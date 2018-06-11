'use strict'

module.exports = class Helper {
  static createCommand (type, name, options) {
    return JSON.stringify({command: `${type.toLowerCase()}-${name}`, options})
  }
}
