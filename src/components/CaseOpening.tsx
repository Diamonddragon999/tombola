/* src/components/CaseOpening.tsx */
import { useEffect, useRef } from 'react'
import { Prize, RARITY_COLORS } from '@/types/prizes'

interface Props {
  prizes  : Prize[]
  selected: Prize | null
  rolling : boolean
  onDone  : () => void
}

const SLOT_W = 120
const GAP    = 12
const ITEMS  = 40

export default function CaseOpening ({ prizes, selected, rolling, onDone }: Props) {
  const railRef = useRef<HTMLDivElement>(null)

  /* DEMO iniţial + anim real când primim câştigătorul */
  useEffect(() => {
    buildRail(prizes[0])                 // demo static

    if (!rolling || !selected) return
    buildRail(selected, true).then(onDone)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling, selected])

  function buildRail (prize: Prize, animate = false) {
    const rail = railRef.current!
    rail.innerHTML = ''

    const slots: Prize[] = Array.from({ length: ITEMS }, () =>
      prizes[Math.floor(Math.random() * prizes.length)],
    )
    const stopIdx = Math.floor(Math.random() * ITEMS * 0.4) + ITEMS * 0.3
    slots[stopIdx] = prize

    slots.forEach((p, i) => {
      const div = document.createElement('div')
      div.textContent = p.name
      div.className =
        'shrink-0 h-24 flex items-center justify-center rounded-lg text-sm font-semibold text-white'
      div.style.width       = `${SLOT_W}px`
      div.style.marginRight = `${GAP}px`
      div.style.background  = RARITY_COLORS[p.rarity]
      if (i === stopIdx) div.dataset.win = '1'
      rail.appendChild(div)
    })

    if (!animate) return Promise.resolve()

    const travel = (stopIdx - 2) * (SLOT_W + GAP)
    return rail
      .animate(
        [{ transform: 'translateX(0)' },
         { transform: `translateX(-${travel}px)` }],
        {
          duration: 3200,
          easing  : 'cubic-bezier(.22,1,.36,1)',
          fill    : 'forwards',
        },
      )
      .finished.then(() => {
        (rail.querySelector('[data-win="1"]') as HTMLElement | null)
          ?.classList.add('ring-4','ring-yellow-300','animate-pulse')
      })
  }

  /* UI */
  return (
    <div className="relative w-[620px] overflow-hidden
                    border-4 border-yellow-400 rounded-xl
                    bg-blue-800/40 backdrop-blur-sm">
      {/* marker – vârful ÎN JOS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0 w-0
                      border-l-[15px] border-r-[15px] border-t-[25px]
                      border-l-transparent border-r-transparent border-t-red-500" />
      <div ref={railRef} className="flex p-4" />
    </div>
  )
}
