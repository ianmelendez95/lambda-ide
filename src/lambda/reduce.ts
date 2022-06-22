import { SimpleGenerator } from '../util/generators'
import * as Generators from '../util/generators'
import * as Maybe from '../util/Maybe'
import * as L from './lang'
import * as Builtins from './builtins'

/**
 * @returns generator of the expression as it is iteratively reduced
 */
export function reduceGen(expr: L.Expr): SimpleGenerator<L.Expr> {
  return Generators.iterateMaybe(expr, reduce1)
}

/**
 * @returns expression with one form beta reduced, 
 *          or null if in (beta) normal form
 */
export function reduce1(expr: L.Expr): Maybe.Maybe<L.Expr> {
  L.unflagReduced(expr) // be sure to reset the 'reduced' status of the expression

  if (expr.kind === 'papp') {
    return evalPApp(expr)
  } else if (expr.kind === 'var') {
    return Maybe.bind(
      Builtins.lookupBuiltin(expr.name),
      (builtin) => L.flagReduced(L.mkPApp(builtin, []))
    )
  } else if (expr.kind === 'app') {
    const func = expr.e1
    if (func.kind === 'papp') {
      const evaled = evalPApp(func)
      if (Maybe.isJust(evaled)) {
        // performed evaluation, so create the new application
        return L.mkApp(evaled, expr.e2)
      } else {
        // couldn't evaluate the partial application, so push the argument onto it
        return L.flagReduced(L.mkPApp(func.func, func.args.concat([expr.e2])))
      }
    } else if (func.kind === 'lambda') {
      return L.flagReduced(applyLambda(func.var.name, expr.e2, func.body))
    } else {
      return Maybe.bind(reduce1(expr.e1), (e1Reduced) => L.mkApp(e1Reduced, expr.e2))
    }
  } else {
    return Maybe.Nothing
  }
}

function evalPApp(papp: L.PApp): Maybe.Maybe<L.Expr> {
  if (papp.args.length < papp.func.arity) {
    // not enough args, so we do not reduce or produce a value
    return null
  } else if (papp.args.length > papp.func.arity) {
    // too many args, throw an error
    throw new Error('Partial application has more arguments than expected: ' + L.showExpr(papp))
  } else {
    // enough args, attempt to reduce an argument
    const reducedArgs = reduceFirstReducibleExpression(papp.args)
    if (Maybe.isJust(reducedArgs)) {
      // found a reduble argument, return the partial app with this argument reduced
      return L.mkPApp(papp.func, reducedArgs)
    } else {
      // no arguments reducible, so delegate to the function to evaluate with the arguments
      return L.flagReduced(papp.func.body(papp.args))
    }
  }
}

function reduceFirstReducibleExpression(exprs: L.Expr[]): Maybe.Maybe<Array<L.Expr>> {
  let reducedExpr = Maybe.Nothing
  for (let i = 0; i < exprs.length; i++) {
    reducedExpr = reduce1(exprs[i])
    if (Maybe.isJust(reducedExpr)) {
      // found first reducible expression, reduce it and return
      let newExprs = [...exprs]
      newExprs[i] = L.flagReduced(reducedExpr)
      return Maybe.just(newExprs)
    }   
  }

  // did not encounter a reducible expression, so no result
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
