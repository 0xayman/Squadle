import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import RoomWinAlert from '../../components/alerts/RoomWinAlert'
import LoseAlert from '../../components/alerts/LoseAlert'
import PlayAgainRequestAlert from '../../components/alerts/PlayAgainRequestAlert'
import WaitPlayAgainAlert from '../../components/alerts/WaitPlayAgainAlert'
import WinAlert from '../../components/alerts/WinAlert'
import GameBoard from '../../components/GameBoard'
import Keyboard from '../../components/Keyboard'
import GameContext from '../../context/GameContext'
import { IRoom } from '../../interfaces/IRoom'
import RoomLoseAlert from '../../components/alerts/RoomLoseAlert'
import AttemptsAlert from '../../components/alerts/AttemptsAlert'
import GameScoreAlert from '../../components/alerts/GameScoreAlert'
import PlayerLeftAlert from '../../components/alerts/PlayerLeftAlert'

const GamePage = () => {
  const {
    room,
    setRoom,
    win,
    gameOver,
    setGameOver,
    resetGameContext,
    channel,
    startMultiPlayerGame,
  } = useContext(GameContext)

  const [playerLeftAlert, setPlayerLeftAlert] = useState(false)
  const [prevRoom, setPrevRoom] = useState<IRoom>()

  const [playAgainRequestAlert, setPlayAgainRequestAlert] = useState(false)
  const [waitPlayAgainAlert, setWaitPlayAgainAlert] = useState(false)

  const router = useRouter()

  const askToPlayAgain = () => {
    setWaitPlayAgainAlert(true)
    channel?.trigger('client-play-again-request', {})
  }

  useEffect(() => {
    if (room) {
      channel?.bind('client-score-updated', (room: IRoom) => {
        setRoom(room)
      })

      channel?.bind('client-attempts-updated', (room: IRoom) => {
        setRoom(room)
      })

      channel?.bind('client-won-game', () => {
        setTimeout(() => {
          setGameOver(true)
        }, 1800)
      })

      channel?.bind('client-game-over', () => {
        setTimeout(() => {
          setGameOver(true)
        }, 1800)
      })

      channel?.bind('client-play-again-request', () => {
        setPlayAgainRequestAlert(true)
      })

      channel?.bind('client-accept-play-again-request', () => {
        startMultiPlayerGame()
        setPlayAgainRequestAlert(false)
        setWaitPlayAgainAlert(false)
      })

      channel?.bind('client-deny-play-again-request', () => {
        setPlayAgainRequestAlert(false)
        setWaitPlayAgainAlert(false)
        router.replace('/mode')
      })

      channel?.bind('client-leave-game', (newRoom: IRoom) => {
        setTimeout(() => {
          setPrevRoom(room)
          setRoom(newRoom)
          setPlayerLeftAlert(true)
        }, 1800)
      })

      window.onbeforeunload = () => {
        const newRoom = {
          ...room,
          players: room.players.filter(
            (player) => player.id !== channel?.members.me.id
          ),
        }
        channel?.trigger('client-leave-game', newRoom)
        channel?.disconnect()
      }
    }
  }, [])

  return (
    <div className='relative flex h-screen flex-col pt-2 text-whitesmock dark:bg-gray-dark'>
      <div className='flex w-full items-center justify-between border-b border-gray-soft px-16 pb-2'>
        <h1 className=' text-4xl font-bold uppercase'>Squadle</h1>
      </div>

      {!room && win && <WinAlert resetGameContext={resetGameContext} />}
      {!room && gameOver && <LoseAlert resetGameContext={resetGameContext} />}

      {room && waitPlayAgainAlert && (
        <WaitPlayAgainAlert room={room} channel={channel!} />
      )}
      {room && playAgainRequestAlert && (
        <PlayAgainRequestAlert
          room={room}
          channel={channel!}
          setPlayAgainRequestAlert={setPlayAgainRequestAlert}
        />
      )}

      {room && win && !waitPlayAgainAlert && !playAgainRequestAlert && (
        <RoomWinAlert askToPlayAgain={askToPlayAgain} />
      )}

      {room &&
        gameOver &&
        room.players.some((player) => player.attempts !== 0) &&
        !waitPlayAgainAlert &&
        !playAgainRequestAlert && (
          <RoomLoseAlert
            askToPlayAgain={askToPlayAgain}
            channel={channel!}
            room={room}
          />
        )}

      {room &&
        room.players.find((player) => player.id === channel?.members.me.id)
          ?.attempts === 0 &&
        !gameOver &&
        !waitPlayAgainAlert &&
        !playAgainRequestAlert && (
          <AttemptsAlert askToPlayAgain={askToPlayAgain} room={room} />
        )}

      {room &&
        gameOver &&
        room.players.every((player) => player.attempts === 0) &&
        !waitPlayAgainAlert &&
        !playAgainRequestAlert && (
          <GameScoreAlert
            askToPlayAgain={askToPlayAgain}
            channel={channel!}
            room={room}
          />
        )}

      {room &&
        playerLeftAlert &&
        !waitPlayAgainAlert &&
        !playAgainRequestAlert && (
          <PlayerLeftAlert room={prevRoom!} channel={channel!} />
        )}

      <div className='grid flex-grow grid-cols-1 md:grid-cols-7'>
        <div className=' mt-6 hidden px-4 md:col-span-2 md:block'>
          {room && (
            <div className='w-full rounded bg-gray-soft px-4 py-4'>
              <div>
                <h1 className='text-lg font-bold'>Currently Playing</h1>
              </div>
              <div className='mt-2'>
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    className='mb-2 flex items-center justify-between border-b border-b-gray-normal'
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
            </div>
          )}
        </div>
        <div className='flex flex-col items-center md:col-span-3'>
          {room && (
            <div className='mt-4 w-full px-12 md:hidden'>
              <div>
                <h1 className='text-lg font-bold'>Currently Playing</h1>
              </div>
              <div className='mt-1'>
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    className='mb-1 flex items-center justify-between'
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
            </div>
          )}
          <GameBoard />
          <Keyboard />
        </div>
        <div className='hidden px-4 md:col-span-2 md:block'></div>
      </div>
    </div>
  )
}

export default GamePage
