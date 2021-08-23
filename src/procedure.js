const puppeteer = require('puppeteer')
const { Logger } = require('./logger')

const {
  waitForLoginPage,
  waitForIndexPage,
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
  return { page, browser }
}

const loadLoginPage = async (page) => {
  const { type: loginPageType, href: loginPageUrl } = await waitForLoginPage(page)
  Logger.success('登录页加载成功！')
  Logger.info(`登录页地址为:`, loginPageUrl)
  return { type: loginPageType }
}

const loadIndexPage = async (page) => {
  await waitForIndexPage(page)
  Logger.success('打卡页加载成功！')
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
    await handleResultError(browser, page, config,
      { result: '数据提交失败', type: 'SaveError', message: saveResult.message }
    )
    return
  }
  handleSuccess(browser, page, config,
    { result: '数据提交成功', type: 'Success', message: saveResult.message }
  )
}

exports.startPPTR = startPPTR
exports.loadLoginPage = loadLoginPage
exports.loadIndexPage = loadIndexPage
exports.submitReportData = submitReportData
