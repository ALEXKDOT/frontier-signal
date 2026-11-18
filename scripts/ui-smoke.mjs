#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createServer as createNetServer } from 'node:net';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 720 },
];
const PRIMARY_VIEWS = ['briefing', 'updates', 'cases', 'ladder', 'models', 'methods'];
const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

const sleep = ms => new Promise(resolvePromise => setTimeout(resolvePromise, ms));

function argument(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1];
}

async function freePort() {
  const server = createNetServer();
  await new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolvePromise);
  });
  const { port } = server.address();
  await new Promise(resolvePromise => server.close(resolvePromise));
  return port;
}

async function staticServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || '/', 'http://localhost');
      const relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
      const file = resolve(DIST, `.${relative}`);
      if (file !== DIST && !file.startsWith(`${DIST}${sep}`)) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      const info = await stat(file);
      if (!info.isFile()) throw new Error('Not a file');
      response.writeHead(200, {
        'cache-control': 'no-store',
        'content-type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
      });
      createReadStream(file).pipe(response);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolvePromise);
  });
  return {
    baseUrl: `http://127.0.0.1:${server.address().port}/`,
    close: () => new Promise(resolvePromise => {
      server.closeAllConnections();
      server.close(resolvePromise);
    }),
  };
}

class Cdp {
  constructor(url) {
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    this.socket = new WebSocket(url);
  }

  async connect() {
    await new Promise((resolvePromise, reject) => {
      this.socket.addEventListener('open', resolvePromise, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', event => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const entry = this.pending.get(message.id);
        if (!entry) return;
        this.pending.delete(message.id);
        if (message.error) entry.reject(new Error(`${entry.method}: ${message.error.message}`));
        else entry.resolve(message.result || {});
        return;
      }
      for (const listener of this.listeners.get(message.method) || []) listener(message.params || {});
    });
  }

  send(method, params = {}) {
    return new Promise((resolvePromise, reject) => {
      const id = ++this.id;
      this.pending.set(id, { resolve: resolvePromise, reject, method });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  close() {
    this.socket.close();
  }
}

async function launchChromium() {
  const port = await freePort();
  const profile = await mkdtemp(join(tmpdir(), 'frontier-signal-ui-'));
  const executable = process.env.CHROME_PATH || '/usr/bin/chromium';
  const child = spawn(executable, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-background-networking',
    '--disable-component-update',
    '--no-first-run',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', chunk => { stderr += String(chunk); });

  let version;
  for (let i = 0; i < 120; i += 1) {
    if (child.exitCode !== null) throw new Error(`Chromium exited early (${child.exitCode}).\n${stderr}`);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) {
        version = await response.json();
        break;
      }
    } catch {}
    await sleep(50);
  }
  if (!version) throw new Error(`Chromium DevTools endpoint did not start.\n${stderr}`);
  const pageResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  if (!pageResponse.ok) throw new Error(`Could not create Chromium page (${pageResponse.status}).`);
  const page = await pageResponse.json();
  return {
    child,
    profile,
    page,
    close: async () => {
      if (child.exitCode === null) child.kill('SIGTERM');
      await Promise.race([
        child.exitCode === null ? new Promise(resolvePromise => child.once('exit', resolvePromise)) : Promise.resolve(),
        sleep(1500).then(() => { if (child.exitCode === null) child.kill('SIGKILL'); }),
      ]);
      await sleep(100);
      await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
    },
  };
}

async function run() {
  const suppliedUrl = argument('--url');
  const local = suppliedUrl ? null : await staticServer();
  const baseUrl = new URL(suppliedUrl || local.baseUrl).href;
 const signals = JSON.parse(await readFile(join(DIST, 'data', 'signals.json'), 'utf8'));
 const expectedEventIds = signals.events.map(event => event.id);
  const browser = await launchChromium();
  const cdp = new Cdp(browser.page.webSocketDebuggerUrl);
  const failures = [];
  const runtimeErrors = [];

  const check = (condition, label, detail = '') => {
    if (condition) console.log(`PASS  ${label}`);
    else {
      const message = detail ? `${label} — ${detail}` : label;
      failures.push(message);
      console.error(`FAIL  ${message}`);
    }
  };

  try {
    await cdp.connect();
    cdp.on('Runtime.exceptionThrown', ({ exceptionDetails }) => {
      runtimeErrors.push(exceptionDetails?.exception?.description || exceptionDetails?.text || 'Uncaught runtime exception');
    });
    cdp.on('Runtime.consoleAPICalled', ({ type, args }) => {
      if (type === 'error') runtimeErrors.push(args?.map(item => item.value || item.description).join(' ') || 'console.error');
    });
    await Promise.all([
      cdp.send('Page.enable'),
      cdp.send('Runtime.enable'),
      cdp.send('Log.enable'),
    ]);
    cdp.on('Log.entryAdded', ({ entry }) => {
      if (entry?.level === 'error') runtimeErrors.push(`${entry.source}: ${entry.text}`);
    });

    const evaluate = async expression => {
      const result = await cdp.send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
        userGesture: true,
      });
      if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Evaluation failed');
      }
      return result.result?.value;
    };

