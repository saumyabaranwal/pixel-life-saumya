import { useCallback, useState } from 'react';
import LandingScreen from '@/components/landing/LandingScreen';
import GameScreen from '@/components/game/GameScreen';
import PortfolioIndex from '@/components/portfolio/PortfolioIndex';
import PortfolioSectionPage from '@/components/portfolio/PortfolioSectionPage';
import AskPage from '@/components/qa/AskPage';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { useRoute } from '@/hooks/useRoute';
import type { CollectibleId } from '@/data/content';

export default function App() {
  const route = useRoute();
  const [collected, setCollected] = useState<CollectibleId[]>([]);

  const handleCollect = useCallback((id: CollectibleId) => {
    setCollected((current) => (current.includes(id) ? current : [...current, id]));
  }, []);

  const handleReset = useCallback(() => setCollected([]), []);

  return (
    <div className="min-h-screen bg-paper font-mono text-ink antialiased">
      <SiteHeader route={route} />
      <main>
        {route.name === 'home' ? <LandingScreen /> : null}
        {route.name === 'portfolio' ? <PortfolioIndex /> : null}
        {route.name === 'section' ? <PortfolioSectionPage section={route.section} /> : null}
        {route.name === 'ask' ? <AskPage /> : null}
        <GameScreen
          active={route.name === 'game'}
          collected={collected}
          onCollect={handleCollect}
          onReset={handleReset}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
