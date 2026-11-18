import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate,validateGlossary} from './validate.mjs';
const read=()=>JSON.parse(readFileSync(new URL('../dist/data/signals.json',import.meta.url),'utf8'));
const readGlossary=()=>JSON.parse(readFileSync(new URL('../dist/data/glossary.json',import.meta.url),'utf8'));
test('the current dataset passes the editorial rules',()=>assert.deepEqual(validate(read(),readGlossary()),[]));
test('changing to reviewed mode cannot silently publish unreviewed analysis',()=>{const d=read();d.mode='reviewed';assert.ok(validate(d).some(e=>e.includes('human approval required')));});
test('each event and the outlook need a reviewer and date',()=>{const d=read();d.mode='reviewed';for(const x of [...d.events,d.outlook])x.review={status:'approved',reviewedBy:'',reviewedAt:null};const errors=validate(d);assert.equal(errors.filter(e=>e.includes('reviewer required')).length,d.events.length+1);});
test('unsafe source URLs are rejected',()=>{const d=read();d.events[0].sources[0].url='javascript:alert(1)';assert.ok(validate(d).some(e=>e.includes('invalid source')));});
test('broken evidence references and duplicate IDs are rejected',()=>{const d=read();d.outlook.basis=['missing'];d.events[1].id=d.events[0].id;const errors=validate(d);assert.ok(errors.some(e=>e.includes('unique')));assert.ok(errors.some(e=>e.includes('references')));});
test('all substantive watch updates and product references are reconciled',()=>{
 const d=read(); assert.deepEqual(d.coverage.map(c=>c.messageIndex),[46,55,57,64,66,68,70,72,74,76,88]);
 for(const id of ['hugging-face','anthropic-opus47','anthropic-pypi','anthropic-research-model','anthropic-opus46','gemini-evaluations','summary-injection','summary-deception','leaked-key','citation-upload','artifactory','file-hosting','medicare','transluce-unm','transluce-datausa','transluce-aihw','transluce-accounts','transluce-crypto','user-image-upload','public-wiki','rubygems','dns-escape'])assert.ok(d.events.some(e=>e.id===id),`Missing named case: ${id}`);
});
test('occurrence dates remain separate from September disclosure dates',()=>{
 const d=read(); const medicare=d.events.find(e=>e.id==='medicare'), dns=d.events.find(e=>e.id==='dns-escape');
 assert.equal(medicare.reportedAt,'2026-09-24'); assert.match(medicare.occurredAt,/June 18, 2026/);
 assert.equal(dns.reportedAt,'2026-09-25'); assert.match(dns.occurredAt,/September 20, 2026/);
 assert.equal(d.chatAsOf,'2026-09-27');assert.ok(d.asOf>=d.chatAsOf);
});
test('the incident record does not conflate Medicare, AIHW, or failed crypto trades',()=>{
 const d=read();assert.match(d.events.find(e=>e.id==='transluce-aihw').evidenceLimits,/No nonpublic/);
 assert.match(d.events.find(e=>e.id==='transluce-crypto').evidenceLimits,/not confirmed successful/);
 assert.equal(d.events.find(e=>e.id==='hugging-face-forensics').kind,'update');
});
test('imported reports cannot silently claim a reviewer or a risk score',()=>{
 const d=read();d.events[0].review.reviewedBy='Generated Editor';d.outlook.level='High';
 const errors=validate(d);assert.ok(errors.some(e=>e.includes('must not claim human approval')));assert.ok(errors.some(e=>e.includes('approved risk rating')));
});
test('removing a mapped incident fails coverage validation',()=>{
 const d=read();d.events=d.events.filter(e=>e.id!=='dns-escape');assert.ok(validate(d).some(e=>e.includes('broken coverage reference')));
});
function weeklyFixture(){
 const d=read();const nextCheck=new Date(Date.parse(d.asOf+'T00:00:00Z')+7*86400000).toISOString().slice(0,10);
 d.updates.enabled=true;d.asOf=nextCheck;
 d.updates.lastCheckedAt=nextCheck;d.updates.lastPublishedAt=nextCheck;
 const e=structuredClone(d.events.find(e=>e.id==='dns-escape'));
 delete e.controlCase;delete e.sequence;
 Object.assign(e,{id:'weekly-fixture',reportedAt:nextCheck,title:'Synthetic validation fixture',origin:'weekly',chatMessages:[],evidenceStrength:'primary-report',selectionReason:'Material evidence relevant to containment and monitoring.',review:{status:'automated',reviewedBy:null,reviewedAt:null,checkedAt:nextCheck}});
 e.sources.forEach(s=>s.checkedAt=nextCheck);d.events.push(e);d.latestEventId=e.id;
 d.updates.history.push({date:nextCheck,addedIds:[e.id],updatedIds:[],summary:'Validation fixture only.'});return d;
}
test('future weekly publication can advance coverage without changing the original chat',()=>{const d=weeklyFixture();assert.deepEqual(validate(d),[]);assert.equal(d.chatAsOf,'2026-09-27');});
test('weekly publication rejects unchecked sources and unverified chat claims',()=>{const d=weeklyFixture(),e=d.events.at(-1);delete e.sources[0].checkedAt;e.verification='reported';const errors=validate(d);assert.ok(errors.some(x=>x.includes('valid check date')));assert.ok(errors.some(x=>x.includes('checked original evidence')));});
test('weekly completion cannot be claimed without a matching history entry',()=>{const d=weeklyFixture();d.updates.history=[];assert.ok(validate(d).some(x=>x.includes('history entry')));});
test('weekly updates cannot invent a human reviewer or conversation provenance',()=>{const d=weeklyFixture(),e=d.events.at(-1);e.review.reviewedBy='Auto Editor';e.chatMessages=[76];const errors=validate(d);assert.ok(errors.some(x=>x.includes('must not claim human approval')));assert.ok(errors.some(x=>x.includes('weekly origin')));});
test('no-change weekly checks can advance freshness without inventing incidents',()=>{const d=weeklyFixture();d.events.pop();d.latestEventId=read().latestEventId;d.updates.history.at(-1).addedIds=[];d.updates.history.at(-1).summary='No material source-supported developments.';assert.deepEqual(validate(d),[]);});

