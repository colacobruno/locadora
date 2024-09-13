module.exports = {
  app: {
    name: 'apifilmes',
    version: process.env.npm_package_version,
    baseRoute: '/api',
    port: 8290
  },
  environment: {
    name: process.env.NODE_ENV
  },
  cors: {
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders: [
      'x-origin-channel',
      'x-origin-application',
      'x-origin-device',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'authorization',
      'companyidrd',
      'common'
    ],
    exposeHeaders: []
  },
  db: {
    mongodb: {
      application: {
        url: process.env.MONGO_DB_URL,
        options: {
          user: process.env.MONGO_DB_USER,
          pass: process.env.MONGO_DB_PASSWORD,
          minPoolSize: 5,
          maxPoolSize: 10
        }
      }
    }
  },
  log: {
    debug: false,
    requestResponse: {
      ignore: ['*']
    },
    bunyan: {
      name: 'Application',
      streams: [
        {
          level: 'debug',
          stream: 'process.stdout'
        }
      ]
    }
  },
  authorization: {},
  time: {
    timezone: process.env.TIMEZONE
  },
  limiteDeUnidadesParaRetornarSugestao: 4,
  origin: {
    ignoreExact: ['/'],
    ignore: ['/doc/', '/api/indice-erros', '/snf'],
    require: {
      application: true
    }
  }
}
