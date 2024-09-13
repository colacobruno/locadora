const mongoose = require('mongoose')

const MongoConnectionFactory = require('../../../db/mongo/MongoConnectionFactory')

const reservationSchema = mongoose.Schema(
  {
    film: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Film',
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['RESERVED', 'LEASED', 'RETURNED'],
      default: 'RESERVED'
    },
    customer: {
      name: String,
      email: String,
      phone: String
    }
  },
  {
    collection: 'reservations'
  }
)

const getModel = () => {
  const connection = new MongoConnectionFactory().newConnection()
  return connection.getModel('application', 'Reservation', reservationSchema, 'reservations')
}

module.exports = { getModel }
