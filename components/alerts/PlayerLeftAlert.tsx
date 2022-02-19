import { NextPage } from 'next'
import Link from 'next/link'
import { PresenceChannel } from 'pusher-js'
import { IRoom } from '../../interfaces/IRoom'

interface ComponentProps {
  room: IRoom
  channel: PresenceChannel
}

const PlayerLeftAlert: NextPage<ComponentProps> = ({ room, channel }) => {
  return (
    <>
      <div className='absolute top-0 left-0 z-10 h-full w-full bg-black bg-opacity-70'></div>
      <div className='absolute top-1/2 left-1/2 z-20 flex w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded bg-gray-700 py-8'>
        <h1 className='text-2xl font-bold uppercase tracking-widest text-whitesmock'>
          {
            room?.players.find((player) => player.id !== channel?.members.me.id)
              ?.username!
          }{' '}
          Left the Game
        </h1>

        <div className='mt-6'>
          <Link href='/'>
            <a className='rounded bg-white px-4 py-2 font-medium uppercase text-gray-dark shadow'>
              Create New Game
            </a>
          </Link>
        </div>
      </div>
    </>
  )
}

export default PlayerLeftAlert
