import { Github, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import { SITE_CONTENT, SOCIAL_LINKS, type SocialId } from '@/data/content';

const FOOTER_SOCIALS: { id: SocialId; icon: LucideIcon }[] = [
  { id: 'linkedin', icon: Linkedin },
  { id: 'github', icon: Github },
];

const ICON_LINK_CLASS =
  'flex h-10 w-10 items-center justify-center border-2 border-ink bg-paper text-ink shadow-pixel-sm transition-all duration-100 hover:-translate-x-px hover:-translate-y-px hover:bg-mist hover:shadow-pixel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper';

export default function SiteFooter() {
  return (
    <footer className="mx-auto mt-12 flex w-full max-w-5xl flex-col items-center gap-4 border-t-2 border-ink/20 px-4 pb-10 pt-8 sm:px-6">
      <ul className="flex items-center gap-3">
        {FOOTER_SOCIALS.map(({ id, icon: Icon }) => {
          const link = SOCIAL_LINKS.find((item) => item.id === id);
          if (!link) return null;
          return (
            <li key={id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className={ICON_LINK_CLASS}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            </li>
          );
        })}
        <li>
          <a href={`mailto:${SITE_CONTENT.email}`} aria-label="Email" className={ICON_LINK_CLASS}>
            <Mail className="h-4 w-4" aria-hidden="true" />
          </a>
        </li>
      </ul>
      <p className="font-mono text-xs text-steel">{SITE_CONTENT.footer}</p>
    </footer>
  );
}
