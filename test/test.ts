import * as chai from 'chai'
import * as Lambda from '../src/lambda/parser'
import * as Util from '../src/lambda/parser'

const assert = chai.assert
const Lang = Lambda.Lang

describe('LambdaLang', function () {
  describe('#Var', function () {
    it('should parse simple', function () {
      assert.deepEqual(
        Lang.Var.tryParse('foo'), 
        Util.mkVar('foo')
      );
    });
  });

  describe('#App', function () {
    it('should parse simple', function () {
      assert.deepEqual(
        Lang.App.tryParse('foo bar'),
        Util.mkApp(Util.mkVar('foo'), Util.mkVar('bar'))
      )
    })
  })

  describe('#Lambda', function () {
    it('should parse simple', function () {
      assert.deepEqual(
        Lang.Lambda.tryParse('\\foo. bar'),
        Util.mkLambda(Util.mkVar('foo'), Util.mkVar('bar'))
      )
    })
  })

  describe('#Expr', function () {
    it('should parse var', function () {
      assert.deepEqual(
        Lang.Expr.tryParse('foo'),
        Util.mkVar('foo')
      )
    })
    it('should parse lambda', function () {
      assert.deepEqual(
        Lang.Expr.tryParse('\\foo. bar'),
        Util.mkLambda(Util.mkVar('foo'), Util.mkVar('bar'))
      )
    })
    it('should parse lambda in parens', function () {
      assert.deepEqual(
        Lang.Expr.tryParse('(foo bar)'),
        Util.mkApp(Util.mkVar('foo'), Util.mkVar('bar'))
      )
    })
  })
});