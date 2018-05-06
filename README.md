# kiirus-db
An attempt to build a NoSQL document oriented database, entirely in JavaScript.

This Database use simple files to store the records and directories to represent the databases and collections, so, the architecture is very simple and easy to backup.

The the records is stored using AES, to ensure an adequate level of protection for the data.

## Insert

```javascript
const database = Database.connect(username, password)

database.use(dbname)

database.users.insert([
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
const database = Database.connect(username, password)

database.use(dbname)

database.users.find((record) => record.item === 'journal')
  .then((result) => {
    console.log('find with function parameter: ');
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })
```

## Delete
To delete registers into a collection, you need to pass a filter function to the delete method.

```javascript
const database = Database.connect(username, password)

database.use(dbname)

database.users.delete(
  (record) =>  record.size.uom === 'in',
).then((records) => {
  console.log(JSON.stringify(records, null, '  '))
})
```

## Update
To update registers into a collection, you need to pass a filter function to the update method and a object with the data to update.

```javascript
const database = Database.connect(username, password)

database.use(dbname)

database.users.update(
  (record) => record.item === 'paper', {
    'size.uom': 'cm',
    status: 'P'
  }
).then((records) => {
  console.log(JSON.stringify(records, null, '  '))
})
```

# Todo

- [ ] Write missing test cases.
- [ ] Create a HTTP server start the database and to receive requests.
- [ ] Create a client to connect the database server and to perform operations.
- [ ] Build a sintax to make querys, update and delete operations.
- [ ] Benchmark the database performance.