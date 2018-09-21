var app = getApp();
let util = require('../../utils/util');
Page({
  data: {
    active: 1,
    page: 1,
    category: 0,
    prizeData1:[],
    prizeData2:[],
    firstState: true,
    header: {
      title: '抽奖记录',
      navBack: true
    }
  },
  onLoad: function () {
    var that = this;
    that.setData({
      topHeight: app.data.topHeight,
      statusBarHeight: app.data.statusBarHeight
    })
    util.loading('数据加载中')
    that.dataRender()
  },
  dataRender(noLoad) {
    var that = this;
    util.postHttp(
      'api/involved',
      {
        user_id: app.data.user_id,
        page_number: 20,
        page: that.data.page,
        over_or_not: that.data.category
      },
      function (res) {
        if (!noLoad) {
          util.hideLoad()
        }
        if (that.data.firstState) {
          that.setData({
            firstState: false
          })
        }
        if (res.data.status == 0) {
          var data = res.data.data.involved;
          if (that.data.category==0){
            data.forEach(function (item) {
              item.opening_time = util.dateformat(item.count_down)
            })
          }else{
            data.forEach(function (item) {
              item.opening_time = util.format(item.opening_time*1000,"MM月dd日 HH时")
            })
          }    
          if (that.data.page > 1) {
            data = that.data.prizeData.concat(data)
          }
          
          if (that.data.category == 0){
            that.setData({
              prizeData1: data,
              prizeData:data
            })
          }else{
            that.setData({
              prizeData2: data,
              prizeData: data
            })
          }

          that.setData({
            total_pages: res.data.data.total_pages
          })
        }
      }
    )
  },
  changeNav(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    console.log(type)

    util.loading('数据加载中')
    if (type == 1) {
      that.setData({
        active: 1,
        category: 0,
        page:1,
        prizeData: that.data.prizeData1
      })
      that.dataRender()
    } else {
      that.setData({
        active: 2,
        category: 1,
        page: 1,
        prizeData: that.data.prizeData2
      })
      that.dataRender()
    }
  },
  onReachBottom: function (e) {
    // 下拉加载
    var that = this;
    if (that.data.page < that.data.total_pages) {
      util.loading('数据加载中')
      that.setData({
        page: that.data.page + 1
      })
      that.dataRender()
    } else {
      return
    }
  },
  //跳转到详情页
  jumpTap(e) {
    console.log(e)
    var rid = e.currentTarget.dataset.rid;
    wx.navigateTo({
      url: '../detail/detail?rid=' + rid
    })
  },
  onShareAppMessage: function (e) {
    //分享页面
    var that = this;
    return {
      title: app.data.share_writing,
      path: 'pages/index/index',
      imageUrl: app.data.share_pic,
      success: function (res) {
        // 转发成功
        util.success('分享成功')
      },
      fail: function (res) {
        // 转发失败
        util.noData('取消分享')
      }
    }
  },
  navBack: function () {
    util.navBack();
  },
  toIndexTap(){
    wx.switchTab({
      url: '../index/index'
    })
  }
})