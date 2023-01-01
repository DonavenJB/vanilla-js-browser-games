const computerChoiceDisplay =
    document.getElementById('computer-choice')

const userChoiceDisplay =
    document.getElementById('user-choice')

const resultDisplay =
    document.getElementById('result')

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

const computerChoices = [
    'rock',
    'paper',
    'scissors'
]

const keyboardChoices = {
    r: 'rock',
    p: 'paper',
    s: 'scissors'
}

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

function updateSelectedChoice(choice) {
    possibleChoices.forEach(button => {
        button.classList.toggle(
            'selected-choice',
            button.id === choice
        )
    })
}

function updateResultState(outcome) {
    resultDisplay.classList.remove(
        'result-win',
        'result-loss',
        'result-draw'
    )

    resultDisplay.classList.add(
        `result-${outcome}`
    )
}

function playRound(choice) {
    if (
        !computerChoices.includes(choice)
    ) {
        return
    }

    userChoice = choice

    userChoiceDisplay.textContent =
        formatChoice(userChoice)

    updateSelectedChoice(userChoice)

    rounds++

    generateComputerChoice()
    getResult()
}

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

    resultDisplay.classList.remove(
        'result-win',
        'result-loss',
        'result-draw'
    )

    possibleChoices.forEach(button => {
        button.classList.remove(
            'selected-choice'
        )
    })

    updateSessionScore()
}

function generateComputerChoice() {
    const randomIndex =
        Math.floor(
            Math.random() *
            computerChoices.length
        )

    computerChoice =
        computerChoices[randomIndex]

    computerChoiceDisplay.textContent =
        formatChoice(computerChoice)
}

function getResult() {
    let result
    let outcome

    const formattedUserChoice =
        formatChoice(userChoice)

    const formattedComputerChoice =
        formatChoice(computerChoice)

    if (computerChoice === userChoice) {
        draws++
        outcome = 'draw'

        result =
            `${formattedUserChoice} meets ${formattedComputerChoice} - it's a draw!`
    } else if (
        userChoice === 'rock' &&
        computerChoice === 'scissors'
    ) {
        userWins++
        outcome = 'win'

        result =
            `${formattedUserChoice} beats ${formattedComputerChoice} - you win!`
    } else if (
        userChoice === 'paper' &&
        computerChoice === 'rock'
    ) {
        userWins++
        outcome = 'win'

        result =
            `${formattedUserChoice} beats ${formattedComputerChoice} - you win!`
    } else if (
        userChoice === 'scissors' &&
        computerChoice === 'paper'
    ) {
        userWins++
        outcome = 'win'

        result =
            `${formattedUserChoice} beats ${formattedComputerChoice} - you win!`
    } else {
        computerWins++
        outcome = 'loss'

        result =
            `${formattedComputerChoice} beats ${formattedUserChoice} - you lose!`
    }

    resultDisplay.textContent =
        result

    updateResultState(outcome)
    updateSessionScore()
}

possibleChoices.forEach(button => {
    button.addEventListener(
        'click',
        () => {
            playRound(button.id)
        }
    )
})

document.addEventListener(
    'keydown',
    event => {
        if (event.repeat) {
            return
        }

        const key =
            event.key.toLowerCase()

        const choice =
            keyboardChoices[key]

        if (!choice) {
            return
        }

        event.preventDefault()

        playRound(choice)
    }
)

resetSessionButton.addEventListener(
    'click',
    resetSession
)

updateSessionScore()
