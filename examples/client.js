'use strict'

const { Client } = require('./../src')

const command = {command: 'create-collection', options: {name: 'users'}}
const database = 'myproject'

const client = new Client('::', 8008)
client.connect().then((params) => {
  client.send(JSON.stringify(command)).then((params) => {
    Client.close()
  })
})
