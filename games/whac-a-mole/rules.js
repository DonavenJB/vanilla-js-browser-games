export function getRandomTargetIndex(
  targetCount,
  randomValue
) {
  return Math.floor(
    randomValue *
    targetCount
  )
}

export function getHitResult(
  running,
  squareId,
  hitPosition,
  score,
  bestScore
) {
  if (
    !running ||
    squareId !== hitPosition
  ) {
    return null
  }

  const nextScore =
    score + 1

  const isNewBest =
    nextScore > bestScore

  return {
    score: nextScore,
    bestScore:
      isNewBest
        ? nextScore
        : bestScore,
    isNewBest
  }
}

export function getNextTime(
  currentTime
) {
  return Math.max(
    0,
    currentTime - 1
  )
}
