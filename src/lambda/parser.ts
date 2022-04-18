import * as P from 'parsimmon'
import * as L from './lang'

/*
expr := var
      | \ var . expr
      | (expr expr)
*/

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
  return P.alt(r.Var, r.Lambda, parens(r.Expr))
}

/**
 * expr := term expr => application
 *       | term      => single expression
 * 
 * TODO - this results in right associative application, 
 *        e.g. (a b c) => (a (b c)), 
 *        when it should be left,
 *        e.g. (a b c) => ((a b) c)
 */
function Expr(r: P.Language): P.Parser<L.Expr> {
  const term: P.Parser<L.Expr> = token(r.Term)
  const expr: P.Parser<L.Expr> = r.Expr

  return term.chain<L.Expr>((firstTerm: L.Expr) =>
    expr.map((nextTerm: L.Expr) => L.mkApp(firstTerm, nextTerm)).fallback(firstTerm)
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
  Var,
  Lambda,
  Term,
  Expr,
  _: function() {
    return P.optWhitespace;
  }
})

export default Parsers.Expr