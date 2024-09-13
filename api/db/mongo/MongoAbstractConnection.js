const dictionary = {
  models: {}
}

class MongoAbstractConnection {
  getModel(nameDb, name, schema, schemaCollection = undefined) {
    if (!dictionary.models[name]) {
      const model = this.getConnection(nameDb).model(name, schema, schemaCollection)
      dictionary.models[name] = model
    }
    return dictionary.models[name]
  }

  getConnection() {
    throw new Error('getConnection não implementado')
  }
}

module.exports = MongoAbstractConnection
