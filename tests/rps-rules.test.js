import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getOutcome
} from '../games/rock-paper-scissors/rules.js'

const cases = [
  ['rock', 'rock', 'draw'],
  ['rock', 'paper', 'loss'],
  ['rock', 'scissors', 'win'],

  ['paper', 'rock', 'win'],
  ['paper', 'paper', 'draw'],
  ['paper', 'scissors', 'loss'],

  ['scissors', 'rock', 'loss'],
  ['scissors', 'paper', 'win'],
  ['scissors', 'scissors', 'draw']
]

cases.forEach(
  ([player, computer, expected]) => {
    test(
      `${player} vs ${computer} => ${expected}`,
      () => {
        assert.equal(
          getOutcome(
            player,
            computer
          ),
          expected
        )
      }
    )
  }
)
