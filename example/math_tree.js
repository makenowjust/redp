import {match, when} from '..'

function binary(op, left, right) {
  return {
    type: 'binary',
    operator: op,
    left, right
  }
}

function unary(op, value) {
  return {
    type: 'unary',
    operator: op,
    value
  }
}

function number(value) {
  return {
    type: 'number',
    value
  }
}

// -100 * 200 + 300
const tree = binary('+', binary('*', unary('-', number(100)), number(200)), number(300))

const calc = match.fn({
  [when({type: 'binary', operator: '+'})]: ({left, right}) => calc(left) + calc(right),
  [when({type: 'binary', operator: '*'})]: ({left, right}) => calc(left) * calc(right),
  [when({type: 'unary' , operator: '-'})]: ({value}) => -calc(value),
  [when({type: 'number'})]               : ({value}) => value,
})

console.log(calc(tree)) //=> -19700
