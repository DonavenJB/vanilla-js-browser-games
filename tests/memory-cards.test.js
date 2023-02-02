import test from 'node:test'
import assert from 'node:assert/strict'

import {
  CARD_TYPES,
  createDeck
} from '../games/memory-game/cards.js'

test('memory deck contains two of each card type', () => {
  const deck = createDeck()

  assert.equal(
    deck.length,
    CARD_TYPES.length * 2
  )

  CARD_TYPES.forEach(card => {
    const count =
      deck.filter(
        deckCard =>
          deckCard.name ===
          card.name
      ).length

    assert.equal(count, 2)
  })
})
