import config from './config'
export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      success: (res) => {
        // 存储登录后的cookies
        console.log(res)
        wx.setStorageSync('cookies', res.cookies)
        resolve(res)
      },
      fail: (error) => {
        console.log(error)
        reject(error)
      }
    })
  })
}
