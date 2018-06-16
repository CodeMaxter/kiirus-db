'use strict'

const { Client } = require('./../src')

const database = 'myproject'
const client = new Client('::', 8008)
const db = client.db(database)

db.users.update({
  item: 'paper'
}, {
  'size.uom': 'cm',
  status: 'P'
}).then((records) => {
  console.log(JSON.stringify(records, null, '  '))
}).catch((error) => {
  console.log(error)
})