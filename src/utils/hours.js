/**
 * Works out whether the business is open right now from the free-text
 * `workingHours` in business.js (e.g. { days: 'Monday – Friday', hours: '7:00 am – 5:00 pm' }).
 * Returns null when the hours can't be read, so callers can simply hide the badge.
 */
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function dayIndexes(label) {
  const found = DAYS.map((d, i) => (label.toLowerCase().includes(d) ? i : -1)).filter((i) => i >= 0);
  if (!found.length) return [];
  if (found.length === 2 && /[–-]|\bto\b/.test(label)) {
    // A range like "Monday – Friday" (DAYS order puts Sunday first, so sort by position in the label)
    const [a, b] = [...found].sort((x, y) => label.toLowerCase().indexOf(DAYS[x]) - label.toLowerCase().indexOf(DAYS[y]));
    const out = [];
    for (let i = a; ; i = (i + 1) % 7) {
      out.push(i);
      if (i === b) break;
    }
    return out;
  }
  return found;
}

function toMinutes(text) {
  const m = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (m[3].toLowerCase() === 'pm') h += 12;
  return h * 60 + Number(m[2] || 0);
}

export function openStatus(workingHours = [], timeZone = 'Australia/Melbourne', now = new Date()) {
  try {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-AU', { timeZone, weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
        .formatToParts(now)
        .map((p) => [p.type, p.value]),
    );
    const today = DAYS.indexOf(parts.weekday.toLowerCase());
    const minutes = Number(parts.hour) * 60 + Number(parts.minute);
    let matched = false;
    for (const row of workingHours) {
      if (!dayIndexes(row.days || '').includes(today)) continue;
      matched = true;
      const times = (row.hours || '').split(/[–-]|\bto\b/);
      const open = toMinutes(times[0] || '');
      const close = toMinutes(times[1] || '');
      if (open != null && close != null && minutes >= open && minutes < close) return { open: true, today };
    }
    return matched || workingHours.length ? { open: false, today } : null;
  } catch {
    return null;
  }
}

/** True when a working-hours row covers the given day index (0 = Sunday). */
export const rowCoversDay = (row, day) => dayIndexes(row.days || '').includes(day);
