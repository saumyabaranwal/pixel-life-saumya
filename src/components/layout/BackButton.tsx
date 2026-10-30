import { ArrowLeft } from 'lucide-react';
import { navigate } from '@/hooks/useRoute';

interface BackButtonProps {
  fallback: string;
  label?: string;
}

export default function BackButton({ fallback, label = 'Back' }: BackButtonProps) {
  const handleClick = () => {
    if (window.history.state?.from === 'game') {
      window.history.back();
      return;
    }
    navigate(fallback);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group inline-flex items-center gap-2 font-pixel text-[10px] uppercase leading-relaxed underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
      {label}
    </button>
  );
}
