import test from 'node:test'
import assert from 'node:assert/strict'

import {
  COLUMNS,
  createBoard,
  getWinningLine
} from '../games/connect-four/rules.js'

test('detects horizontal connect four', () => {
  const board = createBoard()

  ;[35, 36, 37, 38].forEach(
    index => {
      board[index] = 1
    }
  )

  const line =
    getWinningLine(
      board,
      38,
      1
    )

  assert.equal(
    line.length >= 4,
    true
  )
})

test('detects vertical connect four', () => {
  const board = createBoard()

  ;[14, 21, 28, 35].forEach(
    index => {
      board[index] = 2
    }
  )

  const line =
    getWinningLine(
      board,
      14,
      2
    )

  assert.equal(
    line.length >= 4,
    true
  )
})

test('detects diagonal connect four', () => {
  const board = createBoard()

  const indexes = [
    14,
    22,
    30,
    38
  ]

  indexes.forEach(index => {
    board[index] = 1
  })

  const line =
    getWinningLine(
      board,
      38,
      1
    )

  assert.equal(
    line.length >= 4,
    true
  )
})

test('returns null when no connect four exists', () => {
  const board = createBoard()

  board[
    5 * COLUMNS
  ] = 1

  assert.equal(
    getWinningLine(
      board,
      5 * COLUMNS,
      1
    ),
    null
  )
})
