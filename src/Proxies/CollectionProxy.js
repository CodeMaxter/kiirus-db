'use strict'

const { Helper } = require('./../Support')

module.exports = (targetObject) => {
  return new Proxy(targetObject, {
    get (target, property, receiver) {
      if (Reflect.has(target, property)) {
        return Reflect.get(target, property)
      } else {
        return (data) => {
          const command = Helper.createCommand(
            target.constructor.name,
            property,
            {
              database: target.database,
              collection: target.name,
              data
            }
          )

          return target.client.send(command)
        }
      }
    },
    getPrototypeOf (target) {
      return Object.getPrototypeOf(target)
    }
  })
}
