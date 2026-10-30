import { ArrowRight } from 'lucide-react';
import BackButton from '@/components/layout/BackButton';
import PixelArt from '@/components/ui/PixelArt';
import { navigate } from '@/hooks/useRoute';
import { PORTFOLIO_SECTIONS } from '@/data/content';
import { COLLECTIBLE_COLORS, SPRITES } from '@/game/sprites';

export default function PortfolioIndex() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <BackButton fallback="/" label="Home" />
      <header className="mt-8 border-b-2 border-ink pb-6">
        <p className="font-pixel text-[10px] uppercase text-steel">Portfolio</p>
        <h1 className="mt-4 font-pixel text-xl leading-[1.3] sm:text-3xl"> Saumya Baranwal</h1>
        <p className="mt-4 max-w-2xl font-mono text-base leading-relaxed text-steel">
          Aspiring Engineer · AI & Product Builder · Turning Ideas into Useful Experiences
        </p>
      </header>

      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {PORTFOLIO_SECTIONS.map((section) => (
          <li key={section.id}>
            <button
              type="button"
              onClick={() => navigate(`/portfolio/${section.id}`)}
              style={{ borderTopColor: COLLECTIBLE_COLORS[section.id] }}
              className="group flex h-full w-full flex-col gap-6 border-2 border-t-[10px] border-ink bg-paper p-6 text-left shadow-pixel-sm transition-all duration-100 hover:-translate-x-px hover:-translate-y-px hover:bg-mist hover:shadow-pixel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="border-2 border-ink p-2" style={{ color: COLLECTIBLE_COLORS[section.id] }}>
                  <PixelArt rows={SPRITES.icons[section.id]} pixel={4} label={`${section.name} icon`} />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-pixel text-sm uppercase leading-relaxed sm:text-base">{section.name}</h2>
                <p className="mt-3 font-mono text-sm leading-relaxed text-steel">{section.summary}</p>
              </div>
              <span className="inline-flex items-center gap-2 font-pixel text-[10px] uppercase">
                Open section
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
