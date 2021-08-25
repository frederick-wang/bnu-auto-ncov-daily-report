const nodemailer = require('nodemailer')
const { Logger } = require('./logger')
const { getBeijingTime, replaceInfoParams } = require('./util')

const sendMail = async (mailInfo, transportConfig, params) => {
  const transporter = nodemailer.createTransport(transportConfig)
  const mailOptions = Object.fromEntries(
    Object.entries(mailInfo).map(([k, v]) => [k, replaceInfoParams(v, params)])
  )
  const info = await transporter.sendMail(mailOptions)
  Logger.log('邮件已发送:', info.messageId)
}

const send = async (config, result, message) => {
  if (config && config.mail) {
    try {
      await sendMail(config.mail.info, config.mail.transport, {
        username: config.username,
        date: getBeijingTime().date,
        time: getBeijingTime().time,
        result,
        message
      })
    } catch (error) {
      Logger.error('通知邮件发送失败！')
      Logger.log(error)
    }
  }
}

exports.send = send
