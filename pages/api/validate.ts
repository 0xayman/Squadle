import { NextApiRequest, NextApiResponse } from 'next'

import { WORDS } from '../../data/words'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const word = req.query.word.toString().toLowerCase()
    if (WORDS.includes(word)) {
      res.status(200).json({ is_valid: true, message: 'Word Found' })
    } else {
      res.status(404).json({ is_valid: false, message: `The word "${word.toUpperCase()}" is not a valid guess` })
    }
  }
}