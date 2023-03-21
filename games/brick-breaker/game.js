import { GameState } from '../../shared/js/game-state.js'
import { createTimerRegistry } from '../../shared/js/timers.js'

import {
  getBlockBounce,
  getBoardBounce,
  getPaddleBounce,
  isColliding
} from './rules.js'
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

const timers = createTimerRegistry()

let score = 0
let gameState = GameState.READY

function isRunning() {
  return gameState === GameState.RUNNING
}

function isFinished() {
  return gameState === GameState.FINISHED
}
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
  if (!isRunning()) {
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
    if (!isRunning()) {
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
  if (!isRunning()) {
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

function pauseGame() {
  if (!isRunning()) {
    return
  }

  timers.clearAll()
  gameState = GameState.PAUSED

  gameControl.textContent =
    'Resume'

  updateGameStatus(
    'Paused'
  )
}

function finishGame(status) {
  if (isFinished()) {
    return
  }

  timers.clearAll()
  gameState = GameState.FINISHED

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
  if (isFinished()) {
    return
  }

  if (isRunning()) {
    pauseGame()
    return
  }

  timers.interval(
    moveBall,
    frameInterval
  )

  gameState = GameState.RUNNING

  gameControl.textContent =
    'Pause'

  updateGameStatus(
    'Running'
  )
}

function resetGame() {
  timers.clearAll()

  score = 0
  gameState = GameState.READY

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

function checkForCollisions() {
  if (isFinished()) {
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
        ballCurrentPosition,
        ballDiameter,
        block.bottomLeft,
        blockWidth,
        blockHeight
      )
    ) {
      continue
    }

    const blockBounce =
      getBlockBounce(
        ballCurrentPosition,
        ballDiameter,
        block.bottomLeft,
        blockWidth,
        blockHeight,
        xDirection,
        yDirection
      )

    xDirection =
      blockBounce.xDirection

    yDirection =
      blockBounce.yDirection

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

  if (isFinished()) {
    return
  }

  const boardBounce =
    getBoardBounce(
      ballCurrentPosition,
      ballDiameter,
      boardWidth,
      boardHeight,
      xDirection,
      yDirection
    )

  ballCurrentPosition =
    boardBounce.position

  xDirection =
    boardBounce.xDirection

  yDirection =
    boardBounce.yDirection

  const paddleBounce =
    getPaddleBounce(
      ballCurrentPosition,
      ballDiameter,
      currentPosition,
      blockWidth,
      blockHeight,
      xDirection,
      yDirection
    )

  if (paddleBounce) {
    ballCurrentPosition =
      paddleBounce.position

    xDirection =
      paddleBounce.xDirection

    yDirection =
      paddleBounce.yDirection
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
