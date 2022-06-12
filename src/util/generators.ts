/**
 * This module attempts to provide generators that replicate
 * common lazy list functions available in Haskell.
 */

import * as Maybe from "./Maybe"

export type SimpleGenerator<T> = Generator<T, null, void>

export function take<T>(count: number, generator: SimpleGenerator<T>): Array<T> {
  const arr: Array<T> = []
  for (let i = 0; i < count; i++) {
    const result = generator.next()
    if (result.done) {
      return arr
    } else {
      arr.push(result.value)
    }
  }
  return arr
}

/**
 * 'Prepend' the value on the generator.
 * @returns generator that yields the 'first' value, then
 * yields the rest from the 'rest' generator.
 */
export function* prepend<T>(first: T, rest: SimpleGenerator<T>): SimpleGenerator<T> {
  yield first
  yield* rest
  return null
}

export function* iterateMaybe<T>(initialInput: T, iterFunc: (input: T) => Maybe.Maybe<T>): SimpleGenerator<T> {
  let curInput = initialInput
  while (curInput != null) {
    yield curInput
    curInput = iterFunc(curInput)
  }
  return null
}