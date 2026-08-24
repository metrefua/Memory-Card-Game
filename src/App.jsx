import { useEffect, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import DifficultySelector, { DIFFICULTIES } from './components/DifficultySelector.jsx'
import GameBoard from './components/GameBoard.jsx'
import GameOverModal from './components/GameOverModal.jsx'
import WinModal from './components/WinModal.jsx'
import { shuffle, getRandomIds } from './gameUtils.js'

const BEST_SCORE_KEY = 'pokememory-best-score'

export default function App() {
  const [difficulty, setDifficulty] = useState('medium')
  const [cards, setCards] = useState([])
  const [clickedIds, setClickedIds] = useState([])
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem(BEST_SCORE_KEY)
    return saved ? Number(saved) : 0
  })
  const [gameStatus, setGameStatus] = useState('playing') // "playing" | "won" | "lost"
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [justLost, setJustLost] = useState(false)

  const hasMounted = useRef(false)

  // Fetch a fresh deck whenever the difficulty changes (runs on mount too).
  useEffect(() => {
    async function fetchPokemon() {
      setIsLoading(true)
      setError(null)
      try {
        const ids = getRandomIds(DIFFICULTIES[difficulty].count)
        const promises = ids.map(async (id) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch Pokemon #${id}`)
          }
          const data = await response.json()
          return {
            id: data.id,
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default,
          }
        })

        const pokemon = await Promise.all(promises)
        setCards(shuffle(pokemon))
        setClickedIds([])
        setScore(0)
        setGameStatus('playing')
      } catch (err) {
        console.error('Failed to load Pokemon:', err)
        setError("Couldn't load the deck. Check your connection and try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPokemon()
  }, [difficulty])

  // Brief pulse on the board whenever the cards get reshuffled after a click
  // (skip the very first render, which is the initial deck arriving).
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    setIsShuffling(true)
    const timer = setTimeout(() => setIsShuffling(false), 220)
    return () => clearTimeout(timer)
  }, [cards])

}