const cardArray = [
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
    },
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
]

const CARD_BACK = 'images/space.jpeg'
const MATCHED_CARD = 'images/favicon.jpg'

cardArray.sort(() => 0.5 - Math.random())

const gridDisplay = document.querySelector('#grid')
const matchesDisplay = document.querySelector('#matches')
const attemptsDisplay = document.querySelector('#attempts')
const bestAttemptsDisplay = document.querySelector('#best-attempts')
const messageDisplay = document.querySelector('#message')
const newGameButton = document.querySelector('#new-game-button')

let cardsChosen = []
let cardsChosenIds = []
let cardsWon = []

let boardLocked = false
let attempts = 0
let bestAttempts = null
let matchTimerId = null

function createBoard() {
    for (let i = 0; i < cardArray.length; i++) {
        const card = document.createElement('img')

        card.setAttribute('src', CARD_BACK)
        card.setAttribute('data-id', i)
        card.setAttribute('alt', 'Hidden memory card')

        card.addEventListener('click', flipCard)

        gridDisplay.appendChild(card)
    }

    matchesDisplay.textContent = '0'
    attemptsDisplay.textContent = '0'
}

function checkMatch() {
    matchTimerId = null

    const cards = document.querySelectorAll('#grid img')

    const optionOneId = Number(cardsChosenIds[0])
    const optionTwoId = Number(cardsChosenIds[1])

    attempts++
    attemptsDisplay.textContent = attempts

    if (cardsChosen[0] === cardsChosen[1]) {
        cards[optionOneId].setAttribute('src', MATCHED_CARD)
        cards[optionTwoId].setAttribute('src', MATCHED_CARD)

        cards[optionOneId].removeEventListener('click', flipCard)
        cards[optionTwoId].removeEventListener('click', flipCard)

        cards[optionOneId].classList.add('matched')
        cards[optionTwoId].classList.add('matched')

        cardsWon.push(cardsChosen)

        messageDisplay.textContent = 'Match found!'
        messageDisplay.className = 'match-message'
    } else {
        cards[optionOneId].setAttribute('src', CARD_BACK)
        cards[optionTwoId].setAttribute('src', CARD_BACK)

        messageDisplay.textContent = 'No match - try again.'
        messageDisplay.className = 'miss-message'
    }

    matchesDisplay.textContent = cardsWon.length

    cardsChosen = []
    cardsChosenIds = []
    boardLocked = false

    if (cardsWon.length === cardArray.length / 2) {
        if (bestAttempts === null || attempts < bestAttempts) {
            bestAttempts = attempts
            bestAttemptsDisplay.textContent = bestAttempts
        }

        messageDisplay.textContent = 'You found them all!'
        messageDisplay.className = 'match-message'
    }
}

function flipCard() {
    if (boardLocked) {
        return
    }

    const cardId = Number(this.getAttribute('data-id'))

    if (cardsChosenIds.includes(cardId)) {
        return
    }

    if (cardsChosen.length === 0) {
        messageDisplay.textContent = ''
        messageDisplay.className = ''
    }

    cardsChosen.push(cardArray[cardId].name)
    cardsChosenIds.push(cardId)

    this.setAttribute('src', cardArray[cardId].img)

    if (cardsChosen.length === 2) {
        boardLocked = true
        matchTimerId = setTimeout(checkMatch, 650)
    }
}

function newGame() {
    if (matchTimerId) {
        clearTimeout(matchTimerId)
        matchTimerId = null
    }

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

    cardArray.sort(() => 0.5 - Math.random())

    createBoard()
}

newGameButton.addEventListener('click', newGame)

createBoard()
