'use strict'

const { Client } = require('./../src')

const command = {command: 'create-collection', options: {name: 'users'}}

Client.connect('::', 8008).then((params) => {
  Client.send(JSON.stringify(command)).then((params) => {
    Client.close()
  })
})
