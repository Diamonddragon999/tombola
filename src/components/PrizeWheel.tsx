// PrizeWheel.tsx
import { useEffect, useRef } from 'react';
import { Prize, RARITY_COLORS } from '@/types/prizes';
import { Wheel } from 'react-custom-roulette';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';

const tick   = new Howl({ src: ['/scroll.mp3'], volume: 0.5 });
const winner = new Howl({ src: ['/win.mp3'],    volume: 0.9 });

export interface WheelProps {
  prizes  : Prize[];
  selected: Prize | null;
  spinning: boolean;
  onDone  : () => void;
}

export default function PrizeWheel(p: WheelProps) {
  /* ---------------- slice data ---------------- */
  const data = p.prizes.map(pr => ({
    option     : pr.name,
    style      : { backgroundColor: RARITY_COLORS[pr.rarity] },
    image      : pr.image ? { uri: pr.image } : undefined,
    imageSize  : 40,
    textColors : ['#111'],
  }));

  /* până primim “selected” afişăm placeholder‑ul */
  if (!p.selected)
    return <div className="text-white text-xl text-center mt-20">Se pregătește roata…</div>;

  /* sigur avem selected ⇒ “!” ptr. TS */
  const idx = p.prizes.findIndex(pr => pr.id === p.selected!.id);

  /* ---------------- sunet tick‑tick ----------- */
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
    confetti({ spread: 70, particleCount: 160, origin: { y: 0.25 } });
    p.onDone();
  };

  /* Wheel tip‑less ca să putem trimite `showImage` */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const WheelAny: any = Wheel;
  
  console.log('PrizeWheel rendered – p.selected:', p.selected);

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
      showImage          /* OK la runtime, ignorat de TS */
      imageSize={40}
      onStopSpinning={handleStop}
    />
  );
}
