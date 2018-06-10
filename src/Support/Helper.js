'use strict'

const MAX_SAFE_INTEGER = 9007199254740991

module.exports = class Helper {
  static isJson (value) {
    try {
      JSON.parse(value)
    } catch (e) {
        return false
    }

    return true
  }
}