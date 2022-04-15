import * as P from 'parsimmon'

type App = {
  kind: "app",
  val: [Expr, Expr]
}

type Var = {
  kind: "var",
  val: string
}

type Expr = App | Var

function mkVar(name: string): Var {
  return {
    kind: "var",
    val: name
  }
}

function mkApp(e1: Expr, e2: Expr): App {
  return {
    kind: "app",
    val: [e1, e2]
  }
}

function Var(): P.Parser<Var> {
  return P.regexp(/[a-z][a-z0-9_-]*/).map(mkVar)
}

function App(r: P.Language): P.Parser<App> {
  return P.seq(r.Var, r._, r.Var)
    .map((parts) => mkApp(parts[0], parts[2]))
}

const Lambda: P.Language = P.createLanguage({
  Var,
  App,
  Lambda: function(r) {
    return P.seq(
      P.regex(/\\/),
      r.Var,
      P.regex(/\./),
      r._,
      r.Expr
    )
  },
  ExprBody: function(r) {
    return P.alt(
      r.Lambda,
      r.App,
      r.Var
    )
  },
  Expr: function(r) {
    return P.alt(
      P.seq(
        P.regex(/\(/),
        r.ExprBody,
        P.regex(/\)/)
      ),
      r.ExprBody
    )
  },
  _: function() {
    return P.optWhitespace;
  }
})

export default Lambda