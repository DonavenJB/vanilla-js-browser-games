const grid =
  document.querySelector('.grid')

const scoreDisplay =
  document.querySelector('#score')

const statusDisplay =
  document.querySelector('#game-status')

const gameControl =
  document.querySelector('#game-control')

const newGameButton =
  document.querySelector('#new-game')

const paddleLeftButton =
  document.querySelector('#paddle-left')

const paddleRightButton =
  document.querySelector('#paddle-right')

const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20

const boardWidth = 560
const boardHeight = 300

const paddleSpeed = 10
const ballSpeed = 2
const frameInterval = 30

const blockColumns = 5
const blockRows = 3
const blockGap = 10
const blockStartX = 10
const blockStartY = 270

const userStart = [230, 10]
const ballStart = [270, 40]

let currentPosition =
  [...userStart]

let ballCurrentPosition =
  [...ballStart]

let xDirection = -ballSpeed
let yDirection = ballSpeed

let timerId = null
let score = 0

let gameRunning = false
let gameOver = false

class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [
      xAxis,
      yAxis
    ]

    this.bottomRight = [
      xAxis + blockWidth,
      yAxis
    ]

    this.topRight = [
      xAxis + blockWidth,
      yAxis + blockHeight
    ]

    this.topLeft = [
      xAxis,
      yAxis + blockHeight
    ]
  }
}

const blockPositions =
  Array.from(
    {
      length: blockRows
    },
    (_, row) =>
      Array.from(
        {
          length: blockColumns
        },
        (_, column) => [
          blockStartX +
            column *
            (blockWidth + blockGap),

          blockStartY -
            row *
            (blockHeight + blockGap)
        ]
      )
  ).flat()

let blocks = []

function createBlocks() {
  blocks =
    blockPositions.map(
      ([xAxis, yAxis]) =>
        new Block(
          xAxis,
          yAxis
        )
    )
}

function drawBlocks() {
  blocks.forEach(blockData => {
    const block =
      document.createElement('div')

    block.classList.add('block')

    block.style.left =
      blockData.bottomLeft[0] +
      'px'

    block.style.bottom =
      blockData.bottomLeft[1] +
      'px'

    grid.appendChild(block)
  })
}

function removeBlocks() {
  document
    .querySelectorAll('.block')
    .forEach(block => {
      block.remove()
    })
}

createBlocks()
drawBlocks()

const user =
  document.createElement('div')

user.classList.add('user')
grid.appendChild(user)

const ball =
  document.createElement('div')

ball.classList.add('ball')
grid.appendChild(ball)

function drawUser() {
  user.style.left =
    currentPosition[0] +
    'px'

  user.style.bottom =
    currentPosition[1] +
    'px'
}

function drawBall() {
  ball.style.left =
    ballCurrentPosition[0] +
    'px'

  ball.style.bottom =
    ballCurrentPosition[1] +
    'px'
}

drawUser()
drawBall()

function movePaddle(direction) {
  if (!gameRunning) {
    return
  }

  const maximumPosition =
    boardWidth - blockWidth

  if (direction === 'left') {
    currentPosition[0] =
      Math.max(
        0,
        currentPosition[0] -
          paddleSpeed
      )
  }

  if (direction === 'right') {
    currentPosition[0] =
      Math.min(
        maximumPosition,
        currentPosition[0] +
          paddleSpeed
      )
  }

  drawUser()
}

function handleKeyboard(event) {
  if (
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight'
  ) {
    if (!gameRunning) {
      return
    }

    event.preventDefault()

    movePaddle(
      event.key === 'ArrowLeft'
        ? 'left'
        : 'right'
    )

    return
  }

  if (
    event.code === 'Space' &&
    event.target.tagName !== 'BUTTON'
  ) {
    event.preventDefault()

    toggleGame()

    return
  }

  if (
    event.key.toLowerCase() === 'n' &&
    event.target.tagName !== 'BUTTON'
  ) {
    event.preventDefault()

    resetGame()
  }
}

document.addEventListener(
  'keydown',
  handleKeyboard
)

function moveBall() {
  if (
    !gameRunning ||
    gameOver
  ) {
    return
  }

  ballCurrentPosition[0] +=
    xDirection

  ballCurrentPosition[1] +=
    yDirection

  checkForCollisions()
  drawBall()
}

function updateGameStatus(status) {
  statusDisplay.textContent =
    status
}

function stopGameTimer() {
  if (timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }

  gameRunning = false
}

function pauseGame() {
  if (
    !gameRunning ||
    gameOver
  ) {
    return
  }

  stopGameTimer()

  gameControl.textContent =
    'Resume'

  updateGameStatus(
    'Paused'
  )
}

