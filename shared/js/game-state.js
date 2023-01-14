export const GameState = Object.freeze({
  READY: 'ready',
  RUNNING: 'running',
  PAUSED: 'paused',
  FINISHED: 'finished'
})

export function isActiveState(state) {
  return (
    state === GameState.RUNNING ||
    state === GameState.PAUSED
  )
}
