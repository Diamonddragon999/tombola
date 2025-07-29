// src/components/useJoinForm.tsx
import { useEffect, useState } from 'react';
import { trigger, listen, unlisten } from '@/utils/realtime';
import {
  addParticipant, setSpinning, getGameState,
} from '@/utils/gameState';

/* ----------------------------------------------------------------- */
/*  tipuri                                                            */
/* ----------------------------------------------------------------- */
export interface JoinData {
  firstName: string;
  lastName:  string;
  email:     string;
  age:       string;
  followsFacebook:  boolean;
  followsInstagram: boolean;
  followsYoutube:   boolean;
  newsletterConsent: boolean;
}

type JoinState = 'idle' | 'waiting' | 'won';

/* ----------------------------------------------------------------- */
/*  constante                                                         */
/* ----------------------------------------------------------------- */
const BYPASS  = 'rov';                     // prenume pentru acces nelimitat
const LS_KEY  = 'festival2025_joined';     // flag local storage

/* ----------------------------------------------------------------- */
export function useJoinForm() {
  const [data,   setData]   = useState<JoinData>({
    firstName: '', lastName: '', email: '', age: '',
    followsFacebook: false, followsInstagram: false,
    followsYoutube : false, newsletterConsent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state,  setState]  = useState<JoinState>('idle');
  const [prize,  setPrize]  = useState<string>('');

  /* reset flag spinning când intrăm în formular */
  useEffect(() => setSpinning(false), []);

  /* ascultă rezultatul roţii */
  useEffect(() => {
    const cb = (d: any) => {
      setSpinning(false);
      setPrize(d.prize?.name ?? 'Voucher 5 %');
      setState('won');
    };
    listen('spin_result', cb);
    return () => unlisten('spin_result', cb);
  }, []);

  /* ---------------- VERIFICĂ DACĂ A MAI PARTICIPAT ---------------- */
  const alreadyPlayed = (email: string): boolean => {
    if (localStorage.getItem(LS_KEY) === '1') return true;

    const gs = getGameState();
    return gs.participants.some(
      (p: any) => p.email?.toLowerCase() === email.toLowerCase(),
    );
  };

  /* ---------------- VALIDARE DATE ---------------- */
  const validate = () => {
    /* rov – nimic de validat, poate trimite oricând */
    if (data.firstName.trim().toLowerCase() === BYPASS) return true;

    const e: Record<string, string> = {};

    /* câmpuri obligatorii */
    if (!data.firstName.trim()) e.firstName = 'Prenume?';
    if (!data.lastName.trim())  e.lastName  = 'Nume?';
    if (!/\S+@\S+\.\S+/.test(data.email)) e.email = 'Email invalid';
    if (+data.age < 18) e.age = 'Trebuie 18+';
    if (
      !data.followsFacebook &&
      !data.followsInstagram &&
      !data.followsYoutube
    ) {
      e.social = 'Alege o platformă';
    }
    if (!data.newsletterConsent) e.newsletterConsent = 'Acceptă newsletter‑ul';

    /* dublă înscriere */
    if (alreadyPlayed(data.email)) {
      e._form = 'Ai participat deja la tombolă!';
    }

    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ---------------- SUBMIT ---------------- */
  const submit = async () => {
    if (!validate()) return;

    const bypass = data.firstName.trim().toLowerCase() === BYPASS;

    /* salvează participantul + flag local dacă NU e „rov” */
    if (!bypass) {
      addParticipant({
  firstName : data.firstName,
  lastName  : data.lastName,
  email     : data.email,
  age       : +data.age,              //  ← number
  likeFb    : data.followsFacebook,
  likeIg    : data.followsInstagram,
  likeYt    : data.followsYoutube,
  newsletterConsent : data.newsletterConsent,
  prizes    : []                      // prima înscriere → încă n‑a câştigat nimic
});
      localStorage.setItem(LS_KEY, '1');
      setSpinning(true);
      setState('waiting');
    }

    /* porneşte roata */
    await trigger('request_spin', { firstName: data.firstName });
  };

  return {
    data, setData, errors, state, prizeWon: prize, submit,
  };
}
