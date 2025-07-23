/* src/components/CaseDisplay.tsx */
import { useEffect, useState, useCallback } from 'react'
import { PRIZES, Prize } from '@/types/prizes'
import {
  pickPrize, consumePrize, addSpinResult, setSpinning,
} from '@/utils/gameState'
import { listen, unlisten, trigger } from '@/utils/realtime'
import { QRCodeDisplay } from './QRCodeDisplay'
import { StockTable }    from './StockTable'
import CaseOpening       from './CaseOpening'

export default function CaseDisplay () {
  const [selected, setSel]  = useState<Prize | null>(null)
  const [rolling,  setRoll] = useState(false)
  const [msg,      setMsg]  = useState('Așteptăm participanți…')

  const qrUrl = `${window.location.origin}/spin`

  /* ——— request primit de la telefon ——— */
  const handleRequest = useCallback(async (d: { firstName: string }) => {
    if (rolling) return
    const prize = pickPrize()

    setSel(prize)
    setMsg(`${d.firstName} deschide cutia…`)
    setRoll(true)
    setSpinning(true)

    /* aşteptăm finalul animaţiei în <CaseOpening> (3.2 s ≈ 3200 ms) */
    await new Promise(r => setTimeout(r, 3300))

    consumePrize(prize.id)
    addSpinResult({ prize, firstName: d.firstName })
    setMsg(`Felicitări! ${d.firstName} a câștigat ${prize.name}! 🎉`)

    await trigger('spin_result', { firstName: d.firstName, prize })

    /* reset după 5 s */
    setTimeout(() => {
      setRoll(false)
      setSpinning(false)
      setSel(null)
      setMsg('Așteptăm participanți…')
    }, 5000)
  }, [rolling])

  useEffect(() => {
    listen('request_spin', handleRequest)
    return () => unlisten('request_spin', handleRequest)
  }, [handleRequest])

  /* ——— UI ——— */
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
      {/* stânga: QR */}
      <QRCodeDisplay url={qrUrl} size={220} />

      {/* centru: bandă CS‑style */}
      <div className="flex flex-col items-center">
        <img
          src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
          alt="Rovision"
          className="h-16 mb-4"
        />
        <p className="text-white text-xl font-semibold mb-4">{msg}</p>

        <CaseOpening
          prizes={PRIZES}
          selected={selected}
          rolling={rolling}
          onDone={()=>{/* deja tratat în handleRequest */}}
        />
      </div>

      {/* dreapta: tabel stoc */}
      <div className="w-[420px]">
        <StockTable />
      </div>
    </div>
  )
}
