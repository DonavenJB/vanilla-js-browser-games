const computerChoiceDisplay = document.getElementById('computer-choice')
const userChoiceDisplay = document.getElementById('user-choice')
const resultDisplay = document.getElementById('result')
const possibleChoices = document.querySelectorAll('button')
const computerChoices = ['rock', 'paper', 'scissors']

let userChoice
let computerChoice

possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click', (e) => {
    userChoice = e.target.id
    userChoiceDisplay.innerHTML = userChoice
    generateComputerChoice()
    getResult()
}))

function generateComputerChoice() {
    const randomIndex =
        Math.floor(
            Math.random() * computerChoices.length
        )

    computerChoice =
        computerChoices[randomIndex]

    computerChoiceDisplay.innerHTML =
        computerChoice
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
