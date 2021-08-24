const puppeteer = require('puppeteer')

const { Logger } = require('./logger')
const {
  waitForLoginPage,
  login,
  waitForIndexPage,
  getConfirmResult,
  save
} = require('./util')
const { handleResultError, handleSuccess } = require('./handler')

const startPPTR = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })
  Logger.success('浏览器启动成功！')
  const page = await browser.newPage()
  await page.emulate(puppeteer.devices['iPhone 6'])
  return { browser, page }
}

const loadLoginPage = async (page) => {
  const { type: loginPageType, href: loginPageUrl } = await waitForLoginPage(
    page
  )
  Logger.success('登录页加载成功！')
  Logger.info(`登录页地址为:`, loginPageUrl)
  return { type: loginPageType }
}

const userLogin = async (browser, page, config, loginPageType) => {
  const loginResult = await login(
    page,
    config.username,
    config.password,
    loginPageType
  )
  if (loginResult.error) {
    await handleResultError(browser, page, config, {
      result: '登录失败',
      type: 'LoginError',
      message: loginResult.message
    })
    return false
  }
  Logger.success('登录成功！')
  return true
}

const loadIndexPage = async (page) => {
  await waitForIndexPage(page)
  Logger.success('打卡页加载成功！')
}

const confirmReportData = async (browser, page, config) => {
  const confirmResult = await getConfirmResult(page)
  if (confirmResult.error) {
    await handleResultError(browser, page, config, {
      result: '数据校验失败',
      type: 'ConfirmError',
      message: confirmResult.message
    })
    return false
  }
  Logger.success('数据校验成功！提示信息为: ')
  Logger.info(`「${confirmResult.message}」`)
  return true
}

/**
 * 提交打卡数据
 *
 * @param {*} browser
 * @param {*} page
 * @param {*} config
 */
const submitReportData = async (browser, page, config) => {
  const saveResult = await save(page)
  if (saveResult.error) {
    await handleResultError(browser, page, config, {
      result: '数据提交失败',
      type: 'SaveError',
      message: saveResult.message
    })
    return
  }
  handleSuccess(browser, page, config, {
    result: '数据提交成功',
    type: 'Success',
    message: saveResult.message
  })
}

exports.startPPTR = startPPTR
exports.loadLoginPage = loadLoginPage
exports.userLogin = userLogin
exports.loadIndexPage = loadIndexPage
exports.confirmReportData = confirmReportData
exports.submitReportData = submitReportData
