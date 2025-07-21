import { motion } from 'framer-motion';
import { Prize, RARITY_COLORS, RARITY_WEIGHTS } from '@/types/prizes';

interface Props {
  prizes: Prize[];            // UN exemplar / premiu
  selected: Prize | null;     // premiul care trebuie să pice
  spinning: boolean;
  onDone: () => void;
}

/* -------------------------------- util -------------------------------- */
function arcPath(
  cx: number, cy: number, r: number,
  startDeg: number, sweepDeg: number,
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const a0 = toRad(startDeg);
  const a1 = toRad(startDeg + sweepDeg);
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const largeArc = sweepDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z`;
}

export function PrizeWheel({ prizes, selected, spinning, onDone }: Props) {
  const radius  = 200;
  const center  = 250;

  /* ------------------- calc unghiuri ponderate ------------------- */
  const totalW  = prizes.reduce((s, p) => s + RARITY_WEIGHTS[p.rarity], 0);
  const slices  = prizes.map(p => ({
    prize : p,
    sweep : (RARITY_WEIGHTS[p.rarity] / totalW) * 360,
  }));

  /* start angle pentru fiecare felie */
  let acc = 0;
  const layout = slices.map(s => {
    const start = acc;
    acc += s.sweep;
    return { ...s, start };
  });

  /* unde trebuie să se oprească roata */
  const sel   = selected
    ? layout.find(l => l.prize.id === selected.id)
    : undefined;
  const target =
    sel
      ? 360 - (sel.start + sel.sweep / 2) + (Math.random() * 20 - 10)
      : 0;
  const final = 5 * 360 + target;

  /* ----------------------------- svg ------------------------------ */
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-20 animate-pulse" />

      <motion.svg
        width={500}
        height={500}
        className="relative z-10 drop-shadow-2xl"
        animate={spinning ? { rotate: final } : {}}
        transition={{ duration: 4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onAnimationComplete={onDone}
      >
        <circle
          cx={center}
          cy={center}
          r={radius + 10}
          fill="#1f2937"
          stroke="#374151"
          strokeWidth={3}
        />

        {layout.map(l => (
          <g key={l.prize.id}>
            <path
              d={arcPath(center, center, radius, l.start, l.sweep)}
              fill={RARITY_COLORS[l.prize.rarity]}
              stroke="#000"
              strokeWidth={2}
            />
            {/* text pe mijlocul arcului */}
            {l.sweep > 10 && (
              <text
                x={center}
                y={center}
                transform={`
                  rotate(${l.start + l.sweep / 2} ${center} ${center})
                  translate(0 -${radius * 0.6})
                  rotate(${90})
                `}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#000"
                fontSize={l.sweep < 28 ? 10 : 12}
                fontWeight="bold"
              >
                {l.prize.name.length > 16
                  ? l.prize.name.slice(0, 13) + '…'
                  : l.prize.name}
              </text>
            )}
          </g>
        ))}

        <circle
          cx={center}
          cy={center}
          r={25}
          fill="#1f2937"
          stroke="#374151"
          strokeWidth={3}
        />
      </motion.svg>

      {/* pointer */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-500" />
      </div>
    </div>
  );
}
