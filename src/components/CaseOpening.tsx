import { useEffect, useRef } from 'react';
import { Prize, RARITY_COLORS } from '@/types/prizes';

interface Props {
  prizes  : Prize[];
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
    buildRail(prizes[0]);                // demo
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
      div.textContent = p.name;
      div.className =
        'slot-3d shrink-0 h-24 flex items-center justify-center rounded-lg text-sm font-semibold text-white';
      div.style.width       = `${SLOT_W}px`;
      div.style.marginRight = `${GAP}px`;
      div.style.background  = RARITY_COLORS[p.rarity];
      if (i === stopIdx) div.dataset.win = '1';
      rail.appendChild(div);
    });

    if (!animate) return Promise.resolve();

    const travel = (stopIdx - 2) * (SLOT_W + GAP);
    return rail
      .animate(
        [{ transform: 'translateX(0)' },
         { transform: `translateX(-${travel}px)` }],
        { duration: 3200, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
      ).finished.then(() => {
        (rail.querySelector('[data-win="1"]') as HTMLElement | null)
          ?.classList.add('ring-4','ring-yellow-300','win-pulse');
      });
  }

 /* ... restul componentului neschimbat ... */

  return (
    /* în CaseOpening.tsx, în return(), înlocuiește markerul existent */

<div className="relative w-[620px] overflow-hidden
                border-4 border-yellow-400 rounded-xl
                bg-white/5 backdrop-blur-sm">

  {/* ACUL – vârful în jos */}
  <div
    className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-20 w-0 h-0
               border-l-[18px] border-r-[18px] border-t-[28px]
               border-l-transparent border-r-transparent border-t-[#ff3b3b]
               drop-shadow-[0_0_6px_rgba(0,0,0,.9)]"
  />

  <div ref={railRef} className="flex p-4" />
</div>

  )
}

