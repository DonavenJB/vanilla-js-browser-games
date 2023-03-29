import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getCardValue,
  getRoundOutcome,
  getSessionOutcome
} from '../games/card-game/rules.js'

test('converts numbered cards to numeric values', () => {
  assert.equal(
    getCardValue('2'),
    2
  )

  assert.equal(
    getCardValue('10'),
    10
  )
})

test('converts face cards to ranked values', () => {
  assert.equal(
    getCardValue('JACK'),
    11
  )

  assert.equal(
    getCardValue('QUEEN'),
    12
  )

  assert.equal(
    getCardValue('KING'),
    13
  )

  assert.equal(
    getCardValue('ACE'),
    14
  )
})

test('player one wins a higher ranked round', () => {
  assert.equal(
    getRoundOutcome(
      '10',
      '7'
    ),
    'player1'
  )
})

test('player two wins a higher ranked round', () => {
  assert.equal(
    getRoundOutcome(
      'QUEEN',
      'KING'
    ),
    'player2'
  )
})

test('ace ranks above king', () => {
  assert.equal(
    getRoundOutcome(
      'ACE',
      'KING'
    ),
    'player1'
  )
})

test('equal ranks produce war', () => {
  assert.equal(
    getRoundOutcome(
      '8',
      '8'
    ),
    'war'
  )

  assert.equal(
    getRoundOutcome(
      'ACE',
      'ACE'
    ),
    'war'
  )
})

test('detects player one session win', () => {
  assert.equal(
    getSessionOutcome(
      15,
      12
    ),
    'player1'
  )
})

test('detects player two session win or tie', () => {
  assert.equal(
    getSessionOutcome(
      9,
      14
    ),
    'player2'
  )

  assert.equal(
    getSessionOutcome(
      11,
      11
    ),
    'tie'
  )
})
