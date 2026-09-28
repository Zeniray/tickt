import type { Todo } from '../types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  now: Date;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string, schedule: Pick<Todo, 'dueDate' | 'dueTime'>, details: Pick<Todo, 'note' | 'priority'>) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, now, onToggle, onEdit, onDelete }: TodoListProps) {
  return (
    <ul className="todo-list" aria-label="Task list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          now={now}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
