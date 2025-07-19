// pages/api/pusher/trigger.ts (sau /api/pusher/trigger în src/)
import type { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: '2024670',
  key: '49a4432a7ced7b1ca6e3',
  secret: '3826c6f627b77d8b98db',
  cluster: 'eu',
  useTLS: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { event, data } = req.body;

  try {
    await pusher.trigger('festival-channel', event, data);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Pusher trigger failed:', err);
    res.status(500).json({ success: false, error: err });
  }
}
