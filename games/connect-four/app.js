document.addEventListener('DOMContentLoaded', () => {
  const squares =
    document.querySelectorAll('.grid div')

  const result =
    document.querySelector('#result')

  const gameMessage =
    document.querySelector('#game-message')

  const displayCurrentPlayer =
    document.querySelector('#current-player')

  const newGameButton =
    document.querySelector('#new-game-button')

  const playerOneWinsDisplay =
    document.querySelector('#player-one-wins')

  const playerTwoWinsDisplay =
    document.querySelector('#player-two-wins')

  const drawsDisplay =
    document.querySelector('#draws')

  const width = 7
  const playableSquareCount = 42

  let currentPlayer = 1
  let gameOver = false

  let playerOneWins = 0
  let playerTwoWins = 0
  let draws = 0

  const winningArrays = [
    [0, 1, 2, 3],
    [41, 40, 39, 38],
    [7, 8, 9, 10],
    [34, 33, 32, 31],
    [14, 15, 16, 17],
    [27, 26, 25, 24],
    [21, 22, 23, 24],
    [20, 19, 18, 17],
    [28, 29, 30, 31],
    [13, 12, 11, 10],
    [35, 36, 37, 38],
    [6, 5, 4, 3],
    [0, 7, 14, 21],
    [41, 34, 27, 20],
    [1, 8, 15, 22],
    [40, 33, 26, 19],
    [2, 9, 16, 23],
    [39, 32, 25, 18],
    [3, 10, 17, 24],
    [38, 31, 24, 17],
    [4, 11, 18, 25],
    [37, 30, 23, 16],
    [5, 12, 19, 26],
    [36, 29, 22, 15],
    [6, 13, 20, 27],
    [35, 28, 21, 14],
    [0, 8, 16, 24],
    [41, 33, 25, 17],
    [7, 15, 23, 31],
    [34, 26, 18, 10],
    [14, 22, 30, 38],
    [27, 19, 11, 3],
    [35, 29, 23, 17],
    [6, 12, 18, 24],
    [28, 22, 16, 10],
    [13, 19, 25, 31],
    [21, 15, 9, 3],
    [20, 26, 32, 38],
    [36, 30, 24, 18],
    [5, 11, 17, 23],
    [37, 31, 25, 19],
    [4, 10, 16, 22],
    [2, 10, 18, 26],
    [39, 31, 23, 15],
    [1, 9, 17, 25],
    [40, 32, 24, 16],
    [9, 17, 25, 33],
    [8, 16, 24, 32],
    [11, 17, 23, 29],
    [12, 18, 24, 30],
    [1, 2, 3, 4],
    [5, 4, 3, 2],
    [8, 9, 10, 11],
    [12, 11, 10, 9],
    [15, 16, 17, 18],
    [19, 18, 17, 16],
    [22, 23, 24, 25],
    [26, 25, 24, 23],
    [29, 30, 31, 32],
    [33, 32, 31, 30],
    [36, 37, 38, 39],
    [40, 39, 38, 37],
    [7, 14, 21, 28],
    [8, 15, 22, 29],
    [9, 16, 23, 30],
    [10, 17, 24, 31],
    [11, 18, 25, 32],
    [12, 19, 26, 33],
    [13, 20, 27, 34]
  ]

  function updateSessionScores() {
    playerOneWinsDisplay.textContent =
      playerOneWins

    playerTwoWinsDisplay.textContent =
      playerTwoWins

    drawsDisplay.textContent =
      draws
  }

  function checkBoard() {
    for (
      let i = 0;
      i < winningArrays.length;
      i++
    ) {
      const winningArray =
        winningArrays[i]

      const playerOneWins =
        winningArray.every(index =>
          squares[index]
            .classList.contains(
              'player-one'
            )
        )

      if (playerOneWins) {
        return {
          player: 1,
          winningArray
        }
      }

      const playerTwoWins =
        winningArray.every(index =>
          squares[index]
            .classList.contains(
              'player-two'
            )
        )

      if (playerTwoWins) {
        return {
          player: 2,
          winningArray
        }
      }
    }

    return null
  }

  function isBoardFull() {
    for (
      let i = 0;
      i < playableSquareCount;
      i++
    ) {
      if (
        !squares[i]
          .classList.contains('taken')
      ) {
        return false
      }
    }

    return true
  }

  function endGame(
    player,
    winningArray
  ) {
    gameOver = true

    if (player === 1) {
      playerOneWins++
    } else {
      playerTwoWins++
    }

    updateSessionScores()

    winningArray.forEach(index => {
      squares[index].classList.add(
        'winning-piece'
      )
    })

    document.body.classList.add(
      player === 1
        ? 'player-one-won'
        : 'player-two-won'
    )

    result.textContent =
      `Player ${player} Wins!`

    gameMessage.textContent =
      `Player ${player} connected four.`
  }

  function endDraw() {
    gameOver = true

    draws++

    updateSessionScores()

    document.body.classList.add(
      'game-draw'
    )

    result.textContent =
      "It's a Draw!"

    gameMessage.textContent =
      'Board is full with no winner.'
  }

  function updateTurnDisplay() {
    displayCurrentPlayer.textContent =
      currentPlayer

    displayCurrentPlayer.classList.toggle(
      'player-one-turn',
      currentPlayer === 1
    )

    displayCurrentPlayer.classList.toggle(
      'player-two-turn',
      currentPlayer === 2
    )

    gameMessage.textContent =
      `Player ${currentPlayer}'s turn.`
  }

  function resetGame() {
    currentPlayer = 1
    gameOver = false

    document.body.classList.remove(
      'player-one-won',
      'player-two-won',
      'game-draw'
    )

    for (
      let i = 0;
      i < playableSquareCount;
      i++
    ) {
      squares[i].classList.remove(
        'taken',
        'player-one',
        'player-two',
        'winning-piece'
      )
    }

    for (
      let i = playableSquareCount;
      i < squares.length;
      i++
    ) {
      squares[i].classList.remove(
        'player-one',
        'player-two',
        'winning-piece'
      )

      squares[i].classList.add(
        'taken'
      )
    }

    result.textContent = ''

    updateTurnDisplay()
  }

  function findOpenSquare(column) {
    for (let row = 5; row >= 0; row--) {
      const index =
        row * width + column

      if (
        !squares[index]
          .classList.contains('taken')
      ) {
        return index
      }
    }

    return null
  }

  function dropPiece(column) {
    if (gameOver) {
      return
    }

    const targetIndex =
      findOpenSquare(column)

    if (targetIndex === null) {
      gameMessage.textContent =
        `Column ${column + 1} is full.`

      return
    }

    const targetSquare =
      squares[targetIndex]

    const playedBy =
      currentPlayer

    targetSquare.classList.add(
      'taken'
    )

    targetSquare.classList.add(
      playedBy === 1
        ? 'player-one'
        : 'player-two'
    )

    const winner =
      checkBoard()

    if (winner !== null) {
      endGame(
        winner.player,
        winner.winningArray
      )

      return
    }

    if (isBoardFull()) {
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

  updateSessionScores()
  updateTurnDisplay()

  for (
    let i = 0;
    i < playableSquareCount;
    i++
  ) {
    squares[i].addEventListener(
      'click',
      () => {
        const column =
          i % width

        dropPiece(column)
      }
    )
  }
})
