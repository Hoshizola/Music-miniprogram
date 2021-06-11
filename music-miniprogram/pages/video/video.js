import request from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 导航标签数组
    navId: '', //导航标签的标识
    videoList: [], // 视频列表数据
    videoId: '', // 视频id标识
    videoUpdateTimes: [], // 视频更新数组
    isTriggered: false, // 下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取导航数据
    this.getVideoGroupListData()
  },
  // 获取视频导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.data.slice(0, 14),
      navId: videoGroupListData.data.data[0].id
    })
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
    // 获取视频列表数据
    this.getVideoList(this.data.navId)
  },
  // 获取视频列表数据
  async getVideoList(navId){
    let videoListData = await request('/video/group', {id: navId})
    console.log(videoListData)
    // 加载完数据关闭正在加载的提示框
    wx.hideLoading();
    let videoList = videoListData.data.datas.map((item, index) => {
      item.id = index++
      return item
    })
    this.setData({
      videoList,
      isTriggered: false
    })
  },
  // 改变导航标签
  changeNav(event) {
    let navId = event.currentTarget.id
    this.setData({
      navId: navId * 1, // 把navId转为数值
      videoList: []
    })
    // 显示正在加载提示框
    wx.showLoading({
      title: '正在加载'
    });
    this.getVideoList(this.data.navId)
  },
  /* 
    问题：控制视频播放，一次只播放一个视频
    需求：
      1、在点击播放的事件中需要找到上一个播放的视频
      2、在播放新的视频之前关闭上一个正在播放的视频
    关键：
      1、如何找到上一个视频的实例对象
      2、如何确认点击播放的视频和正在播放的视频不是同一个视频
    单例模式：
      1、需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象
      2、节省内存空间
  */
  handlePlay(event){
    // 获取视频id
    let vid = event.currentTarget.id
    /*
      给当前的组件实例添加videoContext属性标识当前正在播放的实例
      如果videoContext不存在，说明是第一个播放的视频
      如果存在，调用stop()停止播放上一个视频，并把videoContext赋值为当前播放的实例
    */
    // 如果点击的是不同的视频，则逻辑是停止上一个视频的播放
    // 如果播放/停止点击的是同一个视频，不用处理逻辑 
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    // 更新data中videoId的状态数据
    this.setData({
      videoId: vid
    })
    // 创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid);
    // 视频自动播放，播放前判断该视频是否已经播放过，如果有，则跳转
    let {videoUpdateTimes} = this.data
    let videoItem = videoUpdateTimes.find(item => item.vid === vid)
    if(videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },
  // 视频定位到上次播放的地方
  handleTimeUpdate(event) {
    let {videoUpdateTimes} = this.data
    let videoItem = videoUpdateTimes.find(item => item.vid === event.currentTarget.id)
    if(videoItem){
      videoItem.currentTime = event.detail.currentTime
    }else{
      let videoTimeObj = {
        vid: event.currentTarget.id,
        currentTime: event.detail.currentTime
      }
      videoUpdateTimes.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTimes
    })
  },
  // 视频播放结束时
  handleEnded(event){
    let {videoUpdateTimes} = this.data
    let currentItemIndex = videoUpdateTimes.findIndex(item => item.vid === event.currentTarget.id)
    videoUpdateTimes.splice(currentItemIndex, 1)
    this.setData({
      videoUpdateTimes
    })
  },
  // 自定义下拉刷新回调
  handleRefresher(){
    console.log('下拉刷新')
    this.getVideoList(this.data.navId)
    this.setData({
      isTriggered: true
    })
  },
  // 自定义上拉触底加载
  handleToLower(){
    console.log('触底啦')
    // 网易没有提供对应的接口用于数据请求
  },

  // 点击搜索音乐进入搜索页面
  toSearch(){
    wx.navigateTo({
      url: '../../pages/search/search'
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
    console.log('页面下拉刷新')
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
    // 返回的对象是自定义的分享内容
    return {
      title: '分享我喜欢的内容',
      path: 'pages/video/video',
      imageUrl: '/static/images/p3.jpg'
    }
  }
})