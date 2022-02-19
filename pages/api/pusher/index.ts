import { NextApiRequest, NextApiResponse } from 'next'

import pusher from '@/config/PusherConfig'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.body
  const response = await pusher.trigger(`${code}`, 'init-game', {
    code,
  })

  res.json(response)
}