import type {ReactNode} from 'react';

export default function Pagination({
  page,
  pageSize,
  total,
  onChange,
  prevLabel,
  nextLabel,
  pageLabel,
  ofLabel
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (nextPage: number) => void;
  prevLabel: ReactNode;
  nextLabel: ReactNode;
  pageLabel: ReactNode;
  ofLabel: ReactNode;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-fig-700">
      <div>
        {pageLabel} {page} {ofLabel} {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="btn btn-secondary"
          onClick={() => onChange(page - 1)}
          disabled={!canPrev}
        >
          {prevLabel}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onChange(page + 1)}
          disabled={!canNext}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
