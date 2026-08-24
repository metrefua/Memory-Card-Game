import Card from './Card.jsx'

// Pokémon's own id is used as the key never the array index.
// After a shuffle the index no longer maps to the same card, so an
// index key would make React reuse the wrong DOM node and break animations.
export default function GameBoard({ cards, onCardClick, isShuffling }) {
  return (
    <div className={`game-board${isShuffling ? ' game-board--shuffling' : ''}`}>
      {cards.map((pokemon) => (
        <Card key={pokemon.id} pokemon={pokemon} onClick={onCardClick} />
      ))}
    </div>
  )
}