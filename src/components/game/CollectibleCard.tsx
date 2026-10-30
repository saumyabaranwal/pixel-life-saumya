import { ArrowRight, Play } from 'lucide-react';
import PixelArt from '@/components/ui/PixelArt';
import PixelButton from '@/components/ui/PixelButton';
import PixelPanel from '@/components/ui/PixelPanel';
import { COLLECTIBLE_ORDER, SITE_CONTENT, getPortfolioSection, type CollectibleId } from '@/data/content';
import { COLLECTIBLE_COLORS, SPRITES } from '@/game/sprites';

interface CollectibleCardProps {
  id: CollectibleId;
  isNew: boolean;
  onExplore: () => void;
  onContinue: () => void;
}

export default function CollectibleCard({ id, isNew, onExplore, onContinue }: CollectibleCardProps) {
  const section = getPortfolioSection(id);
  if (!section) return null;
  const position = COLLECTIBLE_ORDER.indexOf(id) + 1;

  return (
    <PixelPanel
      title={section.name.toUpperCase()}
      actions={
        <>
          <PixelButton onClick={onExplore} className="w-full sm:w-auto">
            {SITE_CONTENT.collectActionLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </PixelButton>
          <PixelButton variant="outline" onClick={onContinue} className="w-full sm:w-auto">
            <Play className="h-4 w-4" aria-hidden="true" />
            Continue Running
          </PixelButton>
        </>
      }
    >
      <p className="mt-3 font-pixel text-[9px] uppercase text-steel">
        Collectible {position} of {COLLECTIBLE_ORDER.length} {isNew ? '' : '(already found)'}
      </p>
      <div className="mt-6 flex justify-center">
        <div className="border-2 border-ink p-3" style={{ color: COLLECTIBLE_COLORS[id], borderColor: COLLECTIBLE_COLORS[id] }}>
          <PixelArt rows={SPRITES.icons[id]} pixel={6} label={`${section.name} icon`} />
        </div>
      </div>
      <p className="mt-6 font-mono text-sm leading-relaxed text-ink">{section.summary}</p>
    </PixelPanel>
  );
}
