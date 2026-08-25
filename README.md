# Memory-Card-Game
Memory Card game where players click on cards to score points, but must never click the same card twice in a row.

## How it works

- A deck of Pokémon (fetched live from [PokéAPI](https://pokeapi.co/)) is laid out in a grid.
- Click a card you haven't clicked yet → score +1, and the whole board reshuffles.
- Click a card you've already clicked this round → game over, score resets.
- Click every card exactly once → you win.
- Best score persists across sessions (`localStorage`).
- Difficulty selector controls deck size: Easy (8), Medium (12), Hard (20).

## Project structure

```
src/
  App.jsx                    
  gameUtils.js               
  index.css                  
  components/
    Header.jsx                
    DifficultySelector.jsx    
    GameBoard.jsx              
    Card.jsx                 
    GameOverModal.jsx
    WinModal.jsx
```

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Deployment
https://memory-card-game-eosin-theta.vercel.app/

