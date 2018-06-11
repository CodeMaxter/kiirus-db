'use strict'

const { Helper } = require('./../Support')

module.exports = class Collection {
  constructor(database, name, client) {
    this.client = client
    this.database = database
    this.name = name
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
        records: data
      }
    )

    return this.client.send(command)
  }
}
