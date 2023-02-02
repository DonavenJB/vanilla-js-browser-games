import {
  existsSync,
  readFileSync
} from 'node:fs'

const games = [
  'brick-breaker',
  'card-game',
  'connect-four',
  'frogger',
  'memory-game',
  'rock-paper-scissors',
  'space-invaders',
  'whac-a-mole'
]

const failures = []

function requireFile(path) {
  if (!existsSync(path)) {
    failures.push(
      `Missing required file: ${path}`
    )
  }
}

function forbidFile(path) {
  if (existsSync(path)) {
    failures.push(
      `Legacy file still exists: ${path}`
    )
  }
}

games.forEach(game => {
  const root = `games/${game}`

  const indexPath =
    `${root}/index.html`

  const cssPath =
    `${root}/game.css`

  const jsPath =
    `${root}/game.js`

  requireFile(indexPath)
  requireFile(cssPath)
  requireFile(jsPath)

  forbidFile(`${root}/app.js`)
  forbidFile(`${root}/style.css`)
  forbidFile(`${root}/js/app.js`)
  forbidFile(`${root}/js/main.js`)
  forbidFile(`${root}/css/style.css`)

  if (
    existsSync(indexPath)
  ) {
    const html =
      readFileSync(
        indexPath,
        'utf8'
      )

    if (
      !html.includes(
        'href="game.css"'
      )
    ) {
      failures.push(
        `${indexPath} does not reference game.css`
      )
    }

    if (
      !/script[^>]+type=["']module["'][^>]+src=["']game\.js["']|script[^>]+src=["']game\.js["'][^>]+type=["']module["']/.test(
        html
      )
    ) {
      failures.push(
        `${indexPath} does not load game.js as a module`
      )
    }
  }

  if (
    existsSync(cssPath)
  ) {
    const css =
      readFileSync(
        cssPath,
        'utf8'
      )

    if (
      !css.includes(
        '../../shared/css/components.css'
      )
    ) {
      failures.push(
        `${cssPath} does not import shared components`
      )
    }
  }
})

const connectFour =
  readFileSync(
    'games/connect-four/game.js',
    'utf8'
  )

if (
  connectFour.includes(
    'winningArrays'
  )
) {
  failures.push(
    'Connect Four still contains hardcoded winningArrays'
  )
}

const memory =
  readFileSync(
    'games/memory-game/game.js',
    'utf8'
  )

if (
  memory.includes(
    'sort(() => 0.5 - Math.random())'
  )
) {
  failures.push(
    'Memory Game still uses random sort shuffling'
  )
}

const frogger =
  readFileSync(
    'games/frogger/game.js',
    'utf8'
  )

if (
  frogger.includes(
    'new KeyboardEvent'
  )
) {
  failures.push(
    'Frogger still dispatches synthetic KeyboardEvents'
  )
}

const spaceInvaders =
  readFileSync(
    'games/space-invaders/game.js',
    'utf8'
  )

if (
  spaceInvaders.includes(
    'new KeyboardEvent'
  )
) {
  failures.push(
    'Space Invaders still dispatches synthetic KeyboardEvents'
  )
}

if (
  spaceInvaders.includes(
    'let aliensRemoved = []'
  )
) {
  failures.push(
    'Space Invaders removed-alien state is still an Array'
  )
}

if (failures.length > 0) {
  console.error(
    '\nArchitecture audit failed:\n'
  )

  failures.forEach(failure => {
    console.error(`- ${failure}`)
  })

  process.exit(1)
}

console.log(
  'Architecture audit passed.'
)
