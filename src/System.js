'use strict'

const os = require('os')
const path = require('path')

const Database = require('./Database')
const Storage = require('./Storage')
const Collection = require('./Collection')

const dbName = 'system'
const collections = {
  databases: [{
    name: dbName
  }],
  roles: [{
    role: 'admin',
    db: dbName,
    privileges: [],
  }],
  users: [{
    name: 'root',
    db: dbName,
    roles: ['admin'],
  }]
}

module.exports = class System {
  static getpathname (pathname, database) {
    return path.join(
      pathname,
      database
    )
  }

  static init (config) {
    if (this.verify(config) === false) {
      return this.createDatabases()
    }

    return Promise.resolve()
  }

  static createDatabases () {
    const promises = []

    const database = new Database()

    database.use(dbName)

    for (const [name, data] of Object.entries(collections)) {
      promises.push(database[name].insert(data))
    }
    // promises.push(database.databases.insert([{
    //   name: dbName
    // }]))
    
    // promises.push(database.users.insert([{
    //   name: 'root',
    //   db: dbName,
    //   roles: ['admin'],
    // }]))

    return Promise.all(promises)

    // .then((result) => {
    //   console.log(result)
    // }).catch((error) => {
    //   console.log(error)
    // })

    return promises
    // database.create(dbPath, systemDbName).then((result) => {
      
    //   database.users.insert([
    // })

    // Storage.createDir(dbPath)
    // .then((result) => {
    //   const collection = new Collection(config, systemDb, 'users')

    //   collection.insert()
    // })
  }

  static verify (config) {
    if (Storage.exists(config.dbpath, true) === false) {
      return false
    }

    // TODO: Check the system database for the database
    console.log(pathname);
  }
}
