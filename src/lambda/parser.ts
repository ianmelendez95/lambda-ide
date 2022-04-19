import * as P from 'parsimmon'
import * as L from './lang'

/*
expr := var
      | \ var . expr
      | (expr expr)
*/

function Num(): P.Parser<L.Expr> {
  return P.regexp(/(?:\+|\-)?[0-9]+(?:\.[0-9]+)?(?:e(?:\+|\-)[0-9]+)?/).map(Number).map(L.mkNum)
}

function Var(): P.Parser<L.Var> {
  return P.regexp(/(?:[a-z][a-z0-9_-]*)|(?:[<>!#$%&*+./<=>?@^\-~]+)/).map(L.mkVar)
}

/**
 * lambda := \ var . expr
 */
function Lambda(r: P.Language): P.Parser<L.Lambda> {
  return P.seqMap(
    P.regex(/\\/),
    r.Var,
    P.regex(/\./),
    r._,
    r.Expr,
    (_bs, varName, _dot, _ws, body) => L.mkLambda(varName, body)
  )
}

/**
 * term := var | lambda | ( expr )
 */
function Term(r: P.Language): P.Parser<L.Expr> {
  return P.alt(r.Num, r.Var, r.Lambda, parens(r.Expr))
}

function mkExprFromSeqTerms(firstTerm: L.Expr, restTerms: L.Expr[]): L.Expr {
  if (restTerms.length === 0) {
    return firstTerm
  } else {
    const lastTerm: L.Expr = restTerms.pop()
    return L.mkApp(mkExprFromSeqTerms(firstTerm, restTerms), lastTerm)
  }
}

/**
 * expr := expr term => application
 *       | term      => single expression
 */
function Expr(r: P.Language): P.Parser<L.Expr> {
  const term: P.Parser<L.Expr> = token(r.Term)

  return term.chain<L.Expr>((first: L.Expr) => 
    term.many().map<L.Expr>((rest: L.Expr[]) => mkExprFromSeqTerms(first, rest))
  )
}

function parens<A>(p: P.Parser<A>): P.Parser<A> {
  return between(p, token(P.regex(/\(/)), token(P.regex(/\)/)))
}

function between<A>(p: P.Parser<A>, bra: P.Parser<any>, cket: P.Parser<any>): P.Parser<A> {
  return P.seqMap(bra, p, cket, (_bra, result, _cket) => result)
}

function token<A>(p: P.Parser<A>): P.Parser<A> {
  return P.seqMap(p, P.optWhitespace, (result, _w) => result)
}

export const Parsers: P.Language = P.createLanguage({
  Num,
  Var,
  Lambda,
  Term,
  Expr,
  _: function() {
    return P.optWhitespace;
  }
})

export default Parsers.Expr