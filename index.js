const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const puppeteer = require('puppeteer')

const config = { username: '', password: '', geo_api_info: {} }
const CONFIG_PATH = path.resolve(__dirname, './config.json')

if (fs.existsSync(CONFIG_PATH)) {
  const { username, password, geo_api_info } = require(CONFIG_PATH)
  if (username && password && geo_api_info) {
    console.log(chalk.green('配置文件加载成功！'))
    config.username = username
    config.password = password
    config.geo_api_info = geo_api_info
    main()
  } else {
    console.log(chalk.red('加载配置文件 config.json 失败！'))
  }
} else {
  console.log(chalk.red('未找到配置文件 config.json！'))
}

async function main () {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })
  console.log(chalk.green('浏览器启动成功！'))
  try {
    const page = await browser.newPage()
    const reportPageUrl = 'https://onewechat.bnu.edu.cn/ncov/wap/default/index'
    await page.goto(reportPageUrl)
    console.log(chalk.green('登录页加载成功！'))
    await page.evaluate((username, password) => {
      // eslint-disable-next-line no-undef
      vm.$data.username = username
      // eslint-disable-next-line no-undef
      vm.$data.password = password
      // eslint-disable-next-line no-undef
      vm.login()
    }, config.username, config.password)
    await new Promise((resolve, reject) => {
      try {
        page.waitForSelector('.item-buydate.form-detail2').then(() => {
          resolve(true)
        })
        page.waitForSelector('#wapat').then(() => {
          resolve(true)
        })
      } catch (error) {
        reject(error)
      }
    })
    const loginResult = await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      if ($('.wapat-title').length && !$('.wapat-title').is(':hidden')) {
        return {
          error: true,
          // eslint-disable-next-line no-undef
          message: $('.wapat-title').text()
        }
      } else {
        return {
          error: false,
          message: ''
        }
      }
    })
    if (loginResult.error) {
      console.log(chalk.red('登录失败！提示信息为：'))
      console.log(`「${chalk.blue(loginResult.message)}」`)
    } else {
      console.log(chalk.green('登录成功！'))
      await page.waitForSelector('.item-buydate.form-detail2')
      console.log(chalk.green('打卡页加载成功！'))
      await page.waitForTimeout(500)
      const confirmResult = await page.evaluate((geo_api_info) => {
        // eslint-disable-next-line no-undef
        vm.locatComplete(geo_api_info)
        // eslint-disable-next-line no-undef
        vm.confirm()
        // eslint-disable-next-line no-undef
        if ($('.wapcf-title').length && !$('.wapcf-title').is(':hidden')) {
          // 已经弹出了确认窗口
          return {
            error: false,
            // eslint-disable-next-line no-undef
            message: $('.wapcf-title').text()
          }
        } else {
          // 弹出了报错窗口
          return {
            error: true,
            // eslint-disable-next-line no-undef
            message: $('.wapat-title').text()
          }
        }
      }, config.geo_api_info)
      if (confirmResult.error) {
        console.log(chalk.red('数据校验失败！提示信息为：'))
        console.log(`「${chalk.blue(confirmResult.message)}」`)
      } else {
        console.log(chalk.green('数据校验成功！提示信息为：'))
        console.log(`「${chalk.blue(confirmResult.message)}」`)
        await page.evaluate(() => {
          // eslint-disable-next-line no-undef
          $('.wapcf-btn.wapcf-btn-ok').click()
        })
        await page.waitForSelector('.wapat-title')
        const saveResult = await page.evaluate(() => {
          // eslint-disable-next-line no-undef
          const message = $('.wapat-title').text()
          if (message === '提交信息成功') {
            return {
              error: false,
              message
            }
          } else {
            return {
              error: true,
              message
            }
          }
        })
        if (saveResult.error) {
          console.log(chalk.red('数据提交失败！提示信息为：'))
          console.log(`「${chalk.blue(saveResult.message)}」`)
        } else {
          console.log(chalk.green('数据提交成功！提示信息为：'))
          console.log(`「${chalk.blue(saveResult.message)}」`)
        }
      }
    }
  } catch (error) {
    console.log(chalk.red('发生运行错误！'))
    console.log(error)
  }
  console.log(chalk.bold.blue('程序执行完毕，退出！'))
  await browser.close()
}
