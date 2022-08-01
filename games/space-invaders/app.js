const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
const invadersLeftDisplay = document.querySelector('#invaders-left')
const gameStatusDisplay = document.querySelector('#game-status')
const gameMessageDisplay = document.querySelector('#game-message')
const startPauseButton = document.querySelector('#start-pause-button')

let currentShooterIndex = 202
const width = 15

let direction = 1
let invadersId = null
let goingRight = true

let aliensRemoved = []
let results = 0

let gameOver = false
let isRunning = false

for (let i = 0; i < 225; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const squares = Array.from(
  document.querySelectorAll('.grid div')
)

const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (
      !aliensRemoved.includes(i) &&
      squares[alienInvaders[i]]
    ) {
      squares[alienInvaders[i]].classList.add('invader')
    }
  }
}

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (squares[alienInvaders[i]]) {
      squares[alienInvaders[i]].classList.remove('invader')
    }
  }
}

function startGame() {
  if (gameOver || isRunning) {
    return
  }

  isRunning = true

  invadersId = setInterval(
    moveInvaders,
    600
  )

  gameStatusDisplay.textContent = 'Running'
  gameMessageDisplay.textContent = 'Destroy all 30 invaders!'
  startPauseButton.textContent = 'Pause Game'
}

function pauseGame() {
  if (!isRunning || gameOver) {
    return
  }

  clearInterval(invadersId)
  invadersId = null

  isRunning = false

  gameStatusDisplay.textContent = 'Paused'
  gameMessageDisplay.textContent = 'Game paused.'
  startPauseButton.textContent = 'Resume Game'
}

function endGame(message) {
  if (gameOver) {
    return
  }

  gameOver = true
  isRunning = false

  clearInterval(invadersId)
  invadersId = null

  gameStatusDisplay.textContent =
    message === 'YOU WIN'
      ? 'Won'
      : 'Game Over'

  gameMessageDisplay.textContent =
    message === 'YOU WIN'
      ? 'YOU WIN!'
      : 'GAME OVER'

  startPauseButton.textContent =
    message === 'YOU WIN'
      ? 'You Win'
      : 'Game Over'

  startPauseButton.disabled = true
}

function moveShooter(e) {
  if (
    gameOver ||
    !isRunning ||
    (
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight'
    )
  ) {
    return
  }

  e.preventDefault()

  squares[currentShooterIndex].classList.remove('shooter')

  switch (e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) {
        currentShooterIndex -= 1
      }
      break

    case 'ArrowRight':
      if (
        currentShooterIndex % width <
        width - 1
      ) {
        currentShooterIndex += 1
      }
      break
  }

  squares[currentShooterIndex].classList.add('shooter')
}

function moveInvaders() {
  if (gameOver || !isRunning) {
    return
  }

  const leftEdge =
    alienInvaders[0] % width === 0

  const rightEdge =
    alienInvaders[alienInvaders.length - 1] %
      width ===
    width - 1

  remove()

  if (rightEdge && goingRight) {
    for (
      let i = 0;
      i < alienInvaders.length;
      i++
    ) {
      alienInvaders[i] += width + 1
    }

    direction = -1
    goingRight = false
  }

  if (leftEdge && !goingRight) {
    for (
      let i = 0;
      i < alienInvaders.length;
      i++
    ) {
      alienInvaders[i] += width - 1
    }

    direction = 1
    goingRight = true
  }

  for (
    let i = 0;
    i < alienInvaders.length;
    i++
  ) {
    alienInvaders[i] += direction
  }

  const invadersReachedBottom =
    alienInvaders.some(
      index => index >= squares.length
    )

  if (invadersReachedBottom) {
    endGame('GAME OVER')
    return
  }

  draw()

  if (
    squares[currentShooterIndex]
      .classList.contains('invader')
  ) {
    endGame('GAME OVER')
    return
  }

  if (
    aliensRemoved.length ===
    alienInvaders.length
  ) {
    endGame('YOU WIN')
  }
}

function shoot(e) {
  if (
    gameOver ||
    !isRunning ||
    e.key !== 'ArrowUp'
  ) {
    return
  }

  e.preventDefault()

  let currentLaserIndex =
    currentShooterIndex

  const laserId =
    setInterval(moveLaser, 100)

  function moveLaser() {
    squares[currentLaserIndex]
      .classList.remove('laser')

    const nextLaserIndex =
      currentLaserIndex - width

    if (nextLaserIndex < 0) {
      clearInterval(laserId)
      return
    }

    currentLaserIndex =
      nextLaserIndex

    squares[currentLaserIndex]
      .classList.add('laser')

    if (
      squares[currentLaserIndex]
        .classList.contains('invader')
    ) {
      squares[currentLaserIndex]
        .classList.remove('laser')

      squares[currentLaserIndex]
        .classList.remove('invader')

      squares[currentLaserIndex]
        .classList.add('boom')

      const boomIndex =
        currentLaserIndex

      setTimeout(() => {
        squares[boomIndex]
          .classList.remove('boom')
      }, 300)

      clearInterval(laserId)

      const alienRemoved =
        alienInvaders.indexOf(
          currentLaserIndex
        )

      if (
        alienRemoved !== -1 &&
        !aliensRemoved.includes(
          alienRemoved
        )
      ) {
        aliensRemoved.push(
          alienRemoved
        )

        results++

        resultsDisplay.textContent =
          results

        invadersLeftDisplay.textContent =
          alienInvaders.length - aliensRemoved.length

        gameMessageDisplay.textContent =
          'Nice shot!'
      }

      if (
        aliensRemoved.length ===
        alienInvaders.length
      ) {
        endGame('YOU WIN')
      }
    }
  }
}

startPauseButton.addEventListener(
  'click',
  () => {
    if (gameOver) {
      return
    }

    if (isRunning) {
      pauseGame()
    } else {
      startGame()
    }
  }
)

document.addEventListener(
  'keydown',
  moveShooter
)

document.addEventListener(
  'keydown',
  shoot
)

draw()

squares[currentShooterIndex]
  .classList.add('shooter')
