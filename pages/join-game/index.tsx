import { useRouter } from 'next/router'
import Pusher, { PresenceChannel } from 'pusher-js'
import { useContext, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GameContext from '../../context/GameContext'
import getWordle from '../../helpers/getWordle'
import { IPlayer } from '../../interfaces/IPlayer'
import { IRoom } from '../../interfaces/IRoom'

const JoinGamePage = () => {
  const [username, setUsername] = useState<string>('')
  const [gameCode, setGameCode] = useState<string>('')

  const { createRoom, setChannel, startMultiPlayerGame } =
    useContext(GameContext)

  const router = useRouter()

  const joinGame = () => {
    if (username.length === 0) {
      toast.warning('Please enter your name.')
      return
    }

    if (gameCode.length === 0) {
      toast.warning('Please enter a game code.')
      return
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: 'eu',
      forceTLS: true,
      authEndpoint: '/api/pusher/auth',
      auth: { params: { username } },
    })

    const channel = pusher.subscribe(`presence-${gameCode}`) as PresenceChannel

    setChannel(channel)

    channel.bind('pusher:subscription_succeeded', async () => {
      if (channel.members.count < 2) {
        toast.error('No game found with this code.')
        pusher.unsubscribe(`presence-${gameCode}`)
        return
      }
      if (channel.members.count > 2) {
        toast.error('This game has already started.')
        pusher.unsubscribe(`presence-${gameCode}`)
        return
      }

      // get members from the channel
      let players: IPlayer[] = []
      channel.members.each((member: any) => {
        let id = member.id
        let username = member.info.name
        players.push({ id, username, score: 0, attempts: 6 })
      })

      //  get wordle
      const wordle: string = await getWordle()

      // create room
      const room: IRoom = createRoom({
        code: gameCode,
        players,
        wordle: wordle,
      })

      // emit client-joined-game event to the channel
      channel.trigger('client-joined-game', {
        id: channel.members.me.id,
        username,
        wordle: room.wordle,
      })

      startMultiPlayerGame()

      // go to game page
      router.push('/game?mode=multi-player')
    })
  }

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-dark text-whitesmock'>
      <ToastContainer theme='colored' autoClose={700} hideProgressBar />
      <div className='text-center'>
        <h3 className='upper text-2xl'>Welcome to</h3>
        <h1 className='text-5xl font-bold uppercase'>Squadle</h1>
      </div>
      <div className='mt-4 flex flex-col gap-y-2'>
        <div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className=' w-80 rounded-l border-none bg-gray-soft px-4 py-2 ring-inset ring-green-dark focus:outline-none focus:ring-1'
            placeholder='Username'
          />
        </div>
        <div>
          <input
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            className=' w-80 rounded-l border-none bg-gray-soft px-4 py-2 ring-inset ring-green-dark focus:outline-none focus:ring-1'
            placeholder='Game Code'
          />
        </div>
        <div className='w-full'>
          <button
            onClick={joinGame}
            className=' w-full rounded bg-green-dark px-4 py-2 font-bold uppercase transition-all duration-100 hover:bg-green-800'
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  )
}

export default JoinGamePage
