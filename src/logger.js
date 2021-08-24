const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const { LOG_FILE_PATH, SCREENSHOT_PATH } = require('../env')
const { getBeijingTime } = './util'

const Logger = {
  prefix: () => `[${getBeijingTime().full}]`,
  log(...args) {
    const prefix = this.prefix()
    console.log(chalk.gray(prefix), ...args)
    fs.appendFileSync(
      LOG_FILE_PATH,
      `${[prefix, ...args, '(log)'].join(' ')}\n`
    )
  },
  error(...args) {
    const prefix = this.prefix()
    console.error(chalk.redBright(prefix), ...args)
    fs.appendFileSync(
      LOG_FILE_PATH,
      `${[prefix, ...args, '(error)'].join(' ')}\n`
    )
  },
  warn(...args) {
    const prefix = this.prefix()
    console.warn(chalk.yellowBright(prefix), ...args)
    fs.appendFileSync(
      LOG_FILE_PATH,
      `${[prefix, ...args, '(warn)'].join(' ')}\n`
    )
  },
  info(...args) {
    const prefix = this.prefix()
    console.info(chalk.blueBright(prefix), ...args)
    fs.appendFileSync(
      LOG_FILE_PATH,
      `${[prefix, ...args, '(info)'].join(' ')}\n`
    )
  },
  success(...args) {
    const prefix = this.prefix()
    console.log(chalk.greenBright(prefix), ...args)
    fs.appendFileSync(
      LOG_FILE_PATH,
      `${[prefix, ...args, '(success)'].join(' ')}\n`
    )
  },
  async screenshot(page, type, fullPage = false) {
    const filename = `${type}-${new Date().getTime()}.png`.replace(
      /<|>|:|"|\/|\\|\||\?|\*/g,
      '-'
    )
    const savePath = path.resolve(SCREENSHOT_PATH, filename)
    try {
      const result = await page.screenshot({ fullPage, path: savePath })
      this.log(`截屏已保存到 ${savePath}`)
      return result
    } catch (error) {
      this.error('截屏失败')
      this.log(error)
    }
  }
}

exports.Logger = Logger
