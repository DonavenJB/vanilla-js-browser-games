export function randomItem(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('randomItem requires a non-empty array')
  }

  const index =
    Math.floor(Math.random() * items.length)

  return items[index]
}

export function shuffle(items) {
  if (!Array.isArray(items)) {
    throw new Error('shuffle requires an array')
  }

  const copy = [...items]

  for (
    let index = copy.length - 1;
    index > 0;
    index--
  ) {
    const swapIndex =
      Math.floor(Math.random() * (index + 1))

    ;[
      copy[index],
      copy[swapIndex]
    ] = [
      copy[swapIndex],
      copy[index]
    ]
  }

  return copy
}
