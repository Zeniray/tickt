export type Priority = 'low' | 'medium' | 'high';

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  /** Optional due date, stored as a local calendar date "YYYY-MM-DD". */
  dueDate?: string;
  /** Optional due time, stored as "HH:MM" (24-hour). */
  dueTime?: string;
  /** Optional free-form note shown under the task text. */
  note?: string;
  /** Optional priority; tasks saved before this field existed display as Medium. */
  priority?: Priority;
}

export type Filter = 'all' | 'active' | 'completed';

export interface TodoCounts {
  total: number;
  active: number;
  completed: number;
}
