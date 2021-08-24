const { Logger } = require('./logger')
const { MAX_ATTEMPTS, ATTEMPTS_INTERVAL, REPORT_PAGE_URL } = require('../env')
const { handleProgramError } = require('./handler')
const {
  startPPTR,
  loadLoginPage,
  userLogin,
  loadIndexPage,
  confirmReportData,
  submitReportData
} = require('./procedure')

const bootstrap = async (config) => {
  /**
   * 当前超时重试次数
   */
  let currentAttempts = 0
  // 初始化 Puppeteer
  const { browser, page } = await startPPTR()
  const bpc = [browser, page, config]
  try {
    // 访问打卡应用网址
    await page.goto(REPORT_PAGE_URL)
    // 加载登录页
    const { type: loginPageType } = await loadLoginPage(page)
    // 用户登录
    if (!await userLogin(...bpc, loginPageType)) return
    // 加载打卡页
    await loadIndexPage(page)
    // 数据校验
    if (!await confirmReportData(...bpc)) return
    // 提交打卡数据
    await submitReportData(...bpc)

  } catch (error) {
    // TimeoutError 是 Puppeteer 的 wait 操作超时的错误名称
    if (error.name !== 'TimeoutError') {
      await handleProgramError(...bpc, { result: '发生运行错误', type: 'RuntimeError', error })
      return
    }

    if (currentAttempts >= MAX_ATTEMPTS) {
      await handleProgramError(...bpc, { result: '操作超时，且已达最大重试次数', type: 'TimeoutError', error })
      return
    }

    currentAttempts++
    Logger.warn(`操作超时，稍后将重试第 ${currentAttempts} 次……`)
    await page.waitForTimeout(ATTEMPTS_INTERVAL)
    await bootstrap()
  }
}

exports.bootstrap = bootstrap
