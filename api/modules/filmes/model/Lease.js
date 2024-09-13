const mongoose = require('mongoose')

const MongoConnectionFactory = require('../../../db/mongo/MongoConnectionFactory')

const leaseSchema = mongoose.Schema(
  {
    film: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Film',
      required: true
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      required: true
    },
    customer: {
      name: String,
      email: String,
      phone: String
    },
    status: { type: String, enum: ['LEASED', 'RETURNED'], required: true }
  },
  {
    timestamps: true,
    collection: 'leases'
  }
)

const getModel = () => {
  const connection = new MongoConnectionFactory().newConnection()
  return connection.getModel('application', 'Lease', leaseSchema, 'leases')
}

module.exports = { getModel }
