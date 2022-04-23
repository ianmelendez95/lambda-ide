import * as chai from 'chai'
import { Doc, concat, line, nest, nil, text, layout } from '../src/lambda/pprint'

const assert = chai.assert

describe('pprint', function () {
  describe('#showTree', function () {
    it('should properly indent test tree', function () {
      assert.equal([
        'aaa[bbbbb[ccc,',
        '          dd],',
        '    eee,',
        '    ffff[gg,',
        '         hhh,',
        '         ii]]'
      ].join('\n'), layout(showTree(testTree())))
    })
  })
  describe('#showTreeAlt', function () {
    it('should properly indent test tree', function () {
      assert.equal([
        'aaa[',
        '  bbbbb[ccc,',
        '        dd],',
        '  eee,',
        '  ffff[gg,',
        '       hhh,',
        '       ii]',
        ']'
      ].join('\n'), layout(showTreeAlt(testTree())))
    })
  })
})

////////////////////////////////////////////////////////////////////////////////
// Tree Structure

/**
 * data Tree = Node String [Tree]
 */
type Tree = {
  value: string,
  children: Tree[]
}

/**
 * aaa[bbbbb[ccc, 
 *           dd],
 * eee,
 * ffff[gg,
 *      hhh,
 *      ii]]
 */
function testTree(): Tree {
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

/**
 * showTree (Node s ts) = text s <> nest (length s) (showBracket ts)
 */
function showTree({ value, children }: Tree): Doc {
  const s = value
  const ts = children
  return concat(text(s), nest(s.length, showBracket(ts)))
}

/**
 * showBracket [] = nil
 * showBracket ts = text "[" <> nest 1 (showTrees ts) <> text "]"
 */
function showBracket(ts: Tree[]): Doc {
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
function showTrees(ts: Tree[]): Doc {
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
 * showTree’ (Node s ts) = text s <> showBracket’ ts
 */
function showTreeAlt({ value, children }: Tree): Doc {
  const s = value
  const ts = children
  return concat(text(s), showBracketAlt(ts))
}

/**
 * showBracket’ [] = nil
 * showBracket’ ts = text "[" <>
 *                   nest 2 (line <> showTrees’ ts) <>
 *                   line <> text "]")
 */
function showBracketAlt(ts: Tree[]): Doc {
  return ts.length === 0
    ? nil()
    : concat(text("["),
             nest(2, concat(line(), showTreesAlt(ts))),
             line(), text("]"))
}

/**
 * showTrees’ [t] = showTree t
 * showTrees’ (t:ts) = showTree t <> text "," <> line <> showTrees ts
 */
function showTreesAlt(ts: Tree[]): Doc {
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
