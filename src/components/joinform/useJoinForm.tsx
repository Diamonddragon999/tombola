import { useEffect, useState } from 'react';
import { listen, unlisten, trigger } from '@/utils/realtime';
import { addParticipant, getGameState, setSpinning } from '@/utils/gameState';

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  followsFacebook: boolean;
  followsInstagram: boolean;
  followsYoutube: boolean;
  newsletterConsent: boolean;
}

export function useJoinForm() {
  const [data, setData]   = useState<FormData>({
    firstName: '', lastName: '', email: '', age: '',
    followsFacebook: false, followsInstagram: false,
    followsYoutube: false,  newsletterConsent: false,
  });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [state, setState]   = useState<'idle'|'waiting'|'done'>('idle');

  /* primește rezultatul din Pusher */
  useEffect(() => {
    const cb = (d:any) => { setState('done'); setSpinning(false); alert(`Felicitări! Ai câștigat: ${d.prize.name}`); };
    listen('spin_result', cb);
    return () => { unlisten('spin_result', cb); };
  }, []);

  /* ----------------------------------- VALIDARE */
  const validate = () => {
    const e: Record<string,string> = {};
    if (!data.firstName.trim()) e.firstName = 'Prenume obligatoriu';
    if (!data.lastName.trim())  e.lastName  = 'Nume obligatoriu';
    if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Email invalid';
    if (!data.age || +data.age < 18) e.age = 'Trebuie 18+';
    if (!data.followsFacebook && !data.followsInstagram && !data.followsYoutube)
      e.social = 'Selectează o platformă';
    if (!data.newsletterConsent) e.newsletterConsent = 'Acceptă newsletter‑ul';
    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ----------------------------------- SUBMIT */
  const submit = async () => {
    if (!validate()) return false;
    if (getGameState().isSpinning) { alert('Așteaptă finalizarea rotirii curente.'); return false; }

    addParticipant({
      firstName: data.firstName, lastName: data.lastName, email: data.email,
      followsSocial: data.followsFacebook||data.followsInstagram||data.followsYoutube,
      newsletterConsent: data.newsletterConsent,
    });

    setSpinning(true);
    setState('waiting');
    await trigger('request_spin', { firstName: data.firstName });
    return true;
  };

  return { data, setData, errors, state, submit };
}
