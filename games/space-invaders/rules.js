export function getActiveInvaders(
  invaders,
  removedIndexes
) {
  return invaders.filter(
    (position, alienIndex) =>
      !removedIndexes.has(alienIndex)
  )
}

export function getInvaderMovement(
  activeInvaders,
  width,
  direction,
  goingRight
) {
  const leftEdge =
    activeInvaders.some(
      position =>
        position % width === 0
    )

  const rightEdge =
    activeInvaders.some(
      position =>
        position % width ===
        width - 1
    )

  if (rightEdge && goingRight) {
    return {
      offset: width,
      direction: -1,
      goingRight: false
    }
  }

  if (leftEdge && !goingRight) {
    return {
      offset: width,
      direction: 1,
      goingRight: true
    }
  }

  return {
    offset: direction,
    direction,
    goingRight
  }
}

export function hasInvaderReachedBottom(
  activeInvaders,
  boardSize
) {
  return activeInvaders.some(
    position =>
      position >= boardSize
  )
}

export function hasInvaderHitShooter(
  activeInvaders,
  shooterIndex
) {
  return activeInvaders.includes(
    shooterIndex
  )
}
