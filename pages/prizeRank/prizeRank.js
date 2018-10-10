var app = getApp();
let util = require('../../utils/util');
Page({
  data: {
    active: 1,
    url: 'api/recent_award',
    prizeData1: [],
    prizeData2: [],
    header: {
      title: '中奖榜单'
    }
  },
  onLoad: function() {
    var that = this;
    var bottomList = app.data.bottomImg;
    bottomList[0].done = false;
    bottomList[1].done = false;
    bottomList[3].done = false;
    bottomList[2].done = true
    that.setData({
      topHeight: app.data.topHeight,
      statusBarHeight: app.data.statusBarHeight,
      bottomList
    })
    util.loading('数据加载中')
    that.dataRender()
    that.newData()
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
            var prizeData1 = res.data.data;
            prizeData1.forEach(function(item) {
              item.gen_time = util.format(item.gen_time * 1000, "yyyy年MM月dd日")
            })
            that.setData({
              prizeData1
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
        url: 'api/recent_award',
        active: 1
      })
      that.dataRender()
    } else {
      that.setData({
        active: 2,
        url: 'api/winning_list'
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
  },
  newData() {
    var that = this;
    util.postHttp(
      'api/message_number', {
        user_id: app.data.user_id
      },
      function (res) {
        if (res.data.status == 0) {
          if (res.data.status == 0) {
            var newDateNum = res.data.data;
            if (newDateNum > 99) {
              newDateNum = 99
            }
            that.setData({
              newDateNum: newDateNum
            })
            console.log(newDateNum)
          }
        }
      }
    )
  },
  bottomSwitch(e) {
    var index = e.currentTarget.dataset.idx;
    console.log(index)
    if (index != 2) {
      if (index == 0) {
        console.log(index)
        wx.redirectTo({
          url: '../index/index'
        })
      } else if (index == 1) {
        wx.redirectTo({
          url: '../trading/trading'
        })
      } else if (index == 3) {
        wx.redirectTo({
          url: '../myself/myself'
        })
      }
    }
  }
})