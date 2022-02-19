import { useContext } from 'react'
import GameContext from '../context/GameContext'
import { motion } from 'framer-motion'
import { CellStatus } from '../constants'

const Keyboard = () => {
  const { keyboard } = useContext(GameContext)

  const { handleClickOnKeyboardButton } = useContext(GameContext)

  return (
    <div className='mb-2'>
      {keyboard.map((line, lineIndex) => (
        <div key={lineIndex} className='flex justify-center'>
          {line.map((key, keyIndex) => (
            <motion.button
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.9,
                transition: { duration: 0.2 },
              }}
              onClick={() => handleClickOnKeyboardButton(key.value)}
              key={keyIndex}
              className={`m-1 flex h-8 items-center justify-center rounded text-sm font-medium md:h-12 md:text-base md:font-bold ${
                key.value === 'ENTER' || key.value === 'DEL'
                  ? ' w-12 md:w-20'
                  : 'w-8 md:w-12'
              } ${
                key.status === CellStatus.CORRECT
                  ? 'bg-green-dark'
                  : key.status === CellStatus.MISPLACED
                  ? ' bg-yellow-dark'
                  : key.status === CellStatus.WRONG
                  ? ' bg-gray-soft'
                  : 'bg-gray-normal'
              }`}
            >
              {key.value}
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Keyboard
