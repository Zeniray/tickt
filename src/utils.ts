import type { Todo } from './types';

/** Generates a unique id, falling back for environments without crypto.randomUUID. */
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Guards against corrupted or hand-edited data in localStorage. */
export function isTodoList(value: unknown): value is Todo[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Partial<Todo>).id === 'string' &&
        typeof (item as Partial<Todo>).text === 'string' &&
        typeof (item as Partial<Todo>).completed === 'boolean',
    )
  );
}
