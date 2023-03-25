import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getFrogOutcome,
  getLogRideOffset,
  getLogRideTarget,
  getNextCycleClass,
  getNextFrogIndex,
  isMovementKey
} from '../games/frogger/rules.js'

test('recognizes Frogger movement keys', () => {
  assert.equal(
    isMovementKey('ArrowLeft'),
    true
  )

  assert.equal(
    isMovementKey('ArrowRight'),
    true
  )

  assert.equal(
    isMovementKey('ArrowUp'),
    true
  )

  assert.equal(
    isMovementKey('ArrowDown'),
    true
  )

  assert.equal(
    isMovementKey('Enter'),
    false
  )
})

test('moves frog horizontally without wrapping rows', () => {
  assert.equal(
    getNextFrogIndex(
      40,
      'ArrowLeft',
      9,
      81
    ),
    39
  )

  assert.equal(
    getNextFrogIndex(
      40,
      'ArrowRight',
      9,
      81
    ),
    41
  )

  assert.equal(
    getNextFrogIndex(
      36,
      'ArrowLeft',
      9,
      81
    ),
    36
  )

  assert.equal(
    getNextFrogIndex(
      44,
      'ArrowRight',
      9,
      81
    ),
    44
  )
})

test('moves frog vertically within the board', () => {
  assert.equal(
    getNextFrogIndex(
      40,
      'ArrowUp',
      9,
      81
    ),
    31
  )

  assert.equal(
    getNextFrogIndex(
      40,
      'ArrowDown',
      9,
      81
    ),
    49
  )

  assert.equal(
    getNextFrogIndex(
      4,
      'ArrowUp',
      9,
      81
    ),
    4
  )

  assert.equal(
    getNextFrogIndex(
      76,
      'ArrowDown',
      9,
      81
    ),
    76
  )
})

test('advances and wraps a forward movement cycle', () => {
  const cycle = [
    'l1',
    'l2',
    'l3',
    'l4',
    'l5'
  ]

  assert.equal(
    getNextCycleClass(
      'l2',
      cycle,
      1
    ),
    'l3'
  )

  assert.equal(
    getNextCycleClass(
      'l5',
      cycle,
      1
    ),
    'l1'
  )
})

test('advances backward and rejects unknown cycle class', () => {
  const cycle = [
    'c1',
    'c2',
    'c3'
  ]

  assert.equal(
    getNextCycleClass(
      'c1',
      cycle,
      -1
    ),
    'c3'
  )

  assert.equal(
    getNextCycleClass(
      'unknown',
      cycle,
      1
    ),
    null
  )
})

test('detects left and right log riding direction', () => {
  assert.equal(
    getLogRideOffset(
      20,
      9,
      ['log-left', 'l2', 'frog']
    ),
    -1
  )

  assert.equal(
    getLogRideOffset(
      29,
      9,
      ['log-right', 'l3', 'frog']
    ),
    1
  )
})

test('does not move frog with an unsafe or unrelated log class', () => {
  assert.equal(
    getLogRideOffset(
      20,
      9,
      ['log-left', 'l4', 'frog']
    ),
    0
  )

  assert.equal(
    getLogRideOffset(
      20,
      9,
      ['frog']
    ),
    0
  )
})

test('returns valid log ride destination', () => {
  assert.equal(
    getLogRideTarget(
      20,
      -1,
      9,
      81
    ),
    19
  )

  assert.equal(
    getLogRideTarget(
      29,
      1,
      9,
      81
    ),
    30
  )
})

test('rejects a log ride that leaves its row or board', () => {
  assert.equal(
    getLogRideTarget(
      18,
      -1,
      9,
      81
    ),
    null
  )

  assert.equal(
    getLogRideTarget(
      80,
      1,
      9,
      81
    ),
    null
  )
})

test('detects car and water hazards', () => {
  assert.equal(
    getFrogOutcome(
      ['c1', 'frog'],
      10
    ),
    'loss'
  )

  assert.equal(
    getFrogOutcome(
      ['l4', 'frog'],
      10
    ),
    'loss'
  )

  assert.equal(
    getFrogOutcome(
      ['l5', 'frog'],
      10
    ),
    'loss'
  )
})

test('detects timeout and finish square', () => {
  assert.equal(
    getFrogOutcome(
      ['frog'],
      0
    ),
    'loss'
  )

  assert.equal(
    getFrogOutcome(
      ['ending-block', 'frog'],
      8
    ),
    'win'
  )
})

test('returns no outcome on a safe square', () => {
  assert.equal(
    getFrogOutcome(
      ['l2', 'frog'],
      8
    ),
    null
  )
})
