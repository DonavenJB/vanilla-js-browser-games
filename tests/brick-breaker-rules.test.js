import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getBlockBounce,
  getBoardBounce,
  getPaddleBounce,
  isColliding
} from '../games/brick-breaker/rules.js'

test('detects overlapping rectangles', () => {
  assert.equal(
    isColliding(
      [100, 100],
      20,
      [110, 110],
      100,
      20
    ),
    true
  )
})

test('counts touching edges as a collision', () => {
  assert.equal(
    isColliding(
      [80, 100],
      20,
      [100, 100],
      100,
      20
    ),
    true
  )
})

test('rejects separated rectangles', () => {
  assert.equal(
    isColliding(
      [79, 100],
      20,
      [100, 100],
      100,
      20
    ),
    false
  )
})

test('block side collision reverses horizontal direction', () => {
  assert.deepEqual(
    getBlockBounce(
      [90, 100],
      20,
      [100, 100],
      100,
      20,
      2,
      -2
    ),
    {
      xDirection: -2,
      yDirection: -2
    }
  )
})

test('block top collision reverses vertical direction', () => {
  assert.deepEqual(
    getBlockBounce(
      [140, 90],
      20,
      [100, 100],
      100,
      20,
      2,
      2
    ),
    {
      xDirection: 2,
      yDirection: -2
    }
  )
})

test('left wall clamps ball and sends it right', () => {
  assert.deepEqual(
    getBoardBounce(
      [-2, 50],
      20,
      560,
      300,
      -2,
      2
    ),
    {
      position: [0, 50],
      xDirection: 2,
      yDirection: 2
    }
  )
})

test('right wall clamps ball and sends it left', () => {
  assert.deepEqual(
    getBoardBounce(
      [542, 50],
      20,
      560,
      300,
      2,
      2
    ),
    {
      position: [540, 50],
      xDirection: -2,
      yDirection: 2
    }
  )
})

test('ceiling clamps ball and sends it downward', () => {
  assert.deepEqual(
    getBoardBounce(
      [100, 282],
      20,
      560,
      300,
      2,
      2
    ),
    {
      position: [100, 280],
      xDirection: 2,
      yDirection: -2
    }
  )
})

test('board bounce does not mutate input position', () => {
  const position =
    [-2, 282]

  getBoardBounce(
    position,
    20,
    560,
    300,
    -2,
    2
  )

  assert.deepEqual(
    position,
    [-2, 282]
  )
})

test('left side of paddle sends ball left', () => {
  assert.deepEqual(
    getPaddleBounce(
      [230, 25],
      20,
      [230, 10],
      100,
      20,
      2,
      -2
    ),
    {
      position: [230, 30],
      xDirection: -2,
      yDirection: 2
    }
  )
})

test('right side of paddle sends ball right', () => {
  assert.deepEqual(
    getPaddleBounce(
      [320, 25],
      20,
      [230, 10],
      100,
      20,
      -2,
      -2
    ),
    {
      position: [320, 30],
      xDirection: 2,
      yDirection: 2
    }
  )
})

test('center paddle hit preserves horizontal direction', () => {
  assert.deepEqual(
    getPaddleBounce(
      [270, 25],
      20,
      [230, 10],
      100,
      20,
      -2,
      -2
    ),
    {
      position: [270, 30],
      xDirection: -2,
      yDirection: 2
    }
  )
})

test('paddle does not bounce a ball moving upward', () => {
  assert.equal(
    getPaddleBounce(
      [270, 25],
      20,
      [230, 10],
      100,
      20,
      -2,
      2
    ),
    null
  )
})
