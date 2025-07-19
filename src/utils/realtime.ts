import Pusher from 'pusher-js';

const pusher = new Pusher('49a4432a7ced7b1ca6e3', {
  cluster: 'eu',
  forceTLS: true,
});

const ch = pusher.subscribe('festival-channel');

// 🛠️ Log de stare, cu typing ca să scapi de TS7031
pusher.connection.bind('state_change', (state: { previous: string; current: string }) => {
  console.log('Pusher state', state.previous, '→', state.current);
});

// Optional: log global pentru toate evenimentele
ch.bind_global((event: string, data: unknown) => {
  if (!event.startsWith('pusher_internal'))
    console.log('GLOBAL EVENT:', event, data);
});

export const listen = (ev: string, cb: (d: any) => void) => ch.bind(ev, cb);
export const unlisten = (event: string, cb: (data: any) => void): void => {
  ch.unbind(event, cb);
};

export const trigger = (event: string, data: any) =>
  fetch('/api/pusher/trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data }),
  });
