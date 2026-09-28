import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
export function validate(data) {
 const errors=[];
 const need=(test,message)=>{if(!test)errors.push(message);};
 need(data.schemaVersion===1,'Unsupported schema version');
 need(['demo','reviewed'].includes(data.mode),'Mode must be demo or reviewed');
 need(/^\d{4}-\d{2}-\d{2}$/.test(data.asOf||''),'A coverage date is required');
 const pathways=new Set((data.pathways||[]).map(x=>x.id));
 need(pathways.size===6,'Exactly six unique pathways are required');
 const ids=new Set();
 for(const e of data.events||[]){
  need(typeof e.id==='string'&&!ids.has(e.id),'Event IDs must be unique');ids.add(e.id);
  for(const key of ['title','category','summary_beginner','technical_summary','why_it_matters','what_it_doesnt_mean','what_would_raise_concern','less_concerning','conclusion','evidence','evidenceNote'])need(typeof e[key]==='string'&&e[key].trim().length>0,`${e.id}: missing ${key}`);
  need(/^\d{4}-\d{2}-\d{2}$/.test(e.date||'')&&!isNaN(Date.parse(e.date)),`${e.id}: invalid date`);
  need(e.date<=data.asOf,`${e.id}: later than coverage date`);
  need(['improving','worsening','mixed'].includes(e.direction),`${e.id}: invalid direction`);
  need(['Incidents','Capabilities','Governance','AI R&D','Cyber','Monitoring','Model proliferation','CBRN'].includes(e.category),`${e.id}: unknown category`);
  need(Array.isArray(e.pathways)&&e.pathways.length>0&&e.pathways.every(id=>pathways.has(id)),`${e.id}: unknown or empty pathways`);
  need(Array.isArray(e.sources)&&e.sources.length>0,`${e.id}: a source is required`);
  for(const s of e.sources||[]){let valid=false;try{const u=new URL(s.url);valid=u.protocol==='https:'&&!u.username&&!u.password;}catch{}need(valid&&s.publisher&&s.title,`${e.id}: invalid source`);}
  validateReview(e.review,e.id);
 }
 need(ids.size>=1,'At least one event is required');
 for(const p of data.pathways||[])need(Array.isArray(p.eventIds)&&p.eventIds.every(id=>ids.has(id)),`${p.id}: invalid event reference`);
 need(['Guarded','Elevated','High','Severe','Critical'].includes(data.outlook?.level),'Invalid outlook level');
 need(data.outlook?.basis?.length>0&&data.outlook.basis.every(id=>ids.has(id)),'Outlook evidence references must exist');
 for(const key of ['thesis','summary','trend','changed','moreConcerning','lessConcerning'])need(typeof data.outlook?.[key]==='string'&&data.outlook[key].trim(),`Outlook missing ${key}`);
 validateReview(data.outlook?.review,'outlook');
 function validateReview(r,label){
  if(data.mode==='demo'){need(r?.status==='demo',`${label}: demo edition must label all assessments as demo`);}
  else{need(r?.status==='approved',`${label}: human approval required`);need(typeof r?.reviewedBy==='string'&&r.reviewedBy.trim().length>1,`${label}: reviewer required`);need(/^\d{4}-\d{2}-\d{2}$/.test(r?.reviewedAt||''),`${label}: review date required`);}
 }
 return errors;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
 const data=JSON.parse(readFileSync(resolve(root,'dist/data/signals.json'),'utf8'));
 const errors=validate(data);
 const glossary=JSON.parse(readFileSync(resolve(root,'dist/data/glossary.json'),'utf8'));
 for(const match of JSON.stringify(data).matchAll(/\[\[([^\]]+)\]\]/g))if(!glossary[match[1].toLowerCase()])errors.push(`Undefined glossary term: ${match[1]}`);
 for(const file of ['dist/index.html','dist/assets/style.css','dist/assets/app.js','dist/data/glossary.json'])if(!existsSync(resolve(root,file)))errors.push(`Missing asset: ${file}`);
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Validated ${data.events.length} research notes, six pathways, all source references, and ${data.mode} publication gates.`);
}
