import { useEffect, useRef, useState } from 'react'
import Header from './component/Header.jsx'
import DifficultySelector, { DIFFICULTIES } from './component/DifficultySelector.jsx'
import GameBoard from './component/GameBoard.jsx'
import GameOverModal from './component/GameOverModal.jsx'
import WinModal from './component/WinModal.jsx'
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

function handleCardClick(id) {
    if (gameStatus !== 'playing') return

    if (clickedIds.includes(id)) {
      // Already clicked this round — game over.
      if (score > bestScore) {
        setBestScore(score)
        localStorage.setItem(BEST_SCORE_KEY, String(score))
      }
      setGameStatus('lost')
      setJustLost(true)
      setTimeout(() => setJustLost(false), 500)
      return
    }

    // New card — score, remember it, and shuffle for the next click.
    const newScore = score + 1
    setScore(newScore)
    setClickedIds((prev) => [...prev, id])
    setCards((prev) => shuffle(prev))

    if (newScore === cards.length) {
      setGameStatus('won')
      if (newScore > bestScore) {
        setBestScore(newScore)
        localStorage.setItem(BEST_SCORE_KEY, String(newScore))
      }
    }
  }

  function handleDifficultyChange(nextDifficulty) {
    if (nextDifficulty === difficulty) return
    setDifficulty(nextDifficulty)
  }

  function handlePlayAgain() {
    // Re-running the fetch effect gives a brand new deck for the next round.
    // Toggling difficulty to itself won't re-trigger the effect, so refetch directly.
    setGameStatus('playing')
    refetchDeck()
  }

  async function refetchDeck() {
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
    } catch (err) {
      console.error('Failed to load Pokemon:', err)
      setError("Couldn't load the deck. Check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const statusKey = error
    ? 'error'
    : isLoading
    ? 'loading'
    : gameStatus === 'lost'
    ? 'gameover'
    : gameStatus === 'won'
    ? 'won'
    : 'playing'

  const statusLabel = {
    loading: 'Loading',
    playing: 'Playing',
    gameover: 'Game Over',
    won: 'You Win',
    error: 'Error',
  }[statusKey]

  return (
    <div className="app">
      <div className="pokedex-shell">
        <div className="pokedex-lights">
          <span className={`status-light status-light--${statusKey}`} aria-hidden="true" />
          <span className="status-text">{statusLabel}</span>
        </div>

        <div className="pokedex-screen">
          <Header
            score={score}
            bestScore={bestScore}
            totalCards={cards.length}
            clickedCount={clickedIds.length}
            justLost={justLost}
          />

          <DifficultySelector
            difficulty={difficulty}
            onChange={handleDifficultyChange}
            disabled={isLoading}
          />

          {error && (
            <div className="error-banner">
              <p>{error}</p>
              <button type="button" className="modal__btn" onClick={refetchDeck}>
                Try again
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="loading">
              <div className="pokeball-spinner" aria-hidden="true" />
              <p>Catching {DIFFICULTIES[difficulty].count} Pokémon…</p>
            </div>
          ) : (
            !error && (
              <GameBoard cards={cards} onCardClick={handleCardClick} isShuffling={isShuffling} />
            )
          )}
        </div>
      </div>

      {gameStatus === 'lost' && (
        <GameOverModal score={score} bestScore={bestScore} onPlayAgain={handlePlayAgain} />
      )}
      {gameStatus === 'won' && (
        <WinModal score={score} bestScore={bestScore} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  )
}
