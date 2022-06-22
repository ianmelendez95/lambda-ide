import * as PP from 'prettier-printer'
import * as L from './lang'
import * as Arrays from '../util/arrays'


export function pprintLambda(expr: L.Expr): string {
  return PP.renderWith({
    line: result => result + '<br/>',
    text: (result, text) => result + text
  }, '', 80, topprint(expr))
}

function topprint(expr: L.Expr): PP.IDoc {
  const barePPrint: PP.IDoc = topprintBare(expr)
  return expr.reduced ? PP.prepend('<b>', PP.append('</b>', barePPrint)) : barePPrint
}

function topprintBare(expr: L.Expr): PP.IDoc {
  if (expr.kind === 'var') {
    return expr.name
  } else if (expr.kind === 'num' || expr.kind === 'bool') {
    return expr.value.toString()
  } else if (expr.kind === 'app') {
    return parens(nestBreak(topprint(expr.e1), topprint(expr.e2)))
  } else if (expr.kind === 'lambda') {
    const lambdaBind: PP.IDoc = PP.prepend('\\', PP.prepend(topprint(expr.var), '.'))
    return parens(nestBreak(lambdaBind, topprint(expr.body)))
  } else {
    return pprintPApp(expr)
  }
}

function pprintPApp(papp: L.PApp): PP.IDoc {
  if (papp.args.length > papp.func.arity) {
    // can't properly print the actual application since we are in the printing code
    throw new Error("Partial application has more arguments than the function's arity")
  }

  // collect the args as IDocs, where '_' stands in for unprovided args
  const argDocs: PP.IDoc[] = Arrays.repeat('_', papp.func.arity)
  papp.args.map(topprint).forEach((argDoc: PP.IDoc, i: number) => {
    // update the placeholders with the provided arg document
    argDocs[i] = argDoc
  })

  try {
    const prettyArgs = PP.group(PP.intersperse(PP.line, argDocs))
    return PP.enclose(PP.brackets, nestBreak(papp.func.name, prettyArgs))
  } catch (e) {
    console.error(e)
    return '[[ERROR]]'
  }
}

function parens(doc: PP.IDoc) {
  return PP.enclose(PP.parens, doc)
}

function nestBreak(lhs: PP.IDoc, rhs: PP.IDoc) {
  return PP.nest(2, PP.group([lhs, PP.line, rhs]))
}
