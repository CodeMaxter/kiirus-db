'use strict'

const http = require('http')

const { getConfig } = require('./../Utils')

module.exports = class Server {
  constructor () {
    this.config = getConfig()

    this.routes = {}

    this.requestHandler = this.requestHandler.bind(this)

    this.server = http.createServer(this.requestHandler)
  }

  get (path, handler) {
    this.routes['GET'] = {[path]: handler}
  }

  post (path, handler) {
    this.routes['POST'] = {[path]: handler}
  }

  requestHandler (request, response) {
    const { method, url } = request

    switch (method) {
      case 'GET':

        break

      case 'POST':
        let body = []

        request.on('data', (chunk) => {
          body.push(chunk)
        })

        request.on('end', () => {
          body = Buffer.concat(body).toString()

          if (request.headers['content-type'] === 'application/json') {
            body = JSON.parse(body)
          }

          request.body = body
          this.routes[method][url](request, response)
        })

        break
    }
  }

  start () {
    this.server.listen(this.config.port, (err) => {
      if (err) {
        return console.log('Something bad happened', err)
      }

      console.log(`Server is listening on ${this.config.port}`)
    })
  }

  stop () {
    server.close(() => {
      console.log('Server closed')
    })
  }

  write (response, data, statusCode = 200) {
    response.setHeader('Content-Type', 'application/json');
    response.writeHead(statusCode)
    response.write(data)
    response.end()
  }
}
