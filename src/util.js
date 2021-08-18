const getLocationHref = async (page) => {
  return await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    return window.location.href
  })
}


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

const clickSaveButton = async (page) => {
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    $('.wapcf-btn.wapcf-btn-ok').click()
  })
}

const login = async (page, username, password) => {
  await page.evaluate((username, password) => {
    // eslint-disable-next-line no-undef
    vm.$data.username = username
    // eslint-disable-next-line no-undef
    vm.$data.password = password
    // eslint-disable-next-line no-undef
    vm.login()
  }, username, password)
}

const getLoginResult = async (page) => {
  return await page.evaluate(() => {
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
}

const waitForLoginPage = (page) =>
  new Promise((resolve, reject) => {
    // https://onewechat.bnu.edu.cn/uc/wap/login
    page
      .waitForSelector('.btn')
      .then(() => {
        resolve(true)
      })
      .catch(error => reject(error))
    // https://onewechat.bnu.edu.cn/site/center/login
    page
      .waitForSelector('.login-btn')
      .then(() => getLocationHref(page))
      .then((loginPageUrl) => {
        const e = new Error(loginPageUrl)
        e.name = 'LoginPageError'
        reject(e)
      })
      .catch(error => reject(error))
  })

const waitForloggingIn = (page) =>
  new Promise((resolve, reject) => {
    // 如果登录成功，页面就会开始跳转。
    page
      .waitForNavigation({ waitUntil: ['load'] })
      .then(() => {
        resolve(true)
      })
      .catch(error => reject(error))
    // 如果登录失败，会在当前页面弹出错误提示。
    page
      .waitForSelector('#wapat')
      .then(() => {
        resolve(true)
      })
      .catch(error => reject(error))
  })

const waitForIndexPage = async (page) => {
  await page.waitForSelector('.item-buydate.form-detail2')
}


const waitForSaveDone = async (page) => {
  await page.waitForSelector('.wapat-title')
}

exports.getLocationHref = getLocationHref
exports.getConfirmResult = getConfirmResult
exports.getSaveResult = getSaveResult
exports.clickSaveButton = clickSaveButton
exports.login = login
exports.getLoginResult = getLoginResult
exports.waitForLoginPage = waitForLoginPage
exports.waitForloggingIn = waitForloggingIn
exports.waitForIndexPage = waitForIndexPage
exports.waitForSaveDone = waitForSaveDone
