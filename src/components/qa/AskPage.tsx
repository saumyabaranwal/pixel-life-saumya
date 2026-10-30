import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import BackButton from '@/components/layout/BackButton';
import PixelArt from '@/components/ui/PixelArt';
import PixelButton from '@/components/ui/PixelButton';
import { QA_ENTRIES, type QAEntry } from '@/data/content';
import { SPRITES } from '@/game/sprites';

const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

const FEMALE_VOICE_PATTERN = /female|samantha|zira|karen|victoria|moira|tessa|fiona|hazel|susan|heera/i;

function findIndianEnglishVoice(): SpeechSynthesisVoice | undefined {
  const indianVoices = window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().replace('_', '-') === 'en-in');
  return indianVoices.find((voice) => FEMALE_VOICE_PATTERN.test(voice.name)) ?? indianVoices[0];
}

export default function AskPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenRange, setSpokenRange] = useState<{ start: number; end: number } | null>(null);
  const selected = selectedIndex === null ? null : QA_ENTRIES[selectedIndex];

  useEffect(() => {
    return () => {
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, []);

  function selectEntry(index: number) {
    if (speechSupported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpokenRange(null);
    setSelectedIndex(index);
  }

  function toggleSpeech(entry: QAEntry) {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      setSpokenRange(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(`${entry.question} ${entry.answer}`);
    utterance.voice = findIndianEnglishVoice() ?? null;
    const answerOffset = entry.question.length + 1;
    utterance.onboundary = (event) => {
      if (event.name !== 'word') return;
      const start = event.charIndex - answerOffset;
      if (start < 0) return;
      const word = /^\S+/.exec(entry.answer.slice(start))?.[0] ?? '';
      setSpokenRange({ start, end: start + word.length });
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpokenRange(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpokenRange(null);
    };
    setIsSpeaking(true);
    synth.speak(utterance);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <BackButton fallback="/" label="Home" />

      <header className="mt-8 border-b-2 border-ink pb-6">
        <p className="font-pixel text-[10px] uppercase text-steel">Q and A</p>
        <h1 className="mt-4 font-pixel text-xl leading-[1.3] sm:text-3xl">Ask me anything</h1>
        <p className="mt-4 max-w-2xl font-mono text-base leading-relaxed text-steel">
          Pick a question below and I will answer it.
        </p>
      </header>

      <div className="mt-10 grid gap-8 md:grid-cols-[220px_1fr] md:gap-12">
        <div className="flex flex-col items-center gap-4">
          <div className="border-2 border-ink bg-paper p-4 shadow-pixel-sm">
            <PixelArt rows={SPRITES.runA} pixel={6} label="Pixel character" className="text-ink" />
          </div>
          <span className="font-pixel text-[10px] uppercase">Me</span>
        </div>

        <div className="flex flex-col gap-8">
          <div
            role="status"
            aria-live="polite"
            className="min-h-44 border-2 border-ink bg-paper p-6 shadow-pixel sm:p-8"
          >
            {selected ? (
              <>
                <p className="font-pixel text-[10px] uppercase leading-relaxed text-steel">{selected.question}</p>
                <p className="mt-5 whitespace-pre-line font-mono text-base leading-relaxed">
                  {spokenRange ? (
                    <>
                      {selected.answer.slice(0, spokenRange.start)}
                      <mark className="bg-ink text-paper">{selected.answer.slice(spokenRange.start, spokenRange.end)}</mark>
                      {selected.answer.slice(spokenRange.end)}
                    </>
                  ) : (
                    selected.answer
                  )}
                </p>
                {selected.placeholder ? (
                  <span className="mt-6 inline-block border-2 border-ink px-2 py-1 font-pixel text-[9px] uppercase">
                    Placeholder
                  </span>
                ) : null}
                {speechSupported ? (
                  <PixelButton variant="outline" onClick={() => toggleSpeech(selected)} className="mt-6">
                    {isSpeaking ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
                    {isSpeaking ? 'Stop' : 'Listen'}
                  </PixelButton>
                ) : null}
              </>
            ) : (
              <p className="font-mono text-base leading-relaxed">Hi! Choose a question to get started.</p>
            )}
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {QA_ENTRIES.map((entry, index) => {
              const isSelected = selectedIndex === index;
              return (
                <li key={entry.question}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectEntry(index)}
                    className={`h-full w-full border-2 border-ink px-4 py-4 text-left font-mono text-sm leading-relaxed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                      isSelected ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-mist'
                    }`}
                  >
                    {entry.question}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
