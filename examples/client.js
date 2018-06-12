'use strict'

const { Client } = require('./../src')

const database = 'myproject'

const client = new Client('::', 8008)

const db = client.db(database)
