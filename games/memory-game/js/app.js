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
cardArray.sort(() => 0.5 - Math.random())

const gridDisplay = document.querySelector('#grid')
const reslutDisplay = document.querySelector('#result')
let cardsChosen = []
let cardsChosenIds = []
const cardsWon = []

function createBoard () {
    for (let i = 0; i < cardArray.length; i++) {
        const card = document.createElement('img')
        card.setAttribute('src', 'images/favicon.jpg')
        card.setAttribute('data-id', i)
        card.addEventListener('click', flipCard)
        gridDisplay.appendChild(card)
    }
}
createBoard()

function checkMatch() {
   const cards = document.querySelectorAll('img')
   const optionOneId = cardsChosenIds[0]
   const optionTwoId = cardsChosenIds[1]
    console.log(cards)
    console.log('check for match')
    if (optionOneId == optionTwoId) {
        alert('you have clicked the same image!')
    }
    if (cardsChosen[0] == cardsChosen[1]) {
        alert('you found a match!')
        cards[optionOneId].setAttribute('src', 'images/favicon.jpg')
        cards[optionTwoId].setAttribute('src', 'images/favicon.jpg')
        cards[optionOneId].removeEventListener('click', flipCard)
        cards[optionTwoId].removeEventListener('click', flipCard)
        cardsWon.push(cardsChosen)
    } else {
        cards[optionOneId].setAttribute('src', 'images/space.jpeg')
        cards[optionTwoId].setAttribute('src', 'images/space.jpeg')
        alert('sorry try again!')
    }
    reslutDisplay.innerHTML = cardsWon.length

    cardsChosen = []
    cardsChosenIds = []

    if (cardsWon.length == cardArray.length/2) {
        reslutDisplay.innerHTML = ' YOU FOUND THEM ALL'

    }
}

function flipCard() {
    const cardId = this.getAttribute('data-id')
    cardsChosen.push(cardArray[cardId].name)
    cardsChosenIds.push(cardId)
    console.log(cardsChosen)
    console.log(cardsChosenIds)
    this.setAttribute('src', cardArray[cardId].img)
    if (cardsChosen.length === 2) {
        setTimeout( checkMatch, 500)
    }
}