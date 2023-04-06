import {
  GameState
} from '../../shared/js/game-state.js'

import {
  createTimerRegistry
} from '../../shared/js/timers.js'

import {
  getHitResult,
  getNextTime,
  getRandomTargetIndex
} from './rules.js'

const squares =
  document.querySelectorAll('.square')

const timeLeftDisplay =
  document.querySelector('#time-left')

const scoreDisplay =
  document.querySelector('#score')

const bestScoreDisplay =
  document.querySelector('#best-score')

const gameStatusDisplay =
  document.querySelector('#game-status')

const gameMessageDisplay =
  document.querySelector('#game-message')

const startPauseButton =
  document.querySelector('#start-pause-button')

const newGameButton =
  document.querySelector('#new-game-button')

const startingTime = 60
const moleMoveInterval = 500
const countDownInterval = 1000
const hitFeedbackDuration = 150

const timers =
  createTimerRegistry()

let bestScore =
  Number(
    sessionStorage.getItem(
      'whacAMoleBestScore'
    )
  ) || 0

let result = 0
let hitPosition = null
let currentTime =
  startingTime

let gameState =
  GameState.READY

function isRunning() {
  return (
    gameState ===
    GameState.RUNNING
  )
}

function setGameState(state) {
  gameState = state

  document.body.classList.remove(
    'game-running',
    'game-paused',
    'game-over'
  )

  if (state === GameState.RUNNING) {
    document.body.classList.add(
      'game-running'
    )

    gameStatusDisplay.textContent =
      'Running'
  }

  if (state === GameState.PAUSED) {
    document.body.classList.add(
      'game-paused'
    )

    gameStatusDisplay.textContent =
      'Paused'
  }

  if (state === GameState.FINISHED) {
    document.body.classList.add(
      'game-over'
    )

    gameStatusDisplay.textContent =
      'Game Over'
  }

  if (state === GameState.READY) {
    gameStatusDisplay.textContent =
      'Ready'
  }
}

function clearTargets() {
  squares.forEach(square => {
    square.classList.remove(
      'mole',
      'hit'
    )
  })

  hitPosition = null
}

function randomSquare() {
  squares.forEach(square => {
    square.classList.remove('mole')
  })

  const targetIndex =
    getRandomTargetIndex(
      squares.length,
      Math.random()
    )

  const target =
    squares[targetIndex]

  target.classList.add('mole')
  hitPosition = target.id
}
function registerHit(square) {
  const hitResult =
    getHitResult(
      isRunning(),
      square.id,
      hitPosition,
      result,
      bestScore
    )

  if (!hitResult) {
    return
  }

  result =
    hitResult.score

  scoreDisplay.textContent =
    result

  if (hitResult.isNewBest) {
    bestScore =
      hitResult.bestScore

    bestScoreDisplay.textContent =
      bestScore

    sessionStorage.setItem(
      'whacAMoleBestScore',
      bestScore
    )

    gameMessageDisplay.textContent =
      'New best score!'
  } else {
    gameMessageDisplay.textContent =
      'Nice hit!'
  }

  hitPosition = null

  square.classList.remove('mole')
  square.classList.add('hit')

  timers.timeout(
    () => {
      square.classList.remove('hit')
    },
    hitFeedbackDuration
  )
}
squares.forEach((square, index) => {
  square.setAttribute(
    'role',
    'button'
  )

  square.setAttribute(
    'tabindex',
    '0'
  )

  square.setAttribute(
    'aria-label',
    `Target ${index + 1}`
  )

  square.addEventListener(
    'click',
    () => {
      registerHit(square)
    }
  )

  square.addEventListener(
    'keydown',
    event => {
      if (
        event.key !== 'Enter' &&
        event.key !== ' '
      ) {
        return
      }

      event.preventDefault()
      registerHit(square)
    }
  )
})

function startTimers() {
  timers.interval(
    randomSquare,
    moleMoveInterval
  )

  timers.interval(
    countDown,
    countDownInterval
  )
}

function startGame() {
  if (
    isRunning() ||
    gameState ===
      GameState.FINISHED
  ) {
    return
  }

  setGameState(
    GameState.RUNNING
  )

  startTimers()

  gameMessageDisplay.textContent =
    result === 0 &&
    currentTime === startingTime
      ? 'Whack the mole before it moves!'
      : 'Game resumed.'

  startPauseButton.textContent =
    'Pause Game'
}

function pauseGame() {
  if (!isRunning()) {
    return
  }

  timers.clearAll()

  squares.forEach(square => {
    square.classList.remove('hit')
  })

  setGameState(
    GameState.PAUSED
  )

  gameMessageDisplay.textContent =
    'Game paused.'

  startPauseButton.textContent =
    'Resume Game'
}

function endGame() {
  if (
    gameState ===
    GameState.FINISHED
  ) {
    return
  }

  timers.clearAll()
  clearTargets()

  setGameState(
    GameState.FINISHED
  )

  gameMessageDisplay.textContent =
    `GAME OVER! Final score: ${result}`

  startPauseButton.textContent =
    'Game Over'

  startPauseButton.disabled =
    true
}

function resetGame() {
  timers.clearAll()

  result = 0
  currentTime = startingTime

  clearTargets()

  scoreDisplay.textContent =
    result

  bestScoreDisplay.textContent =
    bestScore

  timeLeftDisplay.textContent =
    currentTime

  gameMessageDisplay.textContent =
    'Press Start Game to begin.'

  startPauseButton.textContent =
    'Start Game'

  startPauseButton.disabled =
    false

  setGameState(
    GameState.READY
  )
}

function countDown() {
  if (!isRunning()) {
    return
  }

  currentTime =
    getNextTime(
      currentTime
    )

  timeLeftDisplay.textContent =
    currentTime

  if (currentTime === 0) {
    endGame()
  }
}
startPauseButton.addEventListener(
  'click',
  () => {
    if (
      gameState ===
      GameState.FINISHED
    ) {
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

window.addEventListener(
  'blur',
  () => {
    if (isRunning()) {
      pauseGame()
    }
  }
)

resetGame()
