import { ArrowRight, BookOpen, Mail, MessageCircle, Play } from 'lucide-react';
import PixelArt from '@/components/ui/PixelArt';
import PixelButton from '@/components/ui/PixelButton';
import SocialLinks from '@/components/landing/SocialLinks';
import { navigate } from '@/hooks/useRoute';
import { SITE_CONTENT } from '@/data/content';
import { SPRITES } from '@/game/sprites';

const OPTIONS = [
  { label: 'Start Game', path: '/game', icon: Play },
  { label: 'View My Portfolio', path: '/portfolio', icon: BookOpen },
  { label: 'Ask Me Anything', path: '/ask', icon: MessageCircle },
] as const;

export default function LandingScreen() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
      <PixelArt rows={SPRITES.runA} pixel={8} label="Pixel character" className="text-ink" />
      <div className="mt-2 h-0.5 w-full max-w-xs bg-ink" aria-hidden="true" />

      <p className="mt-10 font-pixel text-[10px] uppercase text-steel">{SITE_CONTENT.owner}&apos;s portfolio</p>
      <h1 className="mt-4 font-pixel text-2xl leading-[1.2] sm:text-4xl md:text-5xl">{SITE_CONTENT.title}</h1>
      <p className="mt-6 font-mono text-base text-steel sm:text-lg">{SITE_CONTENT.subtitle}</p>

      <nav aria-label="Start options" className="mt-12 grid w-full max-w-md gap-4">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <PixelButton
              key={option.path}
              variant={option.path === '/game' ? 'solid' : 'outline'}
              onClick={() => navigate(option.path)}
              className="w-full justify-between py-5"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {option.label}
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </PixelButton>
          );
        })}
      </nav>

      <div className="mt-12 flex w-full flex-col items-center gap-4">
        <p className="font-pixel text-[9px] uppercase text-steel">Find me online</p>
        <SocialLinks />
        <a
          href={`mailto:${SITE_CONTENT.email}`}
          className="group flex items-center gap-2 font-mono text-sm text-ink underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {SITE_CONTENT.email}
        </a>
      </div>

      <p className="mt-12 font-mono text-sm text-steel">{SITE_CONTENT.tagline}</p>
    </section>
  );
}
