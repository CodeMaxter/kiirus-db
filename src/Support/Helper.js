'use strict'

module.exports = class Helper {
  static createCommand (type, name, options) {
    return JSON.stringify({command: `${type.toLowerCase()}-${name}`, options})
  }

  /**
   * Set an array item to a given value using "dot" notation.
   *
   * If no path is given to the method, the entire array will be replaced.
   *
   * @param  {array}   array
   * @param  {string}  key
   * @param  {*}   value
   * @return {array}
   */
  static setValue (object, path, value) {
    if (path === undefined) {
      object = value

      return object
    }

    const keys = path.split('.')

    while (keys.length > 1) {
      path = keys.shift()

      // If the key doesn't exist at this depth, we will just create an empty array
      // to hold the next value, allowing us to create the arrays to hold final
      // values at the correct depth. Then we'll keep digging into the array.
      if ((object[path] === undefined || object[path] === null) ||
        !Array.isArray(object[path])
      ) {
        object[path] = {}
      }

      object = object[path]
    }

    object[keys.shift()] = value

    return object
  }
}
