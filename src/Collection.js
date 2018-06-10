'use strict'

const crypto = require('crypto')
const path = require('path')

const config = require('./../kiirus-db-config.json')
const Storage = require('./Storage')

module.exports = class Collection {
  /**
   *
   * @param {object} config
   * @param {string} database
   * @param {string} name
   */
  constructor (database, name) {
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
    const pathname = this._getCollectionPath()

    const exists = await Storage.exists(pathname)

    if (exists) {
      return this.write(pathname, data)
    } else {
      return Storage.createDir(pathname).then((result) => {
        return this.write(pathname, data)
      }).catch((error) => {
        return error
      })
    }
  }

    /**
   * Write a data set to a given collection and return the records ids
   *
   * @param {string} collection
   * @param {array} data
   *
   * @return {Promise<array>}
   */
  write (collection, data) {
    const promises = []

    for (const record of data) {
      // TODO: Verify if the record come with a _id, if the record have a _id,
      // do not generate a new _id. But the Generate _id is needed to save the
      // file to the fyle system
      record._id = record._id || crypto.randomBytes(20).toString('hex')

      promises.push(
        Storage.createFile(
          path.join(collection, record._id + '.json'),
          this._cipher(JSON.stringify(record)),
          () => {
            return record._id
          }
        )
      )
    }

    return Promise.all(promises)
  }

  _getCollectionPath () {
    return path.join(
      config.dbpath,
      this.database,
      this.name
    )
  }

  _cipher (data) {
    return data
  }

  _decipher (data) {
    return data
  }
}
