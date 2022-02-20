import axios from 'axios'
import Pusher, { PresenceChannel } from 'pusher-js'
import { createContext, FC, useState } from 'react'
import {
  CellStatus,
  COLS_COUNT,
  keyboardButtons,
  ROWS_COUNT,
} from '../constants'
import getWordle from '../helpers/getWordle'
import { ICell } from '../interfaces/ICell'
import IGameContext from '../interfaces/IGameContext'
import { IKeyboardButton } from '../interfaces/IKeyboardButton'
import { IRoom } from '../interfaces/IRoom'

const initialGameContext: IGameContext = {
  board: [],
  keyboard: [],
  currentRow: 0,
  currentCol: 0,
  wordle: '',
  win: false,
  gameOver: false,
  playing: false,
  channel: undefined,
  animationErrorStatus: false,
  handleClickOnKeyboardButton: (key: string) => {},
  setChannel: (channel: PresenceChannel) => {},
  startSinglePlayerGame: () => {},
  startMultiPlayerGame: () => {},
  resetGameContext: () => {},
  createRoom: (room: IRoom): IRoom => room,
  setRoom: (room: IRoom) => {},
  setGameOver: (gameOver: boolean) => {},
}

const GameContext = createContext<IGameContext>(initialGameContext)

export const GameProvider: FC = ({ children }) => {
  const [board, setBoard] = useState<ICell[][]>(initialGameContext.board)
  const [keyboard, setKeyboard] = useState<IKeyboardButton[][]>(
    initialGameContext.keyboard
  )
  const [currentRow, setCurrentRow] = useState<number>(
    initialGameContext.currentRow
  )
  const [currentCol, setCurrentCol] = useState<number>(
    initialGameContext.currentCol
  )
  const [wordle, setWordle] = useState<string>(initialGameContext.wordle)
  const [win, setWin] = useState<boolean>(initialGameContext.win)
  const [gameOver, setGameOver] = useState<boolean>(initialGameContext.gameOver)
  const [playing, setPlaying] = useState<boolean>(initialGameContext.playing)
  const [error, setError] = useState<string>()
  const [room, setRoom] = useState<IRoom>()
  const [animationErrorStatus, setAnimationErrorStatus] = useState<boolean>(
    initialGameContext.animationErrorStatus
  )
  const [channel, setChannel] = useState<PresenceChannel>()
  const [checkedCells, setCheckedCells] = useState<ICell[]>([])

  const drawGameBoard = () => {
    const newBoard: ICell[][] = []
    for (let i = 0; i < ROWS_COUNT; i++) {
      newBoard.push([])
      for (let j = 0; j < COLS_COUNT; j++) {
        newBoard[i].push({
          value: '',
          status: CellStatus.UNKNOWN,
          col: j,
        })
      }
    }
    setBoard(newBoard)
  }

  const drawKeyboard = () => {
    const newKeyboard = keyboardButtons.map((row) => {
      return row.map((button) => {
        return { ...button, status: CellStatus.UNKNOWN }
      })
    })
    setKeyboard(newKeyboard)
  }

  const createRoom = (room: IRoom) => {
    setRoom(() => room)
    setWordle(() => room.wordle)
    return room
  }

  const resetGameContext = () => {
    setBoard(initialGameContext.board)
    setKeyboard(initialGameContext.keyboard)
    setCurrentRow(initialGameContext.currentRow)
    setCurrentCol(initialGameContext.currentCol)
    setWordle(initialGameContext.wordle)
    setWin(initialGameContext.win)
    setGameOver(initialGameContext.gameOver)
    setPlaying(initialGameContext.playing)
    setError('')
    setAnimationErrorStatus(initialGameContext.animationErrorStatus)
  }

  const initializeGameState = () => {
    drawGameBoard()
    drawKeyboard()
    setCurrentCol(0)
    setCurrentRow(0)
    setWin(false)
    setGameOver(false)
    setPlaying(true)
    setError('')
    setCheckedCells([])
  }

  const startSinglePlayerGame = async () => {
    const wordle: string = await getWordle()
    console.log(wordle)
    setWordle(wordle)
    initializeGameState()
  }

  const startMultiPlayerGame = async () => {
    initializeGameState()
    if (room) {
      // reset room with new wordle
      // reset players scores and attempts

      const wordle: string = await getWordle()
      const newRoom = {
        ...room,
        wordle,
        players: room.players.map((player) => ({
          ...player,
          score: 0,
          attempts: 6,
        })),
      }
      createRoom(newRoom)
    }
  }

  const validateGuess = async (guess: string): Promise<boolean> => {
    const is_valid = await axios
      .get(`/api/validate?word=${guess}`)
      .then((res) => {
        return res.data.is_valid
      })
      .catch((err) => {
        setError(err.response.data.message)
      })

    return is_valid
  }

  const showInValidGuessErrorMessage = (): void => {
    setTimeout(() => {
      setAnimationErrorStatus(true)
    }, 50)
    setTimeout(() => {
      setAnimationErrorStatus(false)
    }, 350)
  }

  const updateKeyboardButtonColour = (
    cellValue: string,
    cellStatus: number
  ) => {
    setTimeout(() => {
      setKeyboard((keyboard) => {
        const newKeyboard = keyboard.map((line) => {
          return line.map((key) => {
            if (key.value === cellValue && key.status !== CellStatus.CORRECT) {
              key.status = cellStatus
            }
            return key
          })
        })
        return newKeyboard
      })
    }, 1500)
  }

  const updateGameBoardAndKeyboardColours = (guess: string): ICell[][] => {
    const newBoard = board.map((line, lineIndex) => {
      return line.map((cell, cellIndex) => {
        if (lineIndex === currentRow) {
          if (wordle.includes(cell.value)) {
            if (guess[cellIndex] === wordle[cellIndex]) {
              updateKeyboardButtonColour(cell.value, CellStatus.CORRECT)
              return { ...cell, status: CellStatus.CORRECT }
            } else {
              updateKeyboardButtonColour(cell.value, CellStatus.MISPLACED)
              return { ...cell, status: CellStatus.MISPLACED }
            }
          }
          updateKeyboardButtonColour(cell.value, CellStatus.WRONG)
          return { ...cell, status: CellStatus.WRONG }
        }
        return cell
      })
    })
    setBoard(newBoard)
    return newBoard
  }

  const updatePlayerScore = (newBoard: ICell[][]): IRoom => {
    let newRoom = { ...room! }
    let playerScoreIncrement: number = 0
    console.log(checkedCells)
    newBoard[currentRow].forEach((cell) => {
      console.log(
        cell,
        checkedCells.some(
          (item) =>
            item.value === cell.value &&
            item.status === item.status &&
            item.col === cell.col
        )
      )
      if (
        !checkedCells.some(
          (item) =>
            item.value === cell.value &&
            item.status === item.status &&
            item.col === cell.col
        )
      ) {
        setCheckedCells((prev) => [...prev, cell])
        if (cell.status === CellStatus.CORRECT) {
          playerScoreIncrement += 10
        }
      }
    })

    if (playerScoreIncrement > 0) {
      newRoom = {
        ...newRoom,
        players: newRoom.players.map((player) => {
          if (player.id === channel?.members.me.id) {
            return {
              ...player,
              score: player.score + playerScoreIncrement,
            }
          }
          return player
        }),
      }
    }
    console.log(newRoom)
    setRoom(newRoom)
    return newRoom
  }

  const updatePlayerAttempts = (newRoom: IRoom): IRoom => {
    newRoom = {
      ...newRoom,
      players: newRoom.players.map((player) => {
        if (player.id === channel?.members.me.id) {
          return { ...player, attempts: player.attempts - 1 }
        }
        return player
      }),
    }

    setRoom(newRoom)

    channel?.trigger('client-score-updated', newRoom)
    // if both players have used up all their attempts, trigger client-game-over event
    if (newRoom.players.every((player) => player.attempts === 0)) {
      setGameOver(true)
      channel?.trigger('client-game-over', {})
    } else {
      // trigger client-attempts-updated event
      channel?.trigger('client-attempts-updated', newRoom)
    }
    return newRoom
  }

  const handleEnterButton = async (board: ICell[][]): Promise<void> => {
    if (currentCol !== COLS_COUNT) {
      return
    }

    // get the guess word (letters from current row)
    const guess = board[currentRow].map((cell) => cell.value).join('')

    // validate guess
    const isValid: boolean = await validateGuess(guess)

    if (!isValid) {
      showInValidGuessErrorMessage()
      return
    }

    // update board
    const newBoard = updateGameBoardAndKeyboardColours(guess)

    // if there is a room, update it
    if (room) {
      // update player score
      let newRoom = updatePlayerScore(newBoard)

      // update player attempts
      newRoom = updatePlayerAttempts(newRoom)

      // if the guess is correct, client-won-game
      if (guess === wordle) {
        channel?.trigger('client-won-game', room)
        setTimeout(() => {
          setWin(true)
        }, 1800)
      }
    }

    // if there is no room
    if (!room) {
      // if the guess is correct, client-won-game
      if (guess === wordle) {
        setTimeout(() => {
          setWin(true)
        }, 1800)
      }

      // board is full
      if (guess !== wordle && currentRow === ROWS_COUNT - 1) {
        setTimeout(() => {
          setGameOver(true)
        }, 1800)
      }
    }

    // go to next line
    if (currentRow <= ROWS_COUNT) {
      setCurrentRow(currentRow + 1)
      setCurrentCol(0)
    }
  }

  const handleDeleteButton = (board: ICell[][]) => {
    if (currentCol === 0) {
      return
    }

    board[currentRow][currentCol - 1].value = ''
    setCurrentCol(currentCol - 1)
    setBoard(board)
  }

  const handleClickOnKeyboardButton = async (key: string) => {
    // create a mock new board
    const newBoard: ICell[][] = [...board]

    if (key === 'ENTER') {
      // handle enter button
      handleEnterButton(newBoard)
      return
    } else if (key === 'DEL') {
      handleDeleteButton(newBoard)
      return
    }

    // if already on last column, return
    if (currentCol === COLS_COUNT) {
      return
    }

    // write the key to the board
    newBoard[currentRow][currentCol].value = key
    // go to next column
    setCurrentCol(currentCol + 1)
    // update the board
    setBoard(newBoard)
  }

  return (
    <GameContext.Provider
      value={{
        board,
        keyboard,
        wordle,
        win,
        gameOver,
        setGameOver,
        playing,
        error,
        room,
        setRoom,
        currentRow,
        currentCol,
        animationErrorStatus,
        handleClickOnKeyboardButton,
        channel,
        setChannel,
        startSinglePlayerGame,
        startMultiPlayerGame,
        resetGameContext,
        createRoom,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export default GameContext
