import {
  CELL_COUNT,
  COLUMNS,
  createBoard,
  getOpenIndex,
  getWinningLine,
  isBoardFull
} from './rules.js'

const boardDisplay =
  document.querySelector('#board')

const resultDisplay =
  document.querySelector('#result')

const gameMessageDisplay =
  document.querySelector('#game-message')

const currentPlayerDisplay =
  document.querySelector('#current-player')

const newGameButton =
  document.querySelector('#new-game-button')

const playerOneWinsDisplay =
  document.querySelector('#player-one-wins')

const playerTwoWinsDisplay =
  document.querySelector('#player-two-wins')

const drawsDisplay =
  document.querySelector('#draws')

let board = createBoard()
let currentPlayer = 1
let gameOver = false

let playerOneWins = 0
let playerTwoWins = 0
let draws = 0

const cells = []

function createBoardCells() {
  for (
    let index = 0;
    index < CELL_COUNT;
    index++
  ) {
    const cell =
      document.createElement('div')

    const column =
      index % COLUMNS

    cell.setAttribute(
      'role',
      'button'
    )

    cell.setAttribute(
      'tabindex',
      '0'
    )

    cell.setAttribute(
      'aria-label',
      `Drop piece in column ${column + 1}`
    )

    cell.addEventListener(
      'click',
      () => {
        dropPiece(column)
      }
    )

    cell.addEventListener(
      'keydown',
      event => {
        if (
          event.key !== 'Enter' &&
          event.key !== ' '
        ) {
          return
        }

        event.preventDefault()
        dropPiece(column)
      }
    )

    boardDisplay.appendChild(cell)
    cells.push(cell)
  }
}

function updateSessionScores() {
  playerOneWinsDisplay.textContent =
    playerOneWins

  playerTwoWinsDisplay.textContent =
    playerTwoWins

  drawsDisplay.textContent =
    draws
}

function updateTurnDisplay() {
  currentPlayerDisplay.textContent =
    currentPlayer

  currentPlayerDisplay.classList.toggle(
    'player-one-turn',
    currentPlayer === 1
  )

  currentPlayerDisplay.classList.toggle(
    'player-two-turn',
    currentPlayer === 2
  )

  gameMessageDisplay.textContent =
    `Player ${currentPlayer}'s turn.`
}

function clearOutcomeStyles() {
  document.body.classList.remove(
    'player-one-won',
    'player-two-won',
    'game-draw'
  )
}

function endWin(
  player,
  winningLine
) {
  gameOver = true

  if (player === 1) {
    playerOneWins++
  } else {
    playerTwoWins++
  }

  updateSessionScores()

  winningLine.forEach(index => {
    cells[index].classList.add(
      'winning-piece'
    )
  })

  document.body.classList.add(
    player === 1
      ? 'player-one-won'
      : 'player-two-won'
  )

  resultDisplay.textContent =
    `Player ${player} Wins!`

  gameMessageDisplay.textContent =
    `Player ${player} connected four.`
}

function endDraw() {
  gameOver = true
  draws++

  updateSessionScores()

  document.body.classList.add(
    'game-draw'
  )

  resultDisplay.textContent =
    "It's a Draw!"

  gameMessageDisplay.textContent =
    'Board is full with no winner.'
}

function resetGame() {
  board = createBoard()
  currentPlayer = 1
  gameOver = false

  clearOutcomeStyles()

  cells.forEach(cell => {
    cell.classList.remove(
      'taken',
      'player-one',
      'player-two',
      'winning-piece'
    )
  })

  resultDisplay.textContent = ''
  updateTurnDisplay()
}

function dropPiece(column) {
  if (gameOver) {
    return
  }

  const targetIndex =
    getOpenIndex(
      board,
      column
    )

  if (targetIndex === null) {
    gameMessageDisplay.textContent =
      `Column ${column + 1} is full.`

    return
  }

  const playedBy =
    currentPlayer

  board[targetIndex] =
    playedBy

  cells[targetIndex].classList.add(
    'taken',
    playedBy === 1
      ? 'player-one'
      : 'player-two'
  )

  const winningLine =
    getWinningLine(
      board,
      targetIndex,
      playedBy
    )

  if (winningLine) {
    endWin(
      playedBy,
      winningLine
    )

    return
  }

  if (isBoardFull(board)) {
    endDraw()
    return
  }

  currentPlayer =
    playedBy === 1
      ? 2
      : 1

  updateTurnDisplay()
}

newGameButton.addEventListener(
  'click',
  resetGame
)

createBoardCells()
updateSessionScores()
updateTurnDisplay()
