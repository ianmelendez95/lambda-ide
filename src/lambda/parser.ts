import * as P from 'parsimmon'
import * as L from './lang'

/*
expr := var
      | \ var . expr
      | (expr expr)
*/

function Var(): P.Parser<L.Var> {
  return P.regexp(/[a-z][a-z0-9_-]*/).map(L.mkVar)
}

function App(r: P.Language): P.Parser<L.App> {
  return P.seqMap(r.Expr, r._, r.Expr, (e1, _ws, e2) => L.mkApp(e1, e2))
}

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

function Expr(r: P.Language): P.Parser<L.Expr> {
  return P.alt(
    r.Var,
    r.Lambda,
    between(r.App, P.regex(/\(/), P.regex(/\)/)),
  )
}

function between<A>(p: P.Parser<A>, bra: P.Parser<any>, cket: P.Parser<any>): P.Parser<A> {
  return P.seqMap(bra, p, cket, (_bra, result, _cket) => result)
}

export const Parsers: P.Language = P.createLanguage({
  Var,
  App,
  Lambda,
  Expr,
  _: function() {
    return P.optWhitespace;
  }
})

export default Parsers.Expr