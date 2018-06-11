'use strict'

const http = require('http')

const Database = require('./Client/Database')

module.exports = class Client {
  constructor (host, port) {
    this.host = host
    this.port = port
  }

  close (data, encoding) {
    this.client.end(data, encoding)
  }

  db (name) {
    return new Database(name, this)
  }

  send (data, encoding = undefined) {
    const options = {
      hostname: this.host,
      port: this.port,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }

    const result = new Promise((resolve, reject) => {
      try {
        this.client = http.request(options, (request) => {
          if (request.statusCode >= 200 && request.statusCode < 300) {
            resolve(request.statusCode)
          }
  
          reject(request.statusCode)
        })
      } catch (e) {
        reject(e.message)
      }

      this.client.on('error', (e) => {
        reject(e.message)
      })
    })

    this.client.write(data)

    return result
  }
}
