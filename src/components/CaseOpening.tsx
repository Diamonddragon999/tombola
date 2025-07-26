/* src/components/CaseOpening.tsx */
import { useEffect, useRef } from 'react';
import { Prize, RARITY_COLORS } from '@/types/prizes';

interface Props {
  prizes  : Prize[];
  selected: Prize | null;
  rolling : boolean;
  onDone  : () => void;
}

const SLOT_W = 190;
const GAP    = 18;
const ITEMS  = 52;

export default function CaseOpening({ prizes, selected, rolling, onDone }: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // demo static
    buildRail(prizes[0]);

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
        'slot-3d shrink-0 h-32 flex items-center justify-center rounded-xl ' +
        'text-base font-semibold text-white px-4 text-center shadow-[0_0_12px_rgba(0,0,0,.35)]';
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
        { duration: 3600, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
      )
      .finished.then(() => {
        (rail.querySelector('[data-win="1"]') as HTMLElement | null)
          ?.classList.add('ring-4','ring-yellow-300','win-pulse');
      });
  }

  return (
    <div className="relative w-[1200px] max-w-[95vw] overflow-hidden
                    border-4 border-yellow-400 rounded-2xl bg-white/5 backdrop-blur-md
                    shadow-[0_0_40px_rgba(0,0,0,.35)]">
      {/* Săgeată roșie, vârful în JOS */}
      <div
        className="pointer-events-none absolute -top-[3px] left-1/2 -translate-x-1/2 z-20 w-0 h-0
                   border-l-[26px] border-r-[26px] border-t-[38px]
                   border-l-transparent border-r-transparent border-t-[#ff3b3b]
                   drop-shadow-[0_0_10px_rgba(0,0,0,.8)]"
      />
      <div ref={railRef} className="flex p-6" />
    </div>
  );
}
