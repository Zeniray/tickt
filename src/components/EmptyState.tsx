import type { Filter } from '../types';

interface EmptyStateProps {
  filter: Filter;
  hasTasks: boolean;
}

export default function EmptyState({ filter, hasTasks }: EmptyStateProps) {
  let title = 'Nothing here yet.';
  let hint = 'Add something small. Future-you will appreciate it.';

  if (hasTasks && filter === 'active') {
    title = "That's everything. Nice work. ✨";
    hint = 'Come back when there is more to do.';
  } else if (hasTasks && filter === 'completed') {
    title = 'No ticks yet.';
    hint = "Finish something and it'll show up here.";
  }

  return (
    <div className="empty-state">
      <svg
        viewBox="0 0 24 24"
        width="44"
        height="44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9.5" />
        <path d="m8.2 12.4 2.5 2.5 5.1-5.4" />
      </svg>
      <h2>{title}</h2>
      <p>{hint}</p>
    </div>
  );
}
