import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import GameContext from '../context/GameContext'

const HomePage = () => {
  const { startSinglePlayerGame } = useContext(GameContext)

  const router = useRouter()

  const startGame = () => {
    startSinglePlayerGame()
    router.replace('/game?mode=single-player')
  }

  return (
    <div className='flex h-screen flex-col items-center justify-center text-whitesmock dark:bg-gray-dark'>
      <div className='text-center'>
        <h3 className='upper text-2xl'>Welcome to</h3>
        <h1 className='text-5xl font-bold uppercase'>Squadle</h1>
      </div>
      <div className='mt-6 flex items-center gap-4'>
        <button
          onClick={startGame}
          className=' rounded bg-green-dark px-4 py-2 font-bold uppercase transition-all duration-100 hover:bg-green-800'
        >
          Single Player
        </button>
        <Link href='/create-or-join'>
          <a className=' rounded bg-green-dark px-4 py-2 font-bold uppercase transition-all duration-100 hover:bg-green-800'>
            Player With Friends
          </a>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
