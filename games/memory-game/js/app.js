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
const messageDisplay = document.querySelector('#message')
const newGameButton = document.querySelector('#new-game-button')

let cardsChosen = []
let cardsChosenIds = []
let boardLocked = false
let attempts = 0
let matchTimerId = null

let cardsWon = []

function function newGame() {
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

    cardArray.sort(() => 0.5 - Math.random())

    createBoard()
}

newGameButton.addEventListener('click', newGame)

createBoard() {
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

        cardsWon.push(cardsChosen)
    } else {
        cards[optionOneId].setAttribute('src', CARD_BACK)
        cards[optionTwoId].setAttribute('src', CARD_BACK)
    }

    matchesDisplay.textContent = cardsWon.length

    cardsChosen = []
    cardsChosenIds = []
    boardLocked = false

    if (cardsWon.length === cardArray.length / 2) {
        messageDisplay.textContent = 'You found them all!'
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

    cardArray.sort(() => 0.5 - Math.random())

    createBoard()
}

newGameButton.addEventListener('click', newGame)

createBoard()
