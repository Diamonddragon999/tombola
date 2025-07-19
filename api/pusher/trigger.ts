import type { VercelRequest, VercelResponse } from '@vercel/node';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.VITE_PUSHER_KEY!,       // același cu cel din front
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.VITE_PUSHER_CLUSTER!,
  useTLS: true,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { event, data } = req.body;
  await pusher.trigger('festival-channel', event, data);
  return res.status(200).json({ ok: true });
}
