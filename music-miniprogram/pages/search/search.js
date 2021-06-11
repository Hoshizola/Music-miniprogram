import request from '../../utils/request'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', // 搜索框中的默认值
    hotList: [], // 热搜榜数据
    searchContent: '', // 用户输入的搜索数据
    searchList: [], // 根据关键词模糊匹配到的数据
    historyList: [], //搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData()
    // 获取历史记录
    this.getSearchHistory()
  },
  // 获取初始化数据
  async getInitData(){
    let placeholderData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderData.data.data.showKeyword,
      hotList: hotListData.data.data
    })
  },
  // 获取本地搜索历史记录
  getSearchHistory(){
    let historyList = wx.getStorageSync('searchHistory');
    if(historyList) {
      this.setData({
        historyList
      })
    }
  },
  // 模糊搜索
  handleInputChange(event){
    let searchContent = event.detail.value.trim()
    this.setData({
      searchContent
    })
    // 发送模糊搜索请求
    // 为防止频繁输入频繁发送请求，使用节流提高性能，可以设置每隔300ms发送一次请求
    if(isSend) {
      return 
    }
    isSend = true
    this.getsearchListData()
    setTimeout(() => {
      isSend = false
    }, 300);
  },
  // 获取查询列表
  async getsearchListData(){
    // 如果查询条件为空
    if(!this.data.searchContent) {
      this.setData({
        searchList: []
      })
      return
    }
    let {searchContent, historyList} = this.data
    let searchListData = await request('/search', {keywords: searchContent, limit: 10})
    this.setData({
      searchList: searchListData.data.result.songs
    })
    // 将搜索内容添加到历史记录数组中
    // 如果搜索记录之前就存在，先删除，再添加到列表首部
    if(historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })
    // 将数据存到本地以便下次打开页面后自动获取
    wx.setStorageSync('searchHistory', historyList);
  },
  // 删除搜索历史记录
  deleteHistoryList(){
    wx.showModal({
      title: '',
      content: '确认清空历史记录？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#d43c33',
      success: (result) => {
        if (result.confirm) {
          // 清空data中的historyList
          this.setData({
            historyList: []
          })
          // 清空本地缓存
          wx.removeStorageSync('searchHistory');
        }
      }
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