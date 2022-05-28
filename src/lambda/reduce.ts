import { SimpleGenerator, unfoldr } from '../util/generators'
import * as Maybe from '../util/Maybe'
import * as L from './lang'

/**
 * @returns generator of the expression as it is iteratively reduced
 */
export function reduceGen(expr: L.Expr): SimpleGenerator<L.Expr> {
  return unfoldr(expr, (input: L.Expr) =>
    Maybe.map(reduce1(input), (reduced) => [input, reduced])
  )
}

/**
 * @returns expression with one form beta reduced, 
 *          or null if in (beta) normal form
 */
export function reduce1(expr: L.Expr): Maybe.Maybe<L.Expr> {
  if (expr.kind === 'app') {
    const func = expr.e1
    if (func.kind === 'lambda') {
      return applyLambda(func.var.name, expr.e2, func.body)
    } else if (func.kind === 'var') {
      if (func.name === 'if') {
        const e2Bool = parseBool(expr.e2)
        if (Maybe.isJust(e2Bool)) {
          return e2Bool ? ReturnFirst : ReturnSecond
        } else {
          return Maybe.bind<L.Expr, L.Expr>(reduce1(expr.e2), (e2Reduced) => {
            return L.mkApp(func, e2Reduced)
          })
        }
      } else {
        return Maybe.Nothing
      }
    } else {
      return Maybe.bind(reduce1(expr.e1), (e1Reduced) => L.mkApp(e1Reduced, expr.e2))
    }
  } else {
    return Maybe.Nothing
  }
}

// (\x. \y. x)
const ReturnFirst: L.Expr = L.mkLambda(L.mkVar('x'), L.mkLambda(L.mkVar('y'), L.mkVar('x')))

// (\x. \y. y)
const ReturnSecond: L.Expr = L.mkLambda(L.mkVar('x'), L.mkLambda(L.mkVar('y'), L.mkVar('x')))

function parseBool(expr: L.Expr): Maybe.Maybe<boolean> {
  if (expr.kind === 'var') {
    if (expr.name === 'true') {
      return true
    } else if (expr.name === 'false') {
      return false
    }
  }

  return Maybe.Nothing
}

function applyLambda(varName: string, varValue: L.Expr, body: L.Expr): L.Expr {
  if (body.kind === 'num') {
    return body
  } else if (body.kind === 'var') {
    return (body.name === varName) ? varValue : body
  } else if (body.kind === 'lambda') {
    return (body.var.name === varName) 
      ? body  // name is bound by this lambda, so no substitution is necessary
      : L.mkLambda(body.var, applyLambda(varName, varValue, body.body))
  } else if (body.kind === 'app') {
    return L.mkApp(applyLambda(varName, varValue, body.e1), 
                   applyLambda(varName, varValue, body.e2))
  }
}
