import {
  shuffle
} from '../../shared/js/random.js'

import {
  createTimerRegistry
} from '../../shared/js/timers.js'

import {
  CARD_BACK,
  MATCHED_CARD,
  createDeck
} from './cards.js'

const gridDisplay =
  document.querySelector('#grid')

const matchesDisplay =
  document.querySelector('#matches')

const attemptsDisplay =
  document.querySelector('#attempts')

const bestAttemptsDisplay =
  document.querySelector('#best-attempts')

const messageDisplay =
  document.querySelector('#message')

const newGameButton =
  document.querySelector('#new-game-button')

let deck = shuffle(createDeck())

let cardsChosen = []
let cardsChosenIds = []
let cardsWon = []

let boardLocked = false
let attempts = 0
let bestAttempts = null
const matchTimers = createTimerRegistry()

function createBoard() {
  deck.forEach((cardData, index) => {
    const card =
      document.createElement('img')

    card.setAttribute('src', CARD_BACK)
    card.setAttribute('data-id', index)
    card.setAttribute('alt', 'Hidden memory card')
    card.setAttribute('aria-label', 'Hidden memory card')
    card.setAttribute('role', 'button')
    card.setAttribute('tabindex', '0')

    card.addEventListener(
      'click',
      flipCard
    )

    card.addEventListener(
      'keydown',
      handleCardKey
    )

    gridDisplay.appendChild(card)
  })

  matchesDisplay.textContent = '0'
  attemptsDisplay.textContent = '0'
}

function handleCardKey(event) {
  if (
    event.key !== 'Enter' &&
    event.key !== ' '
  ) {
    return
  }

  event.preventDefault()
  flipCard.call(this)
}

function setHiddenCard(card) {
  card.setAttribute('src', CARD_BACK)
  card.setAttribute('alt', 'Hidden memory card')
  card.setAttribute(
    'aria-label',
    'Hidden memory card'
  )
}

function setMatchedCard(
  card,
  cardName
) {
  card.setAttribute(
    'src',
    MATCHED_CARD
  )

  card.setAttribute(
    'alt',
    `Matched ${cardName} card`
  )

  card.setAttribute(
    'aria-label',
    `Matched ${cardName} card`
  )

  card.setAttribute(
    'aria-disabled',
    'true'
  )

  card.setAttribute(
    'tabindex',
    '-1'
  )

  card.removeEventListener(
    'click',
    flipCard
  )

  card.removeEventListener(
    'keydown',
    handleCardKey
  )

  card.classList.add('matched')
}

function checkMatch() {
  const cards =
    document.querySelectorAll(
      '#grid img'
    )

  const firstId =
    Number(cardsChosenIds[0])

  const secondId =
    Number(cardsChosenIds[1])

  attempts++
  attemptsDisplay.textContent =
    attempts

  if (
    cardsChosen[0] ===
    cardsChosen[1]
  ) {
    setMatchedCard(
      cards[firstId],
      cardsChosen[0]
    )

    setMatchedCard(
      cards[secondId],
      cardsChosen[1]
    )

    cardsWon.push(
      cardsChosen[0]
    )

    messageDisplay.textContent =
      'Match found!'

    messageDisplay.className =
      'match-message'
  } else {
    setHiddenCard(cards[firstId])
    setHiddenCard(cards[secondId])

    messageDisplay.textContent =
      'No match - try again.'

    messageDisplay.className =
      'miss-message'
  }

  matchesDisplay.textContent =
    cardsWon.length

  cardsChosen = []
  cardsChosenIds = []
  boardLocked = false

  if (
    cardsWon.length ===
    deck.length / 2
  ) {
    if (
      bestAttempts === null ||
      attempts < bestAttempts
    ) {
      bestAttempts = attempts
      bestAttemptsDisplay.textContent =
        bestAttempts
    }

    document.body.classList.add(
      'game-complete'
    )

    messageDisplay.textContent =
      'You found them all!'

    messageDisplay.className =
      'match-message'
  }
}

function flipCard() {
  if (boardLocked) {
    return
  }

  const cardId =
    Number(
      this.getAttribute('data-id')
    )

  if (
    cardsChosenIds.includes(cardId)
  ) {
    return
  }

  if (cardsChosen.length === 0) {
    messageDisplay.textContent = ''
    messageDisplay.className = ''
  }

  cardsChosen.push(
    deck[cardId].name
  )

  cardsChosenIds.push(cardId)

  this.setAttribute(
    'src',
    deck[cardId].img
  )

  this.setAttribute(
    'alt',
    `${deck[cardId].name} card`
  )

  this.setAttribute(
    'aria-label',
    `${deck[cardId].name} card`
  )

  if (cardsChosen.length === 2) {
    boardLocked = true

    matchTimers.timeout(
      checkMatch,
      650
    )
  }
}

function newGame() {
  matchTimers.clearAll()

  document.body.classList.remove(
    'game-complete'
  )

  gridDisplay.innerHTML = ''

  cardsChosen = []
  cardsChosenIds = []
  cardsWon = []

  boardLocked = false
  attempts = 0

  matchesDisplay.textContent = '0'
  attemptsDisplay.textContent = '0'
  messageDisplay.textContent = ''
  messageDisplay.className = ''

  deck = shuffle(createDeck())

  createBoard()
}

newGameButton.addEventListener(
  'click',
  newGame
)

createBoard()
