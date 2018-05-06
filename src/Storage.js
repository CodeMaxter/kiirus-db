'use strict'

const fs = require('fs-extra')

module.exports = class Storage {
  /**
   * Recursively creates a directory in the hard disk
   *
   * @param {string} pathname
   * @param {number} mode
   *
   * @return {Promise<boolean|string>}
   */
  static createDir (pathname, mode = 0o666) {
    return new Promise((resolve, reject) => {
      fs.mkdirs(pathname, mode, (error) => {
        if (error) {
          reject(error)
        }

        resolve(true)
      })
    })
  }

  /**
   * Write to a file the given content
   *
   * @param {string} pathname
   * @param {string} content
   * @param {function} callback
   *
   * @return {Promise}
   */
  static createFile (pathname, content, callback = undefined) {
    return this.writeFile(pathname, content, callback)
  }

  /**
   * Delete a file from the fyle system
   * 
   * @param {string} pathname 
   * 
   * @returns {Promise<boolean>}
   */
  static deleteFile (pathname) {
    return new Promise((resolve, reject) => {
      fs.unlink(pathname, (error) => {
        if (error) {
          reject(error)
        }

        resolve(true)
      })
    })
  }

  static exists (pathname, sync = false) {
    if (sync) {
      try {
        return fs.statSync(pathname)
      } catch (e) {
        return false
      }
    }

    return new Promise((resolve, reject) => {
      fs.stat(pathname, (error, stats) => {
        if (error) {
          resolve(false)
        }

        resolve(stats)
      })
    })
  }

  static readFile (pathname, sync = false) {
    if (sync) {
      return fs.readFileSync(pathname, 'utf8')
    }

    return new Promise((resolve, reject) => {
      fs.readFile(pathname, 'utf8', (error, data) => {
        if (error) {
          reject(error)
        }

        resolve(data)
      })
    })
  }

  static readJson (pathname, sync = false) {
    if (sync) {
      return JSON.parse(this.readFile(pathname, sync))
    }

    return this.readFile(pathname).then((content) => {
      return JSON.parse(content)
    })
  }

  static writeFile (pathname, content, callback = undefined) {
    return new Promise((resolve, reject) => {
      fs.writeFile(pathname, content, (error) => {
        if (error) {
          reject(error)
        }

        resolve(callback !== undefined ? callback() : true)
      })
    })
  }
}
  