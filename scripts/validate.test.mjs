import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate} from './validate.mjs';
const read=()=>JSON.parse(readFileSync(new URL('../dist/data/signals.json',import.meta.url),'utf8'));
test('the launch dataset passes the editorial rules',()=>assert.deepEqual(validate(read()),[]));
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
 assert.equal(medicare.date,'2026-09-24'); assert.match(medicare.occurred,/June 18, 2026/);
 assert.equal(dns.date,'2026-09-25'); assert.match(dns.occurred,/September 20, 2026/);
 assert.equal(d.latestEventId,'dns-escape');assert.equal(d.asOf,'2026-09-27');
});
test('the incident record does not conflate Medicare, AIHW, or failed crypto trades',()=>{
 const d=read();assert.match(d.events.find(e=>e.id==='transluce-aihw').what_it_doesnt_mean,/No nonpublic/);
 assert.match(d.events.find(e=>e.id==='transluce-crypto').what_it_doesnt_mean,/not confirmed successful/);
 assert.equal(d.events.find(e=>e.id==='hugging-face-forensics').kind,'update');
});
test('imported reports cannot silently claim a reviewer or a risk score',()=>{
 const d=read();d.events[0].review.reviewedBy='Generated Editor';d.outlook.level='High';
 const errors=validate(d);assert.ok(errors.some(e=>e.includes('must not claim human approval')));assert.ok(errors.some(e=>e.includes('approved risk rating')));
});
test('removing a mapped incident fails coverage validation',()=>{
 const d=read();d.events=d.events.filter(e=>e.id!=='dns-escape');assert.ok(validate(d).some(e=>e.includes('broken coverage reference')));
});
