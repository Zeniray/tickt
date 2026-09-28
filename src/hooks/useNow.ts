import { useEffect, useState } from 'react';

/**
 * Returns a Date that refreshes on an interval (and whenever the tab becomes
 * visible again), so time-relative UI like schedule labels stays current
 * without user interaction.
 */
export function useNow(intervalMs = 30000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = window.setInterval(tick, intervalMs);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [intervalMs]);

  return now;
}
