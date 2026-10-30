import { Code, Github, Linkedin, type LucideIcon } from 'lucide-react';
import { SOCIAL_LINKS, type SocialId } from '@/data/content';

const ICONS: Record<SocialId, LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
  leetcode: Code,
};

export default function SocialLinks() {
  return (
    <nav aria-label="Social links" className="w-full max-w-md">
      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        {SOCIAL_LINKS.map((link) => {
          const Icon = ICONS[link.id];
          return (
            <li key={link.id}>
              <a
                href={link.url}
                target={link.placeholder ? undefined : '_blank'}
                rel={link.placeholder ? undefined : 'noopener noreferrer'}
                aria-disabled={link.placeholder || undefined}
                onClick={(event) => {
                  if (link.placeholder) event.preventDefault();
                }}
                className="group flex h-full flex-col items-center gap-2 border-2 border-ink bg-paper px-3 py-4 text-ink shadow-pixel-sm transition-all duration-100 hover:-translate-x-px hover:-translate-y-px hover:bg-mist hover:shadow-pixel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="font-pixel text-[9px] uppercase">{link.label}</span>
                {link.placeholder ? (
                  <span className="font-mono text-[10px] text-steel">Link coming soon</span>
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
