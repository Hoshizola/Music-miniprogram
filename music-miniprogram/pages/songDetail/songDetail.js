import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'
// 获取全局实例
const appInstance = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 音乐是否播放
    song: {}, // 歌曲详情对象
    musicLink: '', // 保存音乐链接，防止在暂停和播放时重新发请求
    currentTime: '00:00', // 音乐播放时间进度
    durationTime: '00:00', // 音乐总时长
    currentWidth: 0 // 音乐播放实时进度条
  },
  
  /**
   * 生命周期函数--监听页面加载
   * options接收路由跳转传过来的query参数
   */
  onLoad: function (options) {
    let songId = options.songId
    this.getMusicInfo(songId)

    // 判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === songId) {
      this.setData({
        isPlay: true
      })
    }

    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 监视音乐播放/暂停/停止
    this.backgroundAudioManager.onPlay(() => {
      // 修改音乐播放状态
      this.setData({
        isPlay: true
      })
      // 修改全局音乐播放的状态
      appInstance.globalData.isMusicPlay = true
      appInstance.globalData.musicId = songId
    })
    this.backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isMusicPlay = false
    })
    // 真机上的手动停止音乐
    this.backgroundAudioManager.onStop(() => {
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isMusicPlay = false
    })
    // 监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换到下一首
      PubSub.publish('switchType', 'next')
      // 将实时进度条设置为0
      this.setData({
        currentTime: '00:00',
        currentWidth: 0
      })
    })
    // 监听音乐实时播放
    this.backgroundAudioManager.onTimeUpdate(() => {
      // 格式化时间
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss') // 单位是s
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },
  // 控制点击播放/暂停函数的回调
  handleMusicPlay(){
    let isPlay = !this.data.isPlay
    let {musicLink} = this.data
    this.musicControl(isPlay, this.data.song.id, musicLink)
  },
  // 获取音乐详情功能函数
  async getMusicInfo(songId){
    let songData = await request('/song/detail', {ids: songId})
    // songData.data.songs[0].dt单位时ms，moment()的参数也是以ms为单位
    let durationTime = moment(songData.data.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.data.songs[0],
      durationTime
    })
    // 动态修改页面标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    });
  },
  // 控制点击播放/暂停的功能
  async musicControl(isPlay, songId, musicLink){
    if(isPlay){
      if(!musicLink) {
        // 获取音乐播放链接
        let musicLinkData = await request('/song/url',{id: songId})
        console.log(musicLinkData)
        musicLink = musicLinkData.data.data[0].url
        this.setData({
          musicLink
        })
      }
      
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name // 如果不设置title，音乐不会播放
    }else{
      this.backgroundAudioManager.pause()
    }
  },
  // 切歌
  handleSwitch(event){
    let type = event.currentTarget.dataset.type
    // 停止上一首播放的音乐
    this.backgroundAudioManager.stop()
    // 订阅来自recommendSong页面发布的songId
    // 每点击一次切换，就会执行handleSwitch函数，也就会多重复订阅一次函数，这不是我们想要的
    // 每次订阅完后取消订阅可以避免
    PubSub.subscribe('songId', (msg, songId) => {
      // 获取音乐详情信息
      this.getMusicInfo(songId) 
      // 切歌后播放
      this.musicControl(true, songId)
      // 取消订阅
      PubSub.unsubscribe('songId')
    })
    // 发布消息给recommendSong页面
    PubSub.publish('switchType', type)
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