    const waitFor = async (expression, timeout = 10_000) => {
      const started = Date.now();
      while (Date.now() - started < timeout) {
        if (await evaluate(expression)) return;
        await sleep(50);
      }
      throw new Error(`Timed out waiting for: ${expression}`);
    };

    const setViewport = async ({ width, height }) => {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width < 800,
        screenWidth: width,
        screenHeight: height,
      });
      await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: width < 800, maxTouchPoints: width < 800 ? 5 : 1 });
    };

    const navigate = async url => {
      await cdp.send('Page.navigate', { url });
      await waitFor("document.readyState === 'complete' && !!document.querySelector('main[data-view]') && !document.querySelector('.loading-state')");
      await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    };

    const route = async view => {
      await evaluate(`document.querySelector('nav a[data-view="${view}"]').click()`);
      await waitFor(`document.querySelector('main').dataset.view === ${JSON.stringify(view)}`);
      await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    };

    for (const viewport of VIEWPORTS) {
      await setViewport(viewport);
      await navigate(new URL(`?view=briefing&ui-smoke=${viewport.width}`, baseUrl).href);
      const rendered = await evaluate(`({
        view: document.querySelector('main')?.dataset.view,
        heading: document.querySelector('main h1')?.textContent.trim(),
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        primaryButtonHeight: document.querySelector('.btn--primary')?.getBoundingClientRect().height || 0,
        caseButtonHeight: document.querySelector('.control-case-picker button')?.getBoundingClientRect().height || 0
      })`);
      check(rendered.view === 'briefing' && rendered.heading.length > 10, `${viewport.width}px briefing renders`);
      check(rendered.overflow <= 1, `${viewport.width}px briefing has no horizontal page overflow`, `${rendered.overflow}px excess`);
      check(rendered.primaryButtonHeight >= 44, `${viewport.width}px primary action is at least 44px tall`, `${rendered.primaryButtonHeight}px`);
      check(rendered.caseButtonHeight >= 44, `${viewport.width}px case selector is at least 44px tall`, `${rendered.caseButtonHeight}px`);

      const glossaryTrigger = await evaluate(`document.querySelector('main .jargon') !== null`);
      check(glossaryTrigger, `${viewport.width}px briefing exposes an inline glossary term`);
      if (glossaryTrigger) {
        await evaluate(`{
          const trigger = document.querySelector('main .jargon');
          trigger.scrollIntoView({block:'center'});
          trigger.focus();
          trigger.click();
        }`);
        await waitFor(`(() => {
          const pop = document.querySelector('#glossary-popover');
          return pop && !pop.hidden && (!pop.hasAttribute('popover') || pop.matches(':popover-open'));
        })()`);
        const bounds = await evaluate(`(() => {
          const r = document.querySelector('#glossary-popover').getBoundingClientRect();
          return {contained:r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1,bounds:[r.left,r.top,r.right,r.bottom]};
        })()`);
        check(bounds.contained, `${viewport.width}px glossary popover stays in the viewport`, bounds.bounds.join(', '));
        await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
        await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
        await waitFor(`document.querySelector('#glossary-popover').hidden`);
      }

      for (const view of PRIMARY_VIEWS.slice(1)) {
        await route(view);
        const layout = await evaluate(`({
          view: document.querySelector('main')?.dataset.view,
          overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
        })`);
        check(layout.view === view, `${viewport.width}px ${view} route renders`);
        check(layout.overflow <= 1, `${viewport.width}px ${view} has no horizontal page overflow`, `${layout.overflow}px excess`);
        if (view === 'updates') {
          const shortestControl = await evaluate(`Math.min(...['#event-search','#year-filter','.update-type-filters button'].map(selector => document.querySelector(selector)?.getBoundingClientRect().height || 0))`);
          check(shortestControl >= 44, `${viewport.width}px update filters are at least 44px tall`, `${shortestControl}px`);
        }
      }
    }

    await setViewport(VIEWPORTS[0]);
    await navigate(new URL('?view=briefing&ui-smoke=desktop-interactions', baseUrl).href);
    await route('updates');
    const chronology = await evaluate(`(() => {
      const groups = [...document.querySelectorAll('.update-week')];
      const ids = groups.flatMap(group => [...group.querySelectorAll('.update-row')].map(row => row.dataset.eventId));
      const weeks = groups.map(group => group.dataset.weekStart);
      const assignedToCorrectWeek = groups.every(group => [...group.querySelectorAll('.update-row')].every(row => {
        const date = row.dataset.reportedAt;
        return date >= group.dataset.weekStart && date <= group.dataset.weekEnd;
      }));
      return {
        groupCount: groups.length,
        ids,
        uniqueCount: new Set(ids).size,
        newestFirst: weeks.every((week, index) => index === 0 || weeks[index - 1] > week),
        assignedToCorrectWeek
      };
    })()`);
    check(chronology.groupCount === 23, 'Updates groups the collection into all 23 report weeks', `${chronology.groupCount} groups`);
    check(
      chronology.ids.length === expectedEventIds.length && chronology.uniqueCount === expectedEventIds.length,
      'Updates renders every recorded event exactly once',
      `${chronology.ids.length} rows, ${chronology.uniqueCount} unique, ${expectedEventIds.length} expected`
    );
    check(expectedEventIds.every(id => chronology.ids.includes(id)), 'Updates retains every event ID from the data file');
    check(chronology.newestFirst && chronology.assignedToCorrectWeek, 'Update weeks and records use report-date order');

    await route('ladder');
    const ladderState = await evaluate(`(() => {
      const steps = [...document.querySelectorAll('[data-stage]')];
      steps[0]?.click();
      return {
        heading: document.querySelector('main h1')?.textContent.trim(),
        steps: steps.length,
        selected: steps.filter(step => step.getAttribute('aria-pressed') === 'true').length,
        detail: document.querySelector('#stage-detail h2')?.textContent.trim()
      };
    })()`);
    check(
      ladderState.heading === 'Concern ladder' && ladderState.steps === 9 && ladderState.selected === 1 && ladderState.detail === 'Tool use',
      'Concern ladder is navigable and renders all nine stages',
      JSON.stringify(ladderState)
    );

    await route('briefing');
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
    const focusRing = await evaluate(`(() => {
      const link = [...document.querySelectorAll('a.text-link')].find(element => element.textContent.includes('Browse all updates'));
      if (!link) return null;
      link.focus({preventScroll:true});
      const style = getComputedStyle(link);
      return {
        focusVisible:link.matches(':focus-visible'),
        outlineStyle:style.outlineStyle,
        outlineWidth:Number.parseFloat(style.outlineWidth) || 0,
        outlineColor:style.outlineColor
      };
    })()`);
    check(
      focusRing?.focusVisible &&
      focusRing.outlineStyle !== 'none' &&
      focusRing.outlineWidth >= 2 &&
      !['transparent', 'rgba(0, 0, 0, 0)'].includes(focusRing.outlineColor),
      'Keyboard focus gives the “Browse all updates” link a visible outline',
      focusRing ? `${focusRing.outlineWidth}px ${focusRing.outlineStyle} ${focusRing.outlineColor}` : 'link not found'
    );
    const lightColors = await evaluate(`(() => {
      const body = getComputedStyle(document.body);
      const header = getComputedStyle(document.querySelector('.site-header'));
      return {background:body.backgroundColor,foreground:body.color,header:header.backgroundColor};
    })()`);
    await evaluate(`document.querySelector('[data-theme-choice="dark"]').click()`);
    await evaluate('new Promise(resolve => requestAnimationFrame(resolve))');
    const theme = await evaluate(`(() => {
      const body = getComputedStyle(document.body);
      const header = getComputedStyle(document.querySelector('.site-header'));
      return {
        value:document.documentElement.dataset.theme,
        pressed:document.querySelector('[data-theme-choice="dark"]').getAttribute('aria-pressed'),
        saved:localStorage.getItem('frontier-theme'),
        colors:{background:body.backgroundColor,foreground:body.color,header:header.backgroundColor}
      };
    })()`);
    check(theme.value === 'dark' && theme.pressed === 'true' && theme.saved === 'dark', 'Dark theme control updates state and preference');
    check(
      theme.colors.background !== lightColors.background &&
      theme.colors.foreground !== lightColors.foreground &&
      theme.colors.header !== lightColors.header,
      'Dark theme applies distinct computed page colors',
      `light ${JSON.stringify(lightColors)}; dark ${JSON.stringify(theme.colors)}`
    );
    await evaluate(`document.querySelector('[data-theme-choice="light"]').click()`);

    await cdp.send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
    await navigate(new URL('?view=briefing&ui-smoke=reduced-motion', baseUrl).href);
    const reducedMotion = await evaluate(`(() => {
      const targets = [document.querySelector('main h1'), ...document.querySelectorAll('main > section')].filter(Boolean);
      const seconds = value => value.split(',').reduce((max, part) => {
        const text = part.trim();
        const amount = Number.parseFloat(text) || 0;
        return Math.max(max, text.endsWith('ms') ? amount / 1000 : amount);
      }, 0);
      const visible = element => {
        const style = getComputedStyle(element), rect = element.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
      };
      return {
        media:matchMedia('(prefers-reduced-motion: reduce)').matches,
        count:targets.length,
        allVisible:targets.every(visible),
        maxTransition:Math.max(...targets.map(element => seconds(getComputedStyle(element).transitionDuration))),
        maxAnimation:Math.max(...targets.map(element => seconds(getComputedStyle(element).animationDuration)))
      };
    })()`);
    check(reducedMotion.media, 'Reduced-motion preference is active in the browser');
    check(reducedMotion.count > 1 && reducedMotion.allVisible, 'Reduced motion leaves the heading and every main section visible', `${reducedMotion.count} elements checked`);
    check(reducedMotion.maxTransition <= 0.001 && reducedMotion.maxAnimation <= 0.001, 'Reduced motion suppresses transitions and animations', `transition ${reducedMotion.maxTransition}s; animation ${reducedMotion.maxAnimation}s`);
    await cdp.send('Emulation.setEmulatedMedia', { media: 'screen', features: [] });

    await evaluate(`{
      const trigger = document.querySelector('main [data-event]');
      trigger.dataset.uiSmokeTrigger = 'dialog';
      trigger.focus();
      trigger.click();
    }`);
    await waitFor(`document.querySelector('#detail-dialog').open`);
    const dialogOpen = await evaluate(`({
      open: document.querySelector('#detail-dialog').open,
      labelled: document.querySelector('#detail-dialog').getAttribute('aria-labelledby') === 'dialog-title',
      focus: document.activeElement.matches('.close-dialog')
    })`);
    check(dialogOpen.open && dialogOpen.labelled && dialogOpen.focus, 'Record dialog opens, is labelled, and receives focus');
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    await waitFor(`!document.querySelector('#detail-dialog').open`);
    check(await evaluate(`document.activeElement?.dataset.uiSmokeTrigger === 'dialog'`), 'Record dialog returns focus to its trigger');

    const jargonCount = await evaluate(`document.querySelectorAll('main .jargon').length`);
    check(jargonCount > 0, 'Briefing exposes inline glossary terms');
    if (jargonCount > 0) {
      await evaluate(`{
        const trigger = document.querySelector('main .jargon');
        trigger.dataset.uiSmokeTrigger = 'glossary';
        trigger.scrollIntoView({block:'center'});
        trigger.focus();
        trigger.click();
      }`);
      await waitFor(`(() => {
        const pop = document.querySelector('#glossary-popover');
        return pop && !pop.hidden && (typeof pop.matches !== 'function' || !pop.hasAttribute('popover') || pop.matches(':popover-open'));
      })()`);
      const popover = await evaluate(`(() => {
        const pop = document.querySelector('#glossary-popover');
        const r = pop.getBoundingClientRect();
        return {
          labelled: pop.getAttribute('aria-labelledby') === 'glossary-popover-title',
          title: !!pop.querySelector('#glossary-popover-title')?.textContent.trim(),
          definition: !!pop.querySelector('p')?.textContent.trim(),
          contained: r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1,
          bounds: [r.left, r.top, r.right, r.bottom]
        };
      })()`);
      check(popover.labelled && popover.title && popover.definition, 'Glossary popover is labelled and contains a definition');
      check(popover.contained, 'Glossary popover stays inside the desktop viewport', popover.bounds.join(', '));
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
      await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
      await waitFor(`document.querySelector('#glossary-popover').hidden`);
      check(await evaluate(`document.activeElement?.dataset.uiSmokeTrigger === 'glossary'`), 'Escape closes the glossary popover and returns focus');
    }

    await navigate(new URL('?view=updates&ui-smoke=filters', baseUrl).href);
    const baselineUpdateCount = await evaluate(`Number.parseInt(document.querySelector('#result-count').textContent, 10)`);
    const searchResult = await evaluate(`(() => {
      const input = document.querySelector('#event-search');
      input.value = 'Hugging Face';
      input.dispatchEvent(new InputEvent('input', {bubbles:true,inputType:'insertText',data:'Hugging Face'}));
      return {
        total:Number.parseInt(document.querySelector('#result-count').textContent, 10),
        rows:document.querySelectorAll('#event-list .update-row').length
      };
    })()`);
    check(searchResult.total > 0 && searchResult.total < baselineUpdateCount && searchResult.rows > 0, 'Updates search for “Hugging Face” reduces the result set', `${searchResult.total} of ${baselineUpdateCount}`);
    const incidentFilter = await evaluate(`(() => {
      const input = document.querySelector('#event-search');
      input.value = '';
      input.dispatchEvent(new InputEvent('input', {bubbles:true,inputType:'deleteContentBackward'}));
      const button = document.querySelector('[data-update-filter="incident"]');
      button.click();
      const rows = [...document.querySelectorAll('#event-list .update-row')];
      return {
        total:Number.parseInt(document.querySelector('#result-count').textContent, 10),
        rows:rows.length,
        onlyIncidents:rows.length > 0 && rows.every(row => row.dataset.updateType === 'incident'),
        pressed:button.getAttribute('aria-pressed')
      };
    })()`);
    check(incidentFilter.total > 0 && incidentFilter.rows > 0 && incidentFilter.onlyIncidents && incidentFilter.pressed === 'true', 'Incident type filter returns only incident records', `${incidentFilter.rows} visible of ${incidentFilter.total}`);

    await setViewport(VIEWPORTS.at(-1));
    await navigate(new URL('?view=briefing&ui-smoke=mobile-interactions', baseUrl).href);
    const menuButton = await evaluate(`(() => {
      const button = document.querySelector('.nav__toggle');
      const r = button.getBoundingClientRect();
      button.focus();
      button.click();
      return {width:r.width,height:r.height,open:document.querySelector('.site-header').classList.contains('is-open'),expanded:button.getAttribute('aria-expanded')};
    })()`);
    check(menuButton.width >= 44 && menuButton.height >= 44, 'Mobile menu control is at least 44×44px', `${menuButton.width}×${menuButton.height}px`);
    check(menuButton.open && menuButton.expanded === 'true', 'Mobile menu opens and exposes expanded state');
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    await waitFor(`!document.querySelector('.site-header').classList.contains('is-open')`);
    const escapedMenu = await evaluate(`({
      expanded:document.querySelector('.nav__toggle').getAttribute('aria-expanded'),
      focus:document.activeElement === document.querySelector('.nav__toggle')
    })`);
    check(escapedMenu.expanded === 'false' && escapedMenu.focus, 'Escape closes the mobile menu and returns focus to its trigger');
    await evaluate(`document.querySelector('.nav__toggle').click()`);
    await waitFor(`document.querySelector('.site-header').classList.contains('is-open')`);
    check(await evaluate(`document.querySelector('.nav__toggle').getAttribute('aria-expanded') === 'true'`), 'Mobile menu can be reopened after Escape');
    await evaluate(`document.querySelector('.nav__links a[data-view="updates"]').click()`);
    await waitFor(`document.querySelector('main').dataset.view === 'updates'`);
    check(await evaluate(`!document.querySelector('.site-header').classList.contains('is-open')`), 'Choosing a mobile route closes the menu');

    for (const [legacy, expected] of [['dashboard', 'briefing'], ['timeline', 'updates'], ['methodology', 'methods']]) {
      await navigate(new URL(`?view=${legacy}&ui-smoke=legacy`, baseUrl).href);
      check(await evaluate(`document.querySelector('main').dataset.view === ${JSON.stringify(expected)}`), `Legacy ${legacy} route resolves to ${expected}`);
    }

    const uniqueErrors = [...new Set(runtimeErrors.filter(Boolean))];
    check(uniqueErrors.length === 0, 'No browser runtime or console errors', uniqueErrors.join(' | '));
  } finally {
    cdp.close();
    await browser.close();
    if (local) await local.close();
  }

  console.log(`\nUI smoke: ${failures.length ? `${failures.length} failure${failures.length === 1 ? '' : 's'}` : 'all checks passed'}`);
  if (failures.length) process.exitCode = 1;
}

run().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
