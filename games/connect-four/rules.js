export const ROWS = 6
export const COLUMNS = 7
export const CELL_COUNT = ROWS * COLUMNS

export function createBoard() {
  return Array(CELL_COUNT).fill(0)
}

export function getOpenIndex(
  board,
  column
) {
  if (
    column < 0 ||
    column >= COLUMNS
  ) {
    return null
  }

  for (
    let row = ROWS - 1;
    row >= 0;
    row--
  ) {
    const index =
      row * COLUMNS + column

    if (board[index] === 0) {
      return index
    }
  }

  return null
}

function toRowColumn(index) {
  return {
    row: Math.floor(index / COLUMNS),
    column: index % COLUMNS
  }
}

function isInside(row, column) {
  return (
    row >= 0 &&
    row < ROWS &&
    column >= 0 &&
    column < COLUMNS
  )
}

function indexFor(row, column) {
  return row * COLUMNS + column
}

export function getWinningLine(
  board,
  lastIndex,
  player
) {
  const origin =
    toRowColumn(lastIndex)

  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
  ]

  for (
    const [rowStep, columnStep]
    of directions
  ) {
    const line = [lastIndex]

    for (
      const sign of [-1, 1]
    ) {
      let row =
        origin.row +
        rowStep * sign

      let column =
        origin.column +
        columnStep * sign

      while (
        isInside(row, column)
      ) {
        const index =
          indexFor(row, column)

        if (
          board[index] !== player
        ) {
          break
        }

        line.push(index)

        row += rowStep * sign
        column += columnStep * sign
      }
    }

    if (line.length >= 4) {
      return line.sort(
        (a, b) => a - b
      )
    }
  }

  return null
}

export function isBoardFull(board) {
  return board.every(
    cell => cell !== 0
  )
}
