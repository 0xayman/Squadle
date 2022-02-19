import { IKeyboardButton } from '../interfaces/IKeyboardButton'

export const CellStatus = {
  UNKNOWN: 0,
  CORRECT: 1,
  WRONG: 2,
  MISPLACED: 3,
}

export const ROWS_COUNT = 6
export const COLS_COUNT = 5

export const keyboardButtons: IKeyboardButton[][] = [
  [
    { value: 'Q', status: CellStatus.UNKNOWN },
    { value: 'W', status: CellStatus.UNKNOWN },
    { value: 'E', status: CellStatus.UNKNOWN },
    { value: 'R', status: CellStatus.UNKNOWN },
    { value: 'T', status: CellStatus.UNKNOWN },
    { value: 'Y', status: CellStatus.UNKNOWN },
    { value: 'U', status: CellStatus.UNKNOWN },
    { value: 'I', status: CellStatus.UNKNOWN },
    { value: 'O', status: CellStatus.UNKNOWN },
    { value: 'P', status: CellStatus.UNKNOWN },
  ],
  [
    { value: 'A', status: CellStatus.UNKNOWN },
    { value: 'S', status: CellStatus.UNKNOWN },
    { value: 'D', status: CellStatus.UNKNOWN },
    { value: 'F', status: CellStatus.UNKNOWN },
    { value: 'G', status: CellStatus.UNKNOWN },
    { value: 'H', status: CellStatus.UNKNOWN },
    { value: 'J', status: CellStatus.UNKNOWN },
    { value: 'K', status: CellStatus.UNKNOWN },
    { value: 'L', status: CellStatus.UNKNOWN },
  ],
  [
    { value: 'ENTER', status: CellStatus.UNKNOWN },
    { value: 'Z', status: CellStatus.UNKNOWN },
    { value: 'X', status: CellStatus.UNKNOWN },
    { value: 'C', status: CellStatus.UNKNOWN },
    { value: 'V', status: CellStatus.UNKNOWN },
    { value: 'B', status: CellStatus.UNKNOWN },
    { value: 'N', status: CellStatus.UNKNOWN },
    { value: 'M', status: CellStatus.UNKNOWN },
    { value: 'DEL', status: CellStatus.UNKNOWN },
  ],
]