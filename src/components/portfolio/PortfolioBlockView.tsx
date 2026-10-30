import { ArrowUpRight } from 'lucide-react';
import { CODING_PROFILES, type LinkItem, type PortfolioBlock, type PortfolioCard } from '@/data/content';

interface PortfolioBlockViewProps {
  block: PortfolioBlock;
  id: string;
}

function PlaceholderBadge() {
  return (
    <span className="border-2 border-ink px-2 py-1 font-pixel text-[8px] uppercase">Placeholder</span>
  );
}

function LinkChip({ link }: { link: LinkItem }) {
  return (
    <a
      href={link.url}
      target={link.placeholder ? undefined : '_blank'}
      rel={link.placeholder ? undefined : 'noopener noreferrer'}
      aria-disabled={link.placeholder || undefined}
      onClick={(event) => {
        if (link.placeholder) event.preventDefault();
      }}
      className="inline-flex items-center gap-2 border-2 border-ink px-3 py-2 font-pixel text-[9px] uppercase transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
    >
      {link.label}
      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}

function CardItem({ card }: { card: PortfolioCard }) {
  return (
    <article className="flex flex-col gap-3 border-2 border-ink border-t-[6px] border-t-[color:var(--accent)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-pixel text-[10px] uppercase leading-relaxed">{card.title}</h3>
        {card.placeholder ? <PlaceholderBadge /> : null}
      </div>
      {card.meta ? <p className="font-pixel text-[8px] uppercase text-steel">{card.meta}</p> : null}
      {card.body ? <p className="font-mono text-sm leading-relaxed">{card.body}</p> : null}
      {card.details && card.details.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {card.details.map((detail) => (
            <li key={detail} className="flex gap-3 font-mono text-sm leading-relaxed">
              <span className="mt-2 h-2 w-2 shrink-0 bg-[color:var(--accent)]" aria-hidden="true" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {card.facts && card.facts.length > 0 ? (
        <dl className="flex flex-col gap-3 border-t-2 border-ink pt-4">
          {card.facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1">
              <dt className="font-pixel text-[8px] uppercase text-steel">{fact.label}</dt>
              <dd className="font-mono text-sm leading-relaxed">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {card.tags && card.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
          {card.tags.map((tag) => (
            <li key={tag} className="bg-mist px-2 py-1 font-mono text-xs">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      {card.links && card.links.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {card.links.map((link) => (
            <LinkChip key={link.label} link={link} />
          ))}
        </div>
      ) : null}
    </article>
  );
}

function BlockContent({ block }: { block: PortfolioBlock }) {
  switch (block.type) {
    case 'text':
      return <p className="font-mono text-sm leading-relaxed">{block.body}</p>;
    case 'cards':
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {block.items.map((card) => (
            <CardItem key={card.title} card={card} />
          ))}
        </div>
      );
    case 'bullets':
      return (
        <ul className="flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 font-mono text-sm leading-relaxed">
              <span className="mt-2 h-2 w-2 shrink-0 bg-[color:var(--accent)]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'tagGroups':
      return (
        <div className="grid gap-6 sm:grid-cols-2">
          {block.groups.map((group) => (
            <div key={group.label}>
              <h3 className="font-pixel text-[9px] uppercase text-steel">{group.label}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="border-2 border-ink px-2 py-1 font-mono text-xs">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case 'profiles':
      return (
        <ul className="grid gap-4 sm:grid-cols-2">
          {CODING_PROFILES.map((profile) => (
            <li key={profile.label} className="flex flex-col items-start gap-3 border-2 border-ink p-5">
              <LinkChip link={profile} />
              {profile.note ? <p className="font-mono text-sm leading-relaxed text-steel">{profile.note}</p> : null}
            </li>
          ))}
        </ul>
      );
  }
}

export default function PortfolioBlockView({ block, id }: PortfolioBlockViewProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      className="border-2 border-ink border-t-[10px] border-t-[color:var(--accent)] bg-paper p-6 shadow-pixel-sm sm:p-8"
      aria-labelledby={headingId}
    >      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={headingId} className="font-pixel text-[11px] uppercase leading-relaxed">
          {block.heading}
        </h2>
        {block.placeholder ? <PlaceholderBadge /> : null}
      </div>
      <div className="mt-6">
        <BlockContent block={block} />
      </div>
    </section>
  );
}
