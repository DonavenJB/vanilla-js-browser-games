const timeLeftDisplay = document.querySelector('#time-left')
const resultDisplay = document.querySelector('#result')
const startPauseButton = document.querySelector('#start-pause-button')
const resetSessionButton = document.querySelector('#reset-session-button')
const winsDisplay = document.querySelector('#wins')
const lossesDisplay = document.querySelector('#losses')
const gamesPlayedDisplay = document.querySelector('#games-played')
const gameStatusDisplay = document.querySelector('#game-status')
const squares = document.querySelectorAll('.grid div')
const logsLeft = document.querySelectorAll('.log-left')
const logsRight = document.querySelectorAll('.log-right')
const carsLeft = document.querySelectorAll('.car-left')
const carsRight = document.querySelectorAll('.car-right')
const initialSquareClasses = Array.from(squares, square => square.className)

const startingIndex = Array.from(squares).findIndex(square => square.classList.contains('starting-block'))
let currentIndex = startingIndex
const width = 9
let timerId
let outcomeTimerId
let currentTime = 20
let gameOver = false
let wins = 0
let losses = 0
let gamesPlayed = 0

function moveFrog(e) {
    const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

    if (!timerId || gameOver || !arrowKeys.includes(e.key)) {
        return
    }

    e.preventDefault()

    squares[currentIndex].classList.remove('frog')

    switch(e.key) {
        case 'ArrowLeft' :
             if (currentIndex % width !== 0) currentIndex -= 1
            break
        case 'ArrowRight' :
            if (currentIndex % width < width - 1) currentIndex += 1
            break
        case 'ArrowUp' :
            if (currentIndex - width >=0 ) currentIndex -= width
            break
        case 'ArrowDown' :
            if (currentIndex + width < width * width) currentIndex += width
            break
    }
    squares[currentIndex].classList.add('frog')
}

function autoMoveElements() {
    const currentRow = Math.floor(currentIndex / width)

    const ridingLeftLog =
        currentRow === 2 &&
        (
            squares[currentIndex].classList.contains('l1') ||
            squares[currentIndex].classList.contains('l2') ||
            squares[currentIndex].classList.contains('l3')
        )

    const ridingRightLog =
        currentRow === 3 &&
        (
            squares[currentIndex].classList.contains('l1') ||
            squares[currentIndex].classList.contains('l2') ||
            squares[currentIndex].classList.contains('l3')
        )

    currentTime--
    timeLeftDisplay.textContent = currentTime

    logsLeft.forEach(logLeft => moveLogLeft(logLeft))
    logsRight.forEach(logRight => moveLogRight(logRight))
    carsLeft.forEach(carLeft => moveCarLeft(carLeft))
    carsRight.forEach(carRight => moveCarRight(carRight))

    if (ridingLeftLog) {
        rideLog(-1)
    } else if (ridingRightLog) {
        rideLog(1)
    }
}

function rideLog(offset) {
    const oldIndex = currentIndex
    const nextIndex = currentIndex + offset

    const oldRow = Math.floor(oldIndex / width)
    const nextRow = Math.floor(nextIndex / width)

    squares[oldIndex].classList.remove('frog')

    if (
        nextIndex < 0 ||
        nextIndex >= squares.length ||
        oldRow !== nextRow
    ) {
        finishGame('You lose!', false)
        return
    }

    currentIndex = nextIndex
    squares[currentIndex].classList.add('frog')
}

function checkOutComes() {
    lose()

    if (!gameOver) {
        win()
    }
}

function moveLogLeft(logLeft) {
    switch(true) {
        case logLeft.classList.contains('l1') :
            logLeft.classList.remove('l1')
            logLeft.classList.add('l2')
            break
        case logLeft.classList.contains('l2') :
            logLeft.classList.remove('l2')
            logLeft.classList.add('l3')
            break
        case logLeft.classList.contains('l3') :
            logLeft.classList.remove('l3')
            logLeft.classList.add('l4')
            break
        case logLeft.classList.contains('l4') :
            logLeft.classList.remove('l4')
            logLeft.classList.add('l5')
            break
        case logLeft.classList.contains('l5') :
            logLeft.classList.remove('l5')
            logLeft.classList.add('l1')
            break
    }
}

function moveLogRight(logRight) {
    switch(true) {
        case logRight.classList.contains('l1') :
            logRight.classList.remove('l1')
            logRight.classList.add('l5')
            break
        case logRight.classList.contains('l2') :
            logRight.classList.remove('l2')
            logRight.classList.add('l1')
            break
        case logRight.classList.contains('l3') :
            logRight.classList.remove('l3')
            logRight.classList.add('l2')
            break
        case logRight.classList.contains('l4') :
            logRight.classList.remove('l4')
            logRight.classList.add('l3')
            break
        case logRight.classList.contains('l5') :
            logRight.classList.remove('l5')
            logRight.classList.add('l4')
            break
    }
}

