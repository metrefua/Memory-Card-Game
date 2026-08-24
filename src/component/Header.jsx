export default function Header({ score, bestScore, totalCards, clickedCount, justLost }) {
  return (
    <header className="header">
      <h1 className="header__title">
        Poké<span>Memory</span>
      </h1>
      <p className="header__subtitle">
        Click each card once to score a point. Click one twice, and the whole run resets.
      </p>

      <div className="scoreboard">
        <div className="score-badge">
          <span className="score-badge__label">Score</span>
          <span className="score-badge__value">{score}</span>
        </div>
        <div className="score-badge score-badge--best">
          <span className="score-badge__label">Best</span>
          <span className="score-badge__value">{bestScore}</span>
        </div>
      </div>

      <div
        className={`streak-meter${justLost ? ' streak-meter--shatter' : ''}`}
        aria-label={`${clickedCount} of ${totalCards} cards cleared this round`}
      >
        {Array.from({ length: totalCards }).map((_, i) => (
          <span
            key={i}
            className={`streak-pip${i < clickedCount ? ' streak-pip--filled' : ''}`}
          />
        ))}
      </div>
    </header>
  )
}
