import type { Filter, TodoCounts } from '../types';

interface FilterBarProps {
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  counts: TodoCounts;
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function FilterBar({ filter, onFilterChange, counts }: FilterBarProps) {
  return (
    <div className="toolbar">
      <div className="filters" role="group" aria-label="Filter tasks">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={`filter-btn${filter === value ? ' is-active' : ''}`}
            aria-pressed={filter === value}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="counts" role="status">
        <span className="count-chip">
          <strong>{counts.total}</strong> total
        </span>
        <span className="count-chip">
          <strong>{counts.active}</strong> active
        </span>
        <span className="count-chip">
          <strong>{counts.completed}</strong> completed
        </span>
      </p>
    </div>
  );
}
