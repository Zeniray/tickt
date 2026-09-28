interface ScheduleFieldsProps {
  idPrefix: string;
  dueDate: string;
  dueTime: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onClear: () => void;
}

/**
 * Shared date/time picker row used by both the composer and the inline editor.
 * Both fields are optional and can be cleared together with "Remove".
 */
export default function ScheduleFields({
  idPrefix,
  dueDate,
  dueTime,
  onDateChange,
  onTimeChange,
  onClear,
}: ScheduleFieldsProps) {
  const hasSchedule = Boolean(dueDate || dueTime);

  return (
    <div className="schedule-fields">
      <div className="schedule-field">
        <label htmlFor={`${idPrefix}-due-date`}>Due date</label>
        <input
          id={`${idPrefix}-due-date`}
          type="date"
          value={dueDate}
          onChange={(event) => onDateChange(event.target.value)}
        />
      </div>
      <div className="schedule-field">
        <label htmlFor={`${idPrefix}-due-time`}>Due time</label>
        <input
          id={`${idPrefix}-due-time`}
          type="time"
          value={dueTime}
          onChange={(event) => onTimeChange(event.target.value)}
        />
      </div>
      {hasSchedule && (
        <button type="button" className="schedule-clear" onClick={onClear}>
          Remove
        </button>
      )}
    </div>
  );
}
