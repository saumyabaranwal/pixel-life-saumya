import { useCallback, useRef, useState, type ReactNode } from 'react';
import { SITE_CONTENT } from '@/data/content';

function fallbackCopy(text: string): string {
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  try {
    document.execCommand('copy');
    return `COPIED: ${text}`;
  } catch {
    return `EMAIL: ${text}`;
  } finally {
    document.body.removeChild(area);
  }
}

export default function EmailCopyLink({
  className,
  ariaLabel,
  testId,
  children,
}: {
  className: string;
  ariaLabel: string;
  testId: string;
  children: ReactNode;
}) {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const handleEmailClick = useCallback(() => {
    const email = SITE_CONTENT.email;
    const done = (message: string) => {
      setToast(message);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(null), 2400);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email).then(
        () => done(`COPIED: ${email}`),
        () => done(fallbackCopy(email)),
      );
    } else {
      done(fallbackCopy(email));
    }
  }, []);

  return (
    <>
      <a
        href={`mailto:${SITE_CONTENT.email}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={className}
        onClick={handleEmailClick}
        data-testid={testId}
      >
        {children}
      </a>
      {toast ? (
        <div
          role="status"
          data-testid="email-copied-toast"
          className="toast-pop fixed bottom-6 left-1/2 z-50 max-w-[90vw] -translate-x-1/2 border-2 border-ink bg-paper px-4 py-3 text-center font-pixel text-[9px] leading-relaxed text-ink shadow-pixel-sm"
        >
          {toast}
        </div>
      ) : null}
    </>
  );
}
