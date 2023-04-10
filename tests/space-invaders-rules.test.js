import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getActiveInvaders,
  getAlienHitIndex,
  getInvaderMovement,
  getNextLaserIndex,
  hasDestroyedAllInvaders,
  hasInvaderHitShooter,
  hasInvaderReachedBottom,
  isFireKey
} from '../games/space-invaders/rules.js'

test('filters removed invaders by original index', () => {
  const invaders = [
    10,
    11,
    12,
    13
  ]

  const removed =
    new Set([1, 3])

  assert.deepEqual(
    getActiveInvaders(
      invaders,
      removed
    ),
    [10, 12]
  )
})

test('moves invaders horizontally when no edge is reached', () => {
  assert.deepEqual(
    getInvaderMovement(
      [5, 6, 7],
      15,
      1,
      true
    ),
    {
      offset: 1,
      direction: 1,
      goingRight: true
    }
  )
})

test('drops and reverses at the right edge', () => {
  assert.deepEqual(
    getInvaderMovement(
      [13, 14],
      15,
      1,
      true
    ),
    {
      offset: 15,
      direction: -1,
      goingRight: false
    }
  )
})

test('drops and reverses at the left edge', () => {
  assert.deepEqual(
    getInvaderMovement(
      [15, 16],
      15,
      -1,
      false
    ),
    {
      offset: 15,
      direction: 1,
      goingRight: true
    }
  )
})

test('removed edge invader does not trigger reversal', () => {
  const invaders = [
    13,
    14
  ]

  const activeInvaders =
    getActiveInvaders(
      invaders,
      new Set([1])
    )

  assert.deepEqual(
    getInvaderMovement(
      activeInvaders,
      15,
      1,
      true
    ),
    {
      offset: 1,
      direction: 1,
      goingRight: true
    }
  )
})

test('detects invader reaching bottom of board', () => {
  assert.equal(
    hasInvaderReachedBottom(
      [210, 224, 225],
      225
    ),
    true
  )

  assert.equal(
    hasInvaderReachedBottom(
      [210, 224],
      225
    ),
    false
  )
})

test('detects invader collision with shooter', () => {
  assert.equal(
    hasInvaderHitShooter(
      [180, 195, 202],
      202
    ),
    true
  )

  assert.equal(
    hasInvaderHitShooter(
      [180, 195, 201],
      202
    ),
    false
  )
})

test('recognizes Space Invaders firing keys', () => {
  assert.equal(
    isFireKey('ArrowUp'),
    true
  )

  assert.equal(
    isFireKey(' '),
    true
  )

  assert.equal(
    isFireKey('Spacebar'),
    true
  )
})

test('rejects non-firing keys', () => {
  assert.equal(
    isFireKey('ArrowLeft'),
    false
  )

  assert.equal(
    isFireKey('Enter'),
    false
  )
})

test('moves laser upward by one board row', () => {
  assert.equal(
    getNextLaserIndex(
      202,
      15
    ),
    187
  )

  assert.equal(
    getNextLaserIndex(
      15,
      15
    ),
    0
  )
})

test('stops laser when its next step leaves the board', () => {
  assert.equal(
    getNextLaserIndex(
      5,
      15
    ),
    null
  )
})

test('identifies only active invaders at laser position', () => {
  const invaders = [
    10,
    11,
    12
  ]

  assert.equal(
    getAlienHitIndex(
      invaders,
      new Set(),
      12
    ),
    2
  )

  assert.equal(
    getAlienHitIndex(
      invaders,
      new Set([2]),
      12
    ),
    null
  )

  assert.equal(
    getAlienHitIndex(
      invaders,
      new Set(),
      20
    ),
    null
  )
})

test('detects when all invaders have been destroyed', () => {
  assert.equal(
    hasDestroyedAllInvaders(
      10,
      10
    ),
    true
  )

  assert.equal(
    hasDestroyedAllInvaders(
      9,
      10
    ),
    false
  )
})
