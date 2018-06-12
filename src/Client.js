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
        this.client = http.request(options, (response) => {
          let body = []

          response.on('data', function (chunk) {
            body.push(chunk)
          })

          response.on('end', function () {
            body = JSON.parse(Buffer.concat(body).toString())

            if (response.statusCode >= 200 && response.statusCode < 300) {
              resolve(body)
            }

            reject(response.statusCode)
          })
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
