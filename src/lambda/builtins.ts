import * as L from "./lang";
import * as Maybe from "../util/Maybe"

export function lookupBuiltin(name: string): Maybe.Maybe<L.Func> {
  const res = builtinsByName[name]
  if (typeof res === 'undefined') {
    return Maybe.Nothing
  } else { 
    return Maybe.just(res)
  }
}


/* ****
 * if
 */

const ifFunc: L.Func = {
  kind: "func",
  name: "if",
  arity: 1,
  body: function(args: L.Expr[]): L.Expr {
    if (args[0].kind !== 'bool') {
      throw new Error(this.name + ": expecting boolean argument, got: " + L.showExpr(args[0]))
    } else {
      return args[0].value ? ReturnFirst : ReturnSecond
    }
  }
}

// (\x. \y. x)
const ReturnFirst: L.Expr = L.mkLambda(L.mkVar('x'), L.mkLambda(L.mkVar('y'), L.mkVar('x')))

// (\x. \y. y)
const ReturnSecond: L.Expr = L.mkLambda(L.mkVar('x'), L.mkLambda(L.mkVar('y'), L.mkVar('y')))


/* ****
 * arithmetic
 */

const lessThan: L.Func = {
  kind: "func",
  name: "<",
  arity: 2,
  body: function(args: L.Expr[]): L.Expr {
    if (args[0].kind !== 'num') {
      throw new Error(this.name + ': Expecting numeric arguments, got: ' + L.showExpr(args[0]))
    } else if (args[1].kind !== 'num') {
      throw new Error(this.name + ': Expecting numeric arguments, got: ' + L.showExpr(args[1]))
    } else {
      return L.mkBool(args[0].value < args[1].value)
    }
  }
}

const multiply: L.Func = {
  kind: "func",
  name: "*",
  arity: 2,
  body: function(args: L.Expr[]): L.Expr {
    if (args[0].kind !== 'num') {
      throw new Error(this.name + ': Expecting numeric arguments, got: ' + L.showExpr(args[0]))
    } else if (args[1].kind !== 'num') {
      throw new Error(this.name + ': Expecting numeric arguments, got: ' + L.showExpr(args[1]))
    } else {
      return L.mkNum(args[0].value * args[1].value)
    }
  }
}

const minus: L.Func = {
  kind: 'func',
  name: '-',
  arity: 2,
  body: function(args: L.Expr[]): L.Expr {
    if (args[0].kind !== 'num') {
      throw new Error(this.name + ': Expecting numeric arguments, got: ' + L.showExpr(args[0]))
    } else if (args[1].kind !== 'num') {
      throw new Error(this.name + ': Expecting numeric arguments, got: ' + L.showExpr(args[1]))
    } else {
      return L.mkNum(args[0].value - args[1].value)
    }
  }
}

const builtinsByName: { [name: string]: L.Func } = {
  '<': lessThan,
  '*': multiply,
  '-': minus,
  'if': ifFunc
}
