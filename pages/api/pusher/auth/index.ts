import { NextApiRequest, NextApiResponse } from 'next'
import pusher from '@/config/PusherConfig'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { socket_id, channel_name, username } = req.body
    const presenceData = {
      user_id: socket_id,
      user_info: {
        name: username
      }
    }

    const auth = pusher.authenticate(socket_id, channel_name, presenceData)

    return res.status(200).json(auth)
  }
  return res.status(405).json({ message: 'Method not allowed' })
}