import { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle, Facebook, Instagram, Youtube,
} from 'lucide-react';
import {
  addParticipant,
  getGameState,
  setSpinning,
} from '../utils/gameState';
import { listen, unlisten, trigger } from '../utils/realtime';

/* ------------------------------------------------------------------ */
export function JoinForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    followsFacebook: false,
    followsInstagram: false,
    followsYoutube: false,
    newsletterConsent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  /* primește rezultat de la pusher */
    useEffect(() => {
      const cb = (d: any) => {
        setIsWaiting(false);
        setSpinning(false);
        alert(`Felicitări! Ai câștigat: ${d.prize.name}`);
      };
      listen('spin_result', cb);
      return () => { unlisten('spin_result', cb); };   // cleanup = void
    }, []);

  /* ---------------- VALIDARE ---------------- */
  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'Prenumele este obligatoriu';
    if (!formData.lastName.trim()) e.lastName = 'Numele este obligatoriu';
    if (!formData.email.trim()) e.email = 'Email-ul este obligatoriu';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Email invalid';
    if (!formData.age.trim()) e.age = 'Vârsta e obligatorie';
    else if (+formData.age < 18) e.age = 'Trebuie 18+';
    if (
      !formData.followsFacebook
      && !formData.followsInstagram
      && !formData.followsYoutube
    )
      e.social = 'Alege cel puțin o platformă';
    if (!formData.newsletterConsent)
      e.newsletterConsent = 'Acceptă newsletter‑ul';
    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ---------------- SUBMIT ------------------ */
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateForm()) return;

    const gs = getGameState();
    if (gs.isSpinning) {
      alert('Așteaptă finalizarea rotirii curente.');
      return;
    }

    addParticipant({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      followsSocial:
        formData.followsFacebook
        || formData.followsInstagram
        || formData.followsYoutube,
      newsletterConsent: formData.newsletterConsent,
    });

    setSpinning(true);
    setIsSubmitted(true);
    setIsWaiting(true);

    /* emite cererea prin API → Pusher */
    await trigger('request_spin', { firstName: formData.firstName });
  };

  /* ---------- UI după submit --------------- */
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-white">
              {isWaiting ? 'Așteptând rândul tău…' : 'Mulțumim!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-100 mb-4">
              {isWaiting
                ? 'Roata se învârte pentru tine! Urmărește ecranul mare.'
                : 'Verifică‑ți emailul pentru detalii.'}
            </p>
            {isWaiting && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto" />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ------------------ FORMULAR ------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="text-center">
            <img
              src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
              alt="Rovision Logo"
              className="h-12 w-auto mx-auto mb-4"
            />
            <CardTitle className="text-2xl text-white mb-2">Young Festival 2025</CardTitle>
            <p className="text-yellow-400 font-semibold">Roata Norocului</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prenume + Nume */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-white">Prenume *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  placeholder="Prenume"
                />
                {errors.firstName && <Err msg={errors.firstName} />}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white">Nume *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                  placeholder="Nume"
                />
                {errors.lastName && <Err msg={errors.lastName} />}
              </div>
            </div>

            {/* Email & Vârstă */}
            <div>
              <Label htmlFor="email" className="text-white">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                placeholder="exemplu@email.com"
              />
              {errors.email && <Err msg={errors.email} />}
            </div>

            <div>
              <Label htmlFor="age" className="text-white">Vârsta *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                placeholder="18+"
              />
              {errors.age && <Err msg={errors.age} />}
            </div>

            {/* SOCIAL CHECKS */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Urmărește-ne *</Label>

              <SocialCheck
                id="fb"
                checked={formData.followsFacebook}
                color="blue-600"
                icon={<Facebook className="h-4 w-4 text-blue-500" />}
                text="Like pe Facebook"
                url="https://www.facebook.com/SistemeDeSupraveghereVideo"
                onToggle={(v) => setFormData({ ...formData, followsFacebook: v })}
              />

              <SocialCheck
                id="ig"
                checked={formData.followsInstagram}
                color="pink-600"
                icon={<Instagram className="h-4 w-4 text-pink-500" />}
                text="Follow pe Instagram"
                url="https://www.instagram.com/rovision_supraveghere_video/"
                onToggle={(v) => setFormData({ ...formData, followsInstagram: v })}
              />

              <SocialCheck
                id="yt"
                checked={formData.followsYoutube}
                color="red-600"
                icon={<Youtube className="h-4 w-4 text-red-500" />}
                text="Subscribe pe YouTube"
                url="https://www.youtube.com/@rovision1317/"
                onToggle={(v) => setFormData({ ...formData, followsYoutube: v })}
              />

              {errors.social && <Err msg={errors.social} />}
            </div>

            {/* Newsletter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={formData.newsletterConsent}
                onCheckedChange={(v) => setFormData({ ...formData, newsletterConsent: v as boolean })}
                className="border-white/50 data-[state=checked]:bg-green-600"
              />
              <Label htmlFor="newsletter" className="text-white text-sm cursor-pointer">
                Accept să primesc newsletter‑ul *
              </Label>
            </div>
            {errors.newsletterConsent && <Err msg={errors.newsletterConsent} />}

            <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3">
              Participă la tombola!
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* --- sub‑componente ajutătoare ---------------------------------- */
function Err({ msg }: { msg: string }) {
  return (
    <Alert variant="destructive" className="mt-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{msg}</AlertDescription>
    </Alert>
  );
}

interface SocialProps {
  id: string;
  checked: boolean;
  color: string;
  icon: React.ReactNode;
  text: string;
  url: string;
  onToggle: (v: boolean) => void;
}

function SocialCheck({
  id, checked, color, icon, text, url, onToggle,
}: SocialProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onToggle(v as boolean)}
        className={`border-white/50 data-[state=checked]:bg-${color} rounded-sm`}
      />
      <Label htmlFor={id} className="text-white text-sm flex items-center gap-2 cursor-pointer">
        {icon}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          onClick={() => onToggle(true)}
        >
          {text}
        </a>
      </Label>
    </div>
  );
}
