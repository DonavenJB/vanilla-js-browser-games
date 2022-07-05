let deckId = ''
let drawing = false

const drawButton = document.querySelector('#draw-button')
const player1Card = document.querySelector('#player1')
const player2Card = document.querySelector('#player2')
const resultDisplay = document.querySelector('#result')
const statusDisplay = document.querySelector('#game-status')

function createDeck() {
    drawing = true
    drawButton.disabled = true

    statusDisplay.textContent = 'Shuffling deck...'

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

            statusDisplay.textContent = 'Ready'
            resultDisplay.textContent = 'Waiting for the first draw.'

            drawButton.disabled = false
        })
        .catch(err => {
            console.error(err)

            deckId = ''

            statusDisplay.textContent = 'Unable to load deck'
            resultDisplay.textContent = 'Please refresh and try again.'
        })
        .finally(() => {
            drawing = false
        })
}

function drawCards() {
    if (drawing || !deckId) {
        return
    }

    drawing = true
    drawButton.disabled = true

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
            if (!data.success || data.cards.length < 2) {
                throw new Error('Unable to draw two cards.')
            }

            const player1 = data.cards[0]
            const player2 = data.cards[1]

            const val1 = cardValue(player1.value)
            const val2 = cardValue(player2.value)

            player1Card.src = player1.image
            player2Card.src = player2.image

            player1Card.alt =
                `${player1.value} of ${player1.suit}`

            player2Card.alt =
                `${player2.value} of ${player2.suit}`

            if (val1 > val2) {
                resultDisplay.textContent = 'Player 1 wins!'
            } else if (val1 < val2) {
                resultDisplay.textContent = 'Player 2 wins!'
            } else {
                resultDisplay.textContent =
                    'WAR! Same rank - draw again.'
            }

            statusDisplay.textContent = 'Round complete'
        })
        .catch(err => {
            console.error(err)

            statusDisplay.textContent = 'Draw failed'

            resultDisplay.textContent =
                'Something went wrong. Try again.'
        })
        .finally(() => {
            drawing = false

            if (deckId) {
                drawButton.disabled = false
            }
        })
}

function cardValue(value) {
    const faceValues = {
        ACE: 14,
        KING: 13,
        QUEEN: 12,
        JACK: 11
    }

    return faceValues[value.toUpperCase()] || Number(value)
}

drawButton.addEventListener('click', drawCards)

createDeck()
