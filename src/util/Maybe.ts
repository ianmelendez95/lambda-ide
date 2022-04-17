
export type Maybe<A> = A | null

/**
 * https://hackage.haskell.org/package/base-4.16.1.0/docs/Prelude.html#v:-62--62--61-
 */
export function bind<A>(maybe: Maybe<A>, bindFunc: (input: A) => Maybe<A>): Maybe<A> {
  return maybe === null ? null : bindFunc(maybe)
}

export function map<A,B>(maybe: Maybe<A>, mapFunc: (input: A) => B): Maybe<B> {
  return maybe === null ? null : mapFunc(maybe)
}