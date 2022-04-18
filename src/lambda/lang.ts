
export type App = {
  kind: "app",
  e1: Expr,
  e2: Expr
}

export type Num = {
  kind: "num",
  value: number
}

export type Var = {
  kind: "var",
  name: string
}

export type Lambda = {
  kind: "lambda",
  var: Var,
  body: Expr
}

export type Expr = Lambda | App | Var | Num

export function mkVar(name: string): Var {
  return { kind: "var", name }
}

export function mkNum(value: number): Num {
  return { kind: "num", value }
}

export function mkApp(e1: Expr, e2: Expr): App {
  return { kind: "app", e1, e2 }
}

export function mkLambda(v: Var, body: Expr): Lambda {
  return { kind: "lambda", var: v, body }
}

export function showExpr(expr: Expr): string {
  if (expr.kind === 'var') {
    return expr.name
  } else if (expr.kind === 'num') {
    return expr.value.toString()
  } else if (expr.kind === 'app') {
    return '(' + showExpr(expr.e1) + ' ' + showExpr(expr.e2) + ')'
  } else {
    return '(\\' + showExpr(expr.var) + '. ' + showExpr(expr.body) + ')'
  }
}
