import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import type { Priority, Todo } from '../types';
import { PRIORITIES } from '../types';
import { describeSchedule } from '../schedule';
import ScheduleFields from './ScheduleFields';
import NotePriorityFields from './NotePriorityFields';
import { ClockIcon, DeleteIcon, EditIcon, FlagIcon, NoteIcon } from './icons';

interface TodoItemProps {
  todo: Todo;
  now: Date;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string, schedule: Pick<Todo, 'dueDate' | 'dueTime'>, details: Pick<Todo, 'note' | 'priority'>) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, now, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const [draftDate, setDraftDate] = useState(todo.dueDate ?? '');
  const [draftTime, setDraftTime] = useState(todo.dueTime ?? '');
  const [draftNote, setDraftNote] = useState(todo.note ?? '');
  const [draftPriority, setDraftPriority] = useState<Priority>(todo.priority ?? 'medium');
  const [justCompleted, setJustCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasCompleted = useRef(todo.completed);

  useEffect(() => {
    if (todo.completed && !wasCompleted.current) {
      setJustCompleted(true);
      const timer = window.setTimeout(() => setJustCompleted(false), 800);
      wasCompleted.current = todo.completed;
      return () => window.clearTimeout(timer);
    }
    wasCompleted.current = todo.completed;
  }, [todo.completed]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setDraft(todo.text);
    setDraftDate(todo.dueDate ?? '');
    setDraftTime(todo.dueTime ?? '');
    setDraftNote(todo.note ?? '');
    setDraftPriority(todo.priority ?? 'medium');
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onEdit(
      todo.id,
      trimmed,
      { dueDate: draftDate || undefined, dueTime: draftTime || undefined },
      { note: draftNote.trim() || undefined, priority: draftPriority },
    );
    setIsEditing(false);
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') cancelEditing();
  };

  const classes = [
    'todo-item',
    todo.completed ? 'is-completed' : '',
    justCompleted ? 'just-completed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (isEditing) {
    return (
      <li className="todo-item is-editing">
        <form
          className="edit-form"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            saveEdit();
          }}
        >
          <label htmlFor={`edit-${todo.id}`} className="visually-hidden">
            Edit task text
          </label>
          <input
            ref={inputRef}
            id={`edit-${todo.id}`}
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleEditKeyDown}
            maxLength={200}
            autoComplete="off"
          />
          <ScheduleFields
            idPrefix={`edit-${todo.id}`}
            dueDate={draftDate}
            dueTime={draftTime}
            onDateChange={setDraftDate}
            onTimeChange={setDraftTime}
            onClear={() => {
              setDraftDate('');
              setDraftTime('');
            }}
          />
          <NotePriorityFields
            idPrefix={`edit-${todo.id}`}
            note={draftNote}
            priority={draftPriority}
            onNoteChange={setDraftNote}
            onPriorityChange={setDraftPriority}
          />
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button type="button" className="btn btn-ghost" onClick={cancelEditing}>
            Cancel
          </button>
        </form>
      </li>
    );
  }

  // Completed tasks show the plain schedule without the "Overdue" flag.
  const schedule = describeSchedule(todo.dueDate, todo.dueTime, now, !todo.completed);
  const priority = todo.priority ?? 'medium';
  const priorityMeta = PRIORITIES.find((p) => p.value === priority) ?? PRIORITIES[1];

  return (
    <li className={classes}>
      <input
        type="checkbox"
        className="todo-checkbox"
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <div className="todo-body">
        <label htmlFor={`todo-${todo.id}`} className="todo-text">
          {todo.text}
        </label>
        <div className="task-meta">
          <span
            className={`priority-chip is-${priority}`}
            aria-label={`Priority: ${priorityMeta.label}`}
          >
            <FlagIcon />
            {priorityMeta.label}
          </span>
          {schedule && (
            <span
              className={`due-chip${schedule.overdue ? ' is-overdue' : ''}`}
              title={`Due ${schedule.fullDate}`}
            >
              <ClockIcon />
              {schedule.text}
            </span>
          )}
        </div>
        {todo.note && (
          <p className="task-note" title={todo.note}>
            <NoteIcon />
            <span>{todo.note}</span>
          </p>
        )}
      </div>
      <div className="todo-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={startEditing}
          aria-label={`Edit task: ${todo.text}`}
        >
          <EditIcon />
        </button>
        <button
          type="button"
          className="icon-btn icon-btn-danger"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete task: ${todo.text}`}
        >
          <DeleteIcon />
        </button>
      </div>
    </li>
  );
}
