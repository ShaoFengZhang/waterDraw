var app = getApp();
let util = require('../../utils/util');
var Page = require('../../utils/xmadx_sdk.min.js').xmad(Page).xmPage;
Page({
  data: {
    page: 1,
    per_page: 50,
    first: true,
    header: {
      title: '水滴抽奖'
    },
    // 需在xmadID中配置广告位ID，多个ID之间用英文逗号隔开
    xmad: {
      adData: {},
      ad: {
        banner: "xm98dd2018345ea489e39b15657d19cb", // 按需引入
      }
    }
  },
  onShow() {
    var that = this;
    if (!that.data.first) {
      that.indexRender(that.data.user_id);
      that.newData(that.data.user_id)
      that.notice()
    }
  },
  onHide() {
    this.setData({
      noticeData: []
    })
  },
  onLoad(options) {   
    var that = this;
    var bottomList = app.data.bottomImg;
    bottomList[1].done = false;
    bottomList[2].done = false;
    bottomList[3].done = false;
    bottomList[0].done = true;

    that.setData({
      topHeight: app.data.topHeight,
      statusBarHeight: app.data.statusBarHeight,
      bottomList: bottomList
    })
    util.loading('数据加载中')
    that.notice();

    if (!app.data.user_id || !util.checkNumber(app.data.user_id)) {
      util.login(
        function(res) {
          that.indexRender(res, 'hide')
          that.newData(res)
          that.setData({
            user_id: res
          })
        }
      )
    } else {
      that.setData({
        user_id: app.data.user_id
      })
      that.newData(that.data.user_id)
      that.indexRender(that.data.user_id, 'hide')
    }
  },
  //通知渲染
  notice() {
    var that = this;
    util.postHttp(
      'api/message', {

      },
      function(res) {
        var data = res.data.data;
        data.forEach(function(item) {
          if (item.nick_name) {
            if (item.nick_name.length > 4) {
              item.nick_name = item.nick_name.substring(0, 4)
            }
          }
        })
        that.setData({
          noticeData: data
        })
      }
    )
  },
  newData(user) {
    var that = this;
    util.postHttp(
      'api/message_number', {
        user_id: user
      },
      function(res) {
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
    )
  },
  //首页列表渲染
  indexRender(user, hide) {
    var that = this;
    util.postHttp(
      'api/prizes_list', {
        user_id: user,
        page: that.data.page,
        per_page: that.data.per_page,
        type: 1
      },
      function(res) {
        if (hide) {
          util.hideLoad();
        }
        if (hide == 'refresh') {
          wx.stopPullDownRefresh();
        }
        if (res.data.status == 0) {
          app.data.share_pic = res.data.data.share_pic;
          app.data.share_writing = res.data.data.share_writing;
          wx.setStorageSync('app.data', app.data);
          var data = res.data.data.prizes;
          var total_pages = res.data.data.total_pages;

          data.forEach(function(item) {
            item.opening_time = util.dateformat(item.count_down)
          })

          if (that.data.page > 1) {
            data = that.data.prizes.concat(data)
          }

          that.setData({
            prizes: data,
            total_pages: total_pages,
          })

          if (that.data.first) {
            that.setData({
              first: false
            })
          }

        } else {
          that.setData({
            prizes: []
          })
        }
        setTimeout(function() {
          that.setData({
            adShow: true
          })
        }, 500)

      }
    )
  },
  //跳转到详情页
  jumpTap(e) {
    var rid = e.currentTarget.dataset.rid;
    wx.navigateTo({
      url: '../detail/detail?rid=' + rid
    })
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
  //上啦刷新
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      page: 1
    })
    util.loading('刷新数据中');
    that.notice()
    that.indexRender(that.data.user_id, 'refresh')
    that.newData(that.data.user_id)
  },
  onReachBottom: function(e) {
    // 下拉加载
    var that = this;
    if (that.data.page < that.data.total_pages) {
      that.setData({
        page: that.data.page + 1
      })
      util.loading('加载数据中')
      that.indexRender(that.data.user_id, 'hide')
      that.newData(that.data.user_id)
    } else {
      return
    }
  },
  bottomSwitch(e) {
    var index = e.currentTarget.dataset.idx;
    console.log(index)
    if (index != 0) {
      if (index == 1) {
        console.log(index)
        wx.redirectTo({
          url: '../trading/trading'
        })
      } else if (index == 2) {
        wx.redirectTo({
          url: '../prizeRank/prizeRank'
        })
      } else if (index == 3) {
        wx.redirectTo({
          url: '../myself/myself'
        })
      }
    }
  }
})