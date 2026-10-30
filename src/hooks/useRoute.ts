import { useEffect, useState } from 'react';
import { getPortfolioSection, type CollectibleId, type PortfolioSection } from '@/data/content';

export type Route =
  | { name: 'home' }
  | { name: 'game' }
  | { name: 'portfolio' }
  | { name: 'section'; section: PortfolioSection }
  | { name: 'ask' };

export interface NavigationState {
  from?: 'game';
}

function parseRoute(): Route {
  const path = window.location.hash.replace(/^#/, '') || '/';
  if (path === '/game') return { name: 'game' };
  if (path === '/ask') return { name: 'ask' };
  if (path === '/portfolio') return { name: 'portfolio' };

  const sectionMatch = /^\/portfolio\/([a-z]+)$/.exec(path);
  if (sectionMatch) {
    const section = getPortfolioSection(sectionMatch[1] as CollectibleId);
    if (section) return { name: 'section', section };
    return { name: 'portfolio' };
  }

  return { name: 'home' };
}

export function navigate(path: string, state: NavigationState | null = null): void {
  window.history.pushState(state, '', `#${path}`);
  window.dispatchEvent(new PopStateEvent('popstate', { state }));
  window.scrollTo({ top: 0 });
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    const sync = () => setRoute(parseRoute());
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  return route;
}
