import {match, when, Pattern} from '..'

const {_} = Pattern

const isFizz = n => n % 3 === 0
const isBuzz = n => n % 5 === 0

const fizzbuzz = match.fn({
  [when.and(isFizz, isBuzz)]: 'FizzBuzz',
  [when(isFizz)]            : 'Fizz',
  [when(isBuzz)]            : 'Buzz',
  [when(_)]                 : n => n,
})

const array = []
for (let i = 1; i <= 15; i++) {
  array.push(fizzbuzz(i))
}

console.log(array) //=> [1, 2, 'Fizz', 4, 'Buzz', ...]
