'use strict'

const os = require('os')
const path = require('path')

const Storage = require('./Storage')

const getConfig = () => {
  if (Storage.exists('./kiirus-db.config', true)) {
    return Storage.readJson('./kiirus-db.config', true)
  } else {
    throw new Error('[Critical]: Config file is not available.')
  }
}

module.exports = {
  getConfig
}
