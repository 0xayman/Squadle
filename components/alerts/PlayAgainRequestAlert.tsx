import { motion } from 'framer-motion'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { PresenceChannel } from 'pusher-js'
import { useContext } from 'react'
import GameContext from '../../context/GameContext'
import { IRoom } from '../../interfaces/IRoom'

interface ComponentProps {
  room: IRoom
  channel: PresenceChannel
  setPlayAgainRequestAlert: (value: boolean) => void
}

const WaitPlayAgainAlert: NextPage<ComponentProps> = ({
  room,
  channel,
  setPlayAgainRequestAlert,
}) => {
  const { startMultiPlayerGame, resetGameContext } = useContext(GameContext)

  const router = useRouter()

  const acceptPlayAgainRequest = () => {
    channel?.trigger('client-accept-play-again-request', {})
    startMultiPlayerGame()
    setPlayAgainRequestAlert(false)
  }

  const denyPlayAgainRequest = () => {
    channel?.trigger('client-deny-play-again-request', {})
    resetGameContext()
    router.replace('/mode')
  }

  return (
    <>
      <div className='absolute top-0 left-0 z-10 h-full w-full bg-black bg-opacity-70'></div>
      <div className='absolute top-1/2 left-1/2 z-20 flex w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded bg-gray-soft py-8'>
        <p className='text-center text-xl font-bold uppercase tracking-widest text-whitesmock'>
          {
            room.players.find((player) => player.id !== channel?.members.me.id)
              ?.username
          }{' '}
          wants to play again
        </p>

        <div className='mt-6 flex gap-4'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={acceptPlayAgainRequest}
            className='rounded bg-red-700 px-4 py-2 font-medium uppercase text-whitesmock shadow'
          >
            Accept
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={denyPlayAgainRequest}
            className='rounded bg-green-dark px-4 py-2 font-medium uppercase text-whitesmock shadow'
          >
            Deny
          </motion.button>
        </div>
      </div>
    </>
  )
}

export default WaitPlayAgainAlert
