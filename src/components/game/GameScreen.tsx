import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import CollectibleCard from '@/components/game/CollectibleCard';
import PixelArt from '@/components/ui/PixelArt';
import PixelButton from '@/components/ui/PixelButton';
import PixelPanel from '@/components/ui/PixelPanel';
import { COLLECTIBLE_ORDER, type CollectibleId } from '@/data/content';
import { drawWorld } from '@/game/renderer';
import { WORLD_H, WORLD_W, createRun, jump, metersOf, stepRun, type RunState } from '@/game/engine';
import { COLLECTIBLE_COLORS, SPRITES } from '@/game/sprites';
import { createSoundEngine, type SoundEffect } from '@/game/sound';
import { navigate } from '@/hooks/useRoute';

type Phase = 'ready' | 'running' | 'paused' | 'card' | 'over';
type View = Phase | 'complete';

interface CardState {
  id: CollectibleId;
  isNew: boolean;
}

interface GameScreenProps {
  active: boolean;
  collected: CollectibleId[];
  onCollect: (id: CollectibleId) => void;
  onReset: () => void;
}

const TOTAL_COLLECTIBLES = COLLECTIBLE_ORDER.length;
const HUD_INTERVAL_SECONDS = 0.1;

function formatMeters(value: number): string {
  return String(value).padStart(4, '0');
}

export default function GameScreen({ active, collected, onCollect, onReset }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runRef = useRef<RunState>(createRun());
  const phaseRef = useRef<Phase>('ready');
  const duckRef = useRef(false);
  const bestRef = useRef(0);
  const collectedRef = useRef(collected);
  const onCollectRef = useRef(onCollect);

  const [phase, setPhaseState] = useState<Phase>('ready');
  const [card, setCard] = useState<CardState | null>(null);
  const [hud, setHud] = useState({ meters: 0, best: 0 });
  const [sound] = useState(createSoundEngine);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    collectedRef.current = collected;
    onCollectRef.current = onCollect;
  }, [collected, onCollect]);

  const setPhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const playSound = useCallback(
    (effect: SoundEffect) => {
      if (!muted) sound.play(effect);
    },
    [muted, sound],
  );

  const isComplete = collected.length >= TOTAL_COLLECTIBLES;
  const view: View = isComplete && phase !== 'running' && phase !== 'card' ? 'complete' : phase;

  const startRun = useCallback(() => {
    runRef.current = createRun();
    setCard(null);
    setHud((current) => ({ meters: 0, best: current.best }));
    setPhase('running');
  }, [setPhase]);

  const handleJump = useCallback(() => {
    if (collectedRef.current.length >= TOTAL_COLLECTIBLES) return;
    const current = phaseRef.current;
    if (current === 'running') {
      const run = runRef.current;
      if (run.lift === 0 && run.verticalSpeed === 0) playSound('jump');
      jump(run);
    } else if (current === 'ready' || current === 'over') {
      startRun();
    }
  }, [startRun, playSound]);

  const togglePause = useCallback(() => {
    const current = phaseRef.current;
    if (current === 'running') {
      duckRef.current = false;
      setPhase('paused');
    } else if (current === 'paused') {
      setPhase('running');
    }
  }, [setPhase]);

  const handleContinue = useCallback(() => {
    setCard(null);
    const finished = collectedRef.current.length >= TOTAL_COLLECTIBLES;
    if (finished) playSound('complete');
    setPhase(finished ? 'ready' : 'running');
  }, [setPhase, playSound]);

  const handleExplore = useCallback((id: CollectibleId) => {
    navigate(`/portfolio/${id}`, { from: 'game' });
  }, []);

  const handlePlayAgain = useCallback(() => {
    onReset();
    runRef.current = createRun();
    setCard(null);
    setHud((current) => ({ meters: 0, best: current.best }));
    setPhase('ready');
  }, [onReset, setPhase]);

  useEffect(() => {
    if (!active) {
      duckRef.current = false;
      if (phaseRef.current === 'running') setPhase('paused');
      return;
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let last = performance.now();
    let hudTimer = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const run = runRef.current;

      if (phaseRef.current === 'running') {
        const event = stepRun(run, dt, duckRef.current);
        hudTimer += dt;

        if (event?.type === 'crash') {
          duckRef.current = false;
          bestRef.current = Math.max(bestRef.current, metersOf(run));
          setPhase('over');
          playSound('crash');
          setHud({ meters: metersOf(run), best: bestRef.current });
        } else if (event?.type === 'pickup') {
          duckRef.current = false;
          const isNew = !collectedRef.current.includes(event.id);
          setCard({ id: event.id, isNew });
          setPhase('card');
          playSound('pickup');
          setHud({ meters: metersOf(run), best: bestRef.current });
          onCollectRef.current(event.id);
        } else if (hudTimer >= HUD_INTERVAL_SECONDS) {
          hudTimer = 0;
          setHud({ meters: metersOf(run), best: bestRef.current });
        }
      }

      drawWorld(ctx, run);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, setPhase, playSound]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (event.target instanceof HTMLButtonElement) return;
        event.preventDefault();
        if (!event.repeat) handleJump();
      } else if (event.code === 'ArrowDown') {
        event.preventDefault();
        duckRef.current = true;
      } else if (event.code === 'KeyP' || event.code === 'Escape') {
        togglePause();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'ArrowDown') duckRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [active, handleJump, togglePause]);

  const canPause = phase === 'running' || phase === 'paused';
  const best = hud.best;

  return (
    <section className={active ? 'px-4 py-8 sm:px-6 sm:py-10' : 'hidden'} aria-label="Pixel runner game">
      <div className="rotate-hint fixed inset-0 z-50 bg-paper p-8 text-center">
        <div className="flex h-full flex-col items-center justify-center gap-6">
          <RotateCcw className="h-12 w-12" aria-hidden="true" />
          <p className="font-pixel text-xs uppercase leading-relaxed">Rotate your phone to landscape to play</p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-2 border-ink bg-paper px-3 py-2 font-pixel text-[9px] uppercase sm:text-[10px]">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
            <span>Distance {formatMeters(hud.meters)} m</span>
            <span className="text-steel">Best {formatMeters(best)} m</span>
          </div>
          <div className="order-last flex w-full items-center justify-center gap-2 sm:order-none sm:w-auto" aria-label={`${collected.length} of ${TOTAL_COLLECTIBLES} collectibles found`}>
            {COLLECTIBLE_ORDER.map((id) => {
              const found = collected.includes(id);
              return (
                <span
                  key={id}
                  className={`flex h-8 w-8 items-center justify-center border-2 border-ink bg-paper ${found ? '' : 'opacity-35'}`}
                  style={{ color: COLLECTIBLE_COLORS[id] }}
                  title={found ? 'Collected' : 'Not collected yet'}
                >
                  <PixelArt rows={SPRITES.icons[id]} pixel={2} />
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePause}
            disabled={!canPause}
            aria-label={phase === 'paused' ? 'Resume game' : 'Pause game'}
            className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-paper transition-colors hover:bg-mist disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            {phase === 'paused' ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => setMuted((current) => !current)}
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
            aria-pressed={!muted}
            className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-paper transition-colors hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
          >
            {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
          </button>
          </div>
        </div>

        <div className="relative border-2 border-ink bg-paper shadow-pixel">
          <canvas
            ref={canvasRef}
            width={WORLD_W}
            height={WORLD_H}
            role="img"
            aria-label="Runner playing field. Press space or tap to jump."
            className="block h-auto w-full touch-none select-none"
            style={{ imageRendering: 'pixelated' }}
            onPointerDown={handleJump}
          />

          {view !== 'running' && view !== 'card' ? (
            <div className="absolute inset-0 flex items-center justify-center bg-paper/90 p-4">
              {view === 'ready' ? (
                <PixelPanel
                  title="Press Space to start"
                  actions={
                    <PixelButton onClick={handleJump} className="w-full sm:w-auto">
                      <Play className="h-4 w-4" aria-hidden="true" />
                      Start Run
                    </PixelButton>
                  }
                >
                  <p className="mt-4 font-mono text-sm leading-relaxed">
                    Space or up to jump. Down to duck. P to pause.
                  </p>
                </PixelPanel>
              ) : null}

              {view === 'paused' ? (
                <PixelPanel
                  title="Paused"
                  actions={
                    <PixelButton onClick={togglePause} className="w-full sm:w-auto">
                      <Play className="h-4 w-4" aria-hidden="true" />
                      Resume
                    </PixelButton>
                  }
                >
                  <p className="mt-4 font-mono text-sm leading-relaxed">
                    Distance so far: {formatMeters(hud.meters)} m
                  </p>
                </PixelPanel>
              ) : null}

              {view === 'over' ? (
                <PixelPanel
                  title="Game over"
                  actions={
                    <PixelButton onClick={handleJump} className="w-full sm:w-auto">
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Run Again
                    </PixelButton>
                  }
                >
                  <p className="mt-4 font-mono text-sm leading-relaxed">You ran {hud.meters} m.</p>
                </PixelPanel>
              ) : null}

              {view === 'complete' ? (
                <PixelPanel
                  title="All items collected!"
                  actions={
                    <>
                      <PixelButton onClick={handlePlayAgain} className="w-full sm:w-auto">
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        Play Again
                      </PixelButton>
                      <PixelButton variant="outline" onClick={() => navigate('/ask')} className="w-full sm:w-auto">
                        Ask Me Anything
                      </PixelButton>
                    </>
                  }
                >
                  <p className="mt-4 font-mono text-sm leading-relaxed">
                    You have found all four parts of the story. Explore any section from the portfolio menu.
                  </p>
                </PixelPanel>
              ) : null}
            </div>
          ) : null}

          {view === 'card' && card ? (
            <div className="absolute inset-0 flex items-center justify-center bg-paper/90 p-4">
              <CollectibleCard
                id={card.id}
                isNew={card.isNew}
                onExplore={() => handleExplore(card.id)}
                onContinue={handleContinue}
              />
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
          <button
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              duckRef.current = true;
            }}
            onPointerUp={() => {
              duckRef.current = false;
            }}
            onPointerLeave={() => {
              duckRef.current = false;
            }}
            onPointerCancel={() => {
              duckRef.current = false;
            }}
            className="flex touch-none select-none flex-col items-center gap-1 border-2 border-ink bg-paper py-4 font-pixel text-[9px] uppercase active:bg-ink active:text-paper"
          >
            <ArrowDown className="h-5 w-5" aria-hidden="true" />
            Duck
          </button>
          <button
            type="button"
            onPointerDown={(event) => {
              event.preventDefault();
              handleJump();
            }}
            className="flex touch-none select-none flex-col items-center gap-1 border-2 border-ink bg-ink py-4 font-pixel text-[9px] uppercase text-paper active:bg-steel"
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
            Jump
          </button>
        </div>

        <p className="mt-4 hidden font-mono text-xs text-steel sm:block">
          Space or up arrow to jump. Down arrow to duck. P or Escape to pause.
        </p>
      </div>
    </section>
  );
}
