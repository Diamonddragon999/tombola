import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, Lock } from 'lucide-react'
import { exportGameData, exportGameDataCsv } from '@/utils/gameState'

/* helper comun ↓ */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
}

export function AdminExport() {
  const [pwd,setPwd]           = useState('')
  const [auth,setAuth]         = useState(false)
  const [err,setErr]           = useState('')

  const handleAuth = (e:React.FormEvent)=>{
    e.preventDefault()
    if (pwd==='admin2025'){ setAuth(true); setErr('') }
    else { setErr('Parolă incorectă!'); setPwd('') }
  }

  /* ---------------- UI login ---------------- */
  if (!auth) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
            <Lock className="h-6 w-6"/> Admin Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <Input type="password" placeholder="Parola admin"
                   value={pwd} onChange={e=>setPwd(e.target.value)}
                   className="bg-white/20 border-white/30 text-white"/>
            {err && <Alert variant="destructive"><AlertDescription>{err}</AlertDescription></Alert>}
            <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
              Autentificare
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )

  /* ---------------- UI export ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader><CardTitle className="text-2xl text-white text-center">Export Date</CardTitle></CardHeader>
        <CardContent className="space-y-4">

          <Button onClick={()=>{
                    downloadBlob(
                      new Blob([exportGameData()],{type:'application/json'}),
                      `festival2025_${Date.now()}.json`)
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold">
            <Download className="h-4 w-4 mr-2"/> Descarcă JSON
          </Button>

          <Button onClick={()=>{
                    downloadBlob(
                      new Blob([exportGameDataCsv()],{type:'text/csv'}),
                      `festival2025_${Date.now()}.csv`)
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold">
            <Download className="h-4 w-4 mr-2"/> Descarcă CSV
          </Button>

          <Button onClick={()=>window.location.href='/'}
                  className="w-full bg-white/20 hover:bg-white/30 text-white">
            Înapoi la aplicație
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
