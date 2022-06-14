export function repeat<A>(x: A, n: number): A[] {
  // https://stackoverflow.com/a/34104348/10719983
  return new Array(n).fill(x)
}