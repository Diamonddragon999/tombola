import { motion } from 'framer-motion';
import { Prize, RARITY_COLORS, RARITY_WEIGHTS } from '@/types/prizes';

interface Props {
  prizes: Prize[];            // lista disponibilă (UN exemplar/prize)
  selected: Prize | null;     // ce trebuie să‑i pice jucătorului
  spinning: boolean;          // flag din BigWheel
  onDone: () => void;         // callback la final de animație
}

/* ------------ helper: generează felii ponderate ------------- */
function buildSlices(prizes: Prize[]) {
  const slices: Prize[] = [];
  for (const p of prizes) {
    const w = RARITY_WEIGHTS[p.rarity];          // ex: voucher 40  | rare 40 …
    for (let i = 0; i < w; i++) slices.push(p);  // duplicăm după greutate
  }
  return slices;
}

export function PrizeWheel({ prizes, selected, spinning, onDone }: Props) {
  const radius   = 200;
  const center   = 250;
  const slices   = buildSlices(prizes);

  /* indexul feliei câștigătoare */
  const selIdx   = selected ? slices.findIndex(p => p.id === selected.id) : -1;
  const sliceAng = 360 / slices.length;

  /* un pic de random‑jitter ca să nu cadă mereu pe margine perfect */
  const jitter   = Math.random() * 20 - 10;
  const target   =
    selIdx >= 0
      ? 360 - (selIdx * sliceAng + sliceAng / 2) + jitter
      : 0;

  /* 5 rotaţii complete + alinierea pe premiu       */
  const finalRot = 5 * 360 + target;

  /* ------------------------------------------------------------ */
  const path = (i: number) => {
    const a0 = (i * sliceAng * Math.PI) / 180;
    const a1 = ((i + 1) * sliceAng * Math.PI) / 180;
    const x0 = center + radius * Math.cos(a0);
    const y0 = center + radius * Math.sin(a0);
    const x1 = center + radius * Math.cos(a1);
    const y1 = center + radius * Math.sin(a1);
    return `M ${center} ${center} L ${x0} ${y0} A ${radius} ${radius} 0 0 1 ${x1} ${y1} Z`;
  };

  const txtPos = (i: number) => {
    const ang = i * sliceAng + sliceAng / 2;
    const r   = radius * 0.7;
    return {
      x: center + r * Math.cos((ang * Math.PI) / 180),
      y: center + r * Math.sin((ang * Math.PI) / 180),
    };
  };

  /* ------------------------------------------------------------ */
  return (
    <div className="relative">
      {/* halou colorat */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-20 animate-pulse" />

      <motion.svg
        width={500}
        height={500}
        className="relative z-10 drop-shadow-2xl"
        animate={spinning ? { rotate: finalRot } : {}}
        transition={{ duration: 4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onAnimationComplete={onDone}
      >
        {/* cerc exterior */}
        <circle
          cx={center}
          cy={center}
          r={radius + 10}
          fill="#1f2937"
          stroke="#374151"
          strokeWidth={3}
        />

        {slices.map((p, i) => (
          <g key={`${p.id}-${i}`}>
            <path
              d={path(i)}
              fill={RARITY_COLORS[p.rarity]}
              stroke="#000"
              strokeWidth={2}
            />
            <text
              {...txtPos(i)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#000"
              fontSize={slices.length > 20 ? 10 : 12}
              fontWeight="bold"
              className="pointer-events-none"
            >
              {p.name.length > 14 ? p.name.slice(0, 11) + '…' : p.name}
            </text>
          </g>
        ))}

        {/* cerc centru */}
        <circle
          cx={center}
          cy={center}
          r={25}
          fill="#1f2937"
          stroke="#374151"
          strokeWidth={3}
        />
      </motion.svg>

      {/* indicator */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-500" />
      </div>
    </div>
  );
}
