import { useRouter } from 'next/router'

const CreateOrJoinGamePage = () => {
  const router = useRouter()

  return (
    <div className='flex h-screen flex-col items-center justify-center text-whitesmock dark:bg-gray-dark'>
      <div className='text-center'>
        <h3 className='upper text-2xl'>Welcome to</h3>
        <h1 className='text-5xl font-bold uppercase'>Squadle</h1>
      </div>
      <div className='mt-6 flex w-52 flex-col gap-y-2'>
        <button
          onClick={() => router.push('/join-game')}
          className=' rounded bg-green-dark px-4 py-2 font-bold uppercase transition-all duration-100 hover:bg-green-800'
        >
          Join Game
        </button>
        <button
          onClick={() => router.push('/create-game')}
          className=' rounded bg-green-dark px-4 py-2 font-bold uppercase transition-all duration-100 hover:bg-green-800'
        >
          Create Game
        </button>
      </div>
    </div>
  )
}

export default CreateOrJoinGamePage
