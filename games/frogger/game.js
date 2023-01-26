import {
  GameState
} from '../../shared/js/game-state.js'

import {
  createTimerRegistry
} from '../../shared/js/timers.js'

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
  const arrowKeys = [
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown'
  ]

  if (
    !isRunning() ||
    !arrowKeys.includes(key)
  ) {
    return
  }

  squares[currentIndex]
    .classList.remove('frog')

  switch (key) {
    case 'ArrowLeft':
      if (
        currentIndex % width !== 0
      ) {
        currentIndex -= 1
      }
      break

    case 'ArrowRight':
      if (
        currentIndex % width <
        width - 1
      ) {
        currentIndex += 1
      }
      break

    case 'ArrowUp':
      if (
        currentIndex - width >= 0
      ) {
        currentIndex -= width
      }
      break

    case 'ArrowDown':
      if (
        currentIndex + width <
        width * width
      ) {
        currentIndex += width
      }
      break
  }

  squares[currentIndex]
    .classList.add('frog')
}

function handleFrogKey(event) {
  const arrowKeys = [
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown'
  ]

  if (
    !isRunning() ||
    !arrowKeys.includes(event.key)
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
  const currentIndex =
    cycle.findIndex(className =>
      element.classList.contains(
        className
      )
    )

  if (currentIndex < 0) {
    return
  }

  const nextIndex =
    (
      currentIndex +
      direction +
      cycle.length
    ) % cycle.length

  element.classList.replace(
    cycle[currentIndex],
    cycle[nextIndex]
  )
}

function rideLog(offset) {
  const oldIndex = currentIndex
  const nextIndex =
    currentIndex + offset

  const oldRow =
    Math.floor(oldIndex / width)

  const nextRow =
    Math.floor(nextIndex / width)

  squares[oldIndex]
    .classList.remove('frog')

  if (
    nextIndex < 0 ||
    nextIndex >= squares.length ||
    oldRow !== nextRow
  ) {
    finishGame(
      'You lose!',
      false
    )

    return
  }

  currentIndex = nextIndex

  squares[currentIndex]
    .classList.add('frog')
}

function autoMoveElements() {
  const currentRow =
    Math.floor(
      currentIndex / width
    )

  const ridingLeftLog =
    currentRow === 2 &&
    (
      squares[currentIndex]
        .classList.contains('l1') ||
      squares[currentIndex]
        .classList.contains('l2') ||
      squares[currentIndex]
        .classList.contains('l3')
    )

  const ridingRightLog =
    currentRow === 3 &&
    (
      squares[currentIndex]
        .classList.contains('l1') ||
      squares[currentIndex]
        .classList.contains('l2') ||
      squares[currentIndex]
        .classList.contains('l3')
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

  if (ridingLeftLog) {
    rideLog(-1)
  } else if (ridingRightLog) {
    rideLog(1)
  }
}

function lose() {
  if (
    squares[currentIndex]
      .classList.contains('c1') ||
    squares[currentIndex]
      .classList.contains('l4') ||
    squares[currentIndex]
      .classList.contains('l5') ||
    currentTime <= 0
  ) {
    finishGame(
      'You lose!',
      false,
      true
    )
  }
}

function win() {
  if (
    squares[currentIndex]
      .classList.contains(
        'ending-block'
      )
  ) {
    finishGame(
      'You Win!',
      true
    )
  }
}

function checkOutcomes() {
  lose()

  if (
    gameState !==
    GameState.FINISHED
  ) {
    win()
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
