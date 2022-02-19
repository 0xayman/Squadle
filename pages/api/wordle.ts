import { NextApiRequest, NextApiResponse } from 'next'

import { WORDS } from '../../data/words'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)]
    res.status(200).json({ word })
  }
}