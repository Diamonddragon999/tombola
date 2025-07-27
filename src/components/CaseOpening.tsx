/* src/components/CaseOpening.tsx */
import { useEffect, useRef } from 'react';
import { Prize, RARITY_COLORS } from '@/types/prizes';

interface Props {
  prizes  : Prize[];
  selected: Prize | null;
  rolling : boolean;
  onDone  : (winner: Prize) => void;
}

const SLOT_W = 210;   // ruletă mare
const GAP    = 18;
const ITEMS  = 52;
const CENTER_SLOT = 3; // markerul “arată” slotul nr. 3 (0-based) din container

export default function CaseOpening({ prizes, selected, rolling, onDone }: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // mereu afișăm ceva (demo)
    buildRail(prizes[0], false);

    if (!rolling || !selected) return;
    buildRail(selected, true).then(() => onDone(selected)).catch(() => onDone(selected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling, selected]);

  function buildRail(prize: Prize, animate: boolean) {
    const rail = railRef.current;
    if (!rail) return Promise.resolve();

    rail.innerHTML = '';

    // 1) slots random
    const slots: Prize[] = Array.from({ length: ITEMS }, () =>
      prizes[Math.floor(Math.random() * prizes.length)]
    );

    // 2) winner plasat mai spre final
    const stopIdx = Math.floor(Math.random() * ITEMS * 0.4) + Math.floor(ITEMS * 0.5);
    slots[stopIdx] = prize;

    // 3) render
    slots.forEach((p, i) => {
      const div = document.createElement('div');
      div.textContent = p.name;
      div.className =
        'shrink-0 h-32 flex items-center justify-center rounded-xl text-base font-semibold text-white slot-3d';
      div.style.width       = `${SLOT_W}px`;
      div.style.marginRight = `${GAP}px`;
      div.style.background  = RARITY_COLORS[p.rarity];
      if (i === stopIdx) div.dataset.win = '1';
      rail.appendChild(div);
    });

    if (!animate) return Promise.resolve();

    // 4) anim matematic (nu depindem de getBoundingClientRect => fără mismatch)
    const travel = (stopIdx - CENTER_SLOT) * (SLOT_W + GAP);
    return rail.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(-${travel}px)` }],
      {
        duration: 3600,
        easing  : 'cubic-bezier(.22,1,.36,1)',
        fill    : 'forwards',
      }
    ).finished.then(() => {
      (rail.querySelector('[data-win="1"]') as HTMLElement | null)
        ?.classList.add('ring-4','ring-yellow-300','win-pulse');
    });
  }

  return (
    <div
      className="relative w-full max-w-[1700px] overflow-hidden
                 border-4 border-yellow-400 rounded-2xl
                 bg-blue-800/40 backdrop-blur-sm mx-auto"
    >
      {/* marker mare, vârf în JOS */}
      <div
        className="absolute -top-28 left-1/2 -translate-x-1/2 h-0 w-0 z-30
                   border-l-[85px] border-r-[85px] border-t-[130px]
                   border-l-transparent border-r-transparent border-t-red-500 drop-shadow-2xl"
      />
      <div ref={railRef} className="flex px-8 py-6" />
    </div>
  );
}
