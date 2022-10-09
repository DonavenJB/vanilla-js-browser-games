const computerChoiceDisplay = document.getElementById('computer-choice')
const userChoiceDisplay = document.getElementById('user-choice')
const resultDisplay = document.getElementById('result')
const possibleChoices = document.querySelectorAll('button')
let userChoice
let computerChoice

possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click', (e) => {
    userChoice = e.target.id
    userChoiceDisplay.innerHTML = userChoice
    generateComputerChoice()
    getResult()
}))

function generateComputerChoice() {
    const randomNumber = Math.floor(Math.random() * 3) + 1

    if (randomNumber === 1) {
        computerChoice = 'rock'
    }
    if (randomNumber === 2) {
        computerChoice = 'scissors'
    }
    if (randomNumber === 3) {
        computerChoice = 'paper'
    }
    computerChoiceDisplay.innerHTML = computerChoice
}

function getResult() {
    let result

    if (computerChoice === userChoice) {
        result = "it's a draw!"
    } else if (
        userChoice === 'rock' &&
        computerChoice === 'scissors'
    ) {
        result = 'you win!'
    } else if (
        userChoice === 'paper' &&
        computerChoice === 'rock'
    ) {
        result = 'you win!'
    } else if (
        userChoice === 'scissors' &&
        computerChoice === 'paper'
    ) {
        result = 'you win!'
    } else {
        result = 'you lose!'
    }

    resultDisplay.innerHTML = result
}
