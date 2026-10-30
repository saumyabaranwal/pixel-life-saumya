import type { CSSProperties } from 'react';
import { PlayCircle } from 'lucide-react';
import BackButton from '@/components/layout/BackButton';
import PixelArt from '@/components/ui/PixelArt';
import PixelButton from '@/components/ui/PixelButton';
import { navigate } from '@/hooks/useRoute';
import PortfolioBlockView from '@/components/portfolio/PortfolioBlockView';
import { COLLECTIBLE_ORDER, PORTFOLIO_SECTIONS, type PortfolioSection } from '@/data/content';
import { COLLECTIBLE_COLORS, SPRITES } from '@/game/sprites';

interface PortfolioSectionPageProps {
  section: PortfolioSection;
}

export default function PortfolioSectionPage({ section }: PortfolioSectionPageProps) {
  const others = PORTFOLIO_SECTIONS.filter((candidate) => candidate.id !== section.id);
  const position = COLLECTIBLE_ORDER.indexOf(section.id) + 1;

  return (
    <article
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14"
      style={{ '--accent': COLLECTIBLE_COLORS[section.id] } as CSSProperties}
    >
      <BackButton fallback="/portfolio" label="Back to portfolio" />

      <header className="mt-8 flex flex-col gap-6 border-b-4 border-[color:var(--accent)] pb-8 sm:flex-row sm:items-center">
        <div className="shrink-0 border-2 border-[color:var(--accent)] p-3 text-[color:var(--accent)]">
          <PixelArt rows={SPRITES.icons[section.id]} pixel={6} label={`${section.name} icon`} />
        </div>
        <div>
          <p className="font-pixel text-[10px] uppercase text-steel">
            Collectible {position} of {COLLECTIBLE_ORDER.length}
          </p>
          <h1 className="mt-3 font-pixel text-xl uppercase leading-[1.3] sm:text-3xl">{section.name}</h1>
          <p className="mt-4 max-w-2xl font-mono text-base leading-relaxed text-steel">{section.intro}</p>
        </div>
      </header>

      <div className="mt-10 flex flex-col gap-6">
        {section.blocks.map((block, index) => (
          <PortfolioBlockView key={`${section.id}-${index}`} block={block} id={`${section.id}-block-${index}`} />
        ))}
      </div>

      <section className="mt-14 border-t-2 border-ink pt-8" aria-labelledby="other-sections-heading">
        <h2 id="other-sections-heading" className="font-pixel text-[11px] uppercase">
          Keep exploring
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((other) => (
            <PixelButton key={other.id} variant="outline" onClick={() => navigate(`/portfolio/${other.id}`)} className="w-full">
              {other.name}
            </PixelButton>
          ))}
        </div>
        <PixelButton onClick={() => navigate('/game')} className="mt-6 w-full sm:w-auto">
          <PlayCircle className="h-4 w-4" aria-hidden="true" />
          Play the game
        </PixelButton>
      </section>
    </article>
  );
}
