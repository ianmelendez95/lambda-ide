/**
 * This module attempts to provide generators that replicate
 * common lazy list functions available in Haskell.
 */

import { Maybe } from "./Maybe"

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

/**
 * https://hackage.haskell.org/package/base-4.16.1.0/docs/Prelude.html#v:iterate 
 */
export function* iterate<T>(initialInput: T, iterFunc: (input: T) => T): SimpleGenerator<T> {
  let curInput = initialInput
  while (true) {
    yield curInput
    curInput = iterFunc(curInput)
  }
}

/**
 * https://hackage.haskell.org/package/base-4.16.1.0/docs/Data-List.html#v:unfoldr
 */
export function* unfoldr<A,B>(initialInput: B,
                              unfoldrFunc: (input: B) => Maybe<[A, B]>): SimpleGenerator<A> {
  let curInput = initialInput
  while (true) {
    const next: Maybe<[A, B]> = unfoldrFunc(curInput)
    if (next === null) {
      return null
    } else {
      const [nextValue, nextInput] = next
      yield nextValue
      curInput = nextInput
    }
  }
}