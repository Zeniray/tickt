export interface ScheduleInfo {
  /** Compact friendly label, e.g. "Today · 6:00 PM" or "Overdue · Sep 24 · 9:00 AM". */
  text: string;
  overdue: boolean;
  /** Long factual description for tooltips, e.g. "Friday, September 25, 2026 · 6:00 PM". */
  fullDate: string;
}

const WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
const MONTH_DAY = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const MONTH_DAY_YEAR = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const FULL_DATE = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

/** Parses "YYYY-MM-DD" as a local calendar date (never UTC, to avoid off-by-one days). */
export function parseLocalDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats "HH:MM" (24-hour) as "6:00 PM". */
export function formatTime12(hhmm: string): string | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = match[2];
  const suffix = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${suffix}`;
}

function minutesOfDay(hhmm: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

function dayCount(date: Date, now: Date): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((date.getTime() - today.getTime()) / 86400000);
}

function shortDay(date: Date, now: Date): string {
  return date.getFullYear() === now.getFullYear() ? MONTH_DAY.format(date) : MONTH_DAY_YEAR.format(date);
}

/**
 * Builds the friendly schedule label for a task.
 * Pass allowOverdue=false for completed tasks — they show the plain date instead
 * of an "Overdue" flag.
 */
export function describeSchedule(
  dueDate: string | undefined,
  dueTime: string | undefined,
  now: Date = new Date(),
  allowOverdue = true,
): ScheduleInfo | null {
  const time = dueTime ? formatTime12(dueTime) : null;
  const date = dueDate ? parseLocalDate(dueDate) : null;
  if (!date && !time) return null;
  if (!date) {
    return { text: time!, overdue: false, fullDate: time! };
  }

  const diff = dayCount(date, now);
  const pastTimeToday = diff === 0 && Boolean(dueTime) && minutesOfDay(dueTime!) < now.getHours() * 60 + now.getMinutes();
  const overdue = allowOverdue && (diff < 0 || pastTimeToday);

  let text: string;
  if (overdue) {
    const dayPart = diff < 0 ? shortDay(date, now) : '';
    text = ['Overdue', dayPart, time].filter(Boolean).join(' · ');
  } else if (diff === 0) {
    text = ['Today', time].filter(Boolean).join(' · ');
  } else if (diff === 1) {
    text = ['Tomorrow', time].filter(Boolean).join(' · ');
  } else if (diff > 1 && diff <= 6) {
    text = [WEEKDAY.format(date), time].filter(Boolean).join(' · ');
  } else {
    text = [shortDay(date, now), time].filter(Boolean).join(' · ');
  }

  return { text, overdue, fullDate: [FULL_DATE.format(date), time].filter(Boolean).join(' · ') };
}
