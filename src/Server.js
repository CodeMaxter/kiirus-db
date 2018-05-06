'use strict'

const net = require('net')
const os = require('os')
const path = require('path')

const Storage = require('./Storage')

const executeCommand = (data) => {
  try {
    const command = JSON.parse(data.toString('utf8'))
    
    console.log(`data: ${JSON.stringify(command)}`)
  } catch(error) {
    throw error;
  }
}

const getConfig = () => {
  let userConfig = {}
  const defaultConfig = {
    dbpath: path.join(os.homedir(), 'data/db'),
    criptoAlgorithm: 'aes-256-ctr',
    port: 8008
  }

  if (Storage.exists('./kiirus-db.config', true)) {
    userConfig = Storage.readJson('./kiirus-db.config', true)
  }

  return { ...defaultConfig, ...userConfig }
}

const handleConnection = (connection) => {
  const remoteAddress = connection.remoteAddress + ':' + connection.remotePort;

  console.log('new client connection from %s', remoteAddress);

  const onConnectionData = (data) => {
    console.log('connection data from %s: %j', remoteAddress, executeCommand(data))

    connection.write(data)
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

const config = getConfig()
const server = net.createServer()

server.on('connection', handleConnection)

module.exports = {
  start,
  stop
}
