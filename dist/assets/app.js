import {refresh as refreshMotion} from './motion/motion.js';
import {currentModels,deriveProviderSummaries,sortByReportedAt,getFeaturedEvents,getControlCases,groupEventsByReportWeek,buildWeeklySeries} from './data-utils.js?v=23014619';

const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reEsc=v=>String(v).replace(/[.*+?^$()|[\]{}\\]/g,'\\$&');
const main=$('#main'), dialog=$('#detail-dialog'), dialogContent=$('#dialog-content');
const TYPES={
 incident:{label:'Incident',icon:'!'},'evaluation-research':{label:'Evaluation & research',icon:'◉'},
 'safeguard-monitoring':{label:'Safeguard & monitoring',icon:'✓'},'model-release-access':{label:'Model release & access',icon:'◇'},
 'policy-governance':{label:'Policy & governance',icon:'§'}
};
const TYPE_KEYS=Object.keys(TYPES);
const EVIDENCE={'primary-report':'Primary report','independent-research':'Independent research','external-investigation':'External investigation','imported-unverified':'Historical import · not independently rechecked'};
const SIGNALS={worsening:['↗','More concerning','amber'],improving:['↘','Safety signal','mint'],mixed:['↔','Mixed signal','muted']};
const ACCESS={unconfirmed:'Availability uncertain',available:'Available',preview:'Preview',restricted:'Restricted access','open-weights':'Downloadable','existing-users':'Existing users only','product-access':'In company products',retiring:'Retiring',retired:'Retired',announced:'Announced'};
let data,glossary,models,aliases=new Map(),updateType='all',topic='All',signal='all',query='',year='all',selectedStage=3,selectedCompany='openai',selectedCase=null,modelQuery='',modelGroup='all',dialogTrigger=null,hasRouted=false;
const fmt=v=>v?new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(`${v}T12:00:00Z`)):'Date not reported';
const short=v=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(`${v}T12:00:00Z`));
const type=e=>TYPES[e.updateType]||{label:e.updateType,icon:'•'}, evidence=e=>EVIDENCE[e.evidenceStrength]||e.evidenceStrength;
const typeBadge=e=>`<span class="update-type update-type--${esc(e.updateType)}"><span aria-hidden="true">${type(e).icon}</span>${esc(type(e).label)}</span>`;
const evidenceBadge=e=>`<span class="evidence-strength evidence-strength--${esc(e.evidenceStrength)}">${esc(evidence(e))}</span>`;
function setTheme(t){t=t==='dark'?'dark':'light';document.documentElement.dataset.theme=t;$$('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===t)));const m=$('meta[name="theme-color"]');if(m)m.content=t==='dark'?'#171c19':'#f7f6f0';try{localStorage.setItem('frontier-theme',t)}catch{}}
setTheme(document.documentElement.dataset.theme||'light');
function sourceRange(events){const d=events.map(e=>e.reportedAt).filter(Boolean).sort();if(!d.length)return'No dated records';const f=v=>new Intl.DateTimeFormat('en-US',{month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(`${v}T12:00:00Z`));return `${f(d[0])}–${f(d.at(-1))}`}

function buildAliases(){aliases=new Map();for(const [key,g] of Object.entries(glossary||{})){aliases.set(key,[...new Set([key,g.label,...(g.aliases||[])].filter(Boolean))].sort((a,b)=>b.length-a.length))}}
function annotate(text,terms=[],seen=new Set()){
 const raw=String(text??'').replace(/\[\[|\]\]/g,''), found=[];
 for(const term of terms){if(seen.has(term)||!glossary?.[term])continue;let best;
  for(const a of aliases.get(term)||[]){const plural=/s$/i.test(a)?'':'(?:s|es)?',m=new RegExp(`(^|[^\\p{L}\\p{N}])(${reEsc(a)}${plural})(?=$|[^\\p{L}\\p{N}])`,'iu').exec(raw);if(!m)continue;const c={term,start:m.index+m[1].length,end:m.index+m[1].length+m[2].length};if(!best||c.start<best.start||(c.start===best.start&&c.end>best.end))best=c}
  if(best)found.push(best)
 }
 found.sort((a,b)=>a.start-b.start||b.end-a.end);const use=[];
 for(const c of found){if(use.some(x=>c.start<x.end&&c.end>x.start))continue;use.push(c);seen.add(c.term)}
 if(!use.length)return esc(raw);let at=0,out='';for(const c of use){out+=esc(raw.slice(at,c.start));out+=`<button type="button" class="jargon" data-term="${esc(c.term)}" aria-expanded="false" aria-controls="glossary-popover" aria-label="Define ${esc(glossary[c.term].label||c.term)}">${esc(raw.slice(c.start,c.end))}</button>`;at=c.end}return out+esc(raw.slice(at))
}

let pop;const ps={trigger:null,pinned:false,timer:null,suppressFocusOpen:false};const nativePop='showPopover'in HTMLElement.prototype;
function ensurePop(){pop=$('#glossary-popover')||document.body.appendChild(Object.assign(document.createElement('aside'),{id:'glossary-popover',className:'glossary-popover',hidden:true,tabIndex:-1}));pop.hidden=true;pop.setAttribute('role','dialog');pop.setAttribute('aria-labelledby','glossary-popover-title');if(nativePop)pop.setAttribute('popover','manual');pop.addEventListener('pointerenter',clearPopTimer);pop.addEventListener('pointerleave',schedulePopClose);pop.addEventListener('focusin',clearPopTimer);pop.addEventListener('focusout',schedulePopClose)}
function clearPopTimer(){if(ps.timer)clearTimeout(ps.timer);ps.timer=null}
const popOpen=()=>!!(ps.trigger&&!pop.hidden);
function positionPop(){if(!popOpen()||!ps.trigger?.isConnected)return;const m=12,t=ps.trigger.getBoundingClientRect(),p=pop.getBoundingClientRect();let l=Math.max(m,Math.min(t.left+t.width/2-p.width/2,innerWidth-p.width-m)),y=t.bottom+10;if(y+p.height>innerHeight-m)y=t.top-p.height-10;y=Math.max(m,Math.min(y,innerHeight-p.height-m));pop.style.left=`${Math.round(l)}px`;pop.style.top=`${Math.round(y)}px`}
function openPop(trigger,pinned=false,focus=false){const g=glossary?.[trigger.dataset.term];if(!g)return;clearPopTimer();if(ps.trigger&&ps.trigger!==trigger){ps.trigger.setAttribute('aria-expanded','false');ps.trigger.removeAttribute('aria-describedby')}ps.trigger=trigger;ps.pinned=pinned;trigger.setAttribute('aria-expanded','true');trigger.setAttribute('aria-describedby','glossary-popover-definition');pop.innerHTML=`<div class="glossary-popover__head"><strong id="glossary-popover-title">${esc(g.label||trigger.dataset.term)}</strong><span>${esc(g.category||'Glossary')}</span></div><p id="glossary-popover-definition">${esc(g.definition)}</p>${g.example?'<p class="glossary-popover__example">'+esc(g.example)+'</p>':''}<a class="glossary-popover__link" href="?view=methods#glossary" data-view="methods" data-anchor="glossary">Full glossary →</a>`;pop.hidden=false;if(nativePop)try{if(!pop.matches(':popover-open'))pop.showPopover()}catch{}requestAnimationFrame(()=>{positionPop();if(focus)$('.glossary-popover__link',pop)?.focus({preventScroll:true})})}
function closePop(refocus=false){clearPopTimer();const t=ps.trigger,was=ps.pinned;t?.setAttribute('aria-expanded','false');t?.removeAttribute('aria-describedby');if(nativePop)try{if(pop.matches(':popover-open'))pop.hidePopover()}catch{}pop.hidden=true;ps.trigger=null;ps.pinned=false;if(refocus&&was&&t?.isConnected){ps.suppressFocusOpen=true;t.focus({preventScroll:true});queueMicrotask(()=>{ps.suppressFocusOpen=false})}}
function schedulePopClose(){if(ps.pinned)return;clearPopTimer();ps.timer=setTimeout(()=>{if(pop.matches(':hover')||pop.contains(document.activeElement)||ps.trigger?.matches(':hover,:focus'))return;closePop()},140)}

function sources(e){
 const links=(e.sources||[]).map(s=>`<a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(s.publisher)}</span><strong>${esc(s.title)}</strong><span aria-hidden="true">↗</span></a>`).join('');
 return `<div class="source-stack source-stack--${esc(e.evidenceStrength)}"><div class="source-stack__label">${esc(evidence(e))}</div>${links}</div>`
}
function reviewLabel(e){
 if(e?.review?.status==='automated')return `Weekly automated summary · sources checked ${fmt(e.review.checkedAt)} · no human sign-off claimed.`;
 if(e?.review?.status==='approved')return `Reviewed by ${esc(e.review.reviewedBy)} on ${esc(e.review.reviewedAt)}.`;
 return'Historical import · human editorial review pending.'
}
function openDialog(html){closePop();dialogContent.innerHTML=html;if(!dialog.open){dialogTrigger=document.activeElement;dialog.showModal()}dialog.scrollTop=0;$('.close-dialog')?.focus()}
function showEvent(id){
 const e=data.events.find(x=>x.id===id);if(!e)return;const seen=new Set();
 const finding=annotate(e.plainSummary,e.glossaryTerms,seen);
 const why=annotate(e.whyItMatters,e.glossaryTerms,seen);
 const limits=annotate(e.evidenceLimits,e.glossaryTerms,seen);
 const technical=e.technicalDetail?'<details class="technical-detail"><summary>Technical detail</summary><p>'+annotate(e.technicalDetail,e.glossaryTerms,seen)+'</p></details>':'';
 const assessment=[
  e.less_concerning?`<section><h3>Counterevidence & mitigating factors</h3><p>${annotate(e.less_concerning,e.glossaryTerms,seen)}</p></section>`:'',
  e.what_would_raise_concern?`<section><h3>What would change the assessment</h3><p>${annotate(e.what_would_raise_concern,e.glossaryTerms,seen)}</p></section>`:'',
  e.conclusion?`<p class="record-conclusion">${annotate(e.conclusion,e.glossaryTerms,seen)}</p>`:''
 ].join('');
 const context=assessment?'<details class="assessment-detail"><summary>Assessment context</summary>'+assessment+'</details>':'';
 const provenance=(e.chatMessages||[]).length?'<a href="?view=methods#coverage" data-view="methods" data-anchor="coverage" data-close>Import provenance →</a>':'';
 openDialog(`<article class="record-detail"><div class="record-detail__meta">${typeBadge(e)}${evidenceBadge(e)}</div><h2 id="dialog-title">${esc(e.title)}</h2><dl class="record-dates"><div><dt>${esc(e.dateBasis||'Reported')}</dt><dd><time datetime="${esc(e.reportedAt)}">${fmt(e.reportedAt)}</time></dd></div><div><dt>Occurred</dt><dd>${esc(e.occurredAt)}</dd></div></dl><section class="record-finding"><h3>Reported finding</h3><p class="lead">${finding}</p></section><div class="record-interpretation"><section><h3>Interpretation</h3><p>${why}</p></section><section class="record-limit"><h3>Evidence limits</h3><p>${limits}</p></section></div>${technical}${context}<section class="record-sources"><h3>Sources & provenance</h3>${e.evidenceNote?'<p>'+esc(e.evidenceNote)+'</p>':''}${sources(e)}<p class="small-note">${reviewLabel(e)} ${provenance}</p></section></article>`)
}
function showPathway(id){
 const p=data.pathways.find(x=>x.id===id);if(!p)return;
 const related=sortByReportedAt(data.events.filter(e=>p.eventIds.includes(e.id))).map(e=>`<button class="related" data-event="${esc(e.id)}"><span><small>${fmt(e.reportedAt)}</small>${esc(e.title)}</span><span aria-hidden="true">→</span></button>`).join('');
 openDialog(`<h2 id="dialog-title">${esc(p.name)}</h2><p class="record-classification">Risk pathway · evidence summary</p><p class="lead">${esc(p.question)}</p><p><strong>${esc(p.status)} ${esc(p.trend)}</strong></p><h3>Evidence summary</h3><p>${esc(p.meaning)}</p><h3>Risk mechanism</h3><p>${esc(p.care)}</p><section class="record-limit"><h3>What has not been established</h3><p>${esc(p.notDemonstrated)}</p></section><h3>Relevant evidence</h3>${related}<h3>Assessment</h3><p>${esc(p.interpretation)} This is a qualitative reading of the selected sources, not a complete assessment of the field.</p>`)
}
function showOutlook(){
 const o=data.outlook;
 const related=sortByReportedAt(data.events.filter(e=>o.basis.includes(e.id))).map(e=>`<button class="related" data-event="${esc(e.id)}"><span><small>${esc(evidence(e))}</small>${esc(e.title)}</span><span aria-hidden="true">→</span></button>`).join('');
 openDialog(`<h2 id="dialog-title">Evidence behind this outlook</h2><p class="lead">${esc(o.summary)}</p><h3>Supporting evidence</h3>${related}<h3>Evidence that would raise concern</h3><p>${esc(o.moreConcerning)}</p><h3>Evidence that would lower concern</h3><p>${esc(o.lessConcerning)}</p><h3>Unresolved uncertainties</h3><p>How evaluation results generalize to deployment, how reliably safeguards withstand adversarial pressure, and how capabilities interact across systems. Frontier Signal does not convert these uncertainties into a precise catastrophe probability.</p><a class="text-link" href="?view=methods" data-view="methods" data-close>Read methods & sources →</a>`)
}

function disclosure(e,seen){
 const technical=e.technicalDetail?'<div><h4>Technical detail</h4><p>'+annotate(e.technicalDetail,e.glossaryTerms,seen)+'</p></div>':'';
 return `<details class="update-disclosure"><summary>Technical detail and evidence limits</summary><div class="update-disclosure__body">${technical}<div><h4>Evidence limits</h4><p>${annotate(e.evidenceLimits,e.glossaryTerms,seen)}</p></div><div><h4>Occurrence date</h4><p>${esc(e.occurredAt)}</p></div></div></details>`
}
function updatePreview(e,variant='brief'){
 const seen=new Set(),t=type(e);
 return `<article class="update-preview update-preview--${variant}" data-update-type="${esc(e.updateType)}"><div class="update-preview__meta"><time datetime="${esc(e.reportedAt)}">${fmt(e.reportedAt)}</time>${typeBadge(e)}${evidenceBadge(e)}</div><h3>${esc(e.title)}</h3><p class="update-preview__summary">${annotate(e.plainSummary,e.glossaryTerms,seen)}</p><div class="update-preview__why"><strong>Interpretation</strong><p>${annotate(e.whyItMatters,e.glossaryTerms,seen)}</p></div>${disclosure(e,seen)}<div class="update-preview__actions"><button class="text-link" data-event="${esc(e.id)}">Read the evidence <span aria-hidden="true">→</span></button><span class="update-preview__type-note"><span aria-hidden="true">${t.icon}</span>${esc(t.label)}</span></div></article>`
}
function eventRows(events){
 return events.map(e=>{
  const seen=new Set(),s=SIGNALS[e.direction]||SIGNALS.mixed;
  const tags=(e.pathways||[]).map(id=>{const p=data.pathways.find(x=>x.id===id);return p?`<button class="tag" data-pathway="${esc(id)}">${esc(p.name)}</button>`:''}).join('');
  return `<article class="update-row" data-event-id="${esc(e.id)}" data-reported-at="${esc(e.reportedAt)}" data-update-type="${esc(e.updateType)}"><div class="update-row__date"><time datetime="${esc(e.reportedAt)}">${short(e.reportedAt)}<span>${e.reportedAt.slice(0,4)}</span></time></div><div class="update-row__body"><div class="update-row__meta">${typeBadge(e)}${evidenceBadge(e)}<span class="signal ${s[2]}">${s[0]} ${s[1]}</span>${e.category?'<span class="topic-chip">'+esc(e.category)+'</span>':''}</div><h3><button data-event="${esc(e.id)}">${esc(e.title)}</button></h3><p>${annotate(e.plainSummary,e.glossaryTerms,seen)}</p><div class="update-row__why"><strong>Interpretation</strong><span>${annotate(e.whyItMatters,e.glossaryTerms,seen)}</span></div>${disclosure(e,seen)}<div class="update-row__foot"><button class="text-link" data-event="${esc(e.id)}">Read the evidence →</button>${tags}</div></div></article>`
 }).join('')
}
function eventWeekGroups(events){
 return groupEventsByReportWeek(events).map(group=>`<section class="update-week" data-week-start="${group.weekStart}" data-week-end="${group.weekEnd}"><header class="update-week__header"><div><p>Report week</p><h2>${fmt(group.weekStart)} to ${fmt(group.weekEnd)}</h2></div><span>${group.events.length} ${group.events.length===1?'record':'records'}</span></header><div class="update-week__events">${eventRows(group.events)}</div></section>`).join('')
}
function editionEvents(){
 const run=[...(data.updates?.history||[])].filter(r=>(r.addedIds?.length||0)+(r.updatedIds?.length||0)>0).sort((a,b)=>String(b.date).localeCompare(String(a.date)))[0];
 if(!run)return getFeaturedEvents(data.events);
 const ids=new Set([...(run.addedIds||[]),...(run.updatedIds||[])]);return sortByReportedAt(data.events.filter(e=>ids.has(e.id)))
}
function editionCounts(events){
 const counts=Object.fromEntries(TYPE_KEYS.map(k=>[k,events.filter(e=>e.updateType===k).length]));
 const items=TYPE_KEYS.map(k=>`<div class="edition-count edition-count--${k}"><span><span aria-hidden="true">${TYPES[k].icon}</span>${esc(TYPES[k].label)}</span><strong>${counts[k]}</strong></div>`).join('');
 return `<div class="edition-counts" data-ui="edition-counts" aria-label="Records in this edition by update type">${items}</div><p class="edition-counts__note">Record counts describe this edition. They are not incident rates or a risk score.</p>`
}
function weeklyChart(){
 const series=buildWeeklySeries(data.events,data.asOf,12),max=Math.max(1,...series.map(w=>w.total));
 const bars=series.map(w=>{const segments=TYPE_KEYS.map(k=>w.counts[k]?`<span class="weekly-bar__segment weekly-bar__segment--${k}" style="width:${(w.counts[k]/max*100).toFixed(2)}%"></span>`:'').join('');return `<div class="weekly-bar"><time datetime="${w.weekStart}">${short(w.weekStart)}</time><div class="weekly-bar__track" aria-hidden="true">${segments}</div><strong>${w.total}</strong></div>`}).join('');
 const rows=series.map(w=>`<tr><th scope="row"><time datetime="${w.weekStart}">${fmt(w.weekStart)}</time></th>${TYPE_KEYS.map(k=>'<td>'+w.counts[k]+'</td>').join('')}<td>${w.total}</td></tr>`).join('');
 const legend=TYPE_KEYS.map(k=>`<span class="chart-legend__item chart-legend__item--${k}"><span aria-hidden="true">${TYPES[k].icon}</span>${esc(TYPES[k].label)}</span>`).join('');
 const heads=TYPE_KEYS.map(k=>'<th scope="col">'+esc(TYPES[k].label)+'</th>').join('');
 return `<section class="records-over-time section" id="records-over-time"><div class="wrap"><header class="section-heading"><p class="section-kicker">Twelve-week report-date view</p><h2>Records by report date and update type</h2><p>Weekly counts group collection records by their displayed report or disclosure date. They do not measure how much risk existed in the world.</p></header><div class="chart-legend">${legend}</div><div class="weekly-chart" data-ui="weekly-chart" role="img" aria-label="Twelve weeks of collection records grouped by report date and update type">${bars}</div><div class="chart-table-wrap"><table class="chart-table"><caption>Collection records by report week and update type</caption><thead><tr><th scope="col">Week starting</th>${heads}<th scope="col">Total</th></tr></thead><tbody>${rows}</tbody></table></div></div></section>`
}

const sequenceSteps=[['setup','Task or evaluation setup'],['observed','Observed behavior'],['boundary','Boundary crossed'],['response','Containment or response'],['outcome','Known outcome']];
function sequence(e){
 const steps=sequenceSteps.map(([k,label])=>{const x=e.sequence?.[k],known=x?.status==='reported';return `<li class="case-sequence__step ${known?'is-reported':'is-unknown'}"><span class="case-sequence__marker" aria-hidden="true">${known?'●':'○'}</span><div><strong>${esc(label)}</strong><p>${known?esc(x.text):'Not reported in the available sources.'}</p></div></li>`}).join('');
 return `<ol class="case-sequence" aria-label="Incident sequence">${steps}</ol>`
}
function casePicker(cases){
 const buttons=cases.map(e=>`<button data-control-case="${esc(e.id)}" aria-pressed="${e.id===selectedCase}" aria-controls="control-case-detail"><span>${esc(e.title)}</span><time datetime="${esc(e.reportedAt)}">${fmt(e.reportedAt)}</time></button>`).join('');
 return `<div class="control-case-picker" role="group" aria-label="Choose a control case">${buttons}</div>`
}
function renderCase(){
 const target=$('#control-case-detail');if(!target)return;
 const cases=getControlCases(data.events),e=cases.find(x=>x.id===selectedCase)||cases[0];if(!e)return;
 selectedCase=e.id;$$('[data-control-case]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.controlCase===e.id)));
 const seen=new Set(),status=e.review?.status==='approved'?'Human-reviewed':e.review?.status==='imported'?'Historical import':'Automated source summary';
 target.innerHTML=`<div class="control-case-detail__meta">${typeBadge(e)}${evidenceBadge(e)}<time datetime="${esc(e.reportedAt)}">Reported ${fmt(e.reportedAt)}</time></div><h3>${esc(e.title)}</h3><div class="control-case-detail__facts"><section><h4>Reported finding</h4><p>${annotate(e.plainSummary,e.glossaryTerms,seen)}</p></section><section><h4>Interpretation</h4><p>${annotate(e.whyItMatters,e.glossaryTerms,seen)}</p></section><section><h4>Evidence limits</h4><p>${annotate(e.evidenceLimits,e.glossaryTerms,seen)}</p></section></div>${sequence(e)}<div class="control-case-detail__foot"><button class="text-link" data-event="${esc(e.id)}">Read record & sources →</button><span>${status}</span></div>`
}
function casesSection({id='control-cases',heading='Latest control cases',description='Cases are ordered by their displayed report or disclosure date.',limit=5}={}){
 const cases=getControlCases(data.events).slice(0,limit);if(!selectedCase||!cases.some(e=>e.id===selectedCase))selectedCase=cases[0]?.id||null;
 const all=id!=='cases'?'<a class="text-link" href="?view=cases" data-view="cases">View all control cases →</a>':'';
 return `<section class="control-cases section" id="${esc(id)}"><div class="wrap"><header class="section-heading section-heading--split"><div><p class="section-kicker">Reported incidents</p><h2>${esc(heading)}</h2><p>${esc(description)}</p></div>${all}</header><div class="control-cases__layout" data-ui="control-case-reader">${casePicker(cases)}<article id="control-case-detail" class="control-case-detail" aria-live="polite"></article></div></div></section>`
}

function modelMapMarkup({id='model-map',heading='Current model families',compact=false}={}){
 if(!models)return `<section class="model-map section" id="${esc(id)}"><div class="wrap"><h2>${esc(heading)}</h2><p>The provider source file could not be loaded.</p></div></section>`;
 const rows=deriveProviderSummaries(models).map(p=>{
  const access=p.accessStatuses.map(s=>ACCESS[s]||s).join(' · ');
  const latest=p.latestChange.dateVerified?`<a href="${esc(p.latestChange.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.latestChange.name)} · ${fmt(p.latestChange.date)} ↗</a>`:`<a href="${esc(p.latestChange.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.latestChange.name)} · date unverified ↗</a>`;
  const practical=p.practical?'<a href="'+esc(p.practical.sourceUrl)+'" target="_blank" rel="noopener noreferrer">'+esc(p.practical.name)+' ↗</a>':'Same as flagship';
  return `<tr><th scope="row" data-label="Provider"><strong>${esc(p.name)}</strong><span>${esc(p.family)}</span></th><td data-label="Flagship family"><a href="${esc(p.flagship.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.flagship.name)} ↗</a></td><td data-label="Practical family">${practical}</td><td data-label="Access">${esc(access)}</td><td data-label="Latest change">${latest}</td><td data-label="Source"><a href="${esc(p.catalogUrl)}" target="_blank" rel="noopener noreferrer">Provider source ↗</a></td></tr>`
 }).join('');
 return `<section class="model-map section ${compact?'model-map--compact':''}" id="${esc(id)}"><div class="wrap"><header class="section-heading section-heading--split"><div><p class="section-kicker">Provider documentation</p><h2>${esc(heading)}</h2><p>The table lists provider-documented model families, access conditions, and latest verified changes. It is not a capability ranking.</p></div><a class="text-link" href="?view=catalog" data-view="catalog">View complete catalog →</a></header><div class="model-map__table-wrap" data-ui="model-family-map"><table class="model-map__table"><thead><tr><th scope="col">Provider</th><th scope="col">Flagship family</th><th scope="col">Practical family</th><th scope="col">Access</th><th scope="col">Latest change</th><th scope="col">Source</th></tr></thead><tbody>${rows}</tbody></table></div><p class="small-note">Provider positioning is not independent evidence of performance or fitness for a particular use.</p></div></section>`
}
function briefing(){
 const featured=getFeaturedEvents(data.events).slice(0,6),edition=editionEvents(),lead=featured[0];
 const leadMarkup=lead?'<div class="weekly-briefing__lead">'+updatePreview(lead,'lead')+'</div>':'';
 main.innerHTML=`<section class="briefing-hero hero" id="top" data-enter><div class="wrap"><div class="briefing-hero__copy" data-ui="edition-briefing"><p class="briefing-hero__edition">Updated ${fmt(data.updates?.lastPublishedAt||data.asOf)} · Coverage ${sourceRange(edition)}</p><h1>Weekly frontier AI briefing</h1><p class="hero__lead">The briefing covers incidents, evaluations, safeguards, policy changes, and model releases, with links to original sources.</p><div class="btn-row"><a class="btn btn--primary" href="#week">Read this week’s briefing ↓</a><a class="btn btn--secondary" href="?view=updates" data-view="updates">Browse all updates →</a></div>${editionCounts(edition)}</div></div></section><section class="weekly-briefing section" id="week"><div class="wrap"><header class="section-heading section-heading--split"><div><p class="section-kicker">Latest edition</p><h2>What changed this week</h2><p>${featured.length} records selected for this week, ordered by report date.</p></div><a class="text-link" href="?view=updates" data-view="updates">Browse all updates →</a></header>${leadMarkup}<div class="weekly-briefing__briefs" data-ui="editorial-briefs">${featured.slice(1).map(e=>updatePreview(e)).join('')}</div></div></section>${weeklyChart()}${casesSection()}${modelMapMarkup({id:'models',heading:'Current model families',compact:true})}<section class="learn-section section" id="learn"><div class="wrap" data-ui="research-directory"><p class="section-kicker">Reference</p><h2>Glossary, methods, and sources</h2><p>Open an underlined term for a definition. The glossary and source register list definitions and citations.</p><div class="btn-row"><a class="btn btn--primary" href="?view=methods#glossary" data-view="methods" data-anchor="glossary">Open the glossary →</a><a class="btn btn--secondary" href="?view=methods" data-view="methods">Read methods & sources →</a></div><p class="small-note">Read the <a href="?view=overview" data-view="overview">Risk Outlook</a> for a qualitative assessment. The <a href="?view=ladder" data-view="ladder">Concern Ladder</a> organizes evidence by agent capability.</p></div></section>`;
 renderCase();if(!hasRouted)refreshMotion()
}

const topicOptions=()=>[...new Set(data.events.map(e=>e.category).filter(Boolean))].sort();
function updatesMarkup(){
 const years=[...new Set(data.events.map(e=>e.reportedAt.slice(0,4)))].sort().reverse().map(v=>`<option value="${v}" ${v===year?'selected':''}>${v}</option>`).join('');
 const topics=topicOptions().map(v=>`<option value="${esc(v)}" ${v===topic?'selected':''}>${esc(v)}</option>`).join('');
 const filters=TYPE_KEYS.map(k=>`<button data-update-filter="${k}" aria-pressed="${updateType===k}"><span aria-hidden="true">${TYPES[k].icon}</span>${esc(TYPES[k].label)}</button>`).join('');
 const weekCount=groupEventsByReportWeek(data.events).length;
 return `<section class="updates-view" id="updates"><header class="page-heading"><p class="section-kicker">Evidence collection</p><h1>All updates</h1><p>${data.events.length} records grouped into ${weekCount} report weeks. Search by date, update type, topic, or signal direction.</p></header><div class="updates-tools"><label class="updates-search" for="event-search">Search updates<input id="event-search" type="search" placeholder="Monitorability, model weights, or Hugging Face" value="${esc(query)}"></label><label for="year-filter">Report year<select id="year-filter"><option value="all">All years</option>${years}</select></label><label for="topic-filter">Technical topic<select id="topic-filter"><option value="All">All topics</option>${topics}</select></label><label for="signal-filter">Signal direction<select id="signal-filter"><option value="all">All signals</option><option value="worsening" ${signal==='worsening'?'selected':''}>More concerning</option><option value="improving" ${signal==='improving'?'selected':''}>Safety signal</option><option value="mixed" ${signal==='mixed'?'selected':''}>Mixed signal</option></select></label></div><div class="update-type-filters" role="group" aria-label="Filter updates by type"><button data-update-filter="all" aria-pressed="${updateType==='all'}">All updates</button>${filters}</div><div class="updates-results-head"><p id="result-count" role="status" aria-live="polite"></p><button class="text-link" id="clear-event-filters" data-action="reset-filters" hidden>Clear filters</button></div><p class="small-note">Weeks use each record’s report or disclosure date. Record totals do not measure incident prevalence.</p><div id="event-list" class="updates-list"></div></section>`
}
function filterEvents(){
 const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
 const matches=data.events.filter(e=>{const hay=[e.title,e.plainSummary,e.technicalDetail,e.whyItMatters,e.evidenceLimits,e.occurredAt,e.category,...(e.glossaryTerms||[]),...(e.sources||[]).flatMap(s=>[s.publisher,s.title])].join(' ').toLowerCase();return(updateType==='all'||e.updateType===updateType)&&(topic==='All'||e.category===topic)&&(signal==='all'||e.direction===signal)&&(year==='all'||e.reportedAt.startsWith(year))&&words.every(w=>hay.includes(w))});
 $('#event-list').innerHTML=matches.length?eventWeekGroups(matches):'<div class="empty-state"><h3>No updates match these filters.</h3><button class="text-link" data-action="reset-filters">Show all updates →</button></div>';
 $('#result-count').textContent=`${matches.length} of ${data.events.length} updates`;
 $('#clear-event-filters').hidden=updateType==='all'&&topic==='All'&&signal==='all'&&!query&&year==='all';
 $$('[data-update-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.updateFilter===updateType)))
}
function updates(){main.innerHTML=updatesMarkup();filterEvents()}
function cases(){main.innerHTML=casesSection({id:'cases',heading:'Control cases',description:'Major incidents and control failures, newest report first.',limit:getControlCases(data.events).length});renderCase()}
function modelMap(){main.innerHTML=modelMapMarkup({id:'model-map',heading:'Model map'})}

const stages=[
 ['Tool use','Documented','An AI uses tools such as search, code execution, or external services.','Tool permissions connect model decisions to real effects.','dns-escape'],
 ['Autonomous multi-step work','Documented','An agent carries out several actions toward a task without approval at each step.','Research tasks and unauthorized coordination show why the full action sequence matters.','hugging-face'],
 ['Circumvents obstacles','Documented','An agent finds alternative routes after its approved approach fails.','A workaround can cross an authorization boundary even when the original goal is benign.','dns-escape'],
 ['Crosses intended boundaries','Documented','A system reaches information or services outside its authorized scope.','The records include both misconfigured evaluations and bypasses of intended restrictions.','medicare'],
 ['Acquires outside resources','Limited examples; attribution varies','Reports describe outside accounts, credentials, and services.','Limited resource access does not establish major compute ownership, capital control, or independence.','transluce-accounts'],
 ['Establishes external persistence','Not established by these records','An agent maintains an independent operating foothold beyond its original environment.','Stored files, public traces, or a temporary connection do not establish durable autonomous operation.',null],
 ['Replicates independently','Limited laboratory components','Anthropic tested replication components with external inference and harness assistance.','This study does not establish self-sustaining replication under realistic defenses.','anthropic-replication-components'],
 ['Resists human shutdown','Not established by these records','A system survives a determined, technically capable effort to stop it.','The DNS incident involved failed automated stopping followed by a successful human stop.','dns-escape'],
 ['Strategically improves itself','Limited evidence; human involvement','METR’s latest evaluation finds stronger research-relevant capabilities, with important measurement limits. Earlier records document AI-assisted development acceleration.','Stronger assistance does not establish a self-sustaining, autonomous improvement cycle. Open-ended research judgment and independent replication remain important tests.','metr-q4-capability-measurement']
];
function ladderMarkup(){
 const buttons=stages.map((s,i)=>`<button class="ladder-step ${i===selectedStage?'selected':''} ${s[1].startsWith('Not established')?'unestablished':''}" data-stage="${i}" aria-pressed="${i===selectedStage}"><span class="step-number">${String(i+1).padStart(2,'0')}</span><span>${esc(s[0])}</span><small>${s[1].startsWith('Not established')?'Not established':s[1].startsWith('Limited')?'Limited evidence':'Documented'}</small></button>`).join('');
 return `<section class="ladder-view" id="ladder"><header class="page-heading"><h1>Concern ladder</h1><p>Nine capabilities, from tool use to strategic self-improvement. Select a level to examine what the evidence establishes.</p></header><div class="ladder-layout"><div class="ladder-steps" role="group" aria-label="Levels of agent capability">${buttons}</div><div id="stage-detail" class="stage-detail" tabindex="-1" aria-live="polite"></div></div><p class="small-note">Evidence labels refer to this edition. “Not established” does not mean impossible or disproven. These stages need not occur in order.</p></section>`
}
function renderStage(i,reveal=false){const s=stages[i];if(!s)return;selectedStage=i;$$('[data-stage]').forEach(b=>{const on=Number(b.dataset.stage)===i;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))});$('#stage-detail').innerHTML=`<span class="stage-big">${String(i+1).padStart(2,'0')}</span><h2>${esc(s[0])}</h2><p class="stage-evidence">${esc(s[1])}</p><p>${esc(s[2])}</p><section class="stage-why"><h3>Implications</h3><p>${esc(s[3])}</p></section>${s[4]?'<button class="text-link" data-event="'+esc(s[4])+'">Related research →</button>':'<p class="small-note">No supporting event is established by these records.</p>'}<button class="ladder-back text-link" data-action="ladder-back">↑ Back to capability levels</button>`;if(reveal&&matchMedia('(max-width:850px)').matches){$('#stage-detail').focus({preventScroll:true});$('#stage-detail').scrollIntoView({block:'start',behavior:'instant'})}}
function ladder(){main.innerHTML=ladderMarkup();renderStage(selectedStage)}
function overview(){
 const o=data.outlook,latest=data.events.find(e=>e.id===data.latestEventId);
 const paths=data.pathways.map(p=>`<button class="pathway-card" data-pathway="${esc(p.id)}"><span>${esc(p.status)} ${esc(p.trend)}</span><h3>${esc(p.name)}</h3><p>${esc(p.question)}</p><strong>${esc(p.interpretation)} →</strong></button>`).join('');
 main.innerHTML=`<section class="outlook-view"><header class="page-heading"><p class="section-kicker">Evidence assessment</p><h1>Risk outlook</h1><p>A qualitative assessment of capabilities, control failures, and safeguards.</p></header><div class="outlook-summary"><div><p class="section-kicker">Five-year outlook</p><h2>${esc(o.title||o.level)}</h2><p>${esc(o.summary)}</p><button class="text-link" data-action="outlook">View supporting evidence →</button></div><aside><h3>Signal direction</h3><button data-signal="worsening">↗ More concerning</button><button data-signal="improving">↘ Safety & control</button><p>Each record states its source limitations.</p></aside></div>${latest?'<section class="latest-outlook-note"><h2>Latest supporting record</h2>'+updatePreview(latest)+'</section>':''}<section class="outlook-pathways"><h2>Risk pathways</h2><div class="pathway-grid">${paths}</div></section></section>`
}

function updateHistory(){
 const runs=data.updates?.history||[];
 return `<section id="weekly-updates"><h2>Update history</h2>${runs.length?runs.slice().reverse().slice(0,12).map(r=>'<article class="source-record"><h3>'+fmt(r.date)+'</h3><p>'+esc(r.summary)+'</p><p class="small-note">'+r.addedIds.length+' new records · '+r.updatedIds.length+' updated records</p></article>').join(''):'<p>No scheduled review has completed yet.</p>'}</section>`
}
function coverage(){
 const linked=data.events.filter(e=>(e.chatMessages||[]).length).length;
 const groups=(data.coverage||[]).map(c=>{const records=c.eventIds.map(id=>{const e=data.events.find(x=>x.id===id);return e?`<button class="related" data-event="${esc(e.id)}"><span>${esc(e.title)}</span><span aria-hidden="true">→</span></button>`:''}).join('');return `<details class="coverage-group"><summary>${fmt(c.date)} · ${c.eventIds.length} linked ${c.eventIds.length===1?'record':'records'}</summary><p>${esc(c.note)}</p>${records}</details>`}).join('');
 return `<section id="coverage"><h2>Import provenance</h2><p>Imported on ${fmt(data.importedAt)} from <a href="${esc(data.chatSource)}" target="_blank" rel="noopener noreferrer">Frontier AI Risk Watch ↗</a>. The original conversation covers developments through ${fmt(data.chatAsOf||data.asOf)}.</p><p>${linked} records link to the conversation or one of its cited reports. Repeated mentions point to the same record.</p>${groups}<h3>Corrections and counting rules</h3><ul>${(data.corrections||[]).map(x=>'<li>'+esc(x)+'</li>').join('')}</ul></section>`
}
function glossarySection(){
 const entries=Object.entries(glossary).sort((a,b)=>(a[1].label||a[0]).localeCompare(b[1].label||b[0]));
 const buttons=entries.map(([k,g])=>`<button type="button" class="glossary-entry" data-term="${esc(k)}" aria-expanded="false" aria-controls="glossary-popover"><span>${esc(g.label||k)}</span><small>${esc(g.category||'Glossary')}</small><span aria-hidden="true">→</span></button>`).join('');
 return `<section id="glossary"><h2>Glossary</h2><p>Plain-language definitions for technical terms used across the briefing. Open a term without leaving the page.</p><div class="glossary-grid">${buttons}</div></section>`
}
function methods(){
 const register=data.events.map(e=>`<details class="source-record"><summary><span>${esc(e.title)}</span><small>${fmt(e.reportedAt)} · ${esc(evidence(e))}</small></summary>${sources(e)}<button class="text-link" data-event="${esc(e.id)}">Read record →</button></details>`).join('');
 main.innerHTML=`<section class="methods-view" id="methodology"><header class="page-heading"><p class="section-kicker">Editorial record</p><h1>Methods & sources</h1><p>How records are selected, interpreted, sourced, and kept current.</p></header><div class="method-layout"><aside class="method-nav" aria-label="Methods sections"><a href="#approach">Approach</a><a href="#dates-evidence">Dates & evidence</a><a href="#editorial-status">Editorial status</a><a href="#model-methodology">Model method</a><a href="#weekly-updates">Update history</a><a href="#coverage">Import provenance</a><a href="#methodology-sources">Source register</a><a href="#glossary">Glossary</a></aside><article class="method-body"><section id="approach"><h2>Approach</h2><p>Frontier Signal is a public briefing backed by an evidence collection. It covers incidents, investigations, capability evaluations, safeguards, monitoring, model access changes, and governance developments.</p><p>The briefing reports what sources establish, gives a restrained interpretation, and states the evidence limits. It does not assign a risk score or convert uncertainty into a catastrophe probability.</p></section><section id="dates-evidence"><h2>Dates & evidence</h2><p>Updates are ordered by report or disclosure date. Every record separately states when the underlying activity occurred, including uncertainty.</p><p>Primary reports describe what a developer, government, or researcher says happened. Independent research, external investigations, and historical imports are labeled separately. Record counts cannot establish prevalence without a denominator and consistent detection.</p></section><section id="editorial-status"><h2>Editorial status</h2><p>Historical imports and weekly automated summaries remain distinct. Source checks are not human editorial approval. Review labels state whether a named person approved a record.</p><p>${data.updates?.enabled?'Reviews are scheduled for '+esc(data.updates.scheduleLabel)+'. Last completed source review: '+fmt(data.updates.lastCheckedAt)+'.':'Scheduled weekly reviews are not enabled.'}</p></section><section id="model-methodology"><h2>Model method</h2><p>The Model map lists each provider’s documented flagship and practical-use models from the source catalog. It reports access conditions and the most recent verified change for each provider.</p><p>The appendix includes earlier versions and variants so their sources remain traceable. Provider positioning is not a standardized cross-provider benchmark.</p>${models?'<p class="small-note">Catalog sources checked '+fmt(models.checkedAt)+'.</p>':''}</section>${updateHistory()}${coverage()}<section id="methodology-sources"><h2>Source register</h2><p>${data.events.length} records · report dates ${sourceRange(data.events)}. Open a record for occurrence dates and evidence limitations.</p>${register}</section>${glossarySection()}</article></div></section>`
}

function modelCard(m){
 const release=m.releasedAt?`<a class="release-date" href="${esc(m.releaseSourceUrl||m.sourceUrl)}" target="_blank" rel="noopener noreferrer"><time datetime="${esc(m.releasedAt)}">${fmt(m.releasedAt)}</time> ↗</a>`:`<span class="release-date unverified">${m.id==='chat-latest'?'Rolling alias':'Date unverified'}</span>`;
 return `<article class="model-card"><div class="model-card-top"><span class="model-availability">${esc(ACCESS[m.status]||m.status)}</span></div><h3>${esc(m.name)}</h3><p>${esc(m.purpose)}</p><div class="model-card-foot"><div><span>Released</span>${release}${m.releaseKind?'<small>'+esc(m.releaseKind)+'</small>':''}</div><a href="${esc(m.sourceUrl)}" target="_blank" rel="noopener noreferrer">Provider source ↗</a></div></article>`
}
function renderCatalog(){
 const c=models.companies.find(x=>x.id===selectedCompany)||models.companies[0],all=currentModels(c),words=modelQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
 const list=all.filter(m=>(modelGroup==='all'||m.group===modelGroup)&&words.every(w=>(m.name+' '+m.purpose+' '+m.group+' '+ACCESS[m.status]).toLowerCase().includes(w)));
 $('#catalog-result-count').textContent=`${list.length} of ${all.length} models`;
 $('#catalog-results').innerHTML=list.length?[...new Set(list.map(m=>m.group))].map(g=>`<section class="model-group"><h2>${esc(g)} <span>${list.filter(m=>m.group===g).length}</span></h2><div class="model-grid">${list.filter(m=>m.group===g).map(modelCard).join('')}</div></section>`).join(''):'<div class="empty-state"><h2>No models match these filters.</h2><button class="text-link" data-action="reset-model-filters">Clear model filters →</button></div>'
}
function catalog(){
 if(!models){main.innerHTML='<section class="empty-state"><h1>Model catalog unavailable</h1><p>The updates collection remains available.</p></section>';return}
 const c=models.companies.find(x=>x.id===selectedCompany)||models.companies[0];selectedCompany=c.id;const all=currentModels(c);
 const providers=models.companies.map(x=>`<button data-company="${esc(x.id)}" aria-pressed="${x.id===selectedCompany}"><strong>${esc(x.name)}</strong><span>${esc(x.family)}</span></button>`).join('');
 const groups=[...new Set(all.map(m=>m.group))].map(g=>`<option value="${esc(g)}" ${modelGroup===g?'selected':''}>${esc(g)}</option>`).join('');
 main.innerHTML=`<section class="catalog-view"><header class="page-heading"><p class="section-kicker">Appendix</p><h1>Complete model catalog</h1><p>The catalog lists provider-documented model versions, aliases, and access states.</p></header><a class="text-link catalog-back" href="?view=models" data-view="models">← Back to Model map</a><div class="company-picker" role="group" aria-label="Choose an AI provider">${providers}</div><div class="catalog-tools"><label for="model-search">Search ${esc(c.name)} models<input id="model-search" type="search" placeholder="Model name or capability" value="${esc(modelQuery)}"></label><label for="model-group-filter">Model category<select id="model-group-filter"><option value="all">All categories</option>${groups}</select></label><p id="catalog-result-count" role="status" aria-live="polite"></p></div><div id="catalog-results"></div></section>`;renderCatalog()
}

function closeMenu(){const h=$('.site-header'),b=$('.nav__toggle');h?.classList.remove('is-open');b?.setAttribute('aria-expanded','false')}
function navigate(view,anchor=''){const u=new URL(location.href);u.searchParams.set('view',view);u.hash=anchor?'#'+anchor:'';history.pushState({},'',u);route()}
function route(){
 if(!data)return;
 const views={briefing,updates,cases,models:modelMap,methods,catalog,overview,ladder},aliases={dashboard:'briefing',timeline:'updates',methodology:'methods'};
 const labels={briefing:'Briefing',updates:'Updates',cases:'Control cases',models:'Model map',methods:'Methods & sources',catalog:'Model catalog appendix',overview:'Risk outlook',ladder:'Concern ladder'};
 const hash=location.hash.slice(1);if(hash==='main'&&hasRouted){main.focus();return}
 const requested=new URLSearchParams(location.search).get('view'),hashView=(Object.hasOwn(views,hash)||Object.hasOwn(aliases,hash))?hash:null,raw=requested||hashView||'briefing';
 let view=aliases[raw]||raw,anchor=hashView?'':hash;
 if(raw==='dashboard'&&hash==='models'){view='models';anchor=''}if(raw==='dashboard'&&hash==='cases'){view='cases';anchor=''}if(!Object.hasOwn(views,view))view='briefing';
 if(dialog.open)dialog.close();closePop();closeMenu();
 $$('nav a[data-view]').forEach(a=>{const av=aliases[a.dataset.view]||a.dataset.view,on=av===view||(view==='catalog'&&av==='models');a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 main.dataset.view=view;main.setAttribute('aria-label',labels[view]);views[view]();
 $$('.method-nav a').forEach(a=>{if(a.hash==='#'+(anchor||'approach'))a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
 document.title=labels[view]+': Frontier Signal';if(hasRouted||hash==='main')main.focus({preventScroll:true});hasRouted=true;
 requestAnimationFrame(()=>{if(anchor&&anchor!=='main')document.getElementById(anchor)?.scrollIntoView({behavior:'instant'});else scrollTo({top:0,behavior:'instant'})})
}

document.addEventListener('click',e=>{
 const b=e.target.closest('button,a');if(!b)return;
 if(b.dataset.term){e.preventDefault();if(ps.trigger===b&&ps.pinned)closePop();else openPop(b,true,e.detail===0)}
 else if(b.dataset.themeChoice)setTheme(b.dataset.themeChoice);
 else if(b.dataset.action==='menu'){const open=!$('.site-header').classList.contains('is-open');$('.site-header').classList.toggle('is-open',open);b.setAttribute('aria-expanded',String(open))}
 else if(b.dataset.view){e.preventDefault();closePop();navigate(b.dataset.view,b.dataset.anchor||'')}
 else if(b.dataset.event)showEvent(b.dataset.event);
 else if(b.dataset.pathway)showPathway(b.dataset.pathway);
 else if(b.dataset.company){selectedCompany=b.dataset.company;modelQuery='';modelGroup='all';catalog()}
 else if(b.dataset.controlCase){selectedCase=b.dataset.controlCase;renderCase()}
 else if(b.dataset.updateFilter){updateType=b.dataset.updateFilter;filterEvents()}
 else if(b.dataset.stage!==undefined)renderStage(Number(b.dataset.stage),true);
 else if(b.dataset.action==='ladder-back')$('[data-stage="'+selectedStage+'"]')?.focus();
 else if(b.dataset.action==='outlook')showOutlook();
 else if(b.dataset.action==='reset-filters'){updateType='all';topic='All';signal='all';query='';year='all';if($('#event-search'))$('#event-search').value='';if($('#year-filter'))$('#year-filter').value='all';if($('#topic-filter'))$('#topic-filter').value='All';if($('#signal-filter'))$('#signal-filter').value='all';filterEvents()}
 else if(b.dataset.action==='reset-model-filters'){modelQuery='';modelGroup='all';$('#model-search').value='';$('#model-group-filter').value='all';renderCatalog();$('#model-search').focus()}
 else if(b.dataset.signal){signal=b.dataset.signal;updateType='all';topic='All';query='';year='all';navigate('updates')}
 else if(b.dataset.action==='retry')location.reload();
 if(b.hasAttribute('data-close'))dialog.close()
});
document.addEventListener('pointerover',e=>{const t=e.target.closest('[data-term]');if(!t||matchMedia('(hover:none)').matches||ps.pinned)return;if(t!==ps.trigger)openPop(t);else clearPopTimer()});
document.addEventListener('pointerout',e=>{if(e.target.closest('[data-term]')&&!ps.pinned)schedulePopClose()});
document.addEventListener('focusin',e=>{const t=e.target.closest('[data-term]');if(t&&!ps.suppressFocusOpen&&!(ps.pinned&&t===ps.trigger))openPop(t)});
document.addEventListener('focusout',e=>{if(e.target.closest('[data-term]')&&!ps.pinned)schedulePopClose()});
document.addEventListener('pointerdown',e=>{if(ps.pinned&&!e.target.closest('#glossary-popover')&&e.target.closest('[data-term]')!==ps.trigger)closePop()},true);
document.addEventListener('keydown',e=>{
 if(e.key!=='Escape')return;
 if(popOpen()){e.preventDefault();e.stopPropagation();closePop(true);return}
 if($('.site-header')?.classList.contains('is-open')){e.preventDefault();closeMenu();$('.nav__toggle')?.focus({preventScroll:true})}
},true);
$('.close-dialog').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>{closePop();if(dialogTrigger?.isConnected)dialogTrigger.focus({preventScroll:true});dialogTrigger=null});
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
document.addEventListener('change',e=>{if(e.target.id==='signal-filter'){signal=e.target.value;filterEvents()}else if(e.target.id==='year-filter'){year=e.target.value;filterEvents()}else if(e.target.id==='topic-filter'){topic=e.target.value;filterEvents()}else if(e.target.id==='model-group-filter'){modelGroup=e.target.value;renderCatalog()}});
document.addEventListener('input',e=>{if(e.target.id==='event-search'){query=e.target.value;filterEvents()}else if(e.target.id==='model-search'){modelQuery=e.target.value;renderCatalog()}});
addEventListener('resize',positionPop);addEventListener('scroll',()=>{if(popOpen()){if(ps.pinned)positionPop();else closePop()}},{passive:true});addEventListener('hashchange',route);addEventListener('popstate',route);

ensurePop();
try{
 const rs=await Promise.all(['signals','glossary'].map(n=>fetch('./data/'+n+'.json')));if(rs.some(r=>!r.ok))throw new Error('Research files unavailable');
 [data,glossary]=await Promise.all(rs.map(r=>r.json()));
 try{const r=await fetch('./data/models.json');if(!r.ok)throw new Error('Model catalog unavailable');models=await r.json()}catch(error){console.warn('Model catalog could not load.',error)}
 data.events=sortByReportedAt(data.events);buildAliases();selectedCase=getControlCases(data.events)[0]?.id||null;const edition=$('#edition-label');if(edition)edition.textContent='Updated '+fmt(data.updates?.lastPublishedAt||data.asOf);route()
}catch(error){main.innerHTML='<div class="empty-state"><h1>The briefing could not load.</h1><p>Check the connection and try again.</p><button class="text-link" data-action="retry">Try again →</button></div>';console.error('Frontier Signal could not load its research files.',error)}
