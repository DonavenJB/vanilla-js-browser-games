import { GameState } from '../../shared/js/game-state.js'
import { createTimerRegistry } from '../../shared/js/timers.js'

import {
  getActiveInvaders,
  getInvaderMovement,
  hasInvaderHitShooter,
  hasInvaderReachedBottom
} from './rules.js'
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
const invaderTimers = createTimerRegistry()
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
const cooldownTimers = createTimerRegistry()

const laserTimers = createTimerRegistry()

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
  cooldownTimers.clearAll()
  canShoot = true
}

function clearActiveLasers() {
  laserTimers.clearAll()

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
  invaderTimers.clearAll()

  invaderTimers.interval(
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

  invaderTimers.interval(
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

  invaderTimers.clearAll()

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

  invaderTimers.clearAll()

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

  invaderTimers.clearAll()

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
    getActiveInvaders(
      alienInvaders,
      aliensRemoved
    )

  if (activeInvaders.length === 0) {
    endGame('YOU WIN')
    return
  }

  remove()

  const movement =
    getInvaderMovement(
      activeInvaders,
      width,
      direction,
      goingRight
    )

  direction = movement.direction
  goingRight = movement.goingRight

  for (
    let i = 0;
    i < alienInvaders.length;
    i++
  ) {
    alienInvaders[i] +=
      movement.offset
  }

  const updatedActiveInvaders =
    getActiveInvaders(
      alienInvaders,
      aliensRemoved
    )

  if (
    hasInvaderReachedBottom(
      updatedActiveInvaders,
      squares.length
    )
  ) {
    endGame('GAME OVER')
    return
  }

  if (
    hasInvaderHitShooter(
      updatedActiveInvaders,
      currentShooterIndex
    )
  ) {
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

  cooldownTimers.timeout(() => {
    canShoot = true
  }, 250)

  let currentLaserIndex =
    currentShooterIndex

  const laserId =
    laserTimers.interval(moveLaser, 100)


  function stopLaser() {
    laserTimers.clearInterval(laserId)

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
