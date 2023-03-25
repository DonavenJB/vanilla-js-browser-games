import {
  GameState
} from '../../shared/js/game-state.js'

import {
  createTimerRegistry
} from '../../shared/js/timers.js'

import {
  getFrogOutcome,
  getLogRideOffset,
  getLogRideTarget,
  getNextCycleClass,
  getNextFrogIndex,
  isMovementKey
} from './rules.js'

const timeLeftDisplay =
  document.querySelector('#time-left')

const resultDisplay =
  document.querySelector('#result')

const startPauseButton =
  document.querySelector('#start-pause-button')

const resetSessionButton =
  document.querySelector('#reset-session-button')

const winsDisplay =
  document.querySelector('#wins')

const lossesDisplay =
  document.querySelector('#losses')

const gamesPlayedDisplay =
  document.querySelector('#games-played')

const bestTimeDisplay =
  document.querySelector('#best-time')

const gameStatusDisplay =
  document.querySelector('#game-status')

const squares =
  document.querySelectorAll('.grid div')

const logsLeft =
  document.querySelectorAll('.log-left')

const logsRight =
  document.querySelectorAll('.log-right')

const carsLeft =
  document.querySelectorAll('.car-left')

const carsRight =
  document.querySelectorAll('.car-right')

const initialSquareClasses =
  Array.from(
    squares,
    square => square.className
  )

const startingIndex =
  Array.from(squares)
    .findIndex(square =>
      square.classList.contains(
        'starting-block'
      )
    )

const width = 9
const startingTime = 20

const timers =
  createTimerRegistry()

const logCycle = [
  'l1',
  'l2',
  'l3',
  'l4',
  'l5'
]

const carCycle = [
  'c1',
  'c2',
  'c3'
]

let currentIndex =
  startingIndex

let currentTime =
  startingTime

let gameState =
  GameState.READY

let wins = 0
let losses = 0
let gamesPlayed = 0
let bestTimeRemaining = null

function isRunning() {
  return (
    gameState ===
    GameState.RUNNING
  )
}

function setGameState(state) {
  gameState = state

  const statusByState = {
    [GameState.READY]: 'Ready',
    [GameState.RUNNING]: 'Running',
    [GameState.PAUSED]: 'Paused',
    [GameState.FINISHED]: 'Finished'
  }

  gameStatusDisplay.textContent =
    statusByState[state]
}

function moveFrogByKey(key) {
  if (
    !isRunning() ||
    !isMovementKey(key)
  ) {
    return
  }

  squares[currentIndex]
    .classList.remove('frog')

  currentIndex =
    getNextFrogIndex(
      currentIndex,
      key,
      width,
      squares.length
    )

  squares[currentIndex]
    .classList.add('frog')
}
function handleFrogKey(event) {
  if (
    !isRunning() ||
    !isMovementKey(event.key)
  ) {
    return
  }

  event.preventDefault()
  moveFrogByKey(event.key)
}
function advanceCycle(
  element,
  cycle,
  direction
) {
  const currentClass =
    cycle.find(className =>
      element.classList.contains(
        className
      )
    )

  if (!currentClass) {
    return
  }

  const nextClass =
    getNextCycleClass(
      currentClass,
      cycle,
      direction
    )

  element.classList.replace(
    currentClass,
    nextClass
  )
}
function rideLog(offset) {
  const oldIndex =
    currentIndex

  const nextIndex =
    getLogRideTarget(
      currentIndex,
      offset,
      width,
      squares.length
    )

  squares[oldIndex]
    .classList.remove('frog')

  if (nextIndex === null) {
    finishGame(
      'You lose!',
      false
    )

    return
  }

  currentIndex =
    nextIndex

  squares[currentIndex]
    .classList.add('frog')
}
function autoMoveElements() {
  const rideOffset =
    getLogRideOffset(
      currentIndex,
      width,
      Array.from(
        squares[currentIndex]
          .classList
      )
    )

  currentTime--
  timeLeftDisplay.textContent =
    currentTime

  logsLeft.forEach(element => {
    advanceCycle(
      element,
      logCycle,
      1
    )
  })

  logsRight.forEach(element => {
    advanceCycle(
      element,
      logCycle,
      -1
    )
  })

  carsLeft.forEach(element => {
    advanceCycle(
      element,
      carCycle,
      1
    )
  })

  carsRight.forEach(element => {
    advanceCycle(
      element,
      carCycle,
      -1
    )
  })

  if (rideOffset !== 0) {
    rideLog(rideOffset)
  }
}
function checkOutcomes() {
  const outcome =
    getFrogOutcome(
      Array.from(
        squares[currentIndex]
          .classList
      ),
      currentTime
    )

  if (outcome === 'loss') {
    finishGame(
      'You lose!',
      false,
      true
    )

    return
  }

  if (outcome === 'win') {
    finishGame(
      'You Win!',
      true
    )
  }
}
function restoreBoard() {
  initialSquareClasses.forEach(
    (className, index) => {
      squares[index].className =
        className
    }
  )
}

