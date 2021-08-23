const puppeteer = require('puppeteer')
const { Logger } = require('./logger')
const { MAX_ATTEMPTS, ATTEMPTS_INTERVAL, REPORT_PAGE_URL } = require('../env')
const { send } = require('./mail')

const {
  getConfirmResult,
  getSaveResult,
  clickSaveButton,
  simulateLogin,
  waitForLoginPage,
  waitForloggingIn,
  waitForIndexPage,
  waitForSaveDone
} = require('./util')

const startPPTR = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })
  Logger.success('浏览器启动成功！')
  const page = await browser.newPage()
  await page.emulate(puppeteer.devices['iPhone 6'])
  return { page, browser }
}

const exit = async (browser) => {
  Logger.info('程序执行完毕，退出！')
  await browser.close()
}

const bootstrap = async (config) => {
  let currentAttempts = 0
  const { page, browser } = await startPPTR()
  try {
    await page.goto(REPORT_PAGE_URL)
    const { type: loginPageType, href: loginPageUrl } = await waitForLoginPage(page)
    Logger.success('登录页加载成功！')
    Logger.info(`登录页地址为:`, loginPageUrl)
    await simulateLogin(page, config.username, config.password, loginPageType)
    const loginResult = await waitForloggingIn(page, loginPageType)

    if (loginResult.error) {
      Logger.error('登录失败！提示信息为: ')
      Logger.info(`「${loginResult.message}」`)
      await Logger.screenshot(page, 'LoginError')
      await send(config, '登录失败', loginResult.message)
      await exit(browser)
      return
    }

    Logger.success('登录成功！')
    await waitForIndexPage(page)
    Logger.success('打卡页加载成功！')
    const confirmResult = await getConfirmResult(page)

    if (confirmResult.error) {
      Logger.error('数据校验失败！提示信息为: ')
      Logger.info(`「${confirmResult.message}」`)
      await Logger.screenshot(page, 'ConfirmError')
      await send(config, '数据校验失败', confirmResult.message)
      await exit(browser)
      return
    }

    Logger.success('数据校验成功！提示信息为: ')
    Logger.info(`「${confirmResult.message}」`)
    await clickSaveButton(page)
    await waitForSaveDone(page)
    const saveResult = await getSaveResult(page)

    if (saveResult.error) {
      Logger.error('数据提交失败！提示信息为: ')
      Logger.info(`「${saveResult.message}」`)
      await Logger.screenshot(page, 'SaveError')
      await send(config, '数据提交失败', saveResult.message)
      await exit(browser)
      return
    }

    Logger.success('数据提交成功！提示信息为: ')
    Logger.info(`「${saveResult.message}」`)
    await Logger.screenshot(page, 'Success')
    await send(config, '数据提交成功', saveResult.message)
    await exit(browser)
  } catch (error) {
    if (error.name === 'TimeoutError') {
      if (currentAttempts < MAX_ATTEMPTS) {
        currentAttempts++
        Logger.warn(`操作超时，稍后将重试第 ${currentAttempts} 次……`)
        await page.waitForTimeout(ATTEMPTS_INTERVAL)
        bootstrap()
      } else {
        Logger.error('操作超时，且已达最大重试次数！')
        Logger.log(error)
        await Logger.screenshot(page, 'TimeoutError')
        await send(config, '操作超时，且已达最大重试次数', error.toString())
        await exit(browser)
      }
    } else {
      Logger.error('发生运行错误！')
      Logger.log(error)
      await Logger.screenshot(page, 'RuntimeError')
      await send(config, '发生运行错误', error.toString())
      await exit(browser)
    }
  }
}

exports.bootstrap = bootstrap
