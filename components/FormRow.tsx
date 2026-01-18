import type {ReactNode} from 'react';

export function FormRow({label, children}: {label: string; children: ReactNode}) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      {children}
    </div>
  );
}
