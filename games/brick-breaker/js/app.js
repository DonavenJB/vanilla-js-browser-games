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
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

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
  ballCurrentPosition[0] +=
    xDirection

  ballCurrentPosition[1] +=
    yDirection

  drawBall()
  checkForCollisions()
}

function toggleGame() {
  if (gameOver) {
    return
  }

  if (gameRunning) {
    clearInterval(timerId)

    timerId = null
    gameRunning = false

    gameControl.textContent =
      'Resume'

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

//check for collisions
function checkForCollisions() {
  //check for block collision
  for (
    let i = 0;
    i < blocks.length;
    i++
  ) {
    if (
      (
        ballCurrentPosition[0] >
          blocks[i].bottomLeft[0] &&
        ballCurrentPosition[0] <
          blocks[i].bottomRight[0]
      ) &&
      (
        (
          ballCurrentPosition[1] +
          ballDiameter
        ) >
          blocks[i].bottomLeft[1] &&
        ballCurrentPosition[1] <
          blocks[i].topLeft[1]
      )
    ) {
      const allBlocks =
        Array.from(
          document.querySelectorAll(
            '.block'
          )
        )

      allBlocks[i].classList.remove(
        'block'
      )

      blocks.splice(i, 1)

      changeDirection()

      score++

      scoreDisplay.innerHTML =
        score

      if (blocks.length == 0) {
        scoreDisplay.innerHTML =
          'You Win!'

        clearInterval(timerId)

        timerId = null
        gameRunning = false
        gameOver = true

        gameControl.textContent =
          'Finished'

        gameControl.disabled =
          true
      }
    }
  }

  //check for wall hits
  if (
    ballCurrentPosition[0] >=
      (boardWidth - ballDiameter) ||
    ballCurrentPosition[0] <= 0 ||
    ballCurrentPosition[1] >=
      (boardHeight - ballDiameter)
  ) {
    changeDirection()
  }

  //check for user collision
  if (
    (
      ballCurrentPosition[0] >
        currentPosition[0] &&
      ballCurrentPosition[0] <
        currentPosition[0] +
        blockWidth
    ) &&
    (
      ballCurrentPosition[1] >
        currentPosition[1] &&
      ballCurrentPosition[1] <
        currentPosition[1] +
        blockHeight
    )
  ) {
    changeDirection()
  }

  //game over
  if (
    ballCurrentPosition[1] <= 0
  ) {
    clearInterval(timerId)

    timerId = null
    gameRunning = false
    gameOver = true

    scoreDisplay.innerHTML =
      'You lose!'

    gameControl.textContent =
      'Finished'

    gameControl.disabled =
      true
  }
}

function changeDirection() {
  if (
    xDirection === 2 &&
    yDirection === 2
  ) {
    yDirection = -2
    return
  }

  if (
    xDirection === 2 &&
    yDirection === -2
  ) {
    xDirection = -2
    return
  }

  if (
    xDirection === -2 &&
    yDirection === -2
  ) {
    yDirection = 2
    return
  }

  if (
    xDirection === -2 &&
    yDirection === 2
  ) {
    xDirection = 2
    return
  }
}
