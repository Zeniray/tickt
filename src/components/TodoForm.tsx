import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Priority, Todo } from '../types';
import ScheduleFields from './ScheduleFields';
import NotePriorityFields from './NotePriorityFields';
import { CalendarIcon, NoteIcon } from './icons';

interface TodoFormProps {
  onAdd: (text: string, schedule: Pick<Todo, 'dueDate' | 'dueTime'>, details: Pick<Todo, 'note' | 'priority'>) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isNoting, setIsNoting] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const clearSchedule = () => {
    setDueDate('');
    setDueTime('');
  };

  const clearDetails = () => {
    setNote('');
    setPriority('medium');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(
      trimmed,
      { dueDate: dueDate || undefined, dueTime: dueTime || undefined },
      { note: note.trim() || undefined, priority },
    );
    setText('');
    clearSchedule();
    clearDetails();
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form-row">
        <label htmlFor="new-task" className="visually-hidden">
          New task
        </label>
        <input
          id="new-task"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="e.g. Water the plants"
          autoComplete="off"
          maxLength={200}
        />
        <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
          Add
        </button>
      </div>
      <div className="todo-form-extras">
        <div className="todo-form-toggles">
          <button
            type="button"
            className="schedule-toggle"
            aria-expanded={isScheduling}
            onClick={() => setIsScheduling((open) => !open)}
          >
            <CalendarIcon />
            {isScheduling ? 'Hide date & time' : 'Add date & time'}
          </button>
          <button
            type="button"
            className="schedule-toggle"
            aria-expanded={isNoting}
            onClick={() => setIsNoting((open) => !open)}
          >
            <NoteIcon />
            {isNoting ? 'Hide note & priority' : 'Add note & priority'}
          </button>
        </div>
        {isScheduling && (
          <ScheduleFields
            idPrefix="new"
            dueDate={dueDate}
            dueTime={dueTime}
            onDateChange={setDueDate}
            onTimeChange={setDueTime}
            onClear={clearSchedule}
          />
        )}
        {isNoting && (
          <NotePriorityFields
            idPrefix="new"
            note={note}
            priority={priority}
            onNoteChange={setNote}
            onPriorityChange={setPriority}
          />
        )}
      </div>
    </form>
  );
}
