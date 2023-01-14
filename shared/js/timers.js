export function createTimerRegistry() {
  const intervals = new Set()
  const timeouts = new Set()

  function interval(callback, delay) {
    const id = setInterval(callback, delay)
    intervals.add(id)
    return id
  }

  function timeout(callback, delay) {
    let id = null

    id = setTimeout(() => {
      timeouts.delete(id)
      callback()
    }, delay)

    timeouts.add(id)
    return id
  }

  function clearIntervalTracked(id) {
    if (id === null || id === undefined) {
      return
    }

    clearInterval(id)
    intervals.delete(id)
  }

  function clearTimeoutTracked(id) {
    if (id === null || id === undefined) {
      return
    }

    clearTimeout(id)
    timeouts.delete(id)
  }

  function clearAll() {
    intervals.forEach(id => {
      clearInterval(id)
    })

    timeouts.forEach(id => {
      clearTimeout(id)
    })

    intervals.clear()
    timeouts.clear()
  }

  return {
    interval,
    timeout,
    clearInterval: clearIntervalTracked,
    clearTimeout: clearTimeoutTracked,
    clearAll
  }
}
