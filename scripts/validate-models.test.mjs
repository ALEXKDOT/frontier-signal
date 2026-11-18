import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateModels} from './validate-models.mjs';
import {currentModels,deriveProviderSummaries} from '../dist/assets/data-utils.js';
const original=JSON.parse(readFileSync(new URL('../dist/data/models.json',import.meta.url),'utf8'));
const copy=()=>structuredClone(original);
const dayAfter=date=>new Date(Date.parse(date+'T00:00:00Z')+86400000).toISOString().slice(0,10);
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
 const data=copy();data.checkedAt=dayAfter(original.checkedAt);data.companies[0].models[0].checkedAt=dayAfter(data.checkedAt);data.companies[0].models[1].retirementAt=original.checkedAt;
 const errors=validateModels(data,original.checkedAt);assert.ok(errors.some(e=>e.includes('completed source-check')));assert.ok(errors.some(e=>e.includes('invalid source-check')));assert.ok(errors.some(e=>e.includes('still offered')));assert.ok(errors.some(e=>e.includes('matching history')));
});
test('release dates require a real calendar date, supporting source, and availability context',()=>{
 const data=copy();const model=data.companies[0].models[0];
 model.releasedAt='2026-02-30';delete model.releaseSourceUrl;delete model.releaseKind;
 const errors=validateModels(data);
 assert.ok(errors.some(e=>e.includes('invalid release date')));
 assert.ok(errors.some(e=>e.includes('own evidence URL')));
 assert.ok(errors.some(e=>e.includes('availability context')));
 model.releasedAt=dayAfter(model.checkedAt);assert.ok(validateModels(data).some(e=>e.includes('invalid release date')));
});
test('unverified launch dates remain explicit and cannot inherit misleading metadata',()=>{
 const data=copy();const model=data.companies[0].models[0];delete model.releasedAt;
 const errors=validateModels(data);
 assert.ok(errors.some(e=>e.includes('explicit explanation')));
 assert.ok(errors.some(e=>e.includes('misleading release metadata')));
 delete model.releaseSourceUrl;delete model.releaseKind;model.releaseNote='The primary source does not establish a launch date.';
 assert.deepEqual(validateModels(data),[]);
});
test('announced-only models cannot appear as currently offered featured selections',()=>{
 const data=copy();data.companies[0].models[0].status='announced';
 assert.ok(validateModels(data).some(e=>e.includes('featured capable')));
});
test('uncertain availability can be disclosed in the directory but cannot be featured',()=>{
 const data=copy();const company=data.companies[0];
 const model=company.models.find(m=>m.id!==company.featured.capable&&m.id!==company.featured.everyday);
 model.status='unconfirmed';
 assert.deepEqual(validateModels(data),[]);
 company.featured.everyday=model.id;
 assert.ok(validateModels(data).some(e=>e.includes('featured everyday')));
});
test('provider summaries resolve featured references without hard-coded model IDs',()=>{
 const summaries=deriveProviderSummaries(original);
 assert.equal(summaries.length,original.companies.length);
 for(const summary of summaries){
  const company=original.companies.find(item=>item.id===summary.id);
  assert.equal(summary.flagship.id,company.featured.capable);
  assert.equal(summary.practical?.id||summary.flagship.id,company.featured.everyday);
  assert.equal(summary.modelCount,currentModels(company).length);
  assert.equal(summary.catalogUrl,company.catalogUrl);
 }
 const broken=copy();broken.companies[0].featured.capable='missing';
 assert.throws(()=>deriveProviderSummaries(broken),/featured model reference does not resolve/);
});
test('provider summaries follow changed pointers and collapse duplicate roles',()=>{
 const data=copy();const company=data.companies[0];
 const replacement=company.models.find(model=>model.id!==company.featured.capable&&model.status==='available'&&model.releasedAt);
 company.featured.capable=replacement.id;
 let summary=deriveProviderSummaries(data).find(item=>item.id===company.id);
 assert.equal(summary.flagship.id,replacement.id);
 company.featured.everyday=replacement.id;
 summary=deriveProviderSummaries(data).find(item=>item.id===company.id);
 assert.equal(summary.practical,null);
 assert.deepEqual(summary.accessStatuses,[replacement.status]);
});
test('provider summaries keep separate access statuses and use the latest verified featured-family change',()=>{
 const catalog={companies:[{id:'maker',name:'Maker',family:'Alpha',note:'',catalogUrl:'https://example.com/catalog',checkedAt:'2026-11-16',featured:{capable:'alpha',everyday:'beta'},models:[
  {id:'alpha',name:'Alpha',status:'product-access',releasedAt:'2026-09-01',releaseSourceUrl:'https://example.com/alpha',sourceUrl:'https://example.com/alpha'},
  {id:'beta',name:'Beta',status:'available',releasedAt:'2026-10-15',releaseKind:'API release',releaseSourceUrl:'https://example.com/beta-release',sourceUrl:'https://example.com/beta'}
 ]}]};
 const [summary]=deriveProviderSummaries(catalog);
 assert.deepEqual(summary.accessStatuses,['product-access','available']);
 assert.deepEqual(summary.latestChange,{modelId:'beta',name:'Beta',date:'2026-10-15',dateVerified:true,kind:'API release',sourceUrl:'https://example.com/beta-release',releaseNote:null});
});
test('provider summaries keep missing release dates explicit',()=>{
 const catalog={companies:[{id:'maker',name:'Maker',family:'Alpha',note:'',catalogUrl:'https://example.com/catalog',checkedAt:'2026-11-16',featured:{capable:'alpha',everyday:'alpha'},models:[
  {id:'alpha',name:'Alpha',status:'available',releaseNote:'The provider has not published a release date.',sourceUrl:'https://example.com/alpha'}
 ]}]};
 const [summary]=deriveProviderSummaries(catalog);
 assert.equal(summary.latestChange.date,null);
 assert.equal(summary.latestChange.dateVerified,false);
 assert.equal(summary.latestChange.releaseNote,'The provider has not published a release date.');
 assert.equal(summary.latestChange.sourceUrl,'https://example.com/alpha');
});
