/* useJoinForm.ts */
import { useEffect, useState } from 'react';
import { trigger, listen, unlisten } from '@/utils/realtime';
import { addParticipant, setSpinning } from '@/utils/gameState';

export type JoinData = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  followsFacebook: boolean;
  followsInstagram: boolean;
  followsYoutube: boolean;
  newsletterConsent: boolean;
};

type JoinState = 'idle' | 'waiting' | 'won';

export function useJoinForm() {
  const [data, setData] = useState<JoinData>({
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
  const [state, setState] = useState<JoinState>('idle');
  const [prizeWon, setPrizeWon] = useState<string>('');

  // Reset spinning flag on mount
  useEffect(() => {
    setSpinning(false);
  }, []);

  // Listen for spin result from display
  useEffect(() => {
    const cb = (d: any) => {
      setSpinning(false);
      setPrizeWon(d?.prize?.name ?? 'Nimic 😢');
      setState('won');
    };
    listen('spin_result', cb);
    return () => unlisten('spin_result', cb);
  }, []);

  /* ---------------- VALIDARE ---------------- */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.firstName.trim()) e.firstName = 'Prenumele e obligatoriu';
    if (!data.lastName.trim()) e.lastName = 'Numele e obligatoriu';
    if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Email invalid';
    if (+data.age < 18) e.age = 'Trebuie 18+';
    if (!data.followsFacebook && !data.followsInstagram && !data.followsYoutube)
      e.social = 'Alege cel puțin o platformă';
    if (!data.newsletterConsent) e.newsletterConsent = 'Acceptă newsletter‑ul';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- SUBMIT ------------------ */
  const submit = async () => {
    if (!validate()) return;

    // Add participant locally
    addParticipant({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      followsSocial:
        data.followsFacebook || data.followsInstagram || data.followsYoutube,
      newsletterConsent: data.newsletterConsent,
    });

    setSpinning(true);
    setState('waiting');

    await trigger('request_spin', { firstName: data.firstName });
  };

  return { data, setData, errors, state, prizeWon, submit };
}
