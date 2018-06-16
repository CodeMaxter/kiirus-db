'use strict'

const { Database, Server } = require('./src/Server')

const server = new Server()
const database = new Database(server.config)

server.post('/', (request, response) => {
  const { command, options } = request.body
  const [ type, operation ] = command.split('-')

  switch (type) {
    case 'collection':
      database.use(options.database)

      try {
        database.getCollection(options.collection)[operation](options.data)
          .then((result) => {
            server.write(response, JSON.stringify(result))
          }).catch((error) => {
            console.log(error)
          })
      } catch (e) {
        // TODO Manage the error in a proper way
        server.write(response, JSON.stringify({message: 'Unexpected error.'}))
      }

      break
  }

})

server.start()
