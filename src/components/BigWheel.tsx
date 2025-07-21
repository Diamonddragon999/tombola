import { useEffect, useState } from 'react'
import PrizeWheel from './PrizeWheel'
import { Prize } from '@/types/prizes'

export default function BigWheel() {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [selected, setSelected] = useState<Prize | null>(null)
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    try {
      const allPrizes = JSON.parse(localStorage.getItem('prizes') || '[]') as Prize[]
      const selectedPrize = JSON.parse(localStorage.getItem('selectedPrize') || 'null') as Prize | null
      setPrizes(allPrizes)
      setSelected(selectedPrize)
      setSpinning(true)
    } catch (e) {
      console.error('Eroare la citirea localStorage:', e)
    }
  }, [])

  const handleDone = () => {
    setSpinning(false)
  }

  if (!selected || prizes.length === 0) return (
    <div className="text-white text-xl text-center mt-20">Se pregătește roata...</div>
  )

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <PrizeWheel
        prizes={prizes}
        selected={selected}
        spinning={spinning}
        onDone={handleDone}
      />
    </div>
  )
}
