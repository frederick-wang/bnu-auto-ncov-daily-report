const nodemailer = require("nodemailer")
const { Logger } = require('./logger')

const sendMail = async (mailInfo, transportConfig, params) => {
  const transporter = nodemailer.createTransport(transportConfig)
  const mailOptions = Object.fromEntries(
    Object.entries(mailInfo)
      .map(([k, v]) => [k, replaceInfoParams(v, params)])
  )
  const info = await transporter.sendMail(mailOptions)
  Logger.log('邮件已发送:', info.messageId)
}

const replaceInfoParams = (str, params) => {
  let result = str
  for (const [k, v] of Object.entries(params)) {
    const r = new RegExp(`\\$\{${k}}`, 'g')
    result = String(result).replace(r, v)
  }
  return result
}

exports.sendMail = sendMail
