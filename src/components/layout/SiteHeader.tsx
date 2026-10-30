import { Gamepad2, Moon, Sun } from 'lucide-react';
import { navigate, type Route } from '@/hooks/useRoute';
import { useTheme } from '@/hooks/theme';
import { SITE_CONTENT } from '@/data/content';

interface SiteHeaderProps {
  route: Route;
}

export default function SiteHeader({ route }: SiteHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const links = [
    { label: 'Game', path: '/game', active: route.name === 'game' },
    { label: 'Portfolio', path: '/portfolio', active: route.name === 'portfolio' || route.name === 'section' },
    { label: 'Ask Me', path: '/ask', active: route.name === 'ask' },
  ];

  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex min-w-0 items-center gap-3 font-pixel text-[10px] uppercase leading-relaxed hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <Gamepad2 className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="truncate">{SITE_CONTENT.ownerName}</span>
        </button>
        <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
          <nav aria-label="Main" className="flex-1 sm:flex-none">
            <ul className="grid grid-cols-3 gap-1 sm:flex sm:items-center sm:gap-2">
              {links.map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    aria-current={link.active ? 'page' : undefined}
                    onClick={() => navigate(link.path)}
                    className={`w-full border-2 border-ink px-2 py-2 font-pixel text-[8px] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink sm:w-auto sm:px-4 sm:text-[10px] ${
                      link.active ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-mist'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-paper text-ink transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
