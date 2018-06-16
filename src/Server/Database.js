'use strict'

const Collection = require('./Collection')

module.exports = class Database {
  constructor(config) {
    this.config = config
  }

  getCollection (collection) {
    return new Collection(this.config, this.name, collection)
  }

  use (name) {
    this.name = name
  }
}
