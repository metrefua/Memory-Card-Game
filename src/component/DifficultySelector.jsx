export const DIFFICULTIES = {
  easy: { label: 'Easy', count: 8 },
  medium: { label: 'Medium', count: 12 },
  hard: { label: 'Hard', count: 20 },
}

export default function DifficultySelector({ difficulty, onChange, disabled }) {
  return (
    <div className="difficulty" role="group" aria-label="Select difficulty">
      {Object.entries(DIFFICULTIES).map(([key, { label, count }]) => (
        <button
          key={key}
          type="button"
          className={`difficulty__btn${difficulty === key ? ' difficulty__btn--active' : ''}`}
          onClick={() => onChange(key)}
          disabled={disabled}
          aria-pressed={difficulty === key}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  )
}
