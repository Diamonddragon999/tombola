import { useEffect, useRef } from 'react';
import { Prize, RARITY_COLORS } from '@/types/prizes';

interface Props {
  prizes  : Prize[];
  selected: Prize | null;
  rolling : boolean;
  onDone  : () => void;
}

// Dimensiuni dinamice în funcție de lățimea viewport-ului
function getSlotMetrics() {
  const w = typeof window === 'undefined' ? 1920 : window.innerWidth;
  if (w < 640)  return { SLOT_W: 170, GAP: 16, H: 'h-36 md:h-44', IMG: 'h-20 md:h-24' };
  if (w < 1024) return { SLOT_W: 210, GAP: 22, H: 'h-40 md:h-48', IMG: 'h-24 md:h-28' };
  return { SLOT_W: 260, GAP: 28, H: 'h-44 md:h-52', IMG: 'h-24 md:h-28' };
}

const ITEMS = 50;

export default function CaseOpening({ prizes, selected, rolling, onDone }: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    buildRail(prizes[0]); // demo static
    if (!rolling || !selected) return;
    buildRail(selected, true).then(onDone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling, selected]);

  function buildRail(prize: Prize, animate = false) {
    const rail = railRef.current!;
    rail.innerHTML = '';

    const { SLOT_W, GAP, H, IMG } = getSlotMetrics();

    const slots: Prize[] = Array.from({ length: ITEMS }, () =>
      prizes[Math.floor(Math.random() * prizes.length)]
    );
    const stopIdx = Math.floor(Math.random() * ITEMS * 0.4) + ITEMS * 0.3;
    slots[stopIdx] = prize;

    slots.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = [
        'shrink-0 flex flex-col items-center justify-center rounded-xl',
        'text-lg md:text-2xl font-semibold text-white slot-3d',
        H,
      ].join(' ');
      div.style.width = `${SLOT_W}px`;
      div.style.marginRight = `${GAP}px`;
      div.style.background = RARITY_COLORS[p.rarity];

      if (p.image) {
        const img = document.createElement('img');
        img.src = p.image;
        img.alt = p.name;
        img.className = `${IMG} object-contain mb-2 pointer-events-none`;
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
      [{ transform: 'translateX(0)' }, { transform: `translateX(-${travel}px)` }],
      { duration: 3600, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
    ).finished.then(() => {
      (rail.querySelector('[data-win=\"1\"]') as HTMLElement | null)
        ?.classList.add('ring-8', 'ring-yellow-300', 'win-pulse');
    });
  }

  return (
    <div
      className="relative w-full overflow-hidden
                 border-[6px] border-yellow-400 rounded-2xl
                 bg-blue-800/30 backdrop-blur-sm mx-auto"
    >
      {/* marker */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2
                   w-0 h-0 border-l-[26px] border-r-[26px] border-t-[42px]
                   border-l-transparent border-r-transparent border-t-red-500 neon-violet z-20"
      />
      <div ref={railRef} className="flex p-6 sm:p-8" />
    </div>
  );
}
