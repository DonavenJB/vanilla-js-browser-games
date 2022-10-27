const computerChoiceDisplay = document.getElementById('computer-choice')
const userChoiceDisplay = document.getElementById('user-choice')
const resultDisplay = document.getElementById('result')

const userWinsDisplay =
    document.getElementById('user-wins')

const computerWinsDisplay =
    document.getElementById('computer-wins')

const drawsDisplay =
    document.getElementById('draws')

const roundsDisplay =
    document.getElementById('rounds')

const resetSessionButton =
    document.getElementById('reset-session')

const possibleChoices =
    document.querySelectorAll('.choices button')

const computerChoices = ['rock', 'paper', 'scissors']

let userChoice
let computerChoice

let userWins = 0
let computerWins = 0
let draws = 0
let rounds = 0

function formatChoice(choice) {
    return (
        choice.charAt(0).toUpperCase() +
        choice.slice(1)
    )
}

function updateSessionScore() {
    userWinsDisplay.textContent =
        userWins

    computerWinsDisplay.textContent =
        computerWins

    drawsDisplay.textContent =
        draws

    roundsDisplay.textContent =
        rounds
}

possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click', (e) => {
    userChoice = e.target.id

    userChoiceDisplay.textContent =
        formatChoice(userChoice)

    rounds++

    generateComputerChoice()
    getResult()
}))

function resetSession() {
    userChoice = undefined
    computerChoice = undefined

    userWins = 0
    computerWins = 0
    draws = 0
    rounds = 0

    userChoiceDisplay.textContent = ''
    computerChoiceDisplay.textContent = ''
    resultDisplay.textContent = ''

    updateSessionScore()
}

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
        draws++

        result =
            `${formattedUserChoice} meets ${formattedComputerChoice} — it's a draw!`
    } else if (
        userChoice === 'rock' &&
        computerChoice === 'scissors'
    ) {
        userWins++

        result =
            `${formattedUserChoice} beats ${formattedComputerChoice} — you win!`
    } else if (
        userChoice === 'paper' &&
        computerChoice === 'rock'
    ) {
        userWins++

        result =
            `${formattedUserChoice} beats ${formattedComputerChoice} — you win!`
    } else if (
        userChoice === 'scissors' &&
        computerChoice === 'paper'
    ) {
        userWins++

        result =
            `${formattedUserChoice} beats ${formattedComputerChoice} — you win!`
    } else {
        computerWins++

        result =
            `${formattedComputerChoice} beats ${formattedUserChoice} — you lose!`
    }

    resultDisplay.textContent =
        result

    updateSessionScore()
}

resetSessionButton.addEventListener(
    'click',
    resetSession
)

updateSessionScore()
