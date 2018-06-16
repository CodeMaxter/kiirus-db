'use strict'

const Collection = require('./Collection')
const { SimpleTarget } = require('./../Proxies')

module.exports = class Database {
  constructor(name, client) {
    this.client = client
    this.name = name

    return SimpleTarget(this, 'getCollection')
  }

  /**
   * Return a COllection object, configurated for the given collection
   *
   * @param {string} collection
   * @returns {Collection}
   */
  getCollection (collection) {
    return new Collection(this.name, collection, this.client)
  }
}
