const { Logger } = require('./logger')
const { send } = require('./mail')

const exit = async (browser) => {
  Logger.info('程序执行完毕，退出！')
  await browser.close()
}

/**
 * 处理错误
 *
 * @param {*} browser
 * @param {*} page
 * @param {*} config
 * @param {{ result: string; type: string; message: string; }} params
 */
const handleError = async (browser, page, config, params) => {
  await Logger.screenshot(page, params.type)
  await send(config, params.result, params.message)
  await exit(browser)
}

/**
 * 处理错误结果
 *
 * @param {*} browser
 * @param {*} page
 * @param {*} config
 * @param {{ result: string; type: string; message: string; }} params
 */
const handleResultError = async (browser, page, config, { result, type, message }) => {
  Logger.error(`${result}！提示信息为：`)
  Logger.log(`「${message}」`)
  await handleError(browser, page, config, { result, type, message })
}

/**
 * 处理程序错误
 *
 * @param {*} browser
 * @param {*} page
 * @param {*} config
 * @param {{ result: string; type: string; error: Error; }} params
 */
const handleProgramError = async (browser, page, config, { result, type, error }) => {
  Logger.error(`${result}！错误内容为：`)
  Logger.log(error)
  await handleError(browser, page, config, { result, type, message: error.toString() })
}

/**
 * 处理打卡成功结果
 *
 * @param {*} browser
 * @param {*} page
 * @param {*} config
 * @param {string} tip
 * @param {{ result: string; type: string; message: string; }} params
 */
const handleSuccess = async (browser, page, config, params) => {
  Logger.success(`${params.result}！提示信息为: `)
  Logger.info(`「${params.message}」`)
  await Logger.screenshot(page, params.type)
  await send(config, params.result, params.message)
  await exit(browser)
}


exports.exit = exit
exports.handleProgramError = handleProgramError
exports.handleResultError = handleResultError
exports.handleSuccess = handleSuccess
