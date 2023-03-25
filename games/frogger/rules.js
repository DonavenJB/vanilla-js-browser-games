const MOVEMENT_KEYS = Object.freeze([
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown'
])

const SAFE_LOG_CLASSES = Object.freeze([
  'l1',
  'l2',
  'l3'
])

const LOSING_CLASSES = Object.freeze([
  'c1',
  'l4',
  'l5'
])

const LEFT_MOVING_LOG_ROW = 2
const RIGHT_MOVING_LOG_ROW = 3

export function isMovementKey(key) {
  return MOVEMENT_KEYS.includes(key)
}

export function getNextFrogIndex(
  currentIndex,
  key,
  width,
  boardSize
) {
  if (!isMovementKey(key)) {
    return currentIndex
  }

  if (
    key === 'ArrowLeft' &&
    currentIndex % width !== 0
  ) {
    return currentIndex - 1
  }

  if (
    key === 'ArrowRight' &&
    currentIndex % width <
      width - 1
  ) {
    return currentIndex + 1
  }

  if (
    key === 'ArrowUp' &&
    currentIndex - width >= 0
  ) {
    return currentIndex - width
  }

  if (
    key === 'ArrowDown' &&
    currentIndex + width <
      boardSize
  ) {
    return currentIndex + width
  }

  return currentIndex
}

export function getNextCycleClass(
  currentClass,
  cycle,
  direction
) {
  const currentIndex =
    cycle.indexOf(currentClass)

  if (currentIndex < 0) {
    return null
  }

  const nextIndex =
    (
      currentIndex +
      direction +
      cycle.length
    ) % cycle.length

  return cycle[nextIndex]
}

export function getLogRideOffset(
  currentIndex,
  width,
  squareClasses
) {
  const isOnSafeLog =
    SAFE_LOG_CLASSES.some(
      className =>
        squareClasses.includes(
          className
        )
    )

  if (!isOnSafeLog) {
    return 0
  }

  const currentRow =
    Math.floor(
      currentIndex / width
    )

  if (
    currentRow ===
    LEFT_MOVING_LOG_ROW
  ) {
    return -1
  }

  if (
    currentRow ===
    RIGHT_MOVING_LOG_ROW
  ) {
    return 1
  }

  return 0
}

export function getLogRideTarget(
  currentIndex,
  offset,
  width,
  boardSize
) {
  const nextIndex =
    currentIndex + offset

  if (
    nextIndex < 0 ||
    nextIndex >= boardSize
  ) {
    return null
  }

  const currentRow =
    Math.floor(
      currentIndex / width
    )

  const nextRow =
    Math.floor(
      nextIndex / width
    )

  if (currentRow !== nextRow) {
    return null
  }

  return nextIndex
}

export function getFrogOutcome(
  squareClasses,
  currentTime
) {
  const isLosingSquare =
    LOSING_CLASSES.some(
      className =>
        squareClasses.includes(
          className
        )
    )

  if (
    isLosingSquare ||
    currentTime <= 0
  ) {
    return 'loss'
  }

  if (
    squareClasses.includes(
      'ending-block'
    )
  ) {
    return 'win'
  }

  return null
}
