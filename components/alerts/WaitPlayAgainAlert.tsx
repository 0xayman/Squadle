import { NextPage } from 'next'
import { PresenceChannel } from 'pusher-js'
import { IRoom } from '../../interfaces/IRoom'

interface ComponentProps {
  room: IRoom
  channel: PresenceChannel
}

const WaitPlayAgainAlert: NextPage<ComponentProps> = ({ room, channel }) => {
  return (
    <>
      <div className='absolute top-0 left-0 z-10 h-full w-full bg-black bg-opacity-70'></div>
      <div className='absolute top-1/2 left-1/2 z-20 flex w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded bg-gray-soft py-8'>
        <p className='text-center text-xl font-bold uppercase tracking-widest text-whitesmock'>
          Waiting for{' '}
          {
            room.players.find((player) => player.id !== channel?.members.me.id)
              ?.username
          }
        </p>
      </div>
    </>
  )
}

export default WaitPlayAgainAlert
