const fs = require('fs-extra')
const { Logger } = require('./logger')
const { CONFIG_FILE_PATH } = require('../env')
const { options } = require('./commander')

/**
 * 从命令行加载参数
 *
 * @returns {{ username: string; password: string; mail: Object|null; }}
 */
const getConfigFromCommandLine = () => {
  const { username, password } = options
  try {
    console.log(options.mail)
    const mail = options.mail
      ? Object.prototype.toString.call(options.mail) === '[object String]'
        ? JSON.parse(options.mail)
        : null
      : null
    return { username, password, mail }
  } catch (error) {
    console.error(error)
    const e = new Error('命令行参数 --mail 的值无法解析！')
    e.name = 'ConfigError'
    throw e
  }
}

/**
 * 从配置文件加载参数
 *
 * @returns {{ username: string; password: string; mail: Object|null; }}
 */
const getConfigFromFile = () => {
  if (!fs.existsSync(CONFIG_FILE_PATH)) return {}

  const config = require(CONFIG_FILE_PATH)
  const { username, password } = config
  let mail = null
  if (config) {
    if (Object.prototype.toString.call(config.mail) !== '[object Object]') {
      const e = new Error('配置文件中 mail 的值无法解析！')
      e.name = 'ConfigError'
      throw e
    }
    mail = config.mail
  }
  return { username, password, mail }
}

const checkLoginInfo = (username, password) => {
  if (!username || !password) {
    const e = new Error('用户名或密码未设置！')
    e.name = 'ConfigError'
    throw e
  }
}

const checkMailConfig = (mailConfig) => {
  if (!mailConfig) return

  const transportError = new Error('加载邮件 SMTP 配置失败！')
  transportError.name = 'ConfigError'
  if (!mailConfig.transport) {
    throw transportError
  }
  const { host, port, secure, auth } = mailConfig.transport
  if (!host || !port || !secure || !auth || !auth.user || !auth.pass) {
    throw transportError
  }

  const infoError = new Error('加载邮件发件信息失败！')
  infoError.name = 'ConfigError'
  if (!mailConfig.info) {
    throw infoError
  }
  const { from, to, subject, html } = mailConfig.info
  if (!from || !to || !subject || !html) {
    throw infoError
  }
}

const loadConfig = () => {
  const configCMD = getConfigFromCommandLine()
  const configFile = getConfigFromFile()
  const username = configCMD.username || configFile.username || null
  const password = configCMD.password || configFile.password || null
  const mail = configCMD.mail || configFile.mail || null

  checkLoginInfo(username, password)
  checkMailConfig(mail)

  Logger.success('配置文件加载成功！')
  return { username, password, mail }
}

exports.loadConfig = loadConfig
