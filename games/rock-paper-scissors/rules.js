export const CHOICES = Object.freeze([
  'rock',
  'paper',
  'scissors'
])

const BEATS = Object.freeze({
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
})

export function getOutcome(playerChoice, computerChoice) {
  if (
    !CHOICES.includes(playerChoice) ||
    !CHOICES.includes(computerChoice)
  ) {
    throw new Error('Unknown Rock Paper Scissors choice')
  }

  if (playerChoice === computerChoice) {
    return 'draw'
  }

  return BEATS[playerChoice] === computerChoice
    ? 'win'
    : 'loss'
}
