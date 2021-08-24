const path = require('path')
const fs = require('fs-extra')

const PACKAGE_JSON_PATH = path.resolve(__dirname, './package.json')
const CONFIG_FILE_PATH = path.resolve(__dirname, './config.json')
const SCREENSHOT_PATH = path.resolve(__dirname, './screenshot')
const LOG_PATH = path.resolve(__dirname, './log')
const LOG_FILE_PATH = path.resolve(LOG_PATH, `Log-${new Date().getTime()}.txt`)

const MAX_ATTEMPTS = 3
const ATTEMPTS_INTERVAL = 60 * 1000

const REPORT_PAGE_URL = 'https://onewechat.bnu.edu.cn/ncov/wap/default/index'

fs.ensureDirSync(SCREENSHOT_PATH)
fs.ensureDirSync(LOG_PATH)

exports.LOG_PATH = LOG_PATH
exports.PACKAGE_JSON_PATH = PACKAGE_JSON_PATH
exports.CONFIG_FILE_PATH = CONFIG_FILE_PATH
exports.SCREENSHOT_PATH = SCREENSHOT_PATH
exports.LOG_FILE_PATH = LOG_FILE_PATH
exports.MAX_ATTEMPTS = MAX_ATTEMPTS
exports.ATTEMPTS_INTERVAL = ATTEMPTS_INTERVAL
exports.REPORT_PAGE_URL = REPORT_PAGE_URL
