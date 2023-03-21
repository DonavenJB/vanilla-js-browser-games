const PADDLE_DIRECTION_THRESHOLD = 10

export function isColliding(
  ballPosition,
  ballDiameter,
  objectPosition,
  objectWidth,
  objectHeight
) {
  const ballLeft =
    ballPosition[0]

  const ballRight =
    ballPosition[0] +
    ballDiameter

  const ballBottom =
    ballPosition[1]

  const ballTop =
    ballPosition[1] +
    ballDiameter

  const objectLeft =
    objectPosition[0]

  const objectBottom =
    objectPosition[1]

  const objectRight =
    objectLeft +
    objectWidth

  const objectTop =
    objectBottom +
    objectHeight

  return (
    ballRight >= objectLeft &&
    ballLeft <= objectRight &&
    ballTop >= objectBottom &&
    ballBottom <= objectTop
  )
}

export function getBlockBounce(
  ballPosition,
  ballDiameter,
  blockPosition,
  blockWidth,
  blockHeight,
  xDirection,
  yDirection
) {
  const ballCenterX =
    ballPosition[0] +
    ballDiameter / 2

  const ballCenterY =
    ballPosition[1] +
    ballDiameter / 2

  const blockCenterX =
    blockPosition[0] +
    blockWidth / 2

  const blockCenterY =
    blockPosition[1] +
    blockHeight / 2

  const overlapX =
    ballDiameter / 2 +
    blockWidth / 2 -
    Math.abs(
      ballCenterX -
      blockCenterX
    )

  const overlapY =
    ballDiameter / 2 +
    blockHeight / 2 -
    Math.abs(
      ballCenterY -
      blockCenterY
    )

  if (overlapX < overlapY) {
    return {
      xDirection: -xDirection,
      yDirection
    }
  }

  return {
    xDirection,
    yDirection: -yDirection
  }
}

export function getBoardBounce(
  ballPosition,
  ballDiameter,
  boardWidth,
  boardHeight,
  xDirection,
  yDirection
) {
  const position =
    [...ballPosition]

  let nextXDirection =
    xDirection

  let nextYDirection =
    yDirection

  const maximumX =
    boardWidth -
    ballDiameter

  const maximumY =
    boardHeight -
    ballDiameter

  if (position[0] <= 0) {
    position[0] = 0

    nextXDirection =
      Math.abs(
        nextXDirection
      )
  }

  if (position[0] >= maximumX) {
    position[0] =
      maximumX

    nextXDirection =
      -Math.abs(
        nextXDirection
      )
  }

  if (position[1] >= maximumY) {
    position[1] =
      maximumY

    nextYDirection =
      -Math.abs(
        nextYDirection
      )
  }

  return {
    position,
    xDirection: nextXDirection,
    yDirection: nextYDirection
  }
}

export function getPaddleBounce(
  ballPosition,
  ballDiameter,
  paddlePosition,
  paddleWidth,
  paddleHeight,
  xDirection,
  yDirection
) {
  if (
    yDirection >= 0 ||
    !isColliding(
      ballPosition,
      ballDiameter,
      paddlePosition,
      paddleWidth,
      paddleHeight
    )
  ) {
    return null
  }

  const position =
    [
      ballPosition[0],
      paddlePosition[1] +
        paddleHeight
    ]

  const paddleCenter =
    paddlePosition[0] +
    paddleWidth / 2

  const ballCenter =
    ballPosition[0] +
    ballDiameter / 2

  let nextXDirection =
    xDirection

  if (
    ballCenter <
    paddleCenter -
      PADDLE_DIRECTION_THRESHOLD
  ) {
    nextXDirection =
      -Math.abs(
        xDirection
      )
  }

  if (
    ballCenter >
    paddleCenter +
      PADDLE_DIRECTION_THRESHOLD
  ) {
    nextXDirection =
      Math.abs(
        xDirection
      )
  }

  return {
    position,
    xDirection: nextXDirection,
    yDirection:
      Math.abs(
        yDirection
      )
  }
}
