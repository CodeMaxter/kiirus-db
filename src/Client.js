'use strict'

const net = require('net')

module.exports = class Client {
  constructor (host, port) {
    this._client = new net.Socket()
    this._host = host
    this._port = port
  }

  close (data, encoding) {
    this._client.end(data, encoding)
  }

  connect () {
    return new Promise((resolve, reject) => {
      this._client.connect(this._port, this._host, () => {
        console.log('Connected to Server')

        resolve()
      })
    })
  }

  send (data, encoding = undefined) {
    return new Promise((resolve, reject) => {
      this._client.write(data, encoding, () => {
        resolve()
      })
    })
  }
}
