import {
  getRoundOutcome,
  getSessionOutcome
} from './rules.js'
let deckId = ''
let remainingCards = 0

let player1Wins = 0
let player2Wins = 0
let wars = 0
let rounds = 0

let drawing = false

const drawButton =
    document.querySelector('#draw-button')

const newGameButton =
    document.querySelector('#new-game-button')

const player1Card =
    document.querySelector('#player1')

const player2Card =
    document.querySelector('#player2')

const resultDisplay =
    document.querySelector('#result')

const statusDisplay =
    document.querySelector('#game-status')

const remainingDisplay =
    document.querySelector('#remaining-cards')

const player1WinsDisplay =
    document.querySelector('#player1-wins')

const player2WinsDisplay =
    document.querySelector('#player2-wins')

const warsDisplay =
    document.querySelector('#wars')

const roundsDisplay =
    document.querySelector('#rounds')

function clearRoundState() {
    document.body.classList.remove(
        'player-one-win',
        'player-two-win',
        'war-round'
    )
}

function updateScoreboard() {
    player1WinsDisplay.textContent = player1Wins
    player2WinsDisplay.textContent = player2Wins
    warsDisplay.textContent = wars
    roundsDisplay.textContent = rounds

    remainingDisplay.textContent = remainingCards
}

function resetSessionDisplay() {
    clearRoundState()

    drawButton.textContent = 'Draw Cards'

    player1Card.removeAttribute('src')
    player2Card.removeAttribute('src')

    player1Card.alt = ''
    player2Card.alt = ''

    resultDisplay.textContent =
        'Waiting for the first draw.'
}

function createDeck(resetScores = false) {
    drawing = true
    deckId = ''

    drawButton.disabled = true
    newGameButton.disabled = true

    statusDisplay.textContent = 'Shuffling deck...'
    remainingDisplay.textContent = '--'

    if (resetScores) {
        player1Wins = 0
        player2Wins = 0
        wars = 0
        rounds = 0
        remainingCards = 0

        player1WinsDisplay.textContent = '0'
        player2WinsDisplay.textContent = '0'
        warsDisplay.textContent = '0'
        roundsDisplay.textContent = '0'

        resetSessionDisplay()
    }

    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(res => {
            if (!res.ok) {
                throw new Error('Unable to reach card service.')
            }

            return res.json()
        })
        .then(data => {
            if (!data.success) {
                throw new Error('Unable to create deck.')
            }

            deckId = data.deck_id
            remainingCards = data.remaining

            updateScoreboard()

            statusDisplay.textContent = 'Ready'

            drawButton.disabled = false
        })
        .catch(err => {
            console.error(err)

            deckId = ''

            statusDisplay.textContent =
                'Unable to load deck'

            resultDisplay.textContent =
                'Use New Game to try again.'
        })
        .finally(() => {
            drawing = false
            newGameButton.disabled = false
        })
}

function drawCards() {
    if (
        drawing ||
        !deckId ||
        remainingCards < 2
    ) {
        return
    }

    drawing = true

    drawButton.disabled = true
    newGameButton.disabled = true

    statusDisplay.textContent = 'Drawing...'

    const url =
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`

    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error('Unable to reach card service.')
            }

            return res.json()
        })
        .then(data => {
            if (
                !data.success ||
                data.cards.length < 2
            ) {
                throw new Error(
                    'Unable to draw two cards.'
                )
            }

            const player1 = data.cards[0]
            const player2 = data.cards[1]
            const roundOutcome =
                getRoundOutcome(
                    player1.value,
                    player2.value
                )
            player1Card.src = player1.image
            player2Card.src = player2.image

            player1Card.alt =
                `${player1.value} of ${player1.suit}`

            player2Card.alt =
                `${player2.value} of ${player2.suit}`

            rounds++
            remainingCards = data.remaining

            clearRoundState()
            drawButton.textContent = 'Draw Cards'

            if (roundOutcome === 'player1') {
                player1Wins++

                document.body.classList.add(
                    'player-one-win'
                )

                resultDisplay.textContent =
                    'Player 1 wins the round!'
            } else if (roundOutcome === 'player2') {
                player2Wins++

                document.body.classList.add(
                    'player-two-win'
                )

                resultDisplay.textContent =
                    'Player 2 wins the round!'
            } else {
                wars++

                document.body.classList.add(
                    'war-round'
                )

                resultDisplay.textContent =
                    'WAR! Same rank - draw again.'

                drawButton.textContent =
                    'Draw Again'
            }

            updateScoreboard()

            if (remainingCards < 2) {
                drawButton.textContent =
                    'Deck Complete'
                const sessionOutcome =
                    getSessionOutcome(
                        player1Wins,
                        player2Wins
                    )

                if (sessionOutcome === 'player1') {
                    statusDisplay.textContent =
                        `Session complete: Player 1 wins ${player1Wins}-${player2Wins}.`
                } else if (sessionOutcome === 'player2') {
                    statusDisplay.textContent =
                        `Session complete: Player 2 wins ${player2Wins}-${player1Wins}.`
                } else {
                    statusDisplay.textContent =
                        'Session complete: overall tie.'
                }
            } else {
                statusDisplay.textContent =
                    'Round complete'
            }
        })
        .catch(err => {
            console.error(err)

            statusDisplay.textContent =
                'Draw failed'

            resultDisplay.textContent =
                'Something went wrong. Try again.'
        })
        .finally(() => {
            drawing = false

            newGameButton.disabled = false

            drawButton.disabled =
                !deckId ||
                remainingCards < 2
        })
}

function newGame() {
    if (drawing) {
        return
    }

    createDeck(true)
}

drawButton.addEventListener(
    'click',
    drawCards
)

newGameButton.addEventListener(
    'click',
    newGame
)

createDeck(true)
