export const CARD_BACK =
  'images/space.jpeg'

export const MATCHED_CARD =
  'images/favicon.jpg'

export const CARD_TYPES = Object.freeze([
  {
    name: 'bishop',
    img: 'images/BlackBishop.png'
  },
  {
    name: 'king',
    img: 'images/BlackKing.png'
  },
  {
    name: 'knight',
    img: 'images/BlackKnight.png'
  },
  {
    name: 'pawn',
    img: 'images/BlackPawn.png'
  },
  {
    name: 'queen',
    img: 'images/BlackQueen.png'
  },
  {
    name: 'rook',
    img: 'images/BlackRook.png'
  }
])

export function createDeck() {
  return CARD_TYPES.flatMap(card => [
    { ...card },
    { ...card }
  ])
}
