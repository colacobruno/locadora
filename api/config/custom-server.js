const { Server } = require('simple-node-framework')

class CustomServer extends Server {
  constructor() {
    super({
      module: 'SNF Custom Server'
    })
  }

  configureErrorHandler() {
    process.on('uncaughtException', error => {
      this.log.error('Uncaught Exception', {
        error: {
          type: 'uncaughtException',
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
    })

    process.on('unhandledRejection', error => {
      this.log.error('Unhandled Rejection', {
        error: {
          type: 'unhandledRejection',
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
    })
  }

  listen(port, listenCallBack, afterListenCallback) {
    const _port = this.config.app.port || port
    this.server = this.app.listen(_port, () => {
      this.log.info(
        `The sandbox is running as [${this.config.app.env}] [http://localhost:${_port}${this.healthCheckUrl}]`
      )
      this.configureDatabase()
      listenCallBack(this.app)
      this.configureRoutes() // ATTENTION: configureRoutes have to be after configureDatabase
      this.configureStartupProbe()
      this.configureErrorHandler()
      afterListenCallback(this.app)
    })
  }
}

module.exports = { CustomServer }
