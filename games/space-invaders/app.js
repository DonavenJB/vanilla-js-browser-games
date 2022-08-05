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
const startingShooterIndex = 202

const initialAlienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

let currentShooterIndex =
  startingShooterIndex

let alienInvaders =
  [...initialAlienInvaders]

let direction = 1
let invadersId = null
let goingRight = true

let aliensRemoved = []
let results = 0

let gameOver = false
let isRunning = false

const activeLaserIds = new Set()

for (let i = 0; i < 225; i++) {
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
      !isRunning ||
      gameOver
  })
}

function draw() {
  for (
    let i = 0;
    i < alienInvaders.length;
    i++
  ) {
    if (
      !aliensRemoved.includes(i) &&
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

function startGame() {
  if (gameOver || isRunning) {
    return
  }

  isRunning = true

  invadersId = setInterval(
    moveInvaders,
    600
  )

  gameStatusDisplay.textContent =
    'Running'

  if (results === 0) {
    gameMessageDisplay.textContent =
      'Destroy all 30 invaders!'
  } else {
    gameMessageDisplay.textContent =
      'Game resumed.'
  }

  startPauseButton.textContent =
    'Pause Game'

  updateControlButtons()
}

function pauseGame() {
  if (!isRunning || gameOver) {
    return
  }

  clearInterval(invadersId)
  invadersId = null

  isRunning = false

  gameStatusDisplay.textContent =
    'Paused'

  gameMessageDisplay.textContent =
    'Game paused.'

  startPauseButton.textContent =
    'Resume Game'

  updateControlButtons()
}

function endGame(message) {
  if (gameOver) {
    return
  }

  gameOver = true
  isRunning = false

  clearInterval(invadersId)
  invadersId = null

  clearActiveLasers()

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
  clearInterval(invadersId)
  invadersId = null

  clearActiveLasers()
  clearBoard()

  currentShooterIndex =
    startingShooterIndex

  alienInvaders =
    [...initialAlienInvaders]

  direction = 1
  goingRight = true

  aliensRemoved = []
  results = 0

  gameOver = false
  isRunning = false

  resultsDisplay.textContent = '0'

  invadersLeftDisplay.textContent =
    initialAlienInvaders.length

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
  if (gameOver || !isRunning) {
    return
  }

  const leftEdge =
    alienInvaders[0] %
      width ===
    0

  const rightEdge =
    alienInvaders[
      alienInvaders.length - 1
    ] %
      width ===
    width - 1

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
  }

  if (leftEdge && !goingRight) {
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

  const invadersReachedBottom =
    alienInvaders.some(
      index =>
        index >= squares.length
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

  activeLaserIds.add(laserId)

  function stopLaser() {
    clearInterval(laserId)

    activeLaserIds.delete(laserId)
  }

  function moveLaser() {
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
          alienInvaders.length -
          aliensRemoved.length

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

newGameButton.addEventListener(
  'click',
  resetGame
)

directionButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (!isRunning || gameOver) {
      return
    }

    document.dispatchEvent(
      new KeyboardEvent(
        'keydown',
        {
          key: button.dataset.key
        }
      )
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

resetGame()