function resetGame() {
  timers.clearAll()

  document.removeEventListener(
    'keyup',
    handleFrogKey
  )

  restoreBoard()

  currentIndex = startingIndex
  currentTime = startingTime

  document.body.classList.remove(
    'round-won',
    'round-lost'
  )

  timeLeftDisplay.textContent =
    currentTime

  resultDisplay.textContent = ''

  startPauseButton.textContent =
    'Start Game'

  setGameState(
    GameState.READY
  )
}

function finishGame(
  message,
  didWin,
  removeFrog = false
) {
  if (
    gameState ===
    GameState.FINISHED
  ) {
    return
  }

  timers.clearAll()

  document.removeEventListener(
    'keyup',
    handleFrogKey
  )

  if (removeFrog) {
    squares[currentIndex]
      .classList.remove('frog')
  }

  gamesPlayed++

  if (didWin) {
    wins++

    if (
      bestTimeRemaining === null ||
      currentTime >
      bestTimeRemaining
    ) {
      bestTimeRemaining =
        currentTime

      bestTimeDisplay.textContent =
        `${bestTimeRemaining}s`
    }
  } else {
    losses++
  }

  winsDisplay.textContent = wins
  lossesDisplay.textContent = losses
  gamesPlayedDisplay.textContent =
    gamesPlayed

  document.body.classList.remove(
    'round-won',
    'round-lost'
  )

  document.body.classList.add(
    didWin
      ? 'round-won'
      : 'round-lost'
  )

  resultDisplay.textContent =
    message

  setGameState(
    GameState.FINISHED
  )

  gameStatusDisplay.textContent =
    didWin ? 'Won' : 'Lost'

  startPauseButton.textContent =
    'Play Again'
}

function startGame() {
  if (isRunning()) {
    return
  }

  timers.interval(
    autoMoveElements,
    1000
  )

  timers.interval(
    checkOutcomes,
    50
  )

  document.addEventListener(
    'keyup',
    handleFrogKey
  )

  startPauseButton.textContent =
    'Pause Game'

  setGameState(
    GameState.RUNNING
  )
}

function pauseGame() {
  if (!isRunning()) {
    return
  }

  timers.clearAll()

  document.removeEventListener(
    'keyup',
    handleFrogKey
  )

  startPauseButton.textContent =
    'Resume Game'

  setGameState(
    GameState.PAUSED
  )
}

startPauseButton.addEventListener(
  'click',
  () => {
    if (
      gameState ===
      GameState.FINISHED
    ) {
      resetGame()
      startGame()
      return
    }

    if (isRunning()) {
      pauseGame()
    } else {
      startGame()
    }
  }
)

resetSessionButton.addEventListener(
  'click',
  () => {
    resetGame()

    wins = 0
    losses = 0
    gamesPlayed = 0
    bestTimeRemaining = null

    winsDisplay.textContent = wins
    lossesDisplay.textContent = losses
    gamesPlayedDisplay.textContent =
      gamesPlayed

    bestTimeDisplay.textContent =
      '--'
  }
)

document
  .querySelectorAll('.move-button')
  .forEach(button => {
    button.addEventListener(
      'click',
      () => {
        moveFrogByKey(
          button.dataset.key
        )
      }
    )
  })

resetGame()
