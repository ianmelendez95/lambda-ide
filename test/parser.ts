import * as chai from 'chai'
import * as L from '../src/lambda/lang'
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
    it('should parse symbolic var', function () {
      assert.deepEqual(
        Parsers.Expr.tryParse('<='),
        L.mkVar('<=')
      )
    })
    it('should parse number', function () {
      assert.deepEqual(
        Parsers.Expr.tryParse('-123.4e+4'),
        L.mkNum(-1234000)
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
    it('should parse multiple apply', function () {
      assert.deepEqual(
        Parsers.Expr.tryParse('(foo bar baz qux)'),
        L.mkApp(L.mkApp(L.mkApp(L.mkVar('foo'), L.mkVar('bar')), L.mkVar('baz')), L.mkVar('qux'))
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