import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';

export function validateModels(catalog, today=new Date().toISOString().slice(0,10)){
 const errors=[];
 const need=(test,message)=>{if(!test)errors.push(message);};
 const isDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
 const isUrl=value=>{try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password;}catch{return false;}};
 need(catalog.schemaVersion===1,'Unsupported model catalog schema');
 need(isDate(catalog.checkedAt)&&catalog.checkedAt<=today,'Model catalog needs a completed source-check date');
 need(typeof catalog.scope==='string'&&catalog.scope.trim(),'Model coverage scope is required');
 need(Array.isArray(catalog.companies)&&catalog.companies.length>=3,'At least three model providers required');
 const companyIds=new Set();
 for(const company of catalog.companies||[]){
  need(/^[a-z0-9-]+$/.test(company.id)&&!companyIds.has(company.id),'Provider IDs must be unique and safe');companyIds.add(company.id);
  for(const key of ['name','family','note'])need(typeof company[key]==='string'&&company[key].trim(),`${company.id}: missing ${key}`);
  need(isUrl(company.catalogUrl),`${company.id}: invalid official catalog URL`);
  need(isDate(company.checkedAt)&&company.checkedAt<=catalog.checkedAt,`${company.id}: invalid provider check date`);
  need(Array.isArray(company.models)&&company.models.length>=2,`${company.id}: model offerings required`);
  const ids=new Set();
  for(const model of company.models||[]){
   const label=`${company.id}/${model.id}`;
   need(/^[a-z0-9-]+$/.test(model.id)&&!ids.has(model.id),`${label}: model IDs must be unique and safe`);ids.add(model.id);
   for(const key of ['name','purpose','group'])need(typeof model[key]==='string'&&model[key].trim(),`${label}: missing ${key}`);
   need(['available','preview','restricted','open-weights','existing-users','product-access','retiring','retired','announced'].includes(model.status),`${label}: unknown availability`);
   need(isUrl(model.sourceUrl),`${label}: invalid source URL`);
   need(isDate(model.checkedAt)&&model.checkedAt<=company.checkedAt,`${label}: invalid source-check date`);
   if(model.releasedAt){
    need(isDate(model.releasedAt)&&model.releasedAt<=model.checkedAt,`${label}: invalid release date`);
    need(isUrl(model.releaseSourceUrl),`${label}: release date needs its own evidence URL`);
    need(typeof model.releaseKind==='string'&&model.releaseKind.trim(),`${label}: release date needs an availability context`);
   }else{
    need(typeof model.releaseNote==='string'&&model.releaseNote.trim(),`${label}: missing release date needs an explicit explanation`);
    need(!model.releaseSourceUrl&&!model.releaseKind,`${label}: undated model has misleading release metadata`);
   }
   if(model.retirementAt){need(isDate(model.retirementAt),`${label}: invalid retirement date`);need(model.retirementAt>catalog.checkedAt||model.status==='retired',`${label}: retired model still offered`);}
  }
  for(const role of ['capable','everyday'])need(company.models?.some(model=>model.id===company.featured?.[role]&&!['retired','announced'].includes(model.status)),`${company.id}: featured ${role} model must be offered`);
 }
 const dates=new Set();
 need(Array.isArray(catalog.history)&&catalog.history.length>0,'Model catalog needs update history');
 for(const entry of catalog.history||[]){
  need(isDate(entry.date)&&entry.date<=catalog.checkedAt&&!dates.has(entry.date),'Model history dates must be unique and within checked coverage');dates.add(entry.date);
  need(typeof entry.summary==='string'&&entry.summary.trim(),'Model history summary required');
  need(Array.isArray(entry.companyIds)&&entry.companyIds.length>0&&entry.companyIds.every(id=>companyIds.has(id)),'Model history must reference providers');
 }
 need(dates.has(catalog.checkedAt),'Model freshness needs a matching history entry');
 return errors;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
 const catalog=JSON.parse(readFileSync(resolve(root,'dist/data/models.json'),'utf8'));
 const errors=validateModels(catalog);
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
 else console.log(`Validated ${catalog.companies.length} providers and ${catalog.companies.reduce((sum,c)=>sum+c.models.length,0)} model entries, sources, availability, and check dates.`);
}
