const squares = document.querySelectorAll('.square')
const timeLeft = document.querySelector('#time-left')
const score = document.querySelector('#score')
const startPauseButton =
  document.querySelector('#start-pause-button')

let result = 0
let hitPosition = null
let currentTime = 60

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

squares.forEach(square => {
  square.addEventListener('mousedown', () => {
    if (
      !isRunning ||
      gameFinished
    ) {
      return
    }

    if (square.id === hitPosition) {
      result++

      score.textContent = result

      hitPosition = null
    }
  })
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

  startPauseButton.textContent =
    'Resume Game'
}

function endGame() {
  if (gameFinished) {
    return
  }

  gameFinished = true
  isRunning = false

  stopTimers()

  squares.forEach(square => {
    square.classList.remove('mole')
  })

  hitPosition = null

  startPauseButton.textContent =
    'Game Over'

  startPauseButton.disabled = true

  alert(
    'GAME OVER! Your final score is ' +
    result
  )
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
