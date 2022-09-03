const squares = document.querySelectorAll('.square')
const timeLeft = document.querySelector('#time-left')
const score = document.querySelector('#score')

const gameStatusDisplay =
  document.querySelector('#game-status')

const gameMessageDisplay =
  document.querySelector('#game-message')

const startPauseButton =
  document.querySelector('#start-pause-button')

const newGameButton =
  document.querySelector('#new-game-button')

const startingTime = 60

let result = 0
let hitPosition = null
let currentTime = startingTime

let moleTimerId = null
let countDownTimerId = null

let isRunning = false
let gameFinished = false

function randomSquare() {
  squares.forEach(square => {
    square.classList.remove('mole')
  })

  const randomSquare =
    squares[Math.floor(Math.random() * squares.length)]

  randomSquare.classList.add('mole')

  hitPosition = randomSquare.id
}

function registerHit(square) {
  if (
    !isRunning ||
    gameFinished ||
    square.id !== hitPosition
  ) {
    return
  }

  result++

  score.textContent = result

  gameMessageDisplay.textContent =
    'Nice hit!'

  hitPosition = null

  square.classList.remove('mole')
  square.classList.add('hit')

  setTimeout(() => {
    square.classList.remove('hit')
  }, 150)
}

squares.forEach(square => {
  square.addEventListener(
    'click',
    () => registerHit(square)
  )
})

function startTimers() {
  moleTimerId = setInterval(
    randomSquare,
    500
  )

  countDownTimerId = setInterval(
    countDown,
    1000
  )
}

function stopTimers() {
  clearInterval(moleTimerId)
  clearInterval(countDownTimerId)

  moleTimerId = null
  countDownTimerId = null
}

function startGame() {
  if (
    isRunning ||
    gameFinished
  ) {
    return
  }

  isRunning = true

  startTimers()

  gameStatusDisplay.textContent =
    'Running'

  gameMessageDisplay.textContent =
    result === 0 && currentTime === startingTime
      ? 'Whack the mole before it moves!'
      : 'Game resumed.'

  startPauseButton.textContent =
    'Pause Game'
}

function pauseGame() {
  if (
    !isRunning ||
    gameFinished
  ) {
    return
  }

  isRunning = false

  stopTimers()

  gameStatusDisplay.textContent =
    'Paused'

  gameMessageDisplay.textContent =
    'Game paused.'

  startPauseButton.textContent =
    'Resume Game'
}

function endGame() {
  if (gameFinished) {
    return
  }

  gameFinished = true
  isRunning = false

  document.body.classList.add(
    'game-over'
  )

  stopTimers()

  squares.forEach(square => {
    square.classList.remove(
      'mole',
      'hit'
    )
  })

  hitPosition = null

  gameStatusDisplay.textContent =
    'Game Over'

  gameMessageDisplay.textContent =
    `GAME OVER! Final score: ${result}`

  startPauseButton.textContent =
    'Game Over'

  startPauseButton.disabled = true
}

function resetGame() {
  stopTimers()

  isRunning = false
  gameFinished = false

  result = 0
  currentTime = startingTime
  hitPosition = null

  document.body.classList.remove(
    'game-over'
  )

  squares.forEach(square => {
    square.classList.remove(
      'mole',
      'hit'
    )
  })

  score.textContent = result

  timeLeft.textContent =
    currentTime

  gameStatusDisplay.textContent =
    'Ready'

  gameMessageDisplay.textContent =
    'Press Start Game to begin.'

  startPauseButton.textContent =
    'Start Game'

  startPauseButton.disabled = false
}

function countDown() {
  if (!isRunning) {
    return
  }

  currentTime--

  timeLeft.textContent =
    currentTime

  if (currentTime <= 0) {
    currentTime = 0

    timeLeft.textContent = currentTime

    endGame()
  }
}

startPauseButton.addEventListener(
  'click',
  () => {
    if (gameFinished) {
      return
    }

    if (isRunning) {
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

resetGame()
