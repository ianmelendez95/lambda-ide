import { pprintLambda } from "./pprint"


/* ********************************************************************************
 * Core Language
 */

export type App = {
  kind: "app",
  e1: Expr,
  e2: Expr
}

export type Num = {
  kind: "num",
  value: number
}

export type Bool = {
  kind: 'bool', 
  value: boolean
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


/* ****
 * Runtime Language
 */

type ExprFunc = (args: Expr[]) => Expr 

export type Func = {
  kind: 'func',
  name: string,
  arity: number,
  body: ExprFunc
}

export type PApp = {
  kind: "papp",
  func: Func,
  args: Expr[],
}

export type Expr = Lambda | App | Var | Bool | Num | PApp

export function mkVar(name: string): Var {
  return { kind: "var", name }
}

export function mkNum(value: number): Num {
  return { kind: "num", value }
}

export function mkBool(value: boolean): Bool {
  return { kind: "bool", value }
}

export function mkApp(e1: Expr, e2: Expr): App {
  return { kind: "app", e1, e2 }
}

export function mkLambda(v: Var, body: Expr): Lambda {
  return { kind: "lambda", var: v, body }
}

export function mkPApp(func: Func, 
                       args: Expr[]): PApp {
  return { kind: "papp", func, args }
}

export function showExpr(expr: Expr): string {
  return pprintLambda(expr)
}
