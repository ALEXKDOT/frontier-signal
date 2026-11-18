import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {UPDATE_TYPES,buildWeeklySeries,getControlCases,getFeaturedEvents,groupEventsByReportWeek,sortByReportedAt} from '../dist/assets/data-utils.js';

const event=(id,reportedAt,extra={})=>({id,title:id,reportedAt,...extra});
const signals=JSON.parse(readFileSync(new URL('../dist/data/signals.json',import.meta.url),'utf8'));
const preOverhaulIds=JSON.parse(readFileSync(new URL('./fixtures/pre-overhaul-event-ids.json',import.meta.url),'utf8'));

test('reported records sort newest first without mutating the source',()=>{
 const events=[event('old','2026-01-01'),event('new','2026-02-01'),{id:'legacy',title:'legacy',date:'2026-01-15'}];
 assert.deepEqual(sortByReportedAt(events).map(item=>item.id),['new','legacy','old']);
 assert.deepEqual(events.map(item=>item.id),['old','new','legacy']);
});

test('featured selection is newest first and uses briefing rank only for date ties',()=>{
 const events=[
  event('same-second','2026-11-15',{featured:true,briefingRank:2}),
  event('newest','2026-11-16',{featured:true,briefingRank:9}),
  event('same-first','2026-11-15',{featured:true,briefingRank:1}),
  event('not-featured','2026-11-17',{featured:false})
 ];
 assert.deepEqual(getFeaturedEvents(events).map(item=>item.id),['newest','same-first','same-second']);
 assert.deepEqual(getFeaturedEvents({events}).map(item=>item.id),['newest','same-first','same-second']);
});

test('control cases are filtered and sorted by displayed report date',()=>{
 const events=[
  event('older','2026-09-01',{controlCase:true}),
  event('not-a-case','2026-12-01',{controlCase:false}),
  event('newer','2026-11-13',{controlCase:{sequence:[]}})
 ];
 assert.deepEqual(getControlCases(events).map(item=>item.id),['newer','older']);
});

test('records group into Monday-starting report weeks without mutating the source',()=>{
 const events=[
  event('sunday','2026-11-15'),
  event('newest','2026-11-18'),
  event('monday','2026-11-16'),
  event('older','2026-11-09')
 ];
 const groups=groupEventsByReportWeek(events);
 assert.deepEqual(groups.map(group=>[group.weekStart,group.weekEnd]),[
  ['2026-11-16','2026-11-22'],
  ['2026-11-09','2026-11-15']
 ]);
 assert.deepEqual(groups[0].events.map(item=>item.id),['newest','monday']);
 assert.deepEqual(groups[1].events.map(item=>item.id),['sunday','older']);
 assert.deepEqual(events.map(item=>item.id),['sunday','newest','monday','older']);
 assert.throws(()=>groupEventsByReportWeek([event('invalid','2026-02-30')]),/valid report date/);
});

test('the complete collection appears exactly once across report weeks',()=>{
 const groups=groupEventsByReportWeek(signals.events);
 const groupedIds=groups.flatMap(group=>group.events.map(item=>item.id));
 const expectedIds=sortByReportedAt(signals.events).map(item=>item.id);
 assert.equal(groups.length,23);
 assert.equal(groupedIds.length,signals.events.length);
 assert.equal(new Set(groupedIds).size,signals.events.length);
 assert.deepEqual(groupedIds,expectedIds);
});

test('the current collection retains every pre-overhaul event',()=>{
 const currentIds=new Set(signals.events.map(item=>item.id));
 const missing=preOverhaulIds.filter(id=>!currentIds.has(id));
 assert.deepEqual(missing,[]);
});

test('weekly series returns twelve Monday buckets and counts every update type',()=>{
 const events=[
  event('before','2026-08-30',{updateType:'incident'}),
  event('incident','2026-08-31',{updateType:'incident'}),
  event('policy','2026-09-06',{updateType:'policy-governance'}),
  event('evaluation','2026-09-07',{updateType:'evaluation-research'}),
  event('safeguard','2026-11-16',{updateType:'safeguard-monitoring'}),
  event('model','2026-11-18',{updateType:'model-release-access'}),
  event('after','2026-11-19',{updateType:'incident'}),
  event('invalid','2026-11-18',{updateType:'unknown'})
 ];
 const series=buildWeeklySeries(events,'2026-11-18',12);
 assert.equal(series.length,12);
 assert.equal(series[0].weekStart,'2026-08-31');
 assert.equal(series.at(-1).weekStart,'2026-11-16');
 assert.deepEqual(Object.keys(series[0].counts),UPDATE_TYPES);
 assert.deepEqual(series[0].counts,{incident:1,'evaluation-research':0,'safeguard-monitoring':0,'model-release-access':0,'policy-governance':1});
 assert.equal(series[1].counts['evaluation-research'],1);
 assert.equal(series.at(-1).counts['safeguard-monitoring'],1);
 assert.equal(series.at(-1).counts['model-release-access'],1);
 assert.equal(series.reduce((sum,bucket)=>sum+bucket.total,0),5);
});

test('weekly series validates its calendar inputs',()=>{
 assert.throws(()=>buildWeeklySeries([],'2026-02-30'),/valid YYYY-MM-DD/);
 assert.throws(()=>buildWeeklySeries([],'2026-11-18',0),/positive integer/);
});
