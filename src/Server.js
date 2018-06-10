'use strict'

const net = require('net')

const { getConfig } = require('./Utils')

const config = getConfig()
const server = net.createServer()

const executeCommand = (data) => {
  try {
    const command = JSON.parse(data)
    
    console.log(`data: ${JSON.stringify(command)}`)
  } catch(error) {
    throw error;
  }
}

const handleConnection = (connection) => {
  const remoteAddress = connection.remoteAddress + ':' + connection.remotePort;

  console.log('new client connection from %s', remoteAddress);

  const onConnectionData = (data) => {
    const command = data.toString('utf8')

    executeCommand(command)

    console.log('connection data from %s: %j', remoteAddress, command)

    connection.write(command)
  }

  const onConnectionClose = () => {
    console.log('connection from %s closed', remoteAddress)
  }

  const onConnectionError = (error) => {
    console.log('Connection %s error: %s', remoteAddress, error.message)
  }

  connection.on('data', onConnectionData)
  connection.on('error', onConnectionError)
  connection.once('close', onConnectionClose)
}

const start = () => {
  server.listen(config.port, () => {
    console.log('server listening to %j', server.address())
  })
}

const stop = () => {
  server.close(() => {
    console.log('server closed')
  })
}

server.on('connection', handleConnection)

module.exports = {
  start,
  stop,
}
