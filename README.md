# kiirus-db
An attempt to build a NoSQL document oriented database, entirely in JavaScript.

This Database use simple files to store the records and directories to represent the databases and collections, so, the architecture is very simple and easy to backup.

The the records is stored using AES *(Ths feature is in the roadmap, but first I need to implement some optimizations)*, to ensure an adequate level of protection for the data.

## Insert

```javascript
const { Client } = require('./../src')

const database = 'myproject'
const client = new Client('::', 8008)
const db = client.db(database)

db.users.insert([
  { item: 'journal', qty: 25, size: { h: 14, w: 21, uom: 'cm' }, status: 'A' },
  { item: 'notebook', qty: 50, size: { h: 8.5, w: 11, uom: 'in' }, status: 'A' },
  { item: 'paper', qty: 100, size: { h: 8.5, w: 11, uom: 'in' }, status: 'D' },
  { item: 'planner', qty: 75, size: { h: 22.85, w: 30, uom: 'cm' }, status: 'D' },
  { item: 'postcard', qty: 45, size: { h: 10, w: 15.25, uom: 'cm' }, status: 'A' }
]).then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)
})
```

## Find
To find registers into a collection, you need to pass a filter function to the find method.

```javascript
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
```

## Delete
To delete registers into a collection, you need to pass a filter function to the delete method.

```javascript
'use strict'

const { Client } = require('./../src')

const database = 'myproject'
const client = new Client('::', 8008)
const db = client.db(database)

db.users.delete({
  'size.uom': 'in',
}).then((records) => {
  console.log(JSON.stringify(records, null, '  '))
}).catch((error) => {
  console.log(error)
})
```

## Update
To update registers into a collection, you need to pass a filter function to the update method and a object with the data to update.

```javascript
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
```

# Todo

- [ ] Write missing test cases.
- [x] Create a HTTP server start the database and to receive requests.
- [x] Create a HTTP client to connect the database server and to perform operations.
- [x] Build a sintax to make querys, update and delete operations.
- [ ] Implement database encryption.
- [ ] Benchmark the database performance.