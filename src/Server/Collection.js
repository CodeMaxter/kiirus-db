'use strict'

const crypto = require('crypto')
const path = require('path')

const glob = require('glob')

const { Helper } = require('./../Support')
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
   * Delete one or many records from the collection using a query
   *
   * @param {function|string} query
   *
   * @return Promise<boolean>
   */
  delete (query) {
    return this.find(query).then((records) => {
      const collectionPath = this._getPath()

      const promises = records.map((record) => {
        const pathname = path.join(collectionPath, record._id + '.json')

        return Storage.exists(pathname).then((result) => {
          return Storage.deleteFile(pathname) ? record._id : undefined
        }).catch((error) => {
          throw new Error(`${messages.dontExists} ${error.code}`)
        })
      })

      return Promise.all(promises)
    })

  }

  /**
   * Select a fields set using a query expression
   *
   * @param {function|object} query
   * @return {Promise<array>}
   */
  find (query) {
    return this.getRecords(this.queryParser.build(query))
      .catch((error) => {
        return error
      })
  }

  /**
   * Read a set of files from the collection path
   *
   * @param {object} query
   * @returns {Promise<array>}
   */
  getRecords (query) {
    return new Promise((resolve, reject) => {
      const pathname = path.join(this._getPath(), '*.json')

      try {
        glob(pathname, async (error, files) => {
          if (error) {
            reject(error)
          }

          const records = []

          for (const file of files) {
            const record = await Storage.readJson(file)

            if (query(record) === true) {
              records.push(record)
            }
          }

          resolve(records)
        })
      } catch (error) {
        reject(`Access denied for user '${this.config.username}:${this.config.password}'`)
      }
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
   * Update a collection using a query to select the records to update and a
   * update object, containing the key and values to be updated
   *
   * @param {function|object} query
   * @param {object} update
   *
   * @return {Promise<array>}
   */
  update ({query, update}) {
    return this.find(query).then((records) => {
      return records.map((record) => {
        for (const [key, value] of Object.entries(update)) {
          Helper.setValue(record, key, value)
        }

        const pathname = path.join(
          this._getPath(),
          record._id + '.json'
        )

        Storage.writeFile(pathname, JSON.stringify(record))

        return record
      })
    })
  }

  /**
   * Write a ate set to a given collection and return the records ids
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

      // TODO implement this id in the following way
      // a 4-byte value representing the seconds since the Unix epoch,
      // a 3-byte machine identifier,
      // a 2-byte process id, and
      // a 3-byte counter, starting with a random value.
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
