'use strict'

const crypto = require('crypto')
const path = require('path')

const glob = require('glob')

const QueryParser = require('./QueryParser')
const Storage = require('./../Storage')

module.exports = class Collection {
  /**
   *
   * @param {object} config
   * @param {string} database
   * @param {string} name
   */
  constructor (config, database, name) {
    this.config = config
    this.database = database
    this.queryParser = new QueryParser()
    this.name = name
  }

  /**
   * Select a fields set using a query expression
   *
   * @param {function|object} query
   * @return {Promise<array>}
   */
  async find (query) {
    return this.getRecords(this.queryParser.build(query))
      .then((records) => {
        return records.filter(this.queryParser.build(query))
      }).catch((error) => {
        return error
      })
  }

    /**
   * Read a set of files from the collection path
   *
   * @param {object} query
   * @returns {Promise<array>}
   */
  async getRecords (query) {
    return new Promise((resolve, reject) => {
      const pathname = path.join(this._getPath(), '*.json')

      glob(pathname, (error, files) => {
        if (error) {
          reject(error)
        }

        const promises = []

        files.forEach((file) => {
          promises.push(Storage.readFile(file))
        })

        Promise.all(promises).then((records) => {
          try {
            resolve(records.map((record) => JSON.parse(this._decipher(record))))
          } catch (error) {
            reject(`Access denied for user '${this.config.username}:${this.config.password}'`)
          }
        })
      })
    })
  }

  /**
   * Insert a data set into the collection
   *
   * @param {array} data
   * @return {Promise<boolean>}
   */
  async insert (data) {
    const pathname = this._getPath()

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
   * Write a ate set to a given collection and return the records ids
   *
   * @param {string} collection
   * @param {array} data
   *
   * @return {Promise<array>}
   */
  async write (collection, data) {
    const promises = []

    for (const record of data) {
      // TODO: Verify if the record come with a _id, if the record have a _id,
      // do not generate a new _id. But the Generate _id is needed to save the
      // file to the fyle system
      record._id = crypto.randomBytes(20).toString('hex')

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

  _cipher (data) {
    return data
  }

  _decipher (data) {
    return data
  }

  _getPath () {
    return path.join(
      this.config.dbpath,
      this.database,
      this.name
    )
  }
}
