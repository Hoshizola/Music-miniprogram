// 发送ajax请求
/* 
  一、封装功能函数
    1、功能点明确
    2、函数内部应该保留固定代码
    3、将动态的数据抽取成形参，由使用者根据自身的情况动态地传入实参
    4、一个良好的功能函数应该设置形参的默认值（ES6的形参默认值）
  二、封装功能组件
    1、功能点明确
    2、组件内部保留静态的代码
    3、将动态的数据抽取成props参数，由使用者根据自身的情况以标签属性的形式动态传入props数据
    4、一个良好的组件应该设置组件的必要性及数据类型
*/
import config from './config'
export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: {
        cookie:wx.getStorageSync('cookies')? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') >= 0) : ''
      },
      success: (res) => {
        resolve(res)
      },
      fail: (error) => {
        console.log(error)
        reject(error)
      }
    })
  })
}
