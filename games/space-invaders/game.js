import { GameState } from '../../shared/js/game-state.js'
const grid = document.querySelector('.grid')

const resultsDisplay =
  document.querySelector('.results')

const invadersLeftDisplay =
  document.querySelector('#invaders-left')

const gameStatusDisplay =
  document.querySelector('#game-status')

const gameMessageDisplay =
  document.querySelector('#game-message')

const startPauseButton =
  document.querySelector('#start-pause-button')

const newGameButton =
  document.querySelector('#new-game-button')

const directionButtons =
  document.querySelectorAll(
    '.direction-controls button'
  )

const width = 15
const boardSize = width * width
const startingShooterIndex = 202

const startingInvaderSpeed = 600
const minimumInvaderSpeed = 250
const invaderSpeedStep = 70
const killsPerSpeedLevel = 5

const initialAlienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

const initialInvaderCount =
  initialAlienInvaders.length

let currentShooterIndex =
  startingShooterIndex

let alienInvaders =
  [...initialAlienInvaders]

let direction = 1
let invadersId = null
let goingRight = true

let currentInvaderSpeed =
  startingInvaderSpeed

let aliensRemoved = new Set()
let results = 0

let gameState = GameState.READY

function isRunning() {
  return gameState === GameState.RUNNING
}

function isFinished() {
  return gameState === GameState.FINISHED
}

let canShoot = true
let shootCooldownId = null

const activeLaserIds = new Set()

for (let i = 0; i < boardSize; i++) {
  const square =
    document.createElement('div')

  grid.appendChild(square)
}

const squares = Array.from(
  document.querySelectorAll('.grid div')
)

function updateControlButtons() {
  directionButtons.forEach(button => {
    button.disabled =
      !isRunning() ||
      isFinished()
  })
}

function draw() {
  for (
    let i = 0;
    i < alienInvaders.length;
    i++
  ) {
    if (
      !aliensRemoved.has(i) &&
      squares[alienInvaders[i]]
    ) {
      squares[alienInvaders[i]]
        .classList.add('invader')
    }
  }
}

function remove() {
  for (
    let i = 0;
    i < alienInvaders.length;
    i++
  ) {
    if (squares[alienInvaders[i]]) {
      squares[alienInvaders[i]]
        .classList.remove('invader')
    }
  }
}

function resetShootCooldown() {
  if (shootCooldownId) {
    clearTimeout(shootCooldownId)
    shootCooldownId = null
  }

  canShoot = true
}

function clearActiveLasers() {
  activeLaserIds.forEach(laserId => {
    clearInterval(laserId)
  })

  activeLaserIds.clear()

  squares.forEach(square => {
    square.classList.remove('laser')
  })
}

function clearBoard() {
  squares.forEach(square => {
    square.classList.remove(
      'invader',
      'shooter',
      'laser',
      'boom'
    )
  })
}

function calculateInvaderSpeed() {
  const speedLevel =
    Math.floor(
      aliensRemoved.size /
      killsPerSpeedLevel
    )

  return Math.max(
    minimumInvaderSpeed,
    startingInvaderSpeed -
      speedLevel * invaderSpeedStep
  )
}

function restartInvaderMovement() {
  clearInterval(invadersId)

  invadersId = setInterval(
    moveInvaders,
    currentInvaderSpeed
  )
}

function updateInvaderSpeed() {
  const nextSpeed =
    calculateInvaderSpeed()

  if (
    nextSpeed ===
    currentInvaderSpeed
  ) {
    return false
  }

  currentInvaderSpeed =
    nextSpeed

  if (
    isRunning() &&
    !isFinished()
  ) {
    restartInvaderMovement()
  }

  return true
}

function startGame() {
  if (isFinished() || isRunning()) {
    return
  }

  gameState = GameState.RUNNING

  invadersId = setInterval(
    moveInvaders,
    currentInvaderSpeed
  )

  gameStatusDisplay.textContent =
    'Running'

  if (results === 0) {
    gameMessageDisplay.textContent =
      `Destroy all ${initialInvaderCount} invaders!`
  } else {
    gameMessageDisplay.textContent =
      'Game resumed.'
  }

  startPauseButton.textContent =
    'Pause Game'

  updateControlButtons()
}

function pauseGame() {
  if (!isRunning() || isFinished()) {
    return
  }

  clearInterval(invadersId)
  invadersId = null

  gameState = GameState.PAUSED

  gameStatusDisplay.textContent =
    'Paused'

  gameMessageDisplay.textContent =
    'Game paused.'

  startPauseButton.textContent =
    'Resume Game'

  updateControlButtons()
}

function endGame(message) {
  if (isFinished()) {
    return
  }

  gameState = GameState.FINISHED

  clearInterval(invadersId)
  invadersId = null

  clearActiveLasers()
  resetShootCooldown()

  document.body.classList.remove(
    'game-won',
    'game-lost'
  )

  document.body.classList.add(
    message === 'YOU WIN'
      ? 'game-won'
      : 'game-lost'
  )

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

  updateControlButtons()
}

