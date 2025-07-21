// PrizeWheel – rulează EXACT o singură dată, fără warning TS
import { useEffect } from 'react'
import { Prize, RARITY_COLORS } from '@/types/prizes'
import { Wheel } from 'react-custom-roulette'
import confetti from 'canvas-confetti'
import { Howl } from 'howler'

const tick   = new Howl({ src: ['/scroll.mp3'], volume: .5 })
const winner = new Howl({ src: ['/win.mp3'],    volume: .9 })

export interface WheelProps {
  prizes   : Prize[]
  selected : Prize | null         // ce trebuie să iasă
  spinning : boolean
  onDone   : () => void           // chemat o singură dată
}

export default function PrizeWheel(p: WheelProps) {
  /* slice‑uri → librărie */
  const data = p.prizes.map(pr => ({
    option     : pr.name,
    style      : { backgroundColor: RARITY_COLORS[pr.rarity] },
    textColors : ['#111']
  }))
  const idx = p.selected
    ? p.prizes.findIndex(pr => pr.id === p.selected!.id)
    : 0

  /* click‑uri audio cât timp se învârte */
  useEffect(() => {
    if (!p.spinning) return
    const id = setInterval(() => tick.play(), 90)
    return () => clearInterval(id)
  }, [p.spinning])

  const handleStop = () => {
    winner.play()
    confetti({ spread: 70, particleCount: 160, origin: { y: .25 } })
    p.onDone()
  }

  return (
    <Wheel
      data={data}
      prizeNumber={idx}
      mustStartSpinning={p.spinning}
      spinDuration={0.7}
      perpendicularText
      radiusLineColor="#1e293b"
      radiusLineWidth={3}
      fontSize={13}
      onStopSpinning={handleStop}
    />
  )
}
