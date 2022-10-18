const computerChoiceDisplay = document.getElementById('computer-choice')
const userChoiceDisplay = document.getElementById('user-choice')
const resultDisplay = document.getElementById('result')
const possibleChoices = document.querySelectorAll('button')
const computerChoices = ['rock', 'paper', 'scissors']

let userChoice
let computerChoice

function formatChoice(choice) {
    return (
        choice.charAt(0).toUpperCase() +
        choice.slice(1)
    )
}

possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click', (e) => {
    userChoice = e.target.id

    userChoiceDisplay.textContent =
        formatChoice(userChoice)

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

    computerChoiceDisplay.textContent =
        formatChoice(computerChoice)
}

function getResult() {
    let result

    const formattedUserChoice =
        formatChoice(userChoice)

    const formattedComputerChoice =
        formatChoice(computerChoice)

    if (computerChoice === userChoice) {
        result =
            `${formattedUserChoice} meets ${formattedComputerChoice} — it's a draw!`
    } else if (
        userChoice === 'rock' &&
        computerChoice === 'scissors'
    ) {
        result =
            `${formattedUserChoice} beats ${formattedComputerChoice} — you win!`
    } else if (
        userChoice === 'paper' &&
        computerChoice === 'rock'
    ) {
        result =
            `${formattedUserChoice} beats ${formattedComputerChoice} — you win!`
    } else if (
        userChoice === 'scissors' &&
        computerChoice === 'paper'
    ) {
        result =
            `${formattedUserChoice} beats ${formattedComputerChoice} — you win!`
    } else {
        result =
            `${formattedComputerChoice} beats ${formattedUserChoice} — you lose!`
    }

    resultDisplay.textContent =
        result
}
