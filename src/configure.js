const fs = require('fs-extra')
const { Logger } = require('./logger')
const { CONFIG_FILE_PATH, MAIL_TEMPLATE_PATH } = require('../env')
const { options } = require('./commander')
const mailTemplate = require(MAIL_TEMPLATE_PATH)

/**
 * 从命令行加载参数
 *
 * @returns {{ username: string; password: string; mail: Object|null; }}
 */
const getConfigFromCommandLine = () => {
  const {
    username,
    password,
    mail,
    mail_host,
    mail_port,
    mail_secure,
    mail_user,
    mail_pass,
    mail_to
  } = options
  return {
    username,
    password,
    mail: mail === 'true',
    mail_host,
    mail_port: Number(mail_port),
    mail_secure: mail_secure === 'true',
    mail_user,
    mail_pass,
    mail_to
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
  const {
    username,
    password,
    mail,
    mail_host,
    mail_port,
    mail_secure,
    mail_user,
    mail_pass,
    mail_to
  } = config
  return {
    username,
    password,
    mail,
    mail_host,
    mail_port,
    mail_secure,
    mail_user,
    mail_pass,
    mail_to
  }
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
  checkLoginInfo(username, password)

  const mail = configCMD.mail || configFile.mail || false
  const mail_host = configCMD.mail_host || configFile.mail_host || null
  const mail_port = configCMD.mail_port || configFile.mail_port || null
  const mail_secure = configCMD.mail_secure || configFile.mail_secure || null
  const mail_user = configCMD.mail_user || configFile.mail_user || null
  const mail_pass = configCMD.mail_pass || configFile.mail_pass || null
  const mail_to = configCMD.mail_to || configFile.mail_to || null
  let mailConfig = null
  if (mail) {
    const { subject, html } = mailTemplate
    mailConfig = {
      transport: {
        host: mail_host,
        port: mail_port,
        secure: mail_secure,
        auth: {
          user: mail_user,
          pass: mail_pass
        }
      },
      info: {
        from: `北师大打卡助手 <${mail_user}>`,
        to: mail_to,
        subject,
        html
      }
    }
    checkMailConfig(mailConfig)
  }

  Logger.success('配置文件加载成功！')
  return { username, password, mail: mailConfig }
}

exports.loadConfig = loadConfig
