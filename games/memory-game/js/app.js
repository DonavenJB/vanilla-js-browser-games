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
const resultDisplay = document.querySelector('#result')

let cardsChosen = []
let cardsChosenIds = []
let boardLocked = false

const cardsWon = []

function createBoard() {
    for (let i = 0; i < cardArray.length; i++) {
        const card = document.createElement('img')

        card.setAttribute('src', CARD_BACK)
        card.setAttribute('data-id', i)
        card.setAttribute('alt', 'Hidden memory card')

        card.addEventListener('click', flipCard)

        gridDisplay.appendChild(card)
    }

    resultDisplay.textContent = '0'
}

function checkMatch() {
    const cards = document.querySelectorAll('#grid img')

    const optionOneId = Number(cardsChosenIds[0])
    const optionTwoId = Number(cardsChosenIds[1])

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

    resultDisplay.textContent = cardsWon.length

    cardsChosen = []
    cardsChosenIds = []
    boardLocked = false

    if (cardsWon.length === cardArray.length / 2) {
        resultDisplay.textContent = 'YOU FOUND THEM ALL'
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
        setTimeout(checkMatch, 650)
    }
}

createBoard()
