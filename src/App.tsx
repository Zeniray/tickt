import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNow } from './hooks/useNow';
import { createId, isTodoList } from './utils';
import type { Filter, Todo } from './types';
import TodoForm from './components/TodoForm';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';

const STORAGE_KEY = 'todo-app.tasks';

interface ToastData {
  id: number;
  text: string;
}

export default function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, [], isTodoList);
  const [filter, setFilter] = useState<Filter>('all');
  const [toast, setToast] = useState<ToastData | null>(null);
  // Re-renders every 30s so "Overdue" flags appear without user interaction.
  const now = useNow(30000);

  const counts = useMemo(
    () => ({
      total: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length,
    }),
    [todos],
  );

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.completed);
    if (filter === 'completed') return todos.filter((todo) => todo.completed);
    return todos;
  }, [todos, filter]);

  const allDone = counts.total > 0 && counts.active === 0;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addTodo = (
    text: string,
    schedule: Pick<Todo, 'dueDate' | 'dueTime'> = {},
    details: Pick<Todo, 'note' | 'priority'> = {},
  ) => {
    const todo: Todo = { id: createId(), text, completed: false, createdAt: Date.now(), ...schedule, ...details };
    setTodos((prev) => [todo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    const target = todos.find((todo) => todo.id === id);
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
    if (target && !target.completed) {
      setToast({ id: Date.now(), text: 'Ticked! ✓' });
    }
  };

  const editTodo = (
    id: string,
    text: string,
    schedule: Pick<Todo, 'dueDate' | 'dueTime'> = {},
    details: Pick<Todo, 'note' | 'priority'> = {},
  ) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              text,
              dueDate: schedule.dueDate,
              dueTime: schedule.dueTime,
              note: details.note,
              priority: details.priority,
            }
          : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 12.8l4.6 4.7L19.5 6.5" />
            </svg>
          </span>
          <span className="brand-name">Tickt</span>
        </div>
        <h1>What are we ticking off today?</h1>
        <p className="tagline">Small tasks. Small wins.</p>
      </header>

      <main className="card">
        <TodoForm onAdd={addTodo} />
        {counts.total > 0 && <FilterBar filter={filter} onFilterChange={setFilter} counts={counts} />}
        {allDone && visibleTodos.length > 0 && (
          <p className="celebration" role="status">
            That's everything. Nice work. ✨
          </p>
        )}
        {visibleTodos.length > 0 ? (
          <TodoList todos={visibleTodos} now={now} onToggle={toggleTodo} onEdit={editTodo} onDelete={deleteTodo} />
        ) : (
          <EmptyState filter={filter} hasTasks={counts.total > 0} />
        )}
      </main>

      <footer className="app-footer">
        <p>Your tasks stay on this device — saved automatically.</p>
      </footer>

      <Toast toast={toast} />
    </div>
  );
}
