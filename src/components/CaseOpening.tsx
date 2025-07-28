// src/components/CaseOpening.tsx
import { useEffect, useRef } from 'react';
import { Prize, RARITY_COLORS } from '@/types/prizes';

interface Props {
  prizes  : ReadonlyArray<Prize>;   // <-- era Prize[]
  selected: Prize | null;
  rolling : boolean;
  onDone  : () => void;
}

const SLOT_W = 120;
const GAP    = 12;
const ITEMS  = 40;

export default function CaseOpening({ prizes, selected, rolling, onDone }: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    buildRail(prizes[0]);                 // demo
    if (!rolling || !selected) return;
    buildRail(selected, true).then(onDone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling, selected]);

  function buildRail(prize: Prize, animate = false) {
    const rail = railRef.current!;
    rail.innerHTML = '';

    const slots: Prize[] = Array.from({ length: ITEMS }, () =>
      prizes[Math.floor(Math.random() * prizes.length)] as Prize,
    );
    const stopIdx = Math.floor(Math.random() * ITEMS * 0.4) + ITEMS * 0.3;
    slots[stopIdx] = prize;

    slots.forEach((p, i) => {
      const div = document.createElement('div');
      div.className =
        'shrink-0 h-36 w-[180px] flex flex-col items-center justify-center rounded-lg text-sm font-semibold text-white slot-3d';
      div.style.marginRight = `${GAP}px`;
      div.style.background  = RARITY_COLORS[p.rarity];

      // img
      const img = document.createElement('img');
      img.src = p.image;
      img.className = 'h-20 object-contain mb-1 pointer-events-none';
      img.onerror = () => (img.style.display = 'none');
      div.appendChild(img);

      // text
      const span = document.createElement('span');
      span.textContent = p.name;
      span.className   = 'text-center leading-tight';
      div.appendChild(span);

      if (i === stopIdx) div.dataset.win = '1';
      rail.appendChild(div);
    });

    if (!animate) return Promise.resolve();

    const travel = (stopIdx - 2) * (SLOT_W + GAP);
    return rail
      .animate(
        [{ transform: 'translateX(0)' }, { transform: `translateX(-${travel}px)` }],
        { duration: 3200, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' },
      )
      .finished.then(() => {
        (rail.querySelector('[data-win="1"]') as HTMLElement | null)
          ?.classList.add('ring-4', 'ring-yellow-300', 'win-pulse');
      });
  }

  return (
    <div className="relative w-full max-w-[1800px] overflow-hidden
                    border-6 border-yellow-400 rounded-xl neon-yellow bg-blue-800/25">
      {/* marker – vârful în jos */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-0 w-0
                      border-l-[22px] border-r-[22px] border-t-[32px]
                      border-l-transparent border-r-transparent border-t-red-500 z-20" />
      <div ref={railRef} className="flex p-6" />
    </div>
  );
}
