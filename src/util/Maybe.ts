
export type Maybe<A> = A | null

export const Nothing: Maybe<any> = null

export function isJust<A>(x: Maybe<A>): boolean {
  return x !== null
}

export function isNothing<A>(x: Maybe<A>): boolean {
  return x === null
}

export function just<A>(x: A): Maybe<A> {
  return x
}

/**
 * https://hackage.haskell.org/package/base-4.16.1.0/docs/Prelude.html#v:-62--62--61-
 */
export function bind<A,B>(maybe: Maybe<A>, bindFunc: (input: A) => Maybe<B>): Maybe<B> {
  return maybe === null ? null : bindFunc(maybe)
}

export function map<A,B>(maybe: Maybe<A>, mapFunc: (input: A) => B): Maybe<B> {
  return maybe === null ? null : mapFunc(maybe)
}