import {match, when, Pattern} from '..'

import * as faker from 'faker'

const {_} = Pattern

function lt(n) {
  return m => m < n
}

function collectAgeGroup(users) {
  const ageGroup = new Map()
  const pattern = {}

  for (let i = 0; i < 10; i++) {
    const age = i * 10
    const key = ` ${age ? age : ' 0'}+`

    ageGroup.set(key, [])
    pattern[when({old: lt(age + 10)})] = ({name}) => ageGroup.get(key).push(name)
  }
  ageGroup.set('100+', [])
  pattern[when(_)] = ({name}) => ageGroup.get('100+').push(name)

  users.forEach(match.fn(pattern))

  return ageGroup
}

const users = []
for (let i = 0; i < 30; i++) {
  users.push({old: ~~(Math.random() * 110), name: faker.name.findName()})
}

for (let [age, names] of collectAgeGroup(users)) {
  console.log(`${age}: ${names.join(', ')}`)
}
