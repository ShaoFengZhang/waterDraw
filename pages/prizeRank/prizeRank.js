var app = getApp();
let util = require('../../utils/util');
Page({
  data: {
    active: 1,
    url: 'api/winning_list',
    prizeData1: [],
    prizeData2: [],
    header: {
      title: '中奖榜单'
    }
  },
  onLoad: function() {
    var that = this;
    that.setData({
      topHeight: app.data.topHeight,
      statusBarHeight: app.data.statusBarHeight
    })
    util.loading('数据加载中')
    that.dataRender()
  },
  dataRender(nooad) {
    var that = this;
    util.postHttp(
      that.data.url, {

      },
      function(res) {
        util.hideLoad()
        if (res.data.status == 0) {
          if (that.data.active == 1) {
            that.setData({
              prizeData1: res.data.data
            })
          } else if (that.data.active == 2) {
            that.setData({
              prizeData2: res.data.data
            })
          }
        } else {
          util.noData(res.data.msg)
        }
      }
    )
  },
  changeNav(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    util.loading('数据加载中')
    if (type == 1) {
      that.setData({
        url: 'api/winning_list',
        active: 1
      })
      that.dataRender()
    } else {
      that.setData({
        active: 2,
        url: 'api/recent_award'
      })
      that.dataRender()
    }
  },
  onShareAppMessage: function(e) {
    //分享页面
    var that = this;
    return {
      title: app.data.share_writing,
      path: 'pages/index/index',
      imageUrl: app.data.share_pic,
      success: function(res) {
        // 转发成功
        util.success('分享成功')
      },
      fail: function(res) {
        // 转发失败
        util.noData('取消分享')
      }
    }
  }
})