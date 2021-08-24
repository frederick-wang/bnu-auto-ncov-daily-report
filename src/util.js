/**
 * 获取打卡结果
 *
 * @param {*} page
 * @returns {Promise<{ error: boolean; message: string; }>}
 */
const getSaveResult = async (page) => {
  return await page.evaluate(() => {
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
}

/**
 * 获取数据校验结果
 *
 * @param {*} page
 * @returns {Promise<{ error: boolean; message: string; }>}
 */
const getConfirmResult = async (page) => {
  return await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    vm.locatComplete(JSON.parse(vm.oldInfo.geo_api_info))
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
  })
}

/**
 * 模拟登录操作
 *
 * @param {*} page
 * @param {string} username
 * @param {string} password
 * @param {string} type
 */
const simulateLogin = async (page, username, password, type) => {
  switch (type) {
    case LoginPageType.UC_WAP:
      await page.evaluate(
        (username, password) => {
          // eslint-disable-next-line no-undef
          vm.$data.username = username
          // eslint-disable-next-line no-undef
          vm.$data.password = password
          // eslint-disable-next-line no-undef
          vm.login()
        },
        username,
        password
      )
      return
    case LoginPageType.SITE_CENTER:
      await page.type('input[type="text"]', username)
      await page.type('input[type="password"]', password)
      await page.click('.login-btn')
      return
    default:
      throw new Error('login: 未知登录页面类型')
  }
}

const LoginPageType = {
  UC_WAP: 'uc_wap',
  SITE_CENTER: 'site_center'
}

/**
 * 等待登录页面加载完成
 *
 * @param {*} page
 * @returns {Promise<{ href: string; type: string; }>}
 */
const waitForLoginPage = (page) =>
  new Promise((resolve, reject) => {
    // https://onewechat.bnu.edu.cn/uc/wap/login
    page
      .waitForSelector('.btn')
      .then(() =>
        page.evaluate(() => {
          // eslint-disable-next-line no-undef
          return window.location.href
        })
      )
      .then((href) => resolve({ href, type: LoginPageType.UC_WAP }))
      .catch((error) => reject(error))
    // https://onewechat.bnu.edu.cn/site/center/login
    page
      .waitForSelector('.login-btn')
      .then(() =>
        page.evaluate(() => {
          // eslint-disable-next-line no-undef
          return window.location.href
        })
      )
      .then((href) => resolve({ href, type: LoginPageType.SITE_CENTER }))
      .catch((error) => reject(error))
  })

/**
 * 检查登录状态
 *
 * @param {*} page
 * @param {string} type
 *
 * @returns {Promise<{ error: boolean; message: string; }>}
 */
const waitForloggingIn = (page, type) =>
  new Promise((resolve, reject) => {
    // 如果登录成功，页面就会开始跳转。
    page
      .waitForNavigation({ waitUntil: ['load'] })
      .then(() => {
        resolve({
          error: false,
          message: ''
        })
      })
      .catch((error) => reject(error))
    // 如果登录失败，会在当前页面弹出错误提示。
    switch (type) {
      case LoginPageType.UC_WAP:
        page
          .waitForSelector('#wapat')
          .then(() =>
            page.evaluate(() => {
              if (
                // eslint-disable-next-line no-undef
                $('.wapat-title').length &&
                // eslint-disable-next-line no-undef
                !$('.wapat-title').is(':hidden')
              ) {
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
          )
          .then((res) => {
            resolve(res)
          })
          .catch((error) => reject(error))
        break
      case LoginPageType.SITE_CENTER:
        page
          .waitForSelector('img[src="/site/static/images/cha.png"]')
          .then(() =>
            page.evaluate(() => ({
              error: true,
              // eslint-disable-next-line no-undef
              message: $('.pophint').text().trim()
            }))
          )
          .then((res) => {
            resolve(res)
          })
          .catch((error) => reject(error))
        page
          .waitForSelector('.redhint')
          .then(() =>
            page.evaluate(() => ({
              error: true,
              // eslint-disable-next-line no-undef
              message: $('.redhint').text()
            }))
          )
          .then((res) => {
            if (res.message) {
              resolve(res)
            }
          })
          .catch((error) => reject(error))
        break
      default:
        throw new Error('waitForloggingIn: 未知登录页面类型')
    }
  })

const waitForIndexPage = async (page) => {
  await page.waitForSelector('.item-buydate.form-detail2')
}

const clickSaveButton = (page) => page.click('.wapcf-btn.wapcf-btn-ok')

const waitForSaveDone = (page) => page.waitForSelector('.wapat-title')

/**
 * 用户登录
 *
 * @param {*} page
 * @param {string} username
 * @param {string} password
 * @param {string} loginPageType
 * @returns
 */
const login = async (page, username, password, loginPageType) => {
  await simulateLogin(page, username, password, loginPageType)
  return await waitForloggingIn(page, loginPageType)
}

/**
 * 打卡
 *
 * @param {*} page
 * @returns
 */
const save = async (page) => {
  await clickSaveButton(page)
  await waitForSaveDone(page)
  return await getSaveResult(page)
}

exports.getConfirmResult = getConfirmResult
exports.login = login
exports.save = save
exports.waitForLoginPage = waitForLoginPage
exports.waitForIndexPage = waitForIndexPage
