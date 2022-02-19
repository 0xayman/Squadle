import { NextPage } from 'next'
import { PresenceChannel } from 'pusher-js'
import { IRoom } from '../../interfaces/IRoom'

interface ComponentProps {
  askToPlayAgain: () => void
  room: IRoom
  channel: PresenceChannel
}

const RoomLoseAlert: NextPage<ComponentProps> = ({
  askToPlayAgain,
  room,
  channel,
}) => {
  return (
    <>
      <div className='absolute top-0 left-0 z-10 h-full w-full bg-black bg-opacity-70'></div>
      <div className='absolute top-1/2 left-1/2 z-20 flex w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded bg-red-700 py-8'>
        <h1 className='text-center text-4xl font-bold uppercase tracking-widest text-whitesmock'>
          you lose
        </h1>
        <h1 className='mt-2 text-center text-xl font-bold uppercase tracking-widest text-whitesmock'>
          {
            room.players.find((player) => player.id !== channel?.members.me.id)
              ?.username
          }{' '}
          guessed the word correctly
        </h1>
        <div className='mt-6'>
          <button
            onClick={askToPlayAgain}
            className='rounded bg-white px-4 py-2 font-medium uppercase text-gray-dark shadow'
          >
            Play Again ?
          </button>
        </div>
      </div>
    </>
  )
}

export default RoomLoseAlert
