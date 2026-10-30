import type { ReactNode } from 'react';

interface PixelPanelProps {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function PixelPanel({ title, children, actions, className = '' }: PixelPanelProps) {
  return (
    <div
      role="dialog"
      aria-label={title}
      className={`w-full max-w-md border-2 border-ink bg-paper p-6 text-center shadow-pixel sm:p-8 ${className}`}
    >
      <h2 className="font-pixel text-sm leading-relaxed sm:text-base">{title}</h2>
      {children}
      {actions ? <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">{actions}</div> : null}
    </div>
  );
}
