/* src/components/PrizeWheel.tsx */
import { motion } from 'framer-motion';
import { Prize, RARITY_COLORS } from '@/types/prizes';

interface Props {
  prizes: Prize[];
  selected: Prize | null;         // schimbat nume => “selected”
  spinning: boolean;
  onDone: () => void;
}

export function PrizeWheel({
  prizes, selected, spinning, onDone,
}: Props) {
  /* ---------- parametri geometrie ---------- */
  const radius   = 200;
  const center   = 250;
  const sliceAng = 360 / prizes.length;

  /* ---------- indice premiu ales ----------- */
  const selIdx = selected
    ? prizes.findIndex(p => p.id === selected.id)
    : -1;

  /* dacă n‑am găsit, pointerul rămâne unde este */
  const target = selIdx >= 0
    ? 360 - (selIdx * sliceAng + sliceAng / 2)
    : 0;

  const finalRotation = 5 * 360 + target;   // 5 ture + aliniere

  /* helpers desen */
  const pathFor = (i: number) => {
    const a0 = (i * sliceAng) * Math.PI / 180;
    const a1 = ((i + 1) * sliceAng) * Math.PI / 180;
    const x0 = center + radius * Math.cos(a0);
    const y0 = center + radius * Math.sin(a0);
    const x1 = center + radius * Math.cos(a1);
    const y1 = center + radius * Math.sin(a1);
    const large = sliceAng > 180 ? 1 : 0;
    return `M${center} ${center}L${x0} ${y0}A${radius} ${radius} 0 ${large} 1 ${x1} ${y1}Z`;
  };

  const textPos = (i: number) => {
    const ang = (i * sliceAng + sliceAng / 2) * Math.PI / 180;
    const r   = radius * 0.7;
    return { x: center + r * Math.cos(ang), y: center + r * Math.sin(ang) };
  };

  /* ---------- render ----------------------- */
  return (
    <div className="relative">
      {/* luminiţă exterior */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-20 animate-pulse" />

      <motion.svg
        width={500} height={500} className="relative z-10 drop-shadow-2xl"
        animate={spinning ? { rotate: finalRotation } : {}}
        transition={{ duration: 4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onAnimationComplete={onDone}
      >
        <circle cx={center} cy={center} r={radius + 10}
                fill="#1f2937" stroke="#374151" strokeWidth={3} />

        {prizes.map((p, i) => (
          <g key={p.id}>
            <path d={pathFor(i)} fill={RARITY_COLORS[p.rarity]} stroke="#000" strokeWidth={2} />
            <text
              {...textPos(i)} textAnchor="middle" dominantBaseline="middle"
              fill="#000" fontSize={12} fontWeight="bold"
            >
              {p.name.length > 14 ? p.name.slice(0, 11) + '…' : p.name}
            </text>
          </g>
        ))}
      </motion.svg>

      {/* pointer */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-500" />
      </div>
    </div>
  );
}
