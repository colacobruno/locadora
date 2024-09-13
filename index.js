require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
require('express-async-errors')

const { CustomServer } = require('./api/config/custom-server')

const server = new CustomServer().configure({
  listenCallBack() {},
  afterListenCallback() {}
})

module.exports = server.app
