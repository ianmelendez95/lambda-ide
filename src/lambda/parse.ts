////////////////////////////////////////////////////////////////////////////////
// Syntax

type LNode = LLam | LApp | LNum | LStr

interface Pos {
  row: number
  colStart: number
  colEnd: number
}

interface LLam {
  kind: "lam"
  pos: Pos
  var: string 
  body: LNode
}

interface LApp {
  kind: "app"
  pos: Pos
  exp1: LNode 
  exp2: LNode
}

interface LNum {
  kind: "num"
  pos: Pos
  value: number
}

interface LStr {
  kind: "str"
  pos: Pos
  value: string
}

////////////////////////////////////////////////////////////////////////////////
// Tokens

type Token = TLParen

interface TLParen {
  kind: "lparen"
  pos: Pos
}

interface TRParen {
  kind: "rparen"
  pos: Pos
}

interface TIdent { 
  kind: "ident"
  pos: Pos

}

function parse(input: string): LNode {
  return { 
    kind: "num",
    pos: {
      row: 0,
      colStart: 0,
      colEnd: 2
    },
    value: 5
  }
}

function tokenize(input: string): Token[] {
  return []
}