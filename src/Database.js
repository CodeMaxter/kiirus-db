'use strict'

const config = require('./../kiirus-db-config.json')

const Collection = require('./Collection')
const { CollectionProxy } = require('./Proxies')
const Storage = require('./Storage')

module.exports = class System {
  constructor (username, password) {
    return CollectionProxy(this)
  }

  create (name, location) {
    return Storage.createDir(pathname)
  }

  getCollection (collection) {
    return new Collection(this.name, collection)
  }

  use (name) {
    this.name = name
  }
}
