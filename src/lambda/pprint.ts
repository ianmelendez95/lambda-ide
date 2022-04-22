import * as L from './lang'

export type Doc = Concat | Nil | Line | Text | Nest

export type Nil = { kind: 'nil' }

export type Line = { kind: 'line' }

export type Concat = {
  kind: 'concat',
  left: Doc,
  right: Doc
}

export type Text = {
  kind: 'text',
  text: string
}

export type Nest = {
  kind: 'nest', 
  depth: number, // integer
  doc: Doc
}

const NIL: Nil = { kind: 'nil' }
const LINE: Line = { kind: 'line' }

export function concat(left: Doc, right: Doc, ...rest: Doc[]): Doc {
  if (rest.length === 0) {
    return { kind: 'concat', left, right }
  } else {
    return { 
      kind: 'concat', 
      left, 
      right: concat(right, rest[0], ...rest.slice(1)) 
    }
  }
}

export function nil(): Doc {
  return NIL
}

export function text(text: string): Doc {
  return { kind: 'text', text }
}

export function line(): Doc {
  return LINE
}

export function nest(depth: number, doc: Doc): Doc {
  return { kind: 'nest', depth, doc }
}

export function layout(doc: Doc): string {
  if (doc.kind === 'concat') {
    return layout(doc.left).concat(layout(doc.right))
  } else if (doc.kind === 'nil') {
    return ''
  } else if (doc.kind === 'line') {
    return '\n'
  } else if (doc.kind === 'text') {
    return doc.text
  } else if (doc.kind === 'nest') {
    const indent = ' '.repeat(doc.depth)
    return layout(doc.doc).replace(/\n/g, '\n' + indent)
  } else {
    throw new Error("Unrecognized document: " + doc)
  }
}
