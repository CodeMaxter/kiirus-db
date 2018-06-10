module.exports = (database) => {
  return new Proxy(database, {
    get (target, property, receiver) {
      if (Reflect.has(target, property)) {
        return Reflect.get(target, property)
      } else {
        return target.getCollection(property)
      }
    },
    getPrototypeOf (target) {
      return Object.getPrototypeOf(target)
    }
  })
}
