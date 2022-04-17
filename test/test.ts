import * as chai from 'chai'
import * as L from '../src/lambda/lang'
import Parser from '../src/lambda/parser'
import { Parsers } from '../src/lambda/parser'

const assert = chai.assert

describe('LambdaLang', function () {
  describe('#Expr', function () {
    it('should parse var', function () {
      assert.deepEqual(
        Parsers.Expr.tryParse('foo'),
        L.mkVar('foo')
      )
    })
    it('should parse lambda', function () {
      assert.deepEqual(
        Parsers.Expr.tryParse('\\foo. bar'),
        L.mkLambda(L.mkVar('foo'), L.mkVar('bar'))
      )
    })
    it('should parse lambda in parens', function () {
      assert.deepEqual(
        Parsers.Expr.tryParse('foo bar'),
        L.mkApp(L.mkVar('foo'), L.mkVar('bar'))
      )
    })
    it('should parse applied lambda', function () {
      assert.deepEqual(
        Parsers.Expr.tryParse('(\\foo. foo) bar'),
        L.mkApp(L.mkLambda(L.mkVar('foo'), L.mkVar('foo')), L.mkVar('bar'))
      )
    })
    it('should parse the Y combinator', function () {
      assert.deepEqual(
        Parsers.Expr.tryParse('\\f. (\\x. f (x x)) (\\x. f (x x))'),
        L.mkLambda(L.mkVar('f'), 
                   L.mkApp(L.mkLambda(L.mkVar('x'), 
                                      L.mkApp(L.mkVar('f'),
                                              L.mkApp(L.mkVar('x'), L.mkVar('x')))),
                           L.mkLambda(L.mkVar('x'), 
                                      L.mkApp(L.mkVar('f'),
                                              L.mkApp(L.mkVar('x'), L.mkVar('x'))))))
      )
    })
  })
});