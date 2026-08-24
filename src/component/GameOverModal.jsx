export default function GameOverModal({ score, bestScore, onPlayAgain }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <div className="modal modal--lost">
        <span className="modal__icon" aria-hidden="true">
          💥
        </span>
        <h2 className="modal__title" id="game-over-title">
          Game Over
        </h2>
        <p className="modal__body">
          You clicked a card you'd already cleared. This round's score was {score}
          {score === bestScore && score > 0 ? ' — matching your best!' : '.'}
        </p>
        <button type="button" className="modal__btn" onClick={onPlayAgain} autoFocus>
          Try Again
        </button>
      </div>
    </div>
  )
}
