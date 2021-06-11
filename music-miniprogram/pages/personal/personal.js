import request from '../../utils/request'

let startY = 0  // 手指起始的坐标
let moveY = 0 // 手指移动的坐标
let moveDistance = 0 // 手指移动的距离

Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {},
    recentPlayRecordList: []
  },
  // 个人中心页动画效果三剑客
  handleTouchStart(event) {
    this.setData({
      coverTransition: ''
    })
    // 以第一根手指为准
    startY = event.touches[0].clientY
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    if(moveDistance <= 0) {
      return 
    }
    if(moveDistance >= 80) {
      moveDistance = 80
    }
    // 更新coverTransform的值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    }) 
  },
  handleTouchEnd() {
    this.setData({
      coverTransform: 'translateY(0rpx)',
      coverTransition: 'transform 1s linear'
    })
  },
  // 点击登录
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 读取用户基本信息
     //  读取的是JSON对象
     let userInfo = wx.getStorageSync('userInfo');
     if(userInfo) {
       this.setData({
         userInfo: JSON.parse(userInfo)
       })
      }
    // 获取用户播放记录
    this.getUserRecentPlayRecordList(this.data.userInfo.userId)
  },
  // 获取用户播放记录  
  async getUserRecentPlayRecordList(userId) {
    let recentPlayRecordListData = await request('/user/record', {uid: userId, type: 0})
    // 给列表的每一项添加唯一属性值
    let recentPlayRecordList = recentPlayRecordListData.data.allData.slice(0, 10).map((item, index) => {
      item.id = index+1
      return item
    })
    console.log(recentPlayRecordList)
    this.setData({
      recentPlayRecordList
    })
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