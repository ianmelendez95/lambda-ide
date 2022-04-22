import * as L from './lang'

export type Doc = string

export function concat(left: Doc, right: Doc, ...rest: Doc[]): Doc {
  if (rest.length === 0) {
    return left.concat(right)
  } else {
    return left.concat(concat(right, rest[0], ...rest.slice(1)))
  }
}

export function nil(): Doc {
  return ""
}

export function text(text: string): Doc {
  return text
}

export function line(): Doc {
  return '\n'
}

export function nest(depth: number, doc: Doc): Doc {
  const indent = ' '.repeat(depth)
  return doc.replace(/\n/g, '\n' + indent)
}

export function layout(doc: Doc): string {
  return doc
}


/**
 * data Tree = Node String [Tree]
 */
type Tree = {
  value: string,
  children: Tree[]
}

/**
 * showTree (Node s ts) = text s <> nest (length s) (showBracket ts)
 */
export function showTree({ value, children }: Tree): Doc {
  const s = value
  const ts = children
  return concat(text(s), nest(s.length, showBracket(ts)))
}

/**
 * showBracket [] = nil
 * showBracket ts = text "[" <> nest 1 (showTrees ts) <> text "]"
 */
export function showBracket(ts: Tree[]): Doc {
  return ts.length === 0
    ? nil()
    : concat(text("["),
      nest(1, showTrees(ts)),
      text("]"))
}

/**
 * showTrees [t] = showTree t
 * showTrees (t:ts) = showTree t <> text "," <> line <> showTrees ts
 */
export function showTrees(ts: Tree[]): Doc {
  if (ts.length === 0) {
    throw new Error('Expecting at least one tree')
  } else if (ts.length === 1) {
    return showTree(ts[0])
  } else {
    return concat(
      showTree(ts[0]),
      text(","),
      line(),
      showTrees(ts.slice(1))
    )
  }
}

/**
 * aaa[bbbbb[ccc, 
 *           dd],
 * eee,
 * ffff[gg,
 *      hhh,
 *      ii]]
 */
export function testTree(): Tree {
  return {
    value: "aaa",
    children: [{
      value: "bbbbb", children: [{ value: "ccc", children: [] },
      { value: "dd", children: [] }]
    },
    { value: "eee", children: [] },
    {
      value: "ffff", children: [{ value: "gg", children: [] },
      { value: "hhh", children: [] },
      { value: "ii", children: [] }]
    }]
  }
}

export function pprint(expr: L.Expr): string {
  return L.showExpr(expr)
}