const mockSNF = () => {
  jest.mock('simple-node-framework', () => {
    const snf = jest.requireActual('simple-node-framework')
    return {
      ...snf,
      Singleton: {
        ...snf.Singleton,
        authorization: {
          protect: {
            bind: () => 'SNF authorization protect'
          }
        }
      },
      ControllerFactory: {
        build(Controller, methodName) {
          return `${Controller.name}->${methodName}`
        }
      }
    }
  })
}
const mockApp = () => {
  jest.mock('../../../index', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    use: jest.fn()
  }))
}
module.exports = {
  mockSNF,
  mockApp
}