test('normalized event fields and update taxonomy are required',()=>{
 const d=read(),event=d.events[0];
 for(const key of ['plainSummary','technicalDetail','whyItMatters','evidenceLimits','reportedAt','occurredAt'])assert.equal(typeof event[key],'string');
 for(const old of ['summary_beginner','technical_summary','why_it_matters','what_it_doesnt_mean','date','occurred'])assert.equal(old in event,false);
 event.updateType='other';event.evidenceStrength='score-92';
 const errors=validate(d);assert.ok(errors.some(error=>error.includes('invalid update type')));assert.ok(errors.some(error=>error.includes('invalid evidence strength')));
});

test('briefing features 5–8 checked records from the latest material run across update types',()=>{
 const d=read(),featured=d.events.filter(event=>event.featured);
 assert.equal(featured.length,7);assert.ok(new Set(featured.map(event=>event.updateType)).size>=3);
 featured[0].featured=false;
 assert.ok(validate(d).some(error=>error.includes('featured must be true')));
});

test('control cases are newest-first and carry five explicit sequence stages',()=>{
 const d=read(),cases=d.events.filter(event=>event.controlCase);
 assert.deepEqual(cases.map(event=>event.id),['epoch-trajectory-live-testing','tencent-amap-fleet','dns-escape','medicare','hugging-face']);
 assert.deepEqual(cases.map(event=>event.reportedAt),cases.map(event=>event.reportedAt).toSorted().reverse());
 for(const event of cases)assert.deepEqual(Object.keys(event.sequence),['setup','observed','boundary','response','outcome']);
 const broken=structuredClone(d);delete broken.events.find(event=>event.controlCase).sequence.response;
 assert.ok(validate(broken).some(error=>error.includes('five ordered stages')));
});

test('glossary aliases are unique and event references and related terms resolve',()=>{
 const glossary={
  agent:{label:'Agent',aliases:['AI agent'],category:'Agents',definition:'A system that can take a sequence of actions.',seeAlso:['sandbox']},
  sandbox:{label:'Sandbox',aliases:['isolated environment'],category:'Safety',definition:'A restricted environment for running software.',seeAlso:[]}
 };
 assert.deepEqual(validateGlossary(glossary,[{id:'record',glossaryTerms:['agent']}]),[]);
 glossary.sandbox.aliases=['AI agent'];glossary.agent.seeAlso=['missing'];
 const errors=validateGlossary(glossary,[{id:'record',glossaryTerms:['unknown']}]);
 assert.ok(errors.some(error=>error.includes('conflicts')));assert.ok(errors.some(error=>error.includes('unknown related')));assert.ok(errors.some(error=>error.includes('unknown glossary term')));
});

test('glossary collisions normalize Unicode, case, hyphens, and punctuation',()=>{
 const glossary={
  agent:{label:'Agent',aliases:['AI‑Agent'],category:'Agents',definition:'A system that can take a sequence of actions.',seeAlso:[]},
  assistant:{label:'Assistant',aliases:['Ａｉ AGENT!'],category:'Agents',definition:'A system designed to help a person complete a task.',seeAlso:[]},
  weights:{label:'Model weights',aliases:['Model’s weights',"MODEL'S WEIGHTS"],category:'Models',definition:'The learned numerical parameters that shape a model’s behavior.',seeAlso:[]}
 };
 const errors=validateGlossary(glossary);
 assert.ok(errors.some(error=>error.includes('“Ａｉ AGENT!” conflicts with agent')));
 assert.ok(errors.some(error=>error.includes('weights: glossary aliases must be unique')));
});

test('the removed vocabulary mode cannot return through the application shell',()=>{
 const source=readFileSync(new URL('../dist/assets/app.js',import.meta.url),'utf8')+readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 for(const token of ['beginner-toggle','frontier-simplified-vocabulary','summary_beginner'])assert.equal(source.includes(token),false,`Removed vocabulary token remains: ${token}`);
});
