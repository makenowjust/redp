import {match, when, Pattern} from '..'

const {_, rest} = Pattern

function map(array, func) {
  return match(array, {
    [when([])]       : [],
    [when([_, rest])]: array => [func(array[0])].concat(map(array.slice(1), func)),
  })
}

console.log(map([1, 2, 3, 4, 5], val => val * 2)) // => [2, 4, 6, 8, 10]
