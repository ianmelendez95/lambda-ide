import * as P from 'parsimmon'

type App = {
  kind: "app",
  val: [Expr, Expr]
}

type Var = {
  kind: "var",
  val: string
}

type Lambda = {
  kind: "lambda",
  var: Var,
  body: Expr
}

type Expr = Lambda | App | Var

export function mkVar(name: string): Var {
  return {
    kind: "var",
    val: name
  }
}

export function mkApp(e1: Expr, e2: Expr): App {
  return {
    kind: "app",
    val: [e1, e2]
  }
}

export function mkLambda(v: Var, b: Expr): Lambda {
  return {
    kind: "lambda",
    var: v,
    body: b
  }
}

function Var(): P.Parser<Var> {
  return P.regexp(/[a-z][a-z0-9_-]*/).map(mkVar)
}

function App(r: P.Language): P.Parser<App> {
  return P.seq(r.Var, r._, r.Var)
    .map((parts) => mkApp(parts[0], parts[2]))
}

function Lambda(r: P.Language): P.Parser<Lambda> {
  return P.seqMap(
    P.regex(/\\/),
    r.Var,
    P.regex(/\./),
    r._,
    r.Expr,
    (_1, varName, _2, _3, body) => mkLambda(varName, body)
  )
}

function Expr(r: P.Language): P.Parser<Expr> {
  return P.alt(
    between(r.Var, P.regex(/\(/), P.regex(/\)/)),
    r.Var
  )
}

function between<A>(p: P.Parser<A>, bra: P.Parser<any>, cket: P.Parser<any>): P.Parser<A> {
  return P.seqMap(bra, p, cket, (_bra, result, _cket) => result)
}

const LambdaLang: P.Language = P.createLanguage({
  Var,
  App,
  Lambda,
  Expr,
  _: function() {
    return P.optWhitespace;
  }
})

export default LambdaLang