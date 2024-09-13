const { AxiosError } = require('axios')

const simulateAxiosError = (axiosInstance, message, code, percentOfError) => {
  if (process.env.NODE_ENV !== 'production' && process.env.ENABLE_SIMULATE_AXIOS_ERROR === 'true') {
    axiosInstance.interceptors.request.clear()
    axiosInstance.interceptors.request.use(config => {
      const rate = Math.floor(Math.random() * 100)

      const RATE_ERROR = 100 - (percentOfError || Number(process.env.SIMULATE_RATE_ERROR) || 20)

      if (rate >= RATE_ERROR) {
        throw new AxiosError(message, code, config, null, {
          status: code,
          data: { message }
        })
      }

      return config
    })
  }
}

module.exports = { simulateAxiosError }