function moveCarLeft(carLeft) {
    switch(true) {
        case carLeft.classList.contains('c1') :
            carLeft.classList.remove('c1')
            carLeft.classList.add('c2')
            break
        case carLeft.classList.contains('c2') :
            carLeft.classList.remove('c2')
            carLeft.classList.add('c3')
            break
        case carLeft.classList.contains('c3') :
            carLeft.classList.remove('c3')
            carLeft.classList.add('c1')
            break
    }
}

function moveCarRight(carRight) {
    switch(true) {
        case carRight.classList.contains('c1') :
            carRight.classList.remove('c1')
            carRight.classList.add('c3')
            break
        case carRight.classList.contains('c2') :
            carRight.classList.remove('c2')
            carRight.classList.add('c1')
            break
        case carRight.classList.contains('c3') :
            carRight.classList.remove('c3')
            carRight.classList.add('c2')
            break
    }
}

function resetGame() {
    clearInterval(timerId)
    clearInterval(outcomeTimerId)

    timerId = null
    outcomeTimerId = null

    document.removeEventListener('keyup', moveFrog)

    initialSquareClasses.forEach((className, index) => {
        squares[index].className = className
    })

    currentIndex = startingIndex
    currentTime = 20
    gameOver = false

    document.body.classList.remove('round-won', 'round-lost')

    timeLeftDisplay.textContent = currentTime
    resultDisplay.textContent = ''
    startPauseButton.textContent = 'Start Game'
    gameStatusDisplay.textContent = 'Ready'
}

function finishGame(message, didWin, removeFrog = false) {
    if (gameOver) {
        return
    }

    clearInterval(timerId)
    clearInterval(outcomeTimerId)

    timerId = null
    outcomeTimerId = null
    gameOver = true

    document.removeEventListener('keyup', moveFrog)

    if (removeFrog) {
        squares[currentIndex].classList.remove('frog')
    }

    gamesPlayed++

    if (didWin) {
        wins++
    } else {
        losses++
    }

    winsDisplay.textContent = wins
    lossesDisplay.textContent = losses
    gamesPlayedDisplay.textContent = gamesPlayed

    document.body.classList.remove('round-won', 'round-lost')
    document.body.classList.add(didWin ? 'round-won' : 'round-lost')

    resultDisplay.textContent = message
    gameStatusDisplay.textContent = didWin ? 'Won' : 'Lost'
    startPauseButton.textContent = 'Play Again'
}

function lose() {
    if (
        squares[currentIndex].classList.contains('c1') ||
        squares[currentIndex].classList.contains('l4') ||
        squares[currentIndex].classList.contains('l5') ||
        currentTime <= 0
    ) {
        finishGame('You lose!', false, true)
    }
}

function win() {
    if (squares[currentIndex].classList.contains('ending-block')) {
        finishGame('You Win!', true)
    }
}

function startGame() {
    timerId = setInterval(autoMoveElements, 1000)
    outcomeTimerId = setInterval(checkOutComes, 50)

    document.addEventListener('keyup', moveFrog)

    startPauseButton.textContent = 'Pause Game'
    gameStatusDisplay.textContent = 'Running'
}

function pauseGame() {
    clearInterval(timerId)
    clearInterval(outcomeTimerId)

    timerId = null
    outcomeTimerId = null

    document.removeEventListener('keyup', moveFrog)

    startPauseButton.textContent = 'Resume Game'
    gameStatusDisplay.textContent = 'Paused'
}

startPauseButton.addEventListener('click', () => {
    if (gameOver) {
        resetGame()
        startGame()
        return
    }

    if (timerId) {
        pauseGame()
    } else {
        startGame()
    }
})
resetSessionButton.addEventListener('click', () => {
    resetGame()

    wins = 0
    losses = 0
    gamesPlayed = 0

    winsDisplay.textContent = wins
    lossesDisplay.textContent = losses
    gamesPlayedDisplay.textContent = gamesPlayed

    resultDisplay.textContent = ''
    gameStatusDisplay.textContent = 'Ready'
})

document.querySelectorAll('.move-button').forEach(button => {
    button.addEventListener('click', () => {
        if (!timerId || gameOver) {
            return
        }

        document.dispatchEvent(
            new KeyboardEvent('keyup', {
                key: button.dataset.key
            })
        )
    })
})
console.log('working')
