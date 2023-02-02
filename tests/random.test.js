import test from 'node:test'
import assert from 'node:assert/strict'

import {
  shuffle
} from '../shared/js/random.js'

test('shuffle preserves values without mutating input', () => {
  const input = [1, 2, 3, 4, 5]
  const original = [...input]

  const output = shuffle(input)

  assert.deepEqual(input, original)
  assert.deepEqual(
    [...output].sort(),
    [...input].sort()
  )

  assert.notStrictEqual(
    output,
    input
  )
})
