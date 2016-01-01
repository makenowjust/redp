# redp

Red Phosphorus - Patter Match Library for ES2015 Era

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


## note

This library uses ES2015 `Symbol` and `Map`. If you want to run this on not ES2015 environment, you can try to use some polyfills. (However, it is not tested. I'm waiting your pull-request)


## license

MIT License: <http://makenowjust.mit-license.org/2016>

(C) 2016 TSUYUSATO Kitsune
