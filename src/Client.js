'use strict'

const net = require('net')

const client = new net.Socket()

client.on('data', (data) => {
  console.log(`Received: ${data}`)
  
	client.destroy() // kill client after server's response
})

client.on('close', () => {
	console.log('Connection closed')
})

const connect = (host, port) => {
  return new Promise((resolve, reject) => {
    client.connect(port, host, () => {
      console.log('Connected to Server')
  
      resolve()
    })
  })
}

const close = (data, encoding) => {
  client.end(data, encoding)
}

const send = (data, encoding = undefined) => {
  return new Promise((resolve, reject) => {
    client.write(data, encoding, () => {
      resolve()
    })
  })
}

module.exports = {
  close,
  connect,
  send,
}