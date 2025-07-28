import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import { Err } from './Err'
import { SocialCheck } from './SocialCheck'
import { useJoinForm } from './useJoinForm'

export default function JoinFormUI() {
  const { data, setData, errors, state, submit, prizeWon } = useJoinForm()

  if (state !== 'idle')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="w-full max-w-md">
          <h2 className="text-white text-2xl text-center mb-4">
            {state === 'waiting' ? 'Așteptăm rândul tău…' : `Felicitări! Ai câștigat: ${prizeWon}`}
          </h2>
          <p className="text-gray-100 text-center">
            {state === 'waiting'
              ? 'Roata se învârte! Urmărește ecranul mare.'
              : 'Prezintă acest ecran staff‑ului pentru ridicarea premiului.'}
          </p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="w-full max-w-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void submit()
          }}
          className="space-y-6 w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fn" className="text-white">
                Prenume *
              </Label>
              <Input
                id="fn"
                value={data.firstName}
                onChange={(e) => setData({ ...data, firstName: e.target.value })}
                className="bg-white/20 border-white/30 text-white"
              />
              {errors.firstName && <Err msg={errors.firstName} />}
            </div>
            <div>
              <Label htmlFor="ln" className="text-white">
                Nume *
              </Label>
              <Input
                id="ln"
                value={data.lastName}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
                className="bg-white/20 border-white/30 text-white"
              />
              {errors.lastName && <Err msg={errors.lastName} />}
            </div>
          </div>
          <div>
            <Label htmlFor="em" className="text-white">
              Email *
            </Label>
            <Input
              id="em"
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="bg-white/20 border-white/30 text-white"
            />
            {errors.email && <Err msg={errors.email} />}
          </div>
          <div>
            <Label htmlFor="age" className="text-white">
              Vârsta *
            </Label>
            <Input
              id="age"
              type="number"
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
              className="bg-white/20 border-white/30 text-white"
            />
            {errors.age && <Err msg={errors.age} />}
          </div>
          <div>
            <Label className="text-white font-medium">Urmărește‑ne *</Label>
            <SocialCheck
              id="fb"
              tone="blue"
              checked={data.followsFacebook}
              icon={<Facebook className="h-4 w-4 text-blue-500" />}
              text="Like pe Facebook"
              url="https://www.facebook.com/SistemeDeSupraveghereVideo"
              onToggle={(v) => setData({ ...data, followsFacebook: v })}
            />
            <SocialCheck
              id="ig"
              tone="pink"
              checked={data.followsInstagram}
              icon={<Instagram className="h-4 w-4 text-pink-500" />}
              text="Follow pe Instagram"
              url="https://www.instagram.com/rovision_supraveghere_video/"
              onToggle={(v) => setData({ ...data, followsInstagram: v })}
            />
            <SocialCheck
              id="yt"
              tone="red"
              checked={data.followsYoutube}
              icon={<Youtube className="h-4 w-4 text-red-500" />}
              text="Subscribe pe YouTube"
              url="https://www.youtube.com/@rovision1317/"
              onToggle={(v) => setData({ ...data, followsYoutube: v })}
            />
            {errors.social && <Err msg={errors.social} />}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="nl"
              checked={data.newsletterConsent}
              onCheckedChange={(v) => setData({ ...data, newsletterConsent: v as boolean })}
              className="border-white/50 data-[state=checked]:bg-green-600"
            />
            <Label htmlFor="nl" className="text-white text-sm cursor-pointer">
              Accept newsletter‑ul *
            </Label>
          </div>
          {errors.newsletterConsent && <Err msg={errors.newsletterConsent} />}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3"
          >
            Participă la tombola!
          </Button>
        </form>
      </div>
    </div>
  )
}
