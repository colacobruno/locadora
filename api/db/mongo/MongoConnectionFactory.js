const MongoConnection = require('./MongoConnection')

class MongoConnectionFactory {
  newConnection() {
    return new MongoConnection()
  }
}

module.exports = MongoConnectionFactory
