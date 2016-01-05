# redp

Red Phosphorus - Pattern Match Library for ES2015 Era

[![Build Status](https://travis-ci.org/MakeNowJust/redp.svg?branch=master)](https://travis-ci.org/MakeNowJust/redp)


## example

```javascript
import {match, when} from 'redp'

// create function to calculate expression tree
const calc = match.fn({
  [when({type: 'binary', operator: '+'})]: ({left, right}) => calc(left) + calc(right),
  [when({type: 'binary', operator: '*'})]: ({left, right}) => calc(left) * calc(right),
  [when({type: 'unary' , operator: '-'})]: ({value}) => -calc(value),
  [when({type: 'number'})]               : ({value}) => value,
})

// -100 + 200 ==> 100
console.log(calc({
  type: 'binary',
  operator: '+',
  left: {
    type: 'unary',
    operator: '-',
    value: {
      type: 'number',
      value: 100,
    },
  },
  right: {
    type: 'number',
    value: 200,
  },
}))
```

You could be look for more examples in [example/](./example/) and [test/](./test/).


## install

```console
$ npm install --save redp
```


## API

```javascript
import {match, when, Pattern} from 'redp`
```

### `match(value, pattern)`

Shortcut to `match.fn(pattern)(value)`.

### `match.fn(patterns)`

Create new function to match `patterns`. `patterns` should be an `Object`. Its keys should be created by `when` function. Returned function accept one argument then try to match `patterns`. Matching some pattern, return it. If not, return `undefined`.

### `when(pattern)`

Create pattern *key* from `pattern`. `pattern` is either some javascript value (`"string"` or `true` or `/regexp/` or `(arrow) => func` or ...) or `Pattern.*` function's result. If `pattern` is some javascript value, it is passed to `Pattern.from`.

Pattern key is not reusable. If you want to reuse `pattern`, you could use `Pattern.from`.

### `when.and(...patterns)`

Shortcut to `when(Pattern.and(...patterns))`.

### `when.or(...patterns)`

Shortcut to `when(Pattern.or(...patterns))`.

### `Pattern`

This is a factory for pattern object.

```javascript
export const Pattern = {
  // Wild card pattern. It can match all values.
  _: ...,

  // Rest pattern. It can match no items or some rest items of array (cannot object!).
  rest: ...,

  // Create pattern object from `object`.
  from(object) {
    // If `object` is pattern object already, return `object`.
    // If `object` is a `RegExp`, create regexp pattern.
    // If `object` is an `Array`, create array pattern.
    // If `object` is a javascript object, create object pattern.
    // If `object` is a function, create condition pattern.
    // Otherwise, create value pattern.
    ...
  },

  // Create regexp pattern.
  regexp(regexp) { ...  },

  // Create array pattern.
  array(array) { ... },

  // Create object pattern.
  object(object) { ... },

  // Create condition pattern.
  condition(predicate) { ... },

  // Create value pattern.
  value(value) { ... },

  // Create 'and' pattern.
  and(...patterns) { ... },

  // Create 'or' pattern.
  or(...patterns) { ... },

  // If `object` is pattern object, return `true`,
  // otherwise return `false`.
  is(object) { ... },
}
```


## note

This library uses ES2015 `Symbol` and `Map`. If you want to run this on not ES2015 environment, you can try to use some polyfills. (However, it is not tested. I'm waiting your pull-request)


## license

MIT License: <http://makenowjust.mit-license.org/2016>

(C) 2016 TSUYUSATO Kitsune
