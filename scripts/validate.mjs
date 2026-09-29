import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
export function validate(data) {
 const errors=[];
 const need=(test,message)=>{if(!test)errors.push(message);};
 const isDate=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
 need(data.schemaVersion===1,'Unsupported schema version');
 need(['demo','watch','reviewed'].includes(data.mode),'Mode must be demo, watch, or reviewed');
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
  if(data.mode==='watch'){
   need(['incident','capability','governance','update','background'].includes(e.kind),`${e.id}: invalid record kind`);
   need(['primary','research','reported','unverified','background'].includes(e.verification),`${e.id}: invalid verification label`);
   need(typeof e.occurred==='string'&&e.occurred.trim(),`${e.id}: occurrence date or uncertainty required`);
   need(typeof e.dateBasis==='string'&&e.dateBasis.trim(),`${e.id}: report date basis required`);
   need(Array.isArray(e.chatMessages),`${e.id}: conversation provenance required`);
   if(e.review?.status==='automated'){
    need(data.updates?.enabled===true,`${e.id}: weekly publication must be enabled`);
    need(e.origin==='weekly'&&e.chatMessages?.length===0,`${e.id}: weekly origin required; do not invent chat provenance`);
    need(['primary','research'].includes(e.verification),`${e.id}: automated publication requires checked original evidence`);
    need(typeof e.selectionReason==='string'&&e.selectionReason.trim().length>15,`${e.id}: explain why this development is material`);
    for(const source of e.sources||[])need(isDate(source.checkedAt)&&source.checkedAt<=e.review.checkedAt,`${e.id}: each automated source needs a valid check date`);
   }
  }
 }
 need(ids.size>=1,'At least one event is required');
 for(const p of data.pathways||[])need(Array.isArray(p.eventIds)&&p.eventIds.every(id=>ids.has(id)),`${p.id}: invalid event reference`);
 need(['Guarded','Elevated','High','Severe','Critical',...(data.mode==='watch'?['Unrated']:[])].includes(data.outlook?.level),'Invalid outlook level');
 need(data.outlook?.basis?.length>0&&data.outlook.basis.every(id=>ids.has(id)),'Outlook evidence references must exist');
 for(const key of ['thesis','summary','trend','changed','moreConcerning','lessConcerning'])need(typeof data.outlook?.[key]==='string'&&data.outlook[key].trim(),`Outlook missing ${key}`);
 validateReview(data.outlook?.review,'outlook');
 if(data.mode==='watch'){
  need(data.outlook?.level==='Unrated','Imported watch must not imply an approved risk rating');
  need(ids.has(data.latestEventId),'Latest record must exist');
  need(data.events.find(e=>e.id===data.latestEventId)?.date===data.events.map(e=>e.date).sort().at(-1),'Latest record must use the most recent report date');
  need(/^https:\/\/chatgpt.com\/share\//.test(data.chatSource||''),'Shared-chat provenance is required');
  need(isDate(data.chatAsOf)&&data.importedAt>=data.chatAsOf&&data.asOf>=data.chatAsOf,'Original chat coverage must remain separate from later weekly coverage');
  if(data.updates){
   const u=data.updates;
   need(typeof u.enabled==='boolean','Weekly update enabled state is required');
   need(u.timezone==='America/New_York'&&typeof u.scheduleLabel==='string','Weekly schedule and timezone are required');
   need(u.lastCheckedAt===null||(isDate(u.lastCheckedAt)&&u.lastCheckedAt===data.asOf),'Last checked date must match completed coverage');
   need(u.lastPublishedAt===null||(isDate(u.lastPublishedAt)&&u.lastCheckedAt&&u.lastPublishedAt>=u.lastCheckedAt),'Publication date needs a completed source check');
   need(Array.isArray(u.history),'Weekly history must be an array');
   const runDates=new Set();
   for(const run of u.history||[]){
    need(isDate(run.date)&&run.date<=u.lastCheckedAt&&!runDates.has(run.date),'Weekly run dates must be unique and within checked coverage');runDates.add(run.date);
    need(typeof run.summary==='string'&&run.summary.trim(),'Weekly run summary required');
    for(const field of ['addedIds','updatedIds'])need(Array.isArray(run[field])&&new Set(run[field]).size===run[field].length&&run[field].every(id=>ids.has(id)),`Weekly ${field} must reference unique existing records`);
    need(!(run.addedIds||[]).some(id=>(run.updatedIds||[]).includes(id)),'A record cannot be both added and updated in the same weekly run');
   }
   need(u.lastCheckedAt===null||(u.history||[]).some(run=>run.date===u.lastCheckedAt),'Completed weekly checks need a history entry');
  }
  const covered=new Set();
  for(const c of data.coverage||[]){
   need(!covered.has(c.messageIndex),'Duplicate conversation coverage row');covered.add(c.messageIndex);
   need(c.eventIds?.length>0&&c.eventIds.every(id=>ids.has(id)),`Message ${c.messageIndex}: broken coverage reference`);
   for(const id of c.eventIds||[])need(data.events.find(e=>e.id===id)?.chatMessages?.includes(c.messageIndex),`Message ${c.messageIndex}: inconsistent provenance`);
  }
  for(const e of data.events){
   for(const index of e.chatMessages||[])need(data.coverage?.some(c=>c.messageIndex===index&&c.eventIds.includes(e.id)),`${e.id}: unmapped conversation reference`);
   for(const id of e.relatedEventIds||[])need(id!==e.id&&ids.has(id),`${e.id}: invalid related record`);
  }
  need(data.corrections?.length>0,'Import corrections must be recorded');
 }
 function validateReview(r,label){
  if(data.mode==='demo'){need(r?.status==='demo',`${label}: demo edition must label all assessments as demo`);}
  else if(data.mode==='watch'){
   need(['imported','automated'].includes(r?.status),`${label}: imported or automated review label required`);
   need(r?.reviewedBy===null&&r?.reviewedAt===null,`${label}: non-human records must not claim human approval`);
   if(r?.status==='automated')need(isDate(r.checkedAt)&&r.checkedAt<=data.asOf,`${label}: automated source check date required`);
  }
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
