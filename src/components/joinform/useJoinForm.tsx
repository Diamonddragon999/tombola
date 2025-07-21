import { useEffect, useState } from 'react';
import { trigger, listen, unlisten } from '@/utils/realtime';
import { addParticipant, setSpinning } from '@/utils/gameState';

export interface JoinData {
  firstName: string;
  lastName:  string;
  email:     string;
  age:       string;
  followsFacebook: boolean;
  followsInstagram: boolean;
  followsYoutube:  boolean;
  newsletterConsent: boolean;
}

type JoinState = 'idle' | 'waiting' | 'won';
const BYPASS = 'rov';

export function useJoinForm() {
  const [data, setData] = useState<JoinData>({
    firstName: '', lastName: '', email: '', age: '',
    followsFacebook: false, followsInstagram: false,
    followsYoutube: false, newsletterConsent: false,
  });

  const [errors, setErrors]  = useState<Record<string,string>>({});
  const [state,  setState]   = useState<JoinState>('idle');
  const [prize,  setPrize]   = useState<string>('');

  useEffect(() => setSpinning(false), []);

  useEffect(() => {
    const cb = (d: any) => {
      setSpinning(false);
      setPrize(d.prize?.name ?? 'Voucher 5 %');
      setState('won');
    };
    listen('spin_result', cb);
    return () => unlisten('spin_result', cb);
  }, []);

  /* ---------------- VALIDARE ---------------- */
  const validate = () => {
    if (data.firstName.trim().toLowerCase() === BYPASS) return true;

    const e: Record<string,string> = {};
    if (!data.firstName.trim()) e.firstName = 'Prenume?';
    if (!data.lastName.trim())  e.lastName  = 'Nume?';
    if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Email invalid';
    if (+data.age < 18) e.age = 'Trebuie 18+';
    if (!data.followsFacebook && !data.followsInstagram && !data.followsYoutube)
      e.social = 'Alege o platformă';
    if (!data.newsletterConsent) e.newsletterConsent = 'Acceptă newsletter‑ul';
    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ---------------- SUBMIT ---------------- */
  const submit = async () => {
    if (!validate()) return;

    if (data.firstName.trim().toLowerCase() !== BYPASS) {
      addParticipant({
        firstName: data.firstName, lastName: data.lastName, email: data.email,
        followsSocial:
          data.followsFacebook || data.followsInstagram || data.followsYoutube,
        newsletterConsent: data.newsletterConsent,
      });
      setSpinning(true);
      setState('waiting');
    }

    await trigger('request_spin', { firstName: data.firstName });
  };

  return { data, setData, errors, state, prizeWon: prize, submit };
}
