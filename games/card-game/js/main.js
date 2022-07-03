let deckId = ''

fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json())
    .then(data => {
        deckId = data.deck_id
    })
    .catch(err => {
        console.log(`error ${err}`)
    })

document.querySelector('button').addEventListener('click', getFetch)

function getFetch() {
    const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)

            const val1 = Number(cardValue(data.cards[0].value))
            const val2 = Number(cardValue(data.cards[1].value))

            document.querySelector('#player1').src = data.cards[0].image
            document.querySelector('#player2').src = data.cards[1].image

            if (val1 > val2) {
                document.querySelector('h3').innerText = 'player 1 WON!'
            } else if (val1 < val2) {
                document.querySelector('h3').innerText = 'player 2 won'
            } else {
                document.querySelector('h3').innerText = 'WAR'
            }
        })
        .catch(err => {
            console.log(`error ${err}`)
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
