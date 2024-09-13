const mongoose = require('mongoose')

const MongoConnectionFactory = require('../../../db/mongo/MongoConnectionFactory')

const schema = mongoose.Schema(
  {
    name: String,
    synopsis: String,
    rating: String
  },
  {
    collection: 'films'
  }
)

const getModel = () => {
  const connection = new MongoConnectionFactory().newConnection()
  return connection.getModel('application', 'Film', schema, 'films')
}

module.exports = { getModel }
