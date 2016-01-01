// Internal constants

// A map to register patterns
const SYM2PAT = new Map()
// A symbol for rest parameter
const REST = Symbol('rest')
// A symbol to mark array as pattern
const MARK = Symbol('mark')
// Pattern type flags
const FLAGS = `
  wild
  and
  or
  value
  regexp
  array
  object
  condition`
  .trim()
  .split(/\s+/g)
  .filter(Boolean)
  .reduce((flags, flag) => {
    flags[flag] = flag
    return flags
  }, {})
// Return `undefined` every
const ignore = () => undefined


// Export functions and objects

// Test to match `pattern` with `value`,
// then matched action call.
export function match(value, pattern) {
  return match.fn(pattern)(value)
}

// Create pattern-matcher function from given `patterns`.
match.fn = function fn(patterns) {
  const matchers = Object.getOwnPropertySymbols(patterns)
    .map(key => {
      const matcher = createMatcher(SYM2PAT.get(key))
      SYM2PAT.delete(key)
      return [matcher, createAction(patterns[key])]
    })

  return input => (matchers.find(([matcher, action]) => matcher(input)) || [, ignore])[1](input)
}

// Create pattern key from given `pattern`.
// `pattern` must be pattern object.
//
// NOTE: pattern key can be used only once.
// If you want to reuse the pattern, you can use `pattern` APIs.
export function when(pattern) {
  const key = Symbol()
  SYM2PAT.set(key, Pattern.from(pattern))

  return key
}

// Shortcut to `when(pattern.and(...patterns))`
when.and = function and(...patterns) {
  return when(Pattern.and(...patterns))
}

// Shortcut to `when(pattern.or(...patterns))`
when.or = function or(...patterns) {
  return when(Pattern.or(...patterns))
}

// Mark array as pattern
function mark(array) {
    array[MARK] = true

    return array
}

// Create pattern object from given arguments (except for `pattern._` and `pattern.rest`).
export const Pattern = {
  mark: mark,
  _: mark([FLAGS.wild]),
  rest: REST,

  // Create pattern object from given `object`.
  from(object) {
    if (object && object[MARK]) {
      return object
    }

    if (object instanceof RegExp) {
      return Pattern.regexp(object)
    }

    if (isArray(object)) {
      return Pattern.array(object)
    }

    if (isObject(object)) {
      return Pattern.object(object)
    }

    if (typeof object === 'function') {
      return Pattern.condition(object)
    }

    return Pattern.value(object)
  },

  and(...patterns) {
    return mark([FLAGS.and, ...patterns.map(Pattern.from)])
  },

  or(...patterns) {
    return mark([FLAGS.or, ...patterns.map(Pattern.from)])
  },

  value(value) {
    return mark([FLAGS.value, value])
  },

  regexp(regexp) {
    return mark([FLAGS.regexp, regexp.toString()])
  },

  array(patterns) {
    let restFlag = false

    if (patterns[patterns.length - 1] === REST) {
      restFlag = true
      patterns = patterns.slice(0, -1)
    }

    return mark([FLAGS.array, restFlag, patterns.map(Pattern.from)])
  },

  object(object) {
    const patterns = Object.keys(object).map(key => [key, Pattern.from(object[key])])

    return mark([FLAGS.object, patterns])
  },

  condition(predicate) {
    return mark([FLAGS.condition, predicate])
  },
}


// Internals

// Create matcher from given `pattern`.
function createMatcher(pattern) {
  return createMatcher[pattern[0]](...pattern.slice(1))
}

createMatcher[FLAGS.wild] = function wild() {
  // ['wild']
  return () => true
}

createMatcher[FLAGS.and] = function and(...patterns) {
  // ['and', pattern1, pattern2, ...]
  const matchers = patterns.map(createMatcher)

  return input => matchers.every(matcher => matcher(input))
}

createMatcher[FLAGS.or] = function or(...patterns) {
  // ['or', pattern1, pattern2, ...]
  const matchers = patterns.map(createMatcher)

  return input => matchers.some(matcher => matcher(input))
}

createMatcher[FLAGS.value] = function value(value) {
  // ['value', value]
  return input => input === value
}

createMatcher[FLAGS.regexp] = function regexp(regexp) {
  // ['regexp', '/regexp_pattern/regexp_flag']
  const flagIndex = regexp.lastIndexOf('/')
  const pattern = regexp.slice(1, flagIndex)
  const flag = regexp.slice(flagIndex + 1)

  regexp = new RegExp(pattern, flag)

  return input => regexp.test(input)
}

createMatcher[FLAGS.array] = function array(restFlag, patterns) {
  // ['array', rest_flag, [pattern1, pattern2, ...]]
  const matchers = patterns.map(createMatcher)

  return input =>
    isArray(input) &&
    (input.length === matchers.length || restFlag && input.length > matchers.length) &&
    matchers.every((matcher, i) => matcher(input[i]))
}

createMatcher[FLAGS.object] = function object(patterns) {
  // ['object', [[key1, pattern1], [key2, pattern2], ...]]
  const matchers = patterns.map(([key, pattern]) => [key, createMatcher(pattern)])

  return input => {
    if (!isObject(input)) {
      return false
    }

    const keys = Object.keys(input)

    return matchers.every(([key, matcher]) => matcher(input[key]))
  }
}

createMatcher[FLAGS.condition] = function condition(predicate) {
  // ['condition', predicate]
  return predicate
}

// Create action from `action`.
function createAction(action) {
  return typeof action === 'function' ? action : () => action
}

function isArray(object) {
  return Array.isArray(object)
}

function isObject(object) {
  return object && typeof object === 'object'
}
