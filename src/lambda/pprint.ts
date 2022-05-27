import * as PP from 'prettier-printer'
import * as L from './lang'


export function pprintLambda(expr: L.Expr): string {
  return PP.render(80, topprint(expr))
}

function topprint(expr: L.Expr): PP.IDoc {
  if (expr.kind === 'var') {
    return expr.name
  } else if (expr.kind === 'num') {
    return expr.value.toString()
  } else if (expr.kind === 'app') {
    return parens(nestBreak(topprint(expr.e1), topprint(expr.e2)))
  } else {
    const lambdaBind: PP.IDoc = PP.prepend('\\', PP.prepend(topprint(expr.var), '.'))
    return parens(nestBreak(lambdaBind, topprint(expr.body)))
  }
}

function parens(doc: PP.IDoc) {
  return PP.enclose(PP.parens, doc)
}

function nestBreak(lhs: PP.IDoc, rhs: PP.IDoc) {
  return PP.nest(2, PP.group([lhs, PP.line, rhs]))
}
