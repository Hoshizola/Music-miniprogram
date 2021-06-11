// pages/index/index.js
import request from '../../utils/request'
//Page Object
Page({
  data: {
    bannerList: [], // 轮播图数据
    recommendList: [], // 推荐歌单
    topList: [] // 热门歌曲
  },
  //options(Object)
  onLoad: async function(options) {
    // 获取轮播图数据
    let bannerListData = await request('/banner', {type: 2})
    // console.log('拿到数据: ', result)
    this.setData({
      bannerList: bannerListData.data.banners
    })
    // 获取推荐歌单数据
    let recommendListData = await request('/personalized', {limit: 10})
    this.setData({
      recommendList: recommendListData.data.result
    })
    // 获取榜单
    let listData = await request('/toplist')
    let list = listData.data.list.slice(0, 5)
    // console.log(list)
    /* 需要根据歌单id的值获取对应的数据，我们需要0-4，发送5次请求 */
    let index = 0
    let topListItemArr = []
    while(index < 5) {
      let topListData = await request('/playlist/detail', {id: list[index++].id}) // 数据量特别大，要截取
      let topListItem = {name: topListData.data.playlist.name, tracks: topListData.data.playlist.tracks.slice(0, 3)}
      topListItemArr.push(topListItem)
      // 边请求数据边更新topList的值，用户体验较好，但是渲染次数较多
      this.setData({
        topList: topListItemArr
      })
    }
  },
  // 跳转每日推荐页
  toRecommendSong(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong'
    });
  },
  onReady: function() {
    
  },
  onShow: function() {
    
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  }
});
  
