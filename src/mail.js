const nodemailer = require("nodemailer")
const { Logger } = require('./logger')

const replaceInfoParams = (str, params) => {
  let result = str
  for (const [k, v] of Object.entries(params)) {
    const r = new RegExp(`\\$\{${k}}`, 'g')
    result = String(result).replace(r, v)
  }
  return result
}

const sendMail = async (mailInfo, transportConfig, params) => {
  const transporter = nodemailer.createTransport(transportConfig)
  const mailOptions = Object.fromEntries(
    Object.entries(mailInfo)
      .map(([k, v]) => [k, replaceInfoParams(v, params)])
  )
  const info = await transporter.sendMail(mailOptions)
  Logger.log('邮件已发送:', info.messageId)
}

const send = async (config, result, message) => {
  if (
    config &&
    config.mail &&
    config.mail.info &&
    config.mail.transport
  ) {
    const { host, port, secure, auth } = config.mail.transport
    if (!host || !port || !secure || !auth || !auth.user || !auth.pass) {
      const e = new Error('加载邮件 SMTP 配置失败！')
      e.name = 'ConfigError'
      Logger.error(e)
      return
    }
    const { from, to, subject, html } = config.mail.info
    if (!from || !to || !subject || !html) {
      const e = new Error('加载邮件发件信息失败！')
      e.name = 'ConfigError'
      Logger.error(e)
      return
    }
    try {
      await sendMail(config.mail.info, config.mail.transport, {
        username: config.username,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        result,
        message
      })
    } catch (error) {
      Logger.error('通知邮件发送失败！')
      Logger.log(error)
    }
  }
}

exports.sendMail = sendMail
exports.send = send
