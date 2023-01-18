import {
  randomItem
} from '../../shared/js/random.js'

import {
  CHOICES,
  getOutcome
} from './rules.js'

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

const choiceButtons =
  document.querySelectorAll('.choices button')

const keyboardChoices = Object.freeze({
  r: 'rock',
  p: 'paper',
  s: 'scissors'
})

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
  userWinsDisplay.textContent = userWins
  computerWinsDisplay.textContent = computerWins
  drawsDisplay.textContent = draws
  roundsDisplay.textContent = rounds
}

function updateSelectedChoice(choice) {
  choiceButtons.forEach(button => {
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

function describeRound(
  userChoice,
  computerChoice,
  outcome
) {
  const user =
    formatChoice(userChoice)

  const computer =
    formatChoice(computerChoice)

  if (outcome === 'draw') {
    return `${user} meets ${computer} - it's a draw!`
  }

  if (outcome === 'win') {
    return `${user} beats ${computer} - you win!`
  }

  return `${computer} beats ${user} - you lose!`
}

function recordOutcome(outcome) {
  if (outcome === 'win') {
    userWins++
  } else if (outcome === 'loss') {
    computerWins++
  } else {
    draws++
  }
}

function playRound(userChoice) {
  if (!CHOICES.includes(userChoice)) {
    return
  }

  const computerChoice =
    randomItem(CHOICES)

  const outcome =
    getOutcome(
      userChoice,
      computerChoice
    )

  rounds++
  recordOutcome(outcome)

  userChoiceDisplay.textContent =
    formatChoice(userChoice)

  computerChoiceDisplay.textContent =
    formatChoice(computerChoice)

  resultDisplay.textContent =
    describeRound(
      userChoice,
      computerChoice,
      outcome
    )

  updateSelectedChoice(userChoice)
  updateResultState(outcome)
  updateSessionScore()
}

function resetSession() {
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

  choiceButtons.forEach(button => {
    button.classList.remove(
      'selected-choice'
    )
  })

  updateSessionScore()
}

choiceButtons.forEach(button => {
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

    const choice =
      keyboardChoices[
        event.key.toLowerCase()
      ]

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
