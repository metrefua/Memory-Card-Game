export default function Card({ pokemon, onClick }) {
  return (
    <button type="button" className="card" onClick={() => onClick(pokemon.id)}>
      <span className="card__image-wrap">
        <img className="card__image" src={pokemon.image} alt={pokemon.name} loading="lazy" />
      </span>
      <span className="card__name">{pokemon.name}</span>
    </button>
  )
}