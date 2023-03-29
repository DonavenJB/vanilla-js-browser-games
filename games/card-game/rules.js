const FACE_VALUES = Object.freeze({
  JACK: 11,
  QUEEN: 12,
  KING: 13,
  ACE: 14
})

export function getCardValue(value) {
  const normalizedValue =
    String(value).toUpperCase()

  return (
    FACE_VALUES[normalizedValue] ??
    Number(normalizedValue)
  )
}

export function getRoundOutcome(
  player1Value,
  player2Value
) {
  const player1 =
    getCardValue(player1Value)

  const player2 =
    getCardValue(player2Value)

  if (player1 > player2) {
    return 'player1'
  }

  if (player2 > player1) {
    return 'player2'
  }

  return 'war'
}

export function getSessionOutcome(
  player1Wins,
  player2Wins
) {
  if (player1Wins > player2Wins) {
    return 'player1'
  }

  if (player2Wins > player1Wins) {
    return 'player2'
  }

  return 'tie'
}
