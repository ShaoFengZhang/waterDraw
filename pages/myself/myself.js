var app = getApp();
let util = require('../../utils/util');
Page({
  data: {
    first: true,
    extraData: {
      id: '33866'
    },
    hideState: false,
    header: {
      title: '水滴抽奖'
    }
  },
  onLoad: function() {
    var that = this;
    var bottomList = app.data.bottomImg;
    bottomList[0].done = false;
    bottomList[1].done = false;
    bottomList[2].done = true
    that.setData({
      topHeight: app.data.topHeight,
      statusBarHeight: app.data.statusBarHeight,
      bottomList: bottomList
    })
    util.loading('数据加载中');
    that.dataRender('hide');
    that.newData()
  },
  hideTap() {
    this.setData({
      hideState: true
    })
  },
  onShow() {
    var that = this;
    if (!that.data.first) {
      that.dataRender()
      that.newData()
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
          }
        }
      }
    )
  },
  dataRender(hide) {
    var that = this;
    util.postHttp(
      'api/my_info', {
        user_id: app.data.user_id
      },
      function(res) {
        if (hide) {
          util.hideLoad();
        }

        if (that.data.first) {
          that.setData({
            first: false
          })
        }
        if (res.data.status == 0) {
          var data = res.data.data;
          var myData = {
            ...data
          }
          that.setData({
            myData: myData
          })
        }
      }
    )
  },
  // 跳转
  jumpTap(e) {
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: '../drawRecord/drawRecord'
      })
    } else if (type == 2) {
      wx.navigateTo({
        url: '../winRecord/winRecord'
      })
    } else if (type == 3) {
      wx.redirectTo({
        url: '../trading/trading'
      })
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
      }
    }
  }
})