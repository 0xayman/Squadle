import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useState } from 'react'
import GameContext from '../../context/GameContext'
import Pusher, { PresenceChannel } from 'pusher-js'
import { useRouter } from 'next/router'

const CreateGamePage = () => {
  const [username, setUsername] = useState<string>('')
  const [gameCode, setGameCode] = useState<string>('')
  const [isWaiting, setIsWaiting] = useState<boolean>(false)

  const { createRoom, setChannel, startMultiPlayerGame } =
    useContext(GameContext)
  const router = useRouter()

  const generateGameCode = (): string => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase()
    setGameCode(code)
    return code
  }

  const createGame = () => {
    if (username.length === 0) {
      toast.warning('Please enter your name.')
      return
    }
    const code: string = generateGameCode()

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: 'eu',
      forceTLS: true,
      authEndpoint: '/api/pusher/auth',
      auth: { params: { username } },
    })

    // create channel
    const channel = pusher.subscribe(`presence-${code}`) as PresenceChannel

    // save channel to context
    setChannel(channel)

    // Listen to successful subscription
    channel.bind('pusher:subscription_succeeded', () => {
      setIsWaiting(true)

      // wait for client-joined-game event
      channel.bind('client-joined-game', (data: any) => {
        // when client joins the game, create room
        createRoom({
          code,
          wordle: data.wordle,
          players: [
            {
              id: channel.members.me.id,
              username,
              score: 0,
              attempts: 6,
            },
            {
              id: data.id,
              username: data.username,
              score: 0,
              attempts: 6,
            },
          ],
        })

        startMultiPlayerGame()

        router.push('/game?mode=multi-player')
      })
    })
  }

  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-dark text-whitesmock'>
      <ToastContainer theme='colored' autoClose={700} hideProgressBar />
      <div className='text-center'>
        <h3 className='upper text-2xl'>Welcome to</h3>
        <h1 className='text-5xl font-bold uppercase'>Squadle</h1>
      </div>
      {!isWaiting && (
        <div className='mt-4 flex flex-col gap-y-2'>
          <div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=' w-80 rounded-l border-none bg-gray-soft px-4 py-2 ring-inset ring-green-dark focus:outline-none focus:ring-1'
              placeholder='Username'
            />
          </div>
          <div className='w-full'>
            <button
              onClick={createGame}
              className=' w-full rounded bg-green-dark px-4 py-2 font-bold uppercase transition-all duration-100 hover:bg-green-800'
            >
              Create Game
            </button>
          </div>
        </div>
      )}
      {isWaiting && (
        <div className='flex w-80 flex-col items-center'>
          <div className='mt-4 rounded bg-gray-soft px-8 py-4 text-center'>
            <h1 className='text-lg'>Welcome, {username}</h1>
            <h1 className=' text-xl'>
              Your Game Code is:{' '}
              <span className='font-bold text-green-dark'>{gameCode}</span>
            </h1>
          </div>
          <div className='mt-2 text-center'>
            <p>
              The game will automatically start when someone joins with this
              code.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateGamePage
