import { NextPage } from 'next'
import { PresenceChannel } from 'pusher-js'
import { IRoom } from '../../interfaces/IRoom'

interface ComponentProps {
  askToPlayAgain: () => void
  room: IRoom
  channel: PresenceChannel
}

const GameScoreAlert: NextPage<ComponentProps> = ({
  askToPlayAgain,
  room,
  channel,
}) => {
  return (
    <>
      <div className='absolute top-0 left-0 z-10 h-full w-full bg-black bg-opacity-70'></div>
      <div
        className={`absolute top-1/2 left-1/2 z-20 flex w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center ${
          room.players.find((player) => player.id === channel?.members.me.id)
            ?.score! ===
          room.players.find((player) => player.id !== channel?.members.me.id)
            ?.score!
            ? 'bg-gray-700'
            : room.players.find(
                (player) => player.id === channel?.members.me.id
              )?.score! >
              room.players.find(
                (player) => player.id !== channel?.members.me.id
              )?.score!
            ? 'bg-green-dark'
            : 'bg-red-700'
        } justify-center rounded  py-8`}
      >
        <h1 className='text-center text-4xl font-bold uppercase tracking-widest text-whitesmock'>
          {room.players.find((player) => player.id === channel?.members.me.id)
            ?.score! ===
          room.players.find((player) => player.id !== channel?.members.me.id)
            ?.score!
            ? 'DRAW'
            : room.players.find(
                (player) => player.id === channel?.members.me.id
              )?.score! >
              room.players.find(
                (player) => player.id !== channel?.members.me.id
              )?.score!
            ? 'you win'
            : 'you lose'}
        </h1>
        <div className='mt-2 w-full px-4'>
          <h1 className='text-xl font-bold'>Final Score</h1>
          {room.players.map((player) => (
            <div
              key={player.id}
              className='mb-2 flex items-center justify-between'
            >
              <h1 className=' font-semibold'>{player.username} </h1>
              <h1 className=' font-semibold'>
                {player.score.toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}{' '}
                / 50
              </h1>
            </div>
          ))}
        </div>
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

export default GameScoreAlert