function resetGame() {
  document.body.classList.remove(
    'game-won',
    'game-lost'
  )

  clearInterval(invadersId)
  invadersId = null

  clearActiveLasers()
  resetShootCooldown()
  clearBoard()

  currentShooterIndex =
    startingShooterIndex

  alienInvaders =
    [...initialAlienInvaders]

  direction = 1
  goingRight = true

  currentInvaderSpeed =
    startingInvaderSpeed

  aliensRemoved = new Set()
  results = 0

  gameState = GameState.READY

  resultsDisplay.textContent = '0'

  invadersLeftDisplay.textContent =
    initialInvaderCount

  gameStatusDisplay.textContent =
    'Ready'

  gameMessageDisplay.textContent =
    'Press Start Game to begin.'

  startPauseButton.textContent =
    'Start Game'

  startPauseButton.disabled = false

  updateControlButtons()

  draw()

  squares[currentShooterIndex]
    .classList.add('shooter')
}

function moveShooter(e) {
  if (
    isFinished() ||
    !isRunning() ||
    (
      e.key !== 'ArrowLeft' &&
      e.key !== 'ArrowRight'
    )
  ) {
    return
  }

  e.preventDefault()

  squares[currentShooterIndex]
    .classList.remove('shooter')

  switch (e.key) {
    case 'ArrowLeft':
      if (
        currentShooterIndex %
          width !==
        0
      ) {
        currentShooterIndex -= 1
      }
      break

    case 'ArrowRight':
      if (
        currentShooterIndex %
          width <
        width - 1
      ) {
        currentShooterIndex += 1
      }
      break
  }

  squares[currentShooterIndex]
    .classList.add('shooter')
}

function moveInvaders() {
  if (isFinished() || !isRunning()) {
    return
  }

  const activeInvaders =
    alienInvaders.filter(
      (position, alienIndex) =>
        !aliensRemoved.has(
          alienIndex
        )
    )

  if (activeInvaders.length === 0) {
    endGame('YOU WIN')
    return
  }

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

  remove()

  if (rightEdge && goingRight) {
    for (
      let i = 0;
      i < alienInvaders.length;
      i++
    ) {
      alienInvaders[i] +=
        width + 1
    }

    direction = -1
    goingRight = false
  } else if (
    leftEdge &&
    !goingRight
  ) {
    for (
      let i = 0;
      i < alienInvaders.length;
      i++
    ) {
      alienInvaders[i] +=
        width - 1
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

  const updatedActiveInvaders =
    alienInvaders.filter(
      (position, alienIndex) =>
        !aliensRemoved.has(
          alienIndex
        )
    )

  const invadersReachedBottom =
    updatedActiveInvaders.some(
      position =>
        position >= squares.length
    )

  if (invadersReachedBottom) {
    endGame('GAME OVER')
    return
  }

  const shooterWasHit =
    updatedActiveInvaders.includes(
      currentShooterIndex
    )

  if (shooterWasHit) {
    draw()
    endGame('GAME OVER')
    return
  }

  draw()

  if (
    aliensRemoved.size ===
    alienInvaders.length
  ) {
    endGame('YOU WIN')
  }
}

function shoot(e) {
  const fireKeys = [
    'ArrowUp',
    ' ',
    'Spacebar'
  ]

  if (
    isFinished() ||
    !isRunning() ||
    !fireKeys.includes(e.key) ||
    !canShoot
  ) {
    return
  }

  e.preventDefault()

  canShoot = false

  shootCooldownId = setTimeout(() => {
    canShoot = true
    shootCooldownId = null
  }, 250)

  let currentLaserIndex =
    currentShooterIndex

  const laserId =
    setInterval(moveLaser, 100)

  activeLaserIds.add(laserId)

  function stopLaser() {
    clearInterval(laserId)
    activeLaserIds.delete(laserId)

    if (squares[currentLaserIndex]) {
      squares[currentLaserIndex]
        .classList.remove('laser')
    }
  }

  function moveLaser() {
    if (
      isFinished() ||
      !isRunning()
    ) {
      return
    }

    squares[currentLaserIndex]
      .classList.remove('laser')

    const nextLaserIndex =
      currentLaserIndex - width

    if (nextLaserIndex < 0) {
      stopLaser()
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

      stopLaser()

      const alienRemoved =
        alienInvaders.indexOf(
          currentLaserIndex
        )

      if (
        alienRemoved !== -1 &&
        !aliensRemoved.has(
          alienRemoved
        )
      ) {
        aliensRemoved.add(
          alienRemoved
        )

        results++

        resultsDisplay.textContent =
          results

        invadersLeftDisplay.textContent =
          alienInvaders.length -
          aliensRemoved.size

        const speedIncreased =
          updateInvaderSpeed()

        gameMessageDisplay.textContent =
          speedIncreased
            ? 'The invaders are getting faster!'
            : 'Nice shot!'
      }

      if (
        aliensRemoved.size ===
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
    if (isFinished()) {
      return
    }

    if (isRunning()) {
      pauseGame()
    } else {
      startGame()
    }
  }
)

newGameButton.addEventListener(
  'click',
  resetGame
)

function runGameInput(key) {
  const input = {
    key,
    preventDefault() {}
  }

  moveShooter(input)
  shoot(input)
}

directionButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!isRunning() || isFinished()) {
      return
    }

    runGameInput(
      button.dataset.key
    )
  })
})

document.addEventListener(
  'keydown',
  moveShooter
)

document.addEventListener(
  'keydown',
  shoot
)

window.addEventListener(
  'blur',
  () => {
    if (
      isRunning() &&
      !isFinished()
    ) {
      pauseGame()
    }
  }
)

resetGame()
