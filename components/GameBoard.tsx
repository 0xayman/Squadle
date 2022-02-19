import { motion } from 'framer-motion'
import { useContext, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CellStatus } from '../constants'
import GameContext from '../context/GameContext'
import IGameContext from '../interfaces/IGameContext'

const GameBoard = () => {
  const { board, currentRow, animationErrorStatus, error } =
    useContext<IGameContext>(GameContext)

  const getAnimationProps = (
    lineIndex: number,
    cellIndex: number,
    cellStatus: number
  ) => {
    if (lineIndex < currentRow) {
      let cellBackgroudColor
      switch (cellStatus) {
        case CellStatus.CORRECT:
          cellBackgroudColor = '#538d4e'
          break
        case CellStatus.MISPLACED:
          cellBackgroudColor = '#b59f3b'
          break
        case CellStatus.WRONG:
          cellBackgroudColor = '#3a3a3c'
          break
        default:
          cellBackgroudColor = '#3a3a3c'
      }
      return {
        animate: {
          rotateX: [0, 90, 0],
          backgroundColor: ['#121213', '#121213', cellBackgroudColor],
        },
        transition: {
          duration: 0.8,
          times: [0, 0.5, 1],
          delay: 0.2 * cellIndex,
        },
      }
    }
    return {}
  }

  const getErrorAnimationProps = (lineIndex: number) => {
    if (lineIndex === currentRow && animationErrorStatus) {
      return {
        animate: {
          x: [0, -5, 5, 0],
        },
        transition: {
          duration: 0.2,
          repeat: 2,
        },
      }
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <div className=' my-auto'>
      <ToastContainer theme='colored' autoClose={500} hideProgressBar />
      {board.map((line, lineIndex) => {
        return (
          <div key={lineIndex} className='flex flex-row flex-wrap'>
            {line.map((cell, cellIndex) => {
              return (
                <motion.div
                  {...getAnimationProps(lineIndex, cellIndex, cell.status)}
                  {...getErrorAnimationProps(lineIndex)}
                  key={cellIndex}
                  className={`m-1 flex h-12 w-12 items-center justify-center rounded border-2 border-gray-soft md:h-14 md:w-14`}
                >
                  {cell.value && (
                    <motion.div
                      animate={{ scale: [null, 1.2, 1] }}
                      transition={{ duration: 0.2, times: [0, 0.5, 1] }}
                      className='text-4xl font-semibold leading-none text-whitesmock'
                    >
                      {cell.value}
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default GameBoard
