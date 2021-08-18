const { Logger } = require('./src/logger')
const { loadConfig } = require('./src/configure')
const { bootstrap } = require('./src/bootstrap')

Logger.info('程序启动！')

const config = loadConfig()
bootstrap(config)
