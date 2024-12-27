// pages/api/stream-webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const event = req.body;

    console.log('QuickNode Stream Event:', event);

    // Process the event data
    if (event.type === 'account') {
      // Example: Update wallet balance or transactions
      console.log(`Account update: ${event.result}`);
    }

    res.status(200).json({ message: 'Event received' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
