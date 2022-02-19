import axios from 'axios'

const getWordle = async (): Promise<string> => {
  const wordle: string = await axios.get('/api/wordle').then(res => {
    return res.data.word.toUpperCase()
  }).catch(err => {
    throw err
  })

  return wordle
}

export default getWordle