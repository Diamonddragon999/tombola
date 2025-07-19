import Pusher from 'pusher-js';

const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  forceTLS: true,
});

const ch = pusher.subscribe('festival-channel');

export const listen   = (ev: string, cb: (d: any) => void) => ch.bind(ev, cb);
export const unlisten = (event: string, cb: (data:any)=>void): void => {
  ch.unbind(event, cb);   // nu mai “return” nimic ➜ tipul e void
};
// POST la /api/pusher/trigger
export const trigger = (event: string, data: any) =>
  fetch('/api/pusher/trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data }),
  });
