// src/components/PrizeWheel.tsx
import { Wheel } from 'react-custom-roulette';
import { Prize, RARITY_COLORS } from '@/types/prizes';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';

const tick   = new Howl({ src: ['/scroll.mp3'], volume: 0.5 });
const winner = new Howl({ src: ['/win.mp3'],    volume: 0.9 });

interface Props {
  prizes: Prize[];            // toate premiile rămase AZI (∞ voucher inclus)
  selected: Prize | null;     // premiul deciS de backend
  spinning: boolean;
  onDone: () => void;
}

export default function PrizeWheel({
  prizes, selected, spinning, onDone,
}: Props) {
  /* 1️⃣  pregătim slice‑urile pt <Wheel> */
  const data = prizes.map(p => ({
    option: p.name,
    style : { backgroundColor: RARITY_COLORS[p.rarity] },
    textColors: ['#111'],
  }));

  /* 2️⃣  indexul la care trebuie să se oprească */
  const mustStopAt = selected
    ? prizes.findIndex(p => p.id === selected.id)
    : 0;                                       // fallback (n‑ar trebui)

  /* 3️⃣  sunete + confetti */
  useEffect(() => {
    if (spinning) {
      const id = setInterval(() => tick.play(), 85);   // click la ~12 Hz
      return () => clearInterval(id);
    }
  }, [spinning]);

  const handleStop = () => {
    winner.play();
    confetti({ spread: 80, particleCount: 160, origin: { y: 0.22 } });
    onDone();
  };

  return (
    <Wheel
      mustStartSpinning={spinning}
      prizeNumber={mustStopAt}
      data={data}

      spinDuration={0.7}         // secunde – smooth, nu iese din viewport
      fontSize={13}
      radiusLineWidth={3}
      perpendicularText
      radiusLineColor="#1e293b"
      onStopSpinning={handleStop}
    />
  );
}