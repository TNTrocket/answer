import store from '@/store/index'
import config from './config'


const path = config.path
// opendid promise
let openIdPromise = null
let sessionPromise = null;

function request(obj = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: obj.url,
      data: obj.data,
      method: obj.method,
      header: {
        ...obj.header
      },
      success: function (data) {
        resolve(data.data)
      },
      fail: function (data) {
        reject(data.data)
      }
    })
  })
}

function _fetch(url, params, config = {}) {
  console.log("fetch请求发起", url, params);
  return new Promise((resolve, reject) => {
    request({
      url: `${path}/${url}`,
      data: params,
      method: 'GET',
      header: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(({
      success,
      data
    }) => {
      console.log('fetch请求返回', url, params, data)
      if (success) {
        resolve(data)
      } else {
        reject()
      }
    }).catch(() => {
      reject()
    })
  })
}

function _post(url, params, config = {}) {
  console.log("post请求发起", url, params);
  return new Promise((resolve, reject) => {
    request({
      url: `${path}/${url}`,
      data: params,
      method: 'POST',
      header: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(({
      success,
      data
    }) => {
      console.log('post请求返回', url, params, data)
      if (success) {
        resolve(data)
      } else {
        reject(data)
      }
    }).catch(() => {
      reject()
    })
  })
}

function fetch(url, params, config) {
  return getOpenIdOnlyPromise().then((result) => {
    const {
      openid
    } = result
    return getGetCustomerPromise().then(() => {
      return _fetch(url, {
        ...params,
        openid: openid,
      }, config)
    })
  })
}

function post(url, params, config) {
  return getOpenIdOnlyPromise().then((result) => {
    const {
      openid
    } = result
    console.log('openid====', openid)
    return getGetCustomerPromise().then(() => {
      return _post(url, {
        ...params,
        openid: openid,
      }, config)
    })
  })
}



function getSessionByLogin() {
  if (!sessionPromise) {
    sessionPromise = new Promise((resolve, reject) => {
      return wx.login({
        success: ({
          code
        }) => {
          console.log('code----', code)
          return _fetch('activityContro/wxMsg', {
            js_code: code
          }).then(({
            openid,
            session_key
          }) => {
            if (openid) {
              resolve({
                openid,
                session_key
              })
            } else {
              reject(new Error())
            }
          })

        }
      })
    });
  }
  return sessionPromise
}



function setOpenIdPromise() {
  openIdPromise = getSessionByLogin().then(({
    openid,
    session_key
  }) => {
    store.dispatch('setUserInfo', {
      openid,
      session_key
    })
    wx.setStorageSync('openid', openid)
    return {
      openid,
      session_key
    }
  })
  return openIdPromise
}

function getOpenIdOnlyPromise() {
  const openid = wx.getStorageSync('openid');
  if (openid) {
    // 即时有openid在缓存也先进行Login防止解析出错
    getOpenIdPromise();
    return Promise.resolve({
      openid
    })
  } else {
    return getOpenIdPromise();
  }
}


function getOpenIdPromise() {
  if (openIdPromise) {
    return openIdPromise
  } else {
    return setOpenIdPromise()
  }
}


function getGetCustomerPromise() {
  if (getCustomerPromise) {
    return getCustomerPromise
  } else {
    return setGetCustomerPromise()
  }
}
let getCustomerPromise = null

function setGetCustomerPromise() {
  getCustomerPromise = new Promise((resolve, reject) => {
    getOpenIdOnlyPromise().then((result) => {
      const {
        openid,
        session_key
      } = result
      _post('activityContro/checkLogin', {
        openid
      }).then((data) => {
        store.dispatch('setUserInfo', {
          ...data
        })
        resolve(data)
      })
    })
  })
  return getCustomerPromise
}

export default {
  getOpenIdPromise,
  setGetCustomerPromise,
  getGetCustomerPromise,
  fetch,
  post,
  path
}
