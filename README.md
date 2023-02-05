# Vanilla JS Browser Games

A collection of browser games built with HTML, CSS, and vanilla JavaScript.

## Games

- Card Game
- Memory Game
- Space Invaders
- Whac-A-Mole
- Connect Four
- Frogger
- Rock Paper Scissors
- Brick Breaker

## Run Locally

Clone the repository:

```bash
git clone https://github.com/DonavenJB/vanilla-js-browser-games.git
```

Open the project directory:

```bash
cd vanilla-js-browser-games
```

Serve the repository with a local web server and open `index.html`.

VS Code users can launch the root `index.html` with Live Server.

## Project Structure

```text
vanilla-js-browser-games/
|-- index.html
|-- style.css
|-- shared/
|   |-- css/
|   `-- js/
|-- games/
|   |-- brick-breaker/
|   |-- card-game/
|   |-- connect-four/
|   |-- frogger/
|   |-- memory-game/
|   |-- rock-paper-scissors/
|   |-- space-invaders/
|   `-- whac-a-mole/
|-- tests/
`-- scripts/
```

Each game has its own HTML, CSS, and JavaScript. Reusable styles and utilities live under `shared/`.

## Testing

Run the automated tests:

```bash
node --test
```

Run the repository audit:

```bash
node scripts/audit.mjs
```

Run both:

```bash
npm run check
```

## Built With

- HTML
- CSS
- Vanilla JavaScript
- Native ES modules
- Node.js built-in test runner
