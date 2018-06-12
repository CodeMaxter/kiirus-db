'use strict'

const { Helper } = require('./../Support')

module.exports = class Collection {
  constructor(database, name, client) {
    this.client = client
    this.database = database
    this.name = name
  }

  /**
   * Select a fields set using a query expression
   *
   * @param {function|object} query
   * @return {Promise<array>}
   */
  async find (query) {
    const command = Helper.createCommand(
      this.constructor.name,
      'find',
      {
        database: this.database,
        collection: this.name,
        data: query
      }
    )

    return this.client.send(command)
  }

  /**
   * Insert a data set into the collection
   *
   * @param {array} data
   * @return {Promise<boolean>}
   */
  async insert (data) {
    const command = Helper.createCommand(
      this.constructor.name,
      'insert',
      {
        database: this.database,
        collection: this.name,
        data
      }
    )

    return this.client.send(command)
  }
}
