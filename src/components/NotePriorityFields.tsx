import { PRIORITIES } from '../types';
import type { Priority } from '../types';

interface NotePriorityFieldsProps {
  idPrefix: string;
  note: string;
  priority: Priority;
  onNoteChange: (value: string) => void;
  onPriorityChange: (value: Priority) => void;
}

/**
 * Shared note + priority picker row, used by both the composer and the inline
 * editor. The note is optional; priority defaults to Medium.
 */
export default function NotePriorityFields({
  idPrefix,
  note,
  priority,
  onNoteChange,
  onPriorityChange,
}: NotePriorityFieldsProps) {
  return (
    <div className="schedule-fields note-priority-fields">
      <div className="schedule-field note-field">
        <label htmlFor={`${idPrefix}-note`}>Note (optional)</label>
        <textarea
          id={`${idPrefix}-note`}
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Any details worth remembering"
          rows={2}
          maxLength={500}
        />
      </div>
      <div className="schedule-field">
        <label htmlFor={`${idPrefix}-priority`}>Priority</label>
        <select
          id={`${idPrefix}-priority`}
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value as Priority)}
        >
          {PRIORITIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
