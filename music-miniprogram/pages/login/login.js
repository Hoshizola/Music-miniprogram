/* 
说明：登录流程
  1、收集表单数据
  2、前端验证
    1）验证用户信息是否合法
    2）前端验证不通过就提示用户，不需要发请求给后端
    3）前端验证通过了，发请求给服务器
  3、后端验证
   1）验证用户是否合法
   2）用户不存在直接告诉前端
   3）用户存在验证密码
   4）密码正确，提示用户登录成功；不正确提示密码不正确
*/
import loginRequest from '../../utils/loginRequest'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },
  // 表单项内容改变时的回调函数
  handleInput(event){
    // type的值为phone或password
    // let type = event.currentTarget.id
    let type = event.currentTarget.dataset.type
    this.setData({
      // 在对象里面属性是变量时要使用[]，此变成方法巧妙替代了if判断
      [type]: event.detail.value
    })
  },
  // 处理登录
  async handleLogin() {
    let {phone, password} = this.data
    /* 
      手机号验证：
        1、不能为空
        2、格式不正确
        3、格式正确
    */
  //  前端验证
   if(!phone) {
     wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    }
    //  定义正则表达式
    let phoneReg = /^1[3-9]\d{9}$/
    if(!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return
    }
    // 验证密码
    if(!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    // 后端验证
    let loginData = await loginRequest('/login/cellphone', {phone, password})
    let status = loginData.data.code
    if(status === 200) {
      wx.showToast({
        title: '登录成功'
      })
      // 将用户信息存储到本地
      wx.setStorageSync('userInfo', JSON.stringify(loginData.data.profile));
        
      wx.reLaunch({
        url: '../../pages/personal/personal'
      });
        
    }else if(status === 400) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    }else if(status === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    }else {
      wx.showToast({
        title: '登录失败'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})