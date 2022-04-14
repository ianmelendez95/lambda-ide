"use strict"
import * as chevrotain from 'chevrotain'

type TokenType = chevrotain.TokenType
type TokenVocabulary = { [key: string]: TokenType }

const Lexer = chevrotain.Lexer
const createToken = chevrotain.createToken

const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z][\w-]*/ })

const If = createToken({
  name: "If",
  pattern: /if/,
  longer_alt: Identifier
})

const True = createToken({
  name: "True",
  pattern: /true/,
  longer_alt: Identifier
})

const False = createToken({
  name: "False",
  pattern: /false/,
  longer_alt: Identifier
})

const LParen = createToken({ name: "LParen", pattern: /\(/})
const RParen = createToken({ name: "RParen", pattern: /\)/})

const BSlash = createToken({ name: "BSlash", pattern: /\\/})
const Dot = createToken({ name: "Dot", pattern: /\./})

const StringLit = createToken({ name: "StringLit", pattern: /"([^"]|\\")*"/})
const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ })
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
})

const allTokens = [
  WhiteSpace,

  If,
  True,
  False,

  StringLit,
  BSlash,
  Dot,
  LParen,
  RParen,

  Identifier,
  Integer
]

const LambdaLexer = new Lexer(allTokens)

export const tokenVocabulary: { [key: string]: TokenType } = allTokens.reduce((vocab: TokenVocabulary, tokenType: TokenType) => { 
  vocab[tokenType.name] = tokenType
  return vocab
}, {})

export function lex(inputText: string): chevrotain.ILexingResult {
  const lexingResult = LambdaLexer.tokenize(inputText)

  if (lexingResult.errors.length > 0) {
    console.error("Lexing errors: ", lexingResult.errors)
    throw Error("Lexing errors detected")
  }

  return lexingResult
}