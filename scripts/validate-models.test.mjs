import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateModels} from './validate-models.mjs';
const original=JSON.parse(readFileSync(new URL('../dist/data/models.json',import.meta.url),'utf8'));
const copy=()=>structuredClone(original);
test('model catalog is source-linked and includes all requested GPT generations',()=>{
 assert.deepEqual(validateModels(original),[]);
 const names=original.companies.find(c=>c.id==='openai').models.map(m=>m.name);
 for(const name of ['GPT-6 Astra','GPT-6.1 Sol','GPT-6 Sol','GPT-6 Luna','GPT-5.6 Sol','GPT-5.6 Terra','GPT-5.6 Luna','GPT-5.5'])assert.ok(names.includes(name));
});
test('unsafe sources and duplicate provider/model identities fail publication',()=>{
 const data=copy();data.companies[0].models[0].sourceUrl='javascript:alert(1)';data.companies[0].models.push(data.companies[0].models[0]);data.companies.push(data.companies[0]);
 const errors=validateModels(data);assert.ok(errors.some(e=>e.includes('invalid source URL')));assert.ok(errors.some(e=>e.includes('model IDs')));assert.ok(errors.some(e=>e.includes('Provider IDs')));
});
test('retired or missing featured models cannot be published',()=>{
 const data=copy();data.companies[0].models[0].status='retired';data.companies[1].featured.everyday='missing';
 assert.equal(validateModels(data).filter(e=>e.includes('featured')).length,2);
});
test('freshness cannot advance without evidence and expired models must be retired',()=>{
 const data=copy();data.checkedAt='2026-10-03';data.companies[0].models[0].checkedAt='2027-01-01';data.companies[0].models[1].retirementAt='2026-09-01';
 const errors=validateModels(data,'2026-10-02');assert.ok(errors.some(e=>e.includes('completed source-check')));assert.ok(errors.some(e=>e.includes('invalid source-check')));assert.ok(errors.some(e=>e.includes('still offered')));assert.ok(errors.some(e=>e.includes('matching history')));
});
