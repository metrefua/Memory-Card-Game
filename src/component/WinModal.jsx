export default function WinModal({ score, bestScore, onPlayAgain }) {
  const isNewBest = score >= bestScore
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="win-title">
      <div className="modal modal--won">
        <span className="modal__icon" aria-hidden="true">
          🏆
        </span>
        <h2 className="modal__title" id="win-title">
          You Cleared the Board!
        </h2>
        <p className="modal__body">
          Every card clicked, none repeated. Final score: {score}
          {isNewBest ? ' — new best!' : `. Best is still ${bestScore}.`}
        </p>
        <button type="button" className="modal__btn" onClick={onPlayAgain} autoFocus>
          Play Again
        </button>
      </div>
    </div>
  )
}
