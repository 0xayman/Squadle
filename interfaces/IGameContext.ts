import { PresenceChannel } from 'pusher-js'
import { ICell } from './ICell'
import { IKeyboardButton } from './IKeyboardButton'
import { IRoom } from './IRoom'

export default interface IGameContext {
  board: ICell[][]
  keyboard: IKeyboardButton[][]
  wordle: string
  currentRow: number
  currentCol: number
  win: boolean
  gameOver: boolean
  playing: boolean
  room?: IRoom
  channel?: PresenceChannel
  error?: string
  animationErrorStatus: boolean
  handleClickOnKeyboardButton: (key: string) => void
  setChannel: (channel: PresenceChannel) => void
  startSinglePlayerGame: () => void
  startMultiPlayerGame: () => void
  resetGameContext: () => void
  createRoom: (room: IRoom) => IRoom
  setRoom: (room: IRoom) => void
  setGameOver: (gameOver: boolean) => void
  initializeGameState: () => void
}
