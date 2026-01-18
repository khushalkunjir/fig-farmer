import type {ReactNode} from 'react';

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  const className = `btn ${
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'danger'
        ? 'btn-danger'
        : 'btn-secondary'
  }`;
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}
