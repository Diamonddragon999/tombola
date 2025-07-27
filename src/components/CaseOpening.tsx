/* src/components/CaseOpening.tsx */
import { useEffect, useRef } from 'react';
import { Prize, RARITY_COLORS } from '@/types/prizes';

interface Props {
  prizes  : Prize[];
  selected: Prize | null;
  rolling : boolean;
  onDone  : () => void;
}

const SLOT_W = 260;      // mai lat
const GAP    = 28;
const ITEMS  = 50;

export default function CaseOpening({ prizes, selected, rolling, onDone }: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    buildRail(prizes[0]);                 // demo static
    if (!rolling || !selected) return;
    buildRail(selected, true).then(onDone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling, selected]);

  function buildRail(prize: Prize, animate = false) {
    const rail = railRef.current!;
    rail.innerHTML = '';

    const slots: Prize[] = Array.from({ length: ITEMS }, () =>
      prizes[Math.floor(Math.random() * prizes.length)]
    );
    const stopIdx = Math.floor(Math.random() * ITEMS * 0.4) + ITEMS * 0.3;
    slots[stopIdx] = prize;

    slots.forEach((p, i) => {
      const div = document.createElement('div');
      div.className =
        'shrink-0 h-44 md:h-52 flex flex-col items-center justify-center rounded-xl ' +
        'text-lg md:text-2xl font-semibold text-white slot-3d';
      div.style.width       = `${SLOT_W}px`;
      div.style.marginRight = `${GAP}px`;
      div.style.background  = RARITY_COLORS[p.rarity];

      if (p.image) {
        const img = document.createElement('img');
        img.src = p.image;
        img.alt = p.name;
        img.className = 'h-24 md:h-28 object-contain mb-2 pointer-events-none';
        div.appendChild(img);
      }
      const span = document.createElement('span');
      span.textContent = p.name;
      div.appendChild(span);

      if (i === stopIdx) div.dataset.win = '1';
      rail.appendChild(div);
    });

    if (!animate) return Promise.resolve();

    const travel = (stopIdx - 3) * (SLOT_W + GAP);
    return rail.animate(
      [{ transform: 'translateX(0)' },
       { transform: `translateX(-${travel}px)` }],
      { duration: 3600, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
    ).finished.then(() => {
      (rail.querySelector('[data-win="1"]') as HTMLElement | null)
        ?.classList.add('ring-8','ring-yellow-300','win-pulse');
    });
  }

  return (
    <div
      className="relative w-full max-w-[1920px] overflow-hidden
                 border-6 border-yellow-400 rounded-2xl
                 bg-blue-800/30 backdrop-blur-sm mx-auto"
    >
      {/* marker mare, vârful în jos */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2
                   w-0 h-0 border-l-[34px] border-r-[34px] border-t-[50px]
                   border-l-transparent border-r-transparent border-t-red-500 neon-violet z-20"
      />
      <div ref={railRef} className="flex p-8" />
    </div>
  );
}
