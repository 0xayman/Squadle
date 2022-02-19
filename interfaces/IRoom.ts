import { IPlayer } from './IPlayer'

export interface IRoom {
  code: string
  wordle: string
  players: IPlayer[]
}
