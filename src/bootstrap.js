const { Logger } = require('./logger')
const { MAX_ATTEMPTS, ATTEMPTS_INTERVAL, REPORT_PAGE_URL } = require('../env')
const { handleProgramError, handleResultError } = require('./handler')
const { getConfirmResult, login } = require('./util')
const { startPPTR, loadLoginPage, loadIndexPage, submitReportData } = require('./procedure.js')

const bootstrap = async (config) => {
  let currentAttempts = 0
  const { page, browser } = await startPPTR()
  try {
    await page.goto(REPORT_PAGE_URL)

    // 加载登录页
    const { type: loginPageType } = await loadLoginPage(page)

    // 用户登录
    const loginResult = await login(page, config.username, config.password, loginPageType)
    if (loginResult.error) {
      await handleResultError(browser, page, config,
        { result: '登录失败', type: 'LoginError', message: loginResult.message }
      )
      return
    }
    Logger.success('登录成功！')

    // 加载打卡页
    await loadIndexPage(page)

    // 数据校验
    const confirmResult = await getConfirmResult(page)
    if (confirmResult.error) {
      await handleResultError(browser, page, config,
        { result: '数据校验失败', type: 'ConfirmError', message: confirmResult.message }
      )
      return
    }
    Logger.success('数据校验成功！提示信息为: ')
    Logger.info(`「${confirmResult.message}」`)

    // 提交打卡数据
    await submitReportData(browser, page, config)
  } catch (error) {
    if (error.name === 'TimeoutError') {
      if (currentAttempts < MAX_ATTEMPTS) {
        currentAttempts++
        Logger.warn(`操作超时，稍后将重试第 ${currentAttempts} 次……`)
        await page.waitForTimeout(ATTEMPTS_INTERVAL)
        bootstrap()
      } else {
        await handleProgramError(browser, page, config,
          { result: '操作超时，且已达最大重试次数', type: 'TimeoutError', message: error.toString() }
        )
      }
    } else {
      await handleProgramError(browser, page, config,
        { result: '发生运行错误', type: 'RuntimeError', message: error.toString() }
      )
    }
  }
}

exports.bootstrap = bootstrap