function finishGame(status) {
  if (gameOver) {
    return
  }

  stopGameTimer()

  gameOver = true

  updateGameStatus(status)

  document.body.classList.remove(
    'game-won',
    'game-lost'
  )

  document.body.classList.add(
    status === 'Won'
      ? 'game-won'
      : 'game-lost'
  )

  gameControl.textContent =
    'Finished'

  gameControl.disabled =
    true
}

function toggleGame() {
  if (gameOver) {
    return
  }

  if (gameRunning) {
    pauseGame()
    return
  }

  if (timerId !== null) {
    return
  }

  timerId = setInterval(
    moveBall,
    frameInterval
  )

  gameRunning = true

  gameControl.textContent =
    'Pause'

  updateGameStatus(
    'Running'
  )
}

function resetGame() {
  stopGameTimer()

  score = 0
  gameOver = false

  document.body.classList.remove(
    'game-won',
    'game-lost'
  )

  updateGameStatus(
    'Ready'
  )

  xDirection =
    -ballSpeed

  yDirection =
    ballSpeed

  currentPosition =
    [...userStart]

  ballCurrentPosition =
    [...ballStart]

  removeBlocks()

  createBlocks()
  drawBlocks()

  scoreDisplay.textContent =
    score

  gameControl.disabled =
    false

  gameControl.textContent =
    'Start'

  drawUser()
  drawBall()
}

gameControl.addEventListener(
  'click',
  toggleGame
)

newGameButton.addEventListener(
  'click',
  resetGame
)

paddleLeftButton.addEventListener(
  'click',
  () => {
    movePaddle('left')
  }
)

paddleRightButton.addEventListener(
  'click',
  () => {
    movePaddle('right')
  }
)

window.addEventListener(
  'blur',
  pauseGame
)

document.addEventListener(
  'visibilitychange',
  () => {
    if (document.hidden) {
      pauseGame()
    }
  }
)

updateGameStatus(
  'Ready'
)

function isColliding(
  objectLeft,
  objectBottom,
  objectWidth,
  objectHeight
) {
  const ballLeft =
    ballCurrentPosition[0]

  const ballRight =
    ballCurrentPosition[0] +
    ballDiameter

  const ballBottom =
    ballCurrentPosition[1]

  const ballTop =
    ballCurrentPosition[1] +
    ballDiameter

  const objectRight =
    objectLeft + objectWidth

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

function bounceOffBlock(block) {
  const ballCenterX =
    ballCurrentPosition[0] +
    ballDiameter / 2

  const ballCenterY =
    ballCurrentPosition[1] +
    ballDiameter / 2

  const blockCenterX =
    block.bottomLeft[0] +
    blockWidth / 2

  const blockCenterY =
    block.bottomLeft[1] +
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
    xDirection *= -1
  } else {
    yDirection *= -1
  }
}

function checkForCollisions() {
  if (gameOver) {
    return
  }

  for (
    let i = blocks.length - 1;
    i >= 0;
    i--
  ) {
    const block =
      blocks[i]

    if (
      !isColliding(
        block.bottomLeft[0],
        block.bottomLeft[1],
        blockWidth,
        blockHeight
      )
    ) {
      continue
    }

    bounceOffBlock(block)

    const allBlocks =
      document.querySelectorAll(
        '.block'
      )

    allBlocks[i].remove()

    blocks.splice(i, 1)

    score++

    scoreDisplay.textContent =
      score

    if (blocks.length === 0) {
      finishGame('Won')
    }

    break
  }

  if (gameOver) {
    return
  }

  if (
    ballCurrentPosition[0] <= 0
  ) {
    ballCurrentPosition[0] = 0

    xDirection =
      Math.abs(xDirection)
  }

  if (
    ballCurrentPosition[0] >=
    boardWidth - ballDiameter
  ) {
    ballCurrentPosition[0] =
      boardWidth - ballDiameter

    xDirection =
      -Math.abs(xDirection)
  }

  if (
    ballCurrentPosition[1] >=
    boardHeight - ballDiameter
  ) {
    ballCurrentPosition[1] =
      boardHeight - ballDiameter

    yDirection =
      -Math.abs(yDirection)
  }

  if (
    yDirection < 0 &&
    isColliding(
      currentPosition[0],
      currentPosition[1],
      blockWidth,
      blockHeight
    )
  ) {
    ballCurrentPosition[1] =
      currentPosition[1] +
      blockHeight

    yDirection =
      Math.abs(yDirection)

    const paddleCenter =
      currentPosition[0] +
      blockWidth / 2

    const ballCenter =
      ballCurrentPosition[0] +
      ballDiameter / 2

    if (
      ballCenter <
      paddleCenter - 10
    ) {
      xDirection =
        -Math.abs(xDirection)
    }

    if (
      ballCenter >
      paddleCenter + 10
    ) {
      xDirection =
        Math.abs(xDirection)
    }
  }

  if (
    ballCurrentPosition[1] <= 0
  ) {
    ballCurrentPosition[1] = 0

    finishGame(
      'Game Over'
    )
  }
}
