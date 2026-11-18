export const UPDATE_TYPES = Object.freeze([
 'incident',
 'evaluation-research',
 'safeguard-monitoring',
 'model-release-access',
 'policy-governance'
]);

const unavailableStatuses = new Set(['retired', 'announced']);
const reportedAt = event => event?.reportedAt || event?.date || '';
const tieLabel = event => String(event?.id || event?.title || '');
const eventList = input => Array.isArray(input) ? input : (input?.events || []);

function parseDay(value) {
 if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
 const date = new Date(`${value}T00:00:00Z`);
 return Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

function isoDay(date) {
 return date.toISOString().slice(0, 10);
}

function addDays(date, amount) {
 const next = new Date(date);
 next.setUTCDate(next.getUTCDate() + amount);
 return next;
}

function compareReportedAt(a, b) {
 const dateOrder = reportedAt(b).localeCompare(reportedAt(a));
 return dateOrder || tieLabel(a).localeCompare(tieLabel(b));
}

export function currentModels(company) {
 return (company?.models || []).filter(model => !unavailableStatuses.has(model.status));
}

export function deriveProviderSummaries(catalog) {
 return (catalog?.companies || []).map(company => {
  const modelsById = new Map((company.models || []).map(model => [model.id, model]));
  const flagship = modelsById.get(company.featured?.capable);
  const selectedPractical = modelsById.get(company.featured?.everyday);
  if (!flagship || !selectedPractical) {
   throw new Error(`${company.id || company.name || 'provider'}: featured model reference does not resolve`);
  }
  const practical = selectedPractical.id === flagship.id ? null : selectedPractical;
  const selectedModels = practical ? [flagship, practical] : [flagship];
  const datedModels = selectedModels
   .filter(model => parseDay(model.releasedAt))
   .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt) || a.id.localeCompare(b.id));
  const latestModel = datedModels[0] || selectedModels[0];
  const dateVerified = Boolean(parseDay(latestModel.releasedAt));
  const accessStatuses = [...new Set(selectedModels.map(model => model.status))];
  return {
   id: company.id,
   name: company.name,
   family: company.family,
   note: company.note,
   catalogUrl: company.catalogUrl,
   checkedAt: company.checkedAt,
   modelCount: currentModels(company).length,
   flagship,
   practical,
   accessStatuses,
   latestChange: {
    modelId: latestModel.id,
    name: latestModel.name,
    date: dateVerified ? latestModel.releasedAt : null,
    dateVerified,
    kind: latestModel.releaseKind || null,
    sourceUrl: latestModel.releaseSourceUrl || latestModel.sourceUrl,
    releaseNote: dateVerified ? null : (latestModel.releaseNote || 'Release date not verified.')
   }
  };
 });
}

export function sortByReportedAt(events) {
 return [...(events || [])].sort(compareReportedAt);
}

export function getFeaturedEvents(input) {
 return eventList(input)
  .filter(event => event.featured === true)
  .sort((a, b) => {
   const dateOrder = reportedAt(b).localeCompare(reportedAt(a));
   if (dateOrder) return dateOrder;
   const rankA = Number.isInteger(a.briefingRank) ? a.briefingRank : Number.MAX_SAFE_INTEGER;
   const rankB = Number.isInteger(b.briefingRank) ? b.briefingRank : Number.MAX_SAFE_INTEGER;
   return rankA - rankB || tieLabel(a).localeCompare(tieLabel(b));
  });
}

export function getControlCases(input) {
 return sortByReportedAt(eventList(input).filter(event => Boolean(event.controlCase)));
}

export function groupEventsByReportWeek(input) {
 const groups = new Map();
 for (const event of sortByReportedAt(eventList(input))) {
  const date = parseDay(reportedAt(event));
  if (!date) throw new TypeError(`${event?.id || event?.title || 'event'} must have a valid report date`);
  const day = date.getUTCDay() || 7;
  const start = addDays(date, 1 - day);
  const weekStart = isoDay(start);
  if (!groups.has(weekStart)) {
   groups.set(weekStart, {
    weekStart,
    weekEnd: isoDay(addDays(start, 6)),
    events: []
   });
  }
  groups.get(weekStart).events.push(event);
 }
 return [...groups.values()];
}

export function buildWeeklySeries(events, asOf, weeks = 12) {
 const endDate = parseDay(asOf);
 if (!endDate) throw new TypeError('asOf must be a valid YYYY-MM-DD date');
 if (!Number.isInteger(weeks) || weeks < 1) throw new TypeError('weeks must be a positive integer');
 const day = endDate.getUTCDay() || 7;
 const currentMonday = addDays(endDate, 1 - day);
 const firstMonday = addDays(currentMonday, -7 * (weeks - 1));
 const series = Array.from({length: weeks}, (_, index) => {
  const start = addDays(firstMonday, index * 7);
  const counts = Object.fromEntries(UPDATE_TYPES.map(type => [type, 0]));
  return {
   weekStart: isoDay(start),
   weekEnd: isoDay(addDays(start, 6)),
   counts,
   total: 0
  };
 });
 const firstTime = firstMonday.valueOf();
 const endTime = endDate.valueOf();
 for (const event of events || []) {
  if (!UPDATE_TYPES.includes(event.updateType)) continue;
  const date = parseDay(reportedAt(event));
  if (!date || date.valueOf() < firstTime || date.valueOf() > endTime) continue;
  const index = Math.floor((date.valueOf() - firstTime) / (7 * 86400000));
  const bucket = series[index];
  if (!bucket) continue;
  bucket.counts[event.updateType] += 1;
  bucket.total += 1;
 }
 return series;
}
