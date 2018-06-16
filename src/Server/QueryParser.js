'us strict'

module.exports = class QueryParser {
  /**
   * Parse a query expression
   *
   * @param {string} recordName 
   */
  constructor (recordName = 'record') {
    this.recordName = recordName

    this.queryFunction = []

    this.comparision = {
      '$eq': '===',
      '$gt': '>',
      '$gte': '>=',
      '$in': '$in',
      '$lt': '<',
      '$lte': '<=',
      '$ne': '!==',
      '$nin': '$nin',
      '$nor': '$nor',
    }

    this.logical = {
      '$and': '&&',
      '$not': '!',
      '$or': '||',
    }
  }

  /**
   * Build a query filter function
   *
   * @param {object} query
   * @return {Function}
   */
  build (query) {
    return new Function(this.recordName, `return ${this.parse(query).join(` && `)}`)
  }

  /**
   * Parse a query expression and returns the set of part that compose it
   *
   * @param {object} query
   * @param {string} operator
   * @param {string} glue
   * @return {array}
   */
  parse (query, operator = '===', glue = '&&') {
    const queryFunction = []

    for (let [key, item] of Object.entries(query)) {
      operator = this.comparision[key] ? key : operator

      const type = this._getType(item)

      switch (type) {
        case 'array':
          if (this.comparision[operator]) {
            queryFunction.push(
              this._parseComparation(item, key, this.comparision[operator])
            )
          } else {
            queryFunction.push(
              `(${this._parseArray(item, key, this.logical[key])})`
            )
          }

          break

        case 'boolean':
        case 'number':
        case 'string':
          queryFunction.push(this._parseScalar(key, item, operator, type))

          break

        case 'object':
          const [queryOperator, queryItem] = Object.entries(item)[0]

          queryFunction.push(this.parse({ [key]: queryItem }, queryOperator)[0])

          break
      }
    }

    return queryFunction
  }

  _getOperator (operator) {
    return this.comparision[operator] || operator
  }

  _getType (item) {
    if (Array.isArray(item)) {
      return 'array'
    } else if (Object.keys(this.logical).includes(item)) {
      return 'logical'
    } else if (Object.keys(this.comparision).includes(item)) {
      return 'comparision'
    } else {
      return typeof item
    }
  }

  _parseArray (query, operator, glue) {
    return query.map((value) => {
      return this.parse(value)
    }).join(` ${glue} `)
  }

  _parseComparation (item, key, operator) {
    switch (operator) {
      case '$in':
        return `[${item.join(', ')}].includes(${this.recordName}.${key})`

      case '$nin':
        return `![${item.join(', ')}].includes(${this.recordName}.${key})`

      case '$nor':
        return `!(${this._parseArray(item, key, '||')})`
    }
  }

  _parseScalar (key, value, operator, type) {
    if (type === 'string') {
      value = `'${value}'`
    }

    operator = this._getOperator(operator)

    return `${this.recordName}.${key} ${operator} ${value}`
  }
}
