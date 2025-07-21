// PrizeWheel.tsx – versiune „minimal‑risk” fără imagini + fără crash
import { useEffect, useRef } from 'react';
import { Wheel }  from 'react-custom-roulette';
import confetti   from 'canvas-confetti';
import { Howl }   from 'howler';
import { Prize, RARITY_COLORS } from '@/types/prizes';

const tick   = new Howl({ src: ['/scroll.mp3'], volume: .5 });
const winner = new Howl({ src: ['/win.mp3'],    volume: .9 });

export interface WheelProps {
  prizes   : Prize[];
  selected : Prize | null;
  spinning : boolean;
  onDone   : () => void;
}

export default function PrizeWheel(p: WheelProps) {
  /* 1. waiting‑placeholder până primim `selected` */
  if (!p.selected)
    return (
      <div className="text-white text-xl text-center mt-20">
        Se pregătește roata…
      </div>
    );

  /* 2. asigurăm că premiul ales există în felii */
  let slices = [...p.prizes];
  let idx = p.prizes.findIndex(pr => pr.id === p.selected!.id);
  if (idx === -1) {           // tocmai a ieşit din stoc ⇒ îl adăugăm
    slices.push(p.selected);
    idx = slices.length - 1;
  }

  /* 3. pregătim datele pentru roată (FĂRĂ imagini → 0 bug‑uri) */
  const data = slices.map(pr => ({
    option     : pr.name,
    style      : { backgroundColor: RARITY_COLORS[pr.rarity] },
    textColors : ['#111'],
  }));

  /* 4. sunet tick‑tick */
  const tickRef = useRef<ReturnType<typeof setInterval>|null>(null);
  useEffect(() => {
    if (p.spinning && !tickRef.current)
      tickRef.current = setInterval(() => tick.play(), 90);
    if (!p.spinning && tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, [p.spinning]);

  const handleStop = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    winner.play();
    confetti({ spread: 70, particleCount: 160, origin: { y: .25 } });
    p.onDone();
  };

  /* 5. rulăm roata (cast‑ul la `any` scoate warnings legate de tipuri) */
  // eslint‑disable‑next‑line @typescript-eslint/no-explicit-any
  const WheelAny: any = Wheel;

  return (
    <WheelAny
      data={data}
      prizeNumber={idx}
      mustStartSpinning={p.spinning}
      spinDuration={0.7}
      perpendicularText
      radiusLineColor="#1e293b"
      radiusLineWidth={3}
      fontSize={13}
      onStopSpinning={handleStop}
    />
  );
}
