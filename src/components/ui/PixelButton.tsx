import type { ButtonHTMLAttributes, ReactNode } from 'react';

type PixelButtonVariant = 'solid' | 'outline';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PixelButtonVariant;
  children: ReactNode;
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-3 border-2 border-ink px-5 py-3 font-pixel text-[11px] uppercase leading-relaxed transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-40 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none';

const VARIANT_CLASSES: Record<PixelButtonVariant, string> = {
  solid: 'bg-ink text-paper shadow-pixel-muted hover:-translate-x-px hover:-translate-y-px hover:shadow-pixel',
  outline: 'bg-paper text-ink shadow-pixel-sm hover:-translate-x-px hover:-translate-y-px hover:bg-mist',
};

export default function PixelButton({ variant = 'solid', className = '', type = 'button', children, ...rest }: PixelButtonProps) {
  return (
    <button type={type} className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
