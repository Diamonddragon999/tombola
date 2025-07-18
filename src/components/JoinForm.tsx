import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { addParticipant, getGameState, setSpinning } from '../utils/gameState';
import { socketManager } from '../utils/socket';
import { useEffect } from 'react';
import { AlertCircle, Facebook, Instagram, Youtube } from 'lucide-react';

export function JoinForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    followsFacebook: false,
    followsInstagram: false,
    followsYoutube: false,
    newsletterConsent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const socket = socketManager.connect();
    
    socket.on('spin_result', (data) => {
      setIsWaiting(false);
      setSpinning(false);
      // Show result notification
      alert(`Felicitări! Ai câștigat: ${data.prize.name}`);
    });

    return () => {
      socket.off('spin_result');
    };
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prenumele este obligatoriu';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Numele este obligatoriu';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email-ul nu este valid';
    }
    
    if (!formData.age.trim()) {
      newErrors.age = 'Vârsta este obligatorie';
    } else if (parseInt(formData.age) < 18) {
      newErrors.age = 'Trebuie să ai cel puțin 18 ani pentru a participa';
    }
    
    if (!formData.followsFacebook && !formData.followsInstagram && !formData.followsYoutube) {
      newErrors.social = 'Trebuie să urmărești cel puțin o platformă socială';
    }
    
    if (!formData.newsletterConsent) {
      newErrors.newsletterConsent = 'Trebuie să accepți să primești newsletter-ul';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const gameState = getGameState();
    if (gameState.isSpinning) {
      alert('Te rugăm să aștepți să se termine rotirea curentă.');
      return;
    }
    
    // Add participant
    addParticipant({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      followsSocial: formData.followsFacebook || formData.followsInstagram || formData.followsYoutube,
      newsletterConsent: formData.newsletterConsent
    });
    
    // Set spinning state
    setSpinning(true);
    setIsSubmitted(true);
    setIsWaiting(true);
    
    // Emit spin request
    socketManager.emit('request_spin', {
      firstName: formData.firstName
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-white">
              {isWaiting ? 'Așteptând rândul tău...' : 'Mulțumim pentru participare!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-100 mb-4">
              {isWaiting 
                ? 'Roata se învârte pentru tine! Urmărește ecranul mare.'
                : 'Verifică-ți emailul pentru detalii despre premiu.'
              }
            </p>
            {isWaiting && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CardTitle className="text-2xl text-white mb-2">
              Young Festival 2025
            </CardTitle>
            <p className="text-yellow-400 font-semibold">Roata Norocului</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-white">Prenume *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                placeholder="Introdu prenumele"
              />
              {errors.firstName && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.firstName}</AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <Label htmlFor="lastName" className="text-white">Nume *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                placeholder="Introdu numele"
              />
              {errors.lastName && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.lastName}</AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-white">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                placeholder="exemplu@email.com"
              />
              {errors.email && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.email}</AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <Label htmlFor="age" className="text-white">Vârsta *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                placeholder="18+"
              />
              {errors.age && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.age}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-white font-medium">Urmărește-ne pe rețelele sociale *</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followsFacebook"
                  checked={formData.followsFacebook}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, followsFacebook: checked as boolean})
                  }
                  className="border-white/50 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-sm"
                />
                <Label htmlFor="followsFacebook" className="text-white text-sm flex items-center gap-2 cursor-pointer">
                  <Facebook className="h-4 w-4 text-blue-500" />
                  <a 
                    href="https://www.facebook.com/SistemeDeSupraveghereVideo" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 underline"
                    onClick={() => setFormData({...formData, followsFacebook: true})}
                  >
                    Like pe Facebook
                  </a>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followsInstagram"
                  checked={formData.followsInstagram}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, followsInstagram: checked as boolean})
                  }
                  className="border-white/50 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600 rounded-sm"
                />
                <Label htmlFor="followsInstagram" className="text-white text-sm flex items-center gap-2 cursor-pointer">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <a 
                    href="https://www.instagram.com/rovision_supraveghere_video/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-pink-400 underline"
                    onClick={() => setFormData({...formData, followsInstagram: true})}
                  >
                    Follow pe Instagram!
                  </a>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followsYoutube"
                  checked={formData.followsYoutube}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, followsYoutube: checked as boolean})
                  }
                  className="border-white/50 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 rounded-sm"
                />
                <Label htmlFor="followsYoutube" className="text-white text-sm flex items-center gap-2 cursor-pointer">
                  <Youtube className="h-4 w-4 text-red-500" />
                  <a 
                    href="https://www.youtube.com/@rovision1317/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-red-400 underline"
                    onClick={() => setFormData({...formData, followsYoutube: true})}
                  >
                    Subscribe pe YouTube
                  </a>
                </Label>
              </div>
              
              {errors.social && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.social}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletterConsent"
                checked={formData.newsletterConsent}
                onCheckedChange={(checked) => 
                  setFormData({...formData, newsletterConsent: checked as boolean})
                }
                className="border-white/50 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 rounded-sm"
              />
              <Label htmlFor="newsletterConsent" className="text-white text-sm cursor-pointer">
                Accept să primesc newsletter-ul *
              </Label>
            </div>
            {errors.newsletterConsent && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.newsletterConsent}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Participă la tombola!
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}