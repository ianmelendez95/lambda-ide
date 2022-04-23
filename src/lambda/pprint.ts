export type Doc = Nil | Line | Text

export type Nil = { kind: 'nil' }

export type Text = {
  kind: 'text',
  text: string,
  next: Doc
}

export type Line = {
  kind: 'line', 
  depth: number, // integer
  next: Doc
}

const NIL: Nil = { kind: 'nil' }

export function concat(left: Doc, right: Doc, ...rest: Doc[]): Doc {
  if (rest.length === 0) {
    return concatTwo(left, right)
  } else {
    return concat(concatTwo(left, right), rest[0], ...rest.slice(1))
  }
}

function concatTwo(left: Doc, right: Doc): Doc {
  if (left.kind === 'nil') {
    return right
  } else if (left.kind === 'text') {
    return { kind: 'text', text: left.text, next: concatTwo(left.next, right) }
  } else if (left.kind === 'line') {
    return { kind: 'line', depth: left.depth, next: concatTwo(left.next, right) }
  } else {
    throw new Error()
  }
}

export function nil(): Doc {
  return NIL
}

export function text(text: string): Doc {
  return { kind: 'text', text, next: nil() }
}

export function line(): Doc {
  return { kind: 'line', depth: 0, next: nil() }
}

export function nest(depth: number, doc: Doc): Doc {
  if (doc.kind === 'nil') {
    return nil()
  } else if (doc.kind === 'text') {
    return { kind: 'text', text: doc.text, next: nest(depth, doc.next) }
  } else if (doc.kind === 'line') {
    return { kind: 'line', depth: depth + doc.depth, next: nest(depth, doc.next) }
  }
}

export function layout(doc: Doc): string {
  if (doc.kind === 'nil') {
    return ''
  } else if (doc.kind === 'line') {
    return '\n' + ' '.repeat(doc.depth) + layout(doc.next)
  } else if (doc.kind === 'text') {
    return doc.text + layout(doc.next)
  } else {
    throw new Error()
  }
}
