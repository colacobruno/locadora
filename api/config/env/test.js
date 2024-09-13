const defaultSettings = require('./default')

module.exports = {
  ...defaultSettings,
  apiScheduleRisk: {
    ...defaultSettings.apiScheduleRisk,
    enabled: 'true'
  }
}
