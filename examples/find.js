'use strict'

const { Client } = require('./../src')

const database = 'myproject'

const client = new Client('::', 8008)

const db = client.db(database)

db.users.find({
  qty: { $gt: 50 }
}).then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)
})

// database.users.find({
//   'item': 'journal',
//   'qty': { '<': 70 },
//   'status': { '===': 'A' },
//   'size.h': { '<=': 8.5 },
//   'or': [{ 'size.w': 14 }, { '<=': 8.5 }]
// }).then((result) => {
//   console.log('\n\nfind with object parameter: ');

//   console.log(result)
// }).catch((error) => {
//   console.log(error)
// })
