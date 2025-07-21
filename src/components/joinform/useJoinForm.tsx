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

const BYPASS_NAME = 'rov';          // ► “rov” = fără validări / infinit spins

export function useJoinForm() {
  const [data, setData] = useState<JoinData>({
    firstName: '',
    lastName:  '',
    email:     '',
    age:       '',
    followsFacebook: false,
    followsInstagram: false,
    followsYoutube: false,
    newsletterConsent: false,
  });

  const [errors, setErrors]   = useState<Record<string,string>>({});
  const [state,  setState]    = useState<JoinState>('idle');
  const [prizeWon, setPrize]  = useState<string>('');

  /* când intri pe pagină – oprește flag‑ul local */
  useEffect(() => setSpinning(false), []);

  /* primește rezultat de la ecranul mare */
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
    if (data.firstName.trim().toLowerCase() === BYPASS_NAME) return true;

    const e: Record<string,string> = {};
    if (!data.firstName.trim()) e.firstName = 'Prenumele e obligatoriu';
    if (!data.lastName.trim())  e.lastName  = 'Numele e obligatoriu';
    if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Email invalid';
    if (+data.age < 18) e.age = 'Trebuie 18+';
    if (!data.followsFacebook && !data.followsInstagram && !data.followsYoutube)
      e.social = 'Alege cel puțin o platformă';
    if (!data.newsletterConsent) e.newsletterConsent = 'Acceptă newsletter‑ul';
    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ---------------- SUBMIT ------------------ */
  const submit = async () => {
    if (!validate()) return;

    /* „rov” nu intră în statistici și nu blochează roata */
    const isBypass = data.firstName.trim().toLowerCase() === BYPASS_NAME;
    if (!isBypass) {
      addParticipant({
        firstName: data.firstName,
        lastName : data.lastName,
        email    : data.email,
        followsSocial:
          data.followsFacebook || data.followsInstagram || data.followsYoutube,
        newsletterConsent: data.newsletterConsent,
      });
      setSpinning(true);
      setState('waiting');
    }

    await trigger('request_spin', { firstName: data.firstName });
  };

  return { data, setData, errors, state, prizeWon, submit };
}
