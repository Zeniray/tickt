import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/**
 * A useState variant that mirrors its value into localStorage.
 * Falls back to in-memory state when storage is unavailable or holds invalid data.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return initialValue;
      const parsed: unknown = JSON.parse(stored);
      if (isValid && !isValid(parsed)) return initialValue;
      return parsed as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked — the app keeps working in memory.
    }
  }, [key, value]);

  return [value, setValue];
}
