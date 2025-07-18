import { motion } from 'framer-motion';
import { Prize, RARITY_COLORS } from '../types/prizes';

interface PrizeWheelProps {
  prizes: Prize[];
  selectedPrize?: Prize | null;
  isSpinning: boolean;
  onSpinComplete?: () => void;
}

export function PrizeWheel({ prizes, selectedPrize, isSpinning, onSpinComplete }: PrizeWheelProps) {
  const radius = 200;
  const centerX = 250;
  const centerY = 250;
  
  // Add "Nimic" (nothing) slices to achieve the probability distribution
  const nothingSlices = 8; // 40% nothing
  const allPrizes = [...prizes];
  
  // Add "nothing" entries
  for (let i = 0; i < nothingSlices; i++) {
    allPrizes.push({
      id: `nothing-${i}`,
      name: 'Încearcă din nou!',
      rarity: 'rare' as const,
      dailyStock: 999
    });
  }
  
  const sliceAngle = 360 / allPrizes.length;
  
  // Calculate rotation angle to land on selected prize
  const selectedIndex = selectedPrize ? allPrizes.findIndex(p => p.id === selectedPrize.id) : -1;
  const targetAngle = selectedIndex >= 0 ? 
    360 - (selectedIndex * sliceAngle + sliceAngle / 2) + (Math.random() * 20 - 10) : 0;
  
  const spins = 5; // Number of full rotations
  const finalRotation = spins * 360 + targetAngle;

  const createSlicePath = (index: number) => {
    const startAngle = index * sliceAngle;
    const endAngle = (index + 1) * sliceAngle;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = sliceAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number) => {
    const angle = index * sliceAngle + sliceAngle / 2;
    const angleRad = (angle * Math.PI) / 180;
    const textRadius = radius * 0.7;
    
    return {
      x: centerX + textRadius * Math.cos(angleRad),
      y: centerY + textRadius * Math.sin(angleRad)
    };
  };

  const getSliceColor = (prize: any) => {
    if (prize.id.startsWith('nothing-')) {
      return '#6b7280'; // Gray for nothing
    }
    return RARITY_COLORS[prize.rarity as keyof typeof RARITY_COLORS];
  };

  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-20 animate-pulse"></div>
        
        <motion.svg
          width={500}
          height={500}
          className="relative z-10 drop-shadow-2xl"
          animate={isSpinning ? { rotate: finalRotation } : {}}
          transition={{
            duration: 4,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          onAnimationComplete={onSpinComplete}
        >
          {/* Define gradients */}
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5"/>
            </filter>
          </defs>
          
          {/* Outer ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 10}
            fill="#1f2937"
            stroke="#374151"
            strokeWidth="3"
            filter="url(#shadow)"
          />
          
          {allPrizes.map((prize, index) => {
            const textPos = getTextPosition(index);
            const sliceColor = getSliceColor(prize);
            
            return (
              <g key={`${prize.id}-${index}`}>
                <path
                  d={createSlicePath(index)}
                  fill={sliceColor}
                  stroke="#000"
                  strokeWidth={2}
                  filter="url(#shadow)"
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#000"
                  fontSize={allPrizes.length > 12 ? "10" : "12"}
                  fontWeight="bold"
                  className="pointer-events-none"
                  style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}
                >
                  {prize.name.length > 10 ? 
                    prize.name.substring(0, 10) + '...' : 
                    prize.name
                  }
                </text>
              </g>
            );
          })}
          
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={25}
            fill="#1f2937"
            stroke="#374151"
            strokeWidth="3"
            filter="url(#shadow)"
          />
        </motion.svg>
        
        {/* Pointer */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"></div>
        </div>
      </div>
    </div>
  );
}