import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getHitResult,
  getNextTime,
  getRandomTargetIndex
} from '../games/whac-a-mole/rules.js'

test('maps random values to target indexes', () => {
  assert.equal(
    getRandomTargetIndex(
      9,
      0
    ),
    0
  )

  assert.equal(
    getRandomTargetIndex(
      9,
      0.5
    ),
    4
  )

  assert.equal(
    getRandomTargetIndex(
      9,
      0.999
    ),
    8
  )
})

test('valid hit increments score and creates new best', () => {
  assert.deepEqual(
    getHitResult(
      true,
      '4',
      '4',
      5,
      5
    ),
    {
      score: 6,
      bestScore: 6,
      isNewBest: true
    }
  )
})

test('valid hit preserves a higher existing best score', () => {
  assert.deepEqual(
    getHitResult(
      true,
      '4',
      '4',
      5,
      10
    ),
    {
      score: 6,
      bestScore: 10,
      isNewBest: false
    }
  )
})

test('wrong target does not count as a hit', () => {
  assert.equal(
    getHitResult(
      true,
      '3',
      '4',
      5,
      10
    ),
    null
  )
})

test('hit does not count while game is not running', () => {
  assert.equal(
    getHitResult(
      false,
      '4',
      '4',
      5,
      10
    ),
    null
  )
})

test('countdown decreases by one', () => {
  assert.equal(
    getNextTime(60),
    59
  )

  assert.equal(
    getNextTime(1),
    0
  )
})

test('countdown never becomes negative', () => {
  assert.equal(
    getNextTime(0),
    0
  )

  assert.equal(
    getNextTime(-1),
    0
  )
})
