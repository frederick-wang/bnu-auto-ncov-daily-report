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
 * @param {string} tip
 * @param {{ result: string; type: string; message: string; }} params
 */
const handleError = async (browser, page, config, tip, params) => {
  Logger.error(`${params.result}！${tip}：`)
  Logger.log(params.error)
  await Logger.screenshot(page, params.type)
  await send(config, params.result, params.error.toString())
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
const handleResultError = async (browser, page, config, params) => {
  await handleError(browser, page, config, '提示信息为', params)
}

/**
 * 处理程序错误
 *
 * @param {*} browser
 * @param {*} page
 * @param {*} config
 * @param {{ result: string; type: string; message: string; }} params
 */
const handleProgramError = async (browser, page, config, params) => {
  await handleError(browser, page, config, '错误内容为', params)
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
