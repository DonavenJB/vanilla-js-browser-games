import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getActiveInvaders,
  getInvaderMovement,
  hasInvaderHitShooter,
  hasInvaderReachedBottom
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
