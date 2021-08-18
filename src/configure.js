const fs = require('fs-extra')
const { Logger } = require('./logger')

const { CONFIG_FILE_PATH } = require('../env')

const loadConfig = () => {
  if (!fs.existsSync(CONFIG_FILE_PATH)) {
    const e = new Error('未找到配置文件 config.json！')
    e.name = 'ConfigError'
    Logger.error(e)
  }

  const config = require(CONFIG_FILE_PATH)

  if (!config.username || !config.password) {
    const e = new Error('加载配置文件 config.json 失败！')
    e.name = 'ConfigError'
    Logger.error(e)
  }

  Logger.success('配置文件加载成功！')
  return config
}

exports.loadConfig = loadConfig
