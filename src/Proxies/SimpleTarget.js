module.exports = (targetObject, defaultFunction = undefined) => {
  return new Proxy(targetObject, {
    get (target, property, receiver) {
      if (Reflect.has(target, property)) {
        return Reflect.get(target, property)
      } else if (defaultFunction !== undefined) {
        return target[defaultFunction].call(target, property)
      }
    },
    getPrototypeOf (target) {
      return Object.getPrototypeOf(target)
    }
  })
}
