import {match, when, Pattern} from '..'

import test from 'ava'

const {_, rest} = Pattern

test('value', t => {
  ['test', 42, false, undefined, null, Symbol('test')].forEach(val => {
    t.true(match(val, {[when(val)]: true}))
    t.is(match('not match', {[when(val)]: true}), undefined)
  })
})

test('regexp', t => {
  const val = '==test=='
  const regexp = /test/

  t.true(match(val, {[when(regexp)]: true}))
  t.is(match('not match', {[when(regexp)]: true}), undefined)
})

test('array', t => {
  const array = ['test', 42, false, undefined, null, Symbol('test'), /test/]
  const val = array.slice()

  val[val.length - 1] = '==test=='
  t.true(match(val, {[when(array)]: true}))

  val[val.length - 1] = 'not match'
  t.is(match(val, {[when(array)]: true}), undefined)

  array[val.length - 1] = rest
  t.true(match(val, {[when(array)]: true}))
})

test('object', t => {
  const object = {
    string: 'test',
    number: 42,
    boolean: false,
    undefined: undefined,
    null: null,
    symbol: Symbol('test'),
    regexp: /test/,
  }
  const val = Object.keys(object).reduce((val, key) => {
    val[key] = object[key]
    return val
  }, {})
  val.regexp = '==test=='

  t.true(match(val, {[when(object)]: true}))

  val.regexp = 'not match'
  t.is(match(val, {[when(object)]: true}), undefined)
})

test('condition', t => {
  t.plan(2)

  const pred = () => {
    t.pass()
    return true
  }

  t.true(match(null, {[when(pred)]: true}))
})

test('wild', t => {
  t.true(match(null, {[when(_)]: true}))
})

test('or', t => {
  const pats = ['test', 42]

  t.true(match('test', {[when.or(...pats)]: true}))
  t.true(match(42, {[when.or(...pats)]: true}))
})

test('and', t => {
  const pats = [/test/, /^==|==$/]

  t.true(match('==test', {[when.and(...pats)]: true}))
  t.true(match('test==', {[when.and(...pats)]: true}))
})

test(t => {
  ['test', 42, false, undefined, null, Symbol('test'), ['hello', 'world'], {hello: 'world'}].forEach(val => {
    const pat = Pattern.from(val)

    t.true(match(val, {[when(pat)]: true}))
    t.is(match('not match', {[when(pat)]: true}), undefined)
  })

  ;[
    [/test/, 'test'],
    [(test => /test/.test(test)), 'test'],
  ].forEach(([pat, val]) => {
    pat = Pattern.from(pat)

    t.true(match(val, {[when(pat)]: true}))
    t.is(match('not match', {[when(pat)]: true}), undefined)
  })

  const pats = [/test/, /==/]

  ;['and', 'or'].forEach(op => {
    const pat = Pattern[op](...pats)

    t.true(match('==test==', {[when(pat)]: true}))
    t.is(match('not match', {[when(pat)]: true}), undefined)
  })
})
