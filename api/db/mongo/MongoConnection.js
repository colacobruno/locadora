const mongoose = require('mongoose')
const { log, database } = require('simple-node-framework').Singleton
const MongoAbstractConnection = require('./MongoAbstractConnection')

class MongoConnection extends MongoAbstractConnection {
  constructor() {
    super()

    this.mongoose = mongoose
    this.database = database
  }

  getConnection(nameDb) {
    try {
      return this.getMongo(nameDb)
    } catch (error) {
      log.error('MongoConnection', 'Erro ao tentar se conectar ao mongo')
      return null
    }
  }

  getMongo(nameDb) {
    return this.isMongoDb() ? this.getDatabase(nameDb) : this.getMongoose()
  }

  isMongoDb() {
    return this.mongoDB()
  }

  mongoDB() {
    return this.database.connections.mongodb
  }

  getDatabase(nameDb) {
    return this.mongoDB()[nameDb]
  }

  getMongoose() {
    return this.mongoose
  }
}

module.exports = MongoConnection
