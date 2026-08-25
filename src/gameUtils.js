// Fisher-Yates shuffle — returns a new shuffled array, does not mutate the input.
export function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Returns `count` unique random National Pokédex IDs in the range 1-898
// (Gen I-VIII), matching the range the game was designed around.
export function getRandomIds(count) {
  const ids = new Set()
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * 898) + 1)
  }
  return [...ids]
}
