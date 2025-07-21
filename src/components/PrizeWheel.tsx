// src/components/PrizeWheel.tsx
import { useEffect, useRef } from 'react';
import { Prize, RARITY_COLORS } from '@/types/prizes';
import { Wheel }          from 'react-custom-roulette';
import { Howl }           from 'howler';
import confetti           from 'canvas-confetti';

const tick   = new Howl({ src: ['/scroll.mp3'], volume: 0.5 });
const winner = new Howl({ src: ['/win.mp3'],    volume: 0.9 });

export interface WheelProps {
  prizes  : Prize[];
  selected: Prize | null;   // premiul ales de backend
  spinning: boolean;
  onDone  : () => void;
}

/* ▼ img pointer (pune‑l tu în /public dacă vrei alt PNG) */
const pointerProps = {
  src  : '/pointer.png',                // fallback: nativ din lib
  style: { width: 36, top: -6 },        // un pic mai mic decât default
};

export default function PrizeWheel(p: WheelProps) {
  /* ------------- felii ----------------------------------------- */
  const data = p.prizes.map(pr => ({
    option     : pr.name,
    style      : { backgroundColor: RARITY_COLORS[pr.rarity] },
    textColor  : '#111',
  }));

  if (!p.selected)
    return <div className="text-white text-xl text-center mt-20">Se pregătește roata…</div>;

  const idx = p.prizes.findIndex(pr => pr.id === p.selected!.id);
  /* safety – nu intrăm niciodată pe -1; prize există în lista curentă */
  const safeIdx = idx < 0 ? 0 : idx;

  /* ------------- tick‑uri sincronizate -------------------------- */
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (p.spinning) {
      /** durată totală anim = spinDuration·1000
       *  punem ~5 click‑uri / rotaţie x (rotaţii default~=8) ≈ 40 ticks
       *  => spacing = (spinDur·1000)/ticks */
      const TICKS = data.length * 4;                       // ~4 clicuri/felie
      const spacing = (0.7 * 1000) / TICKS;                // 0.7 = spinDuration
      tickTimer.current = setInterval(() => tick.play(), spacing);
    } else if (tickTimer.current) {
      clearInterval(tickTimer.current);
      tickTimer.current = null;
    }
    return () => { if (tickTimer.current) clearInterval(tickTimer.current); };
  }, [p.spinning, data.length]);

  /** final – sunet win + confetti + cleanup */
  const handleStop = () => {
    if (tickTimer.current) clearInterval(tickTimer.current);
    winner.play();
    confetti({ spread: 70, particleCount: 160, origin: { y: 0.25 } });
    p.onDone();
  };

  /* cast → any ca să putem trimite pointerProps; nu e tipat în .d.ts */
  const WheelAny: any = Wheel;

  return (
    <div className="relative">
      {/* glow / “neon ring” */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r
                      from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-30" />
      <WheelAny
        mustStartSpinning={p.spinning}
        prizeNumber={safeIdx}
        data={data}
        spinDuration={0.7}
        pointerProps={pointerProps}
        perpendicularText
        outerBorderColor="#1e293b"
        outerBorderWidth={6}
        innerBorderColor="#0f172a"
        innerBorderWidth={6}
        radiusLineColor="#1e293b"
        radiusLineWidth={3}
        fontSize={14}
        backgroundColors={['#d1d5db', '#f3f4f6']}  // alb‑gri alternat
        textColors={['#111']}
        onStopSpinning={handleStop}
      />
    </div>
  );
}
