
export type App = {
  kind: "app",
  val: [Expr, Expr]
}

export type Var = {
  kind: "var",
  val: string
}

export type Lambda = {
  kind: "lambda",
  var: Var,
  body: Expr
}

export type Expr = Lambda | App | Var

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