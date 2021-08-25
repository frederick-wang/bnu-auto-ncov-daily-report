const got = require('got')
const { Logger } = require('./logger')
const { getBeijingTime, replaceInfoParams } = require('./util')

const sendWechatMessage = async (payload, sendKey, params) => {
  const url = `https://sctapi.ftqq.com/${sendKey}.send`
  const data = new URLSearchParams(
    Object.fromEntries(
      Object.entries(payload).map(([k, v]) => [k, replaceInfoParams(v, params)])
    )
  ).toString()
  const res = await got.post(url, { body: data }).json()
  if (res.code || res.data.errno) {
    throw new Error(`微信通知消息加入推送队列失败：${JSON.stringify(res)}`)
  }
  Logger.log(`微信通知消息已加入推送队列，pushid: ${res.data.pushid}，readkey: ${res.data.readkey}`)
}

const send = async (config, result, message) => {
  if (config && config.wechat) {
    try {
      await sendWechatMessage(config.wechat.payload, config.wechat.sendKey, {
        username: config.username,
        date: getBeijingTime().date,
        time: getBeijingTime().time,
        result,
        message
      })
    } catch (error) {
      Logger.error('微信通知消息发送失败！')
      Logger.log(error)
    }
  }
}

exports.send = send
