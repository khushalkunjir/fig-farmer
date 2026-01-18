import type {ReactNode} from 'react';

export function Card({title, children}: {title: string; children: ReactNode}) {
  return (
    <div className="card p-4">
      <div className="mb-3 text-sm font-semibold text-fig-700">{title}</div>
      {children}
    </div>
  );
}
