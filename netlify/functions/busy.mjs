// Busy times from Hussain's calendar, for the booking page at /book.
//
// Reads the calendar's private iCal link from the CALENDAR_ICS_URL environment variable
// (set it in Netlify, never in this repo; several links can be separated by spaces).
// Returns only start and end times. Event names, places and notes never leave this function.
//
//   GET /api/busy  ->  { "ok": true, "updated": "...", "busy": [[startMs, endMs], ...] }

import IcalExpander from 'ical-expander';

const HOME = 'America/Toronto';     // all-day and floating events are read as Ottawa time
const DAYS_AHEAD = 35;

// wall-clock time in a zone -> real instant, without a library
const offset = (ms, tz) => {
  const o = {};
  new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    .formatToParts(new Date(ms)).forEach((p) => { o[p.type] = +p.value; });
  return Date.UTC(o.year, o.month - 1, o.day, o.hour % 24, o.minute, o.second) - Math.floor(ms / 1000) * 1000;
};
const wall = (y, mo, d, h, mi, tz) => {
  const g = Date.UTC(y, mo - 1, d, h, mi);
  const o1 = offset(g, tz);
  let t = g - o1;
  const o2 = offset(t, tz);
  if (o2 !== o1) t = g - o2;
  return t;
};
const toMs = (t) => (t.isDate || !t.zone || t.zone.tzid === 'floating')
  ? wall(t.year, t.month, t.day, t.isDate ? 0 : t.hour, t.isDate ? 0 : t.minute, HOME)
  : t.toJSDate().getTime();

// which service a link belongs to, for problem messages (never the link itself)
const kind = (link) => {
  try {
    const h = new URL(clean(link)).hostname;
    if (/google\.com$/.test(h)) return 'Google';
    if (/icloud\.com$/.test(h)) return 'iCloud';
    if (/outlook|office365|live\.com$/.test(h)) return 'Outlook';
    return h;
  } catch { return 'not a link'; }
};
// webcal:// -> https://, and Outlook's "HTML" publish link -> its ICS twin
const clean = (link) => {
  let u = link.trim().replace(/^webcal:/i, 'https:');
  if (/^https:\/\/[^/]*(outlook|office365|live\.com)/i.test(u)) u = u.replace(/\/calendar\.html(?=$|[?#])/i, '/calendar.ics');
  return u;
};

const json = (body, maxAge) => new Response(JSON.stringify(body), {
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, max-age=0, must-revalidate',
    // Netlify keeps a copy for a few minutes, so the calendar is read at most every 5 minutes
    'netlify-cdn-cache-control': `public, durable, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
  },
});

export default async () => {
  const links = (process.env.CALENDAR_ICS_URL || '').split(/\s+/).filter(Boolean);
  if (!links.length) return json({ ok: false, reason: 'no calendar connected', busy: [] }, 60);

  const from = new Date(Date.now() - 86400e3);
  const to = new Date(Date.now() + DAYS_AHEAD * 86400e3);
  const busy = [];
  const add = (comp, s, e) => {
    if (String(comp.getFirstPropertyValue('transp') || '').toUpperCase() === 'TRANSPARENT') return;   // marked "free"
    if (String(comp.getFirstPropertyValue('status') || '').toUpperCase() === 'CANCELLED') return;
    const a = toMs(s);
    const b = e ? toMs(e) : a + (s.isDate ? 86400e3 : 0);
    if (b > a) busy.push([a, b]);
  };

  // Each link is read on its own, so one broken link doesn't hide the others.
  // Problems are described without the link itself, so they're safe to show in /api/busy.
  const problems = [];
  for (const [i, raw] of links.entries()) {
    const name = `calendar ${i + 1} of ${links.length} (${kind(raw)})`;
    let text;
    try {
      const r = await fetch(clean(raw), { headers: { 'user-agent': 'inkoprep.ca booking page' }, signal: AbortSignal.timeout(8000) });
      if (!r.ok) { problems.push(`${name} answered ${r.status}${r.status === 404 ? ', check the link is the private or published iCal one' : ''}`); continue; }
      text = await r.text();
    } catch (err) {
      problems.push(`${name} ${err.name === 'TimeoutError' ? 'took too long to answer' : 'could not be reached, check the link'}`);
      continue;
    }
    if (!/BEGIN:VCALENDAR/i.test(text.slice(0, 3000))) {
      problems.push(`${name} is a web page, not an iCal feed: copy the ICS / iCal link instead`);
      continue;
    }
    try {
      const { events, occurrences } = new IcalExpander({ ics: text, maxIterations: 2000 }).between(from, to);
      events.forEach((ev) => add(ev.component, ev.startDate, ev.endDate));
      occurrences.forEach((o) => add(o.item.component, o.startDate, o.endDate));
    } catch {
      problems.push(`${name} could not be read as a calendar`);   // the parser's own message can quote event text, so it stays out
    }
  }
  if (problems.length) console.error('busy:', problems.join(' | '));
  if (problems.length === links.length) return json({ ok: false, reason: 'calendar not reachable', problems, busy: [] }, 30);

  busy.sort((x, y) => x[0] - y[0]);
  const merged = [];
  for (const iv of busy) {
    const last = merged[merged.length - 1];
    if (last && iv[0] <= last[1]) last[1] = Math.max(last[1], iv[1]);
    else merged.push(iv);
  }
  return json({ ok: true, updated: new Date().toISOString(), busy: merged, ...(problems.length ? { problems } : {}) }, 300);
};

export const config = { path: '/api/busy' };
