import PubSub from 'pubsub-js'
import request from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    day: '', // 天
    month: '', // 月份
    recommendList: [], //推荐歌曲数组
    index: -1, // 当前被点击歌曲所在下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title: '请先登录', 
        icon: 'none',
        success: () => {
          // 跳转至登录页面
          wx.wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
      
    // 更新日期
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    // 获取每日推荐歌曲数据
    this.getRecommendList()

    // 订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      // msg值是事件名，这里是switchType，data才是真正接收的参数数据
      let { recommendList, index } = this.data
      if(type === 'pre') { // 点击上一首
        (index === 0) && (index = recommendList.length)
        index -= 1
      }else { // 点击下一首
        (index === recommendList.length - 1) && (index = -1)
        index += 1
      }
      this.setData({
        index
      })
      let songId =recommendList[index].id
      // 将songId传给songDetail页面
      PubSub.publish('songId', songId)
    })
  },
  // 获取推荐歌曲的数据
  async getRecommendList(){
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.data.recommend
    })
  },
  // 跳转至歌曲详情页
  toSongDetail(event){
    let { song, index } = event.currentTarget.dataset
    this.setData({
      index
    })
    // 路由跳转传参
    wx.navigateTo({
      // url: '../../pages/songDetail/songDetail?song=' + JSON.stringify(song)  //参数长度过长会被截图，会出错
      url: '../../pages/songDetail/songDetail?songId=' + song.id
    });
      
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

