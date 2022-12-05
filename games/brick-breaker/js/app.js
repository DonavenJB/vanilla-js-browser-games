const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const gameControl = document.querySelector('#game-control')

const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20

const boardWidth = 560
const boardHeight = 300

const paddleSpeed = 10

let xDirection = -2
let yDirection = 2

const userStart = [230, 10]
let currentPosition = [...userStart]

const ballStart = [270, 40]
let ballCurrentPosition = [...ballStart]

let timerId = null
let score = 0

let gameRunning = false
let gameOver = false

//my block
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + blockWidth, yAxis]
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    this.topLeft = [xAxis, yAxis + blockHeight]
  }
}

//all my blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),

  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),

  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
]

//draw my blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div')

    block.classList.add('block')

    block.style.left =
      blocks[i].bottomLeft[0] + 'px'

    block.style.bottom =
      blocks[i].bottomLeft[1] + 'px'

    grid.appendChild(block)
  }
}

addBlocks()

//add user
const user = document.createElement('div')

user.classList.add('user')
grid.appendChild(user)

drawUser()

//add ball
const ball = document.createElement('div')

ball.classList.add('ball')
grid.appendChild(ball)

drawBall()

//move user
function moveUser(e) {
  if (
    e.key !== 'ArrowLeft' &&
    e.key !== 'ArrowRight'
  ) {
    return
  }

  if (!gameRunning) {
    return
  }

  e.preventDefault()

  const maximumPosition =
    boardWidth - blockWidth

  if (e.key === 'ArrowLeft') {
    currentPosition[0] =
      Math.max(
        0,
        currentPosition[0] -
          paddleSpeed
      )
  }

  if (e.key === 'ArrowRight') {
    currentPosition[0] =
      Math.min(
        maximumPosition,
        currentPosition[0] +
          paddleSpeed
      )
  }

  drawUser()
}

document.addEventListener(
  'keydown',
  moveUser
)

//draw User
function drawUser() {
  user.style.left =
    currentPosition[0] + 'px'

  user.style.bottom =
    currentPosition[1] + 'px'
}

//draw Ball
function drawBall() {
  ball.style.left =
    ballCurrentPosition[0] + 'px'

  ball.style.bottom =
    ballCurrentPosition[1] + 'px'
}

//move ball
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

function stopGameTimer() {
  if (timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }

  gameRunning = false
}

function finishGame(message) {
  if (gameOver) {
    return
  }

  stopGameTimer()

  gameOver = true

  scoreDisplay.textContent =
    message

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
    stopGameTimer()

    gameControl.textContent =
      'Resume'

    return
  }

  if (timerId !== null) {
    return
  }

  timerId = setInterval(
    moveBall,
    30
  )

  gameRunning = true

  gameControl.textContent =
    'Pause'
}

gameControl.addEventListener(
  'click',
  toggleGame
)

//collision helpers
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
    objectBottom + objectHeight

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
      ballCenterX - blockCenterX
    )

  const overlapY =
    ballDiameter / 2 +
    blockHeight / 2 -
    Math.abs(
      ballCenterY - blockCenterY
    )

  if (overlapX < overlapY) {
    xDirection *= -1
  } else {
    yDirection *= -1
  }
}

//check for collisions
function checkForCollisions() {
  if (gameOver) {
    return
  }

  //brick collision
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
      finishGame('You Win!')
    }

    //Only one brick may be removed per frame.
    break
  }

  if (gameOver) {
    return
  }

  //left wall
  if (ballCurrentPosition[0] <= 0) {
    ballCurrentPosition[0] = 0

    xDirection =
      Math.abs(xDirection)
  }

  //right wall
  if (
    ballCurrentPosition[0] >=
    boardWidth - ballDiameter
  ) {
    ballCurrentPosition[0] =
      boardWidth - ballDiameter

    xDirection =
      -Math.abs(xDirection)
  }

  //top wall
  if (
    ballCurrentPosition[1] >=
    boardHeight - ballDiameter
  ) {
    ballCurrentPosition[1] =
      boardHeight - ballDiameter

    yDirection =
      -Math.abs(yDirection)
  }

  //paddle collision
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

  //game over
  if (ballCurrentPosition[1] <= 0) {
    ballCurrentPosition[1] = 0

    finishGame('You lose!')
  }
}
