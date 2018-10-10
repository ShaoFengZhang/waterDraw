var app = getApp();
let util = require('../../utils/util');
Page({
  data: {
    active: 1,
    page: 1,
    category: 0,
    prizeData1: [],
    prizeData2: [],
    firstState:true,
    header: {
      title: '中奖纪录',
      navBack: true
    },
    isEmpty:false
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
  dataRender(noLoad) {
    var that = this;
    util.postHttp(
      'api/winning_prize', {
        user_id: app.data.user_id,
        page_number: 20,
        page: that.data.page,
        receive_or_not: that.data.category
      },
      function(res) {
        if (!noLoad) {
          util.hideLoad()
        }
        if (that.data.firstState){
          that.setData({
            firstState:false
          })
        }

        if (res.data.status == 0) {
          var data = res.data.data.winning_prize;
          data.forEach(function(item) {
            item.opening_time = util.format(item.opening_time * 1000, "MM月dd日 HH时")
          })
          if (that.data.page > 1) {
            data = that.data.prizeData.concat(data)
          }

          if (that.data.category == 0) {
            that.setData({
              prizeData1: data,
              prizeData: data
            })
          } else {
            that.setData({
              prizeData2: data,
              prizeData: data
            })
          }

          if (that.data.prizeData.length==0){
            that.setData({
              isEmpty:true
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
        page: 1,
        prizeData: []
      })
      that.dataRender()
    } else {
      that.setData({
        active: 2,
        category: 1,
        page: 1,
        prizeData: []
      })
      that.dataRender()
    }
  },
  onReachBottom: function(e) {
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
  // 填写收货地址
  addressTap(e) {
    var that = this;
    console.log(e)
    var rid = e.currentTarget.dataset.rid;
    var formId = e.detail.formId;
    console.log(rid);
    wx.chooseAddress({
      success: function(res) {
        that.chooseAddress(res, formId, rid)
      },
      fail: function(res) {
        console.log(res)
        if (res.errMsg == 'chooseAddress:fail auth deny' || res.errMsg == 'chooseAddress:fail:auth denied') {
          wx.showModal({
            title: '警告',
            confirmText: "确定",
            content: '您点击了拒绝授权，将无法正常添加，点击确定重新获取授权',
            showCancel: true,
            success: function(res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (!res["authSetting"]["scope.address"]) {
                      util.noData("授权失败")
                    } else {
                      that.addressTap(e)
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
    
  },
  // 阻止向下捕捉
  cancel() {
    return false
  },
  // 选择地址
  chooseAddress(data, formId, rid) {
    var that = this;
    wx.showModal({
      title: '请核对地址',
      content: data.provinceName + data.cityName + data.countyName + data.detailInfo + '。电话:' + data.telNumber,
      success: function(res) {
        if (res.confirm) {
          util.postHttp(
            'api/collect_goods', {
              formId: formId,
              rid: rid,
              user_id: app.data.user_id,
              consignee: data.userName,
              phone: data.telNumber,
              province: data.provinceName,
              city: data.cityName,
              area: data.countyName,
              detail_address: data.detailInfo,
              zip_code: data.postalCode
            },
            function(res) {
              if (res.data.status == 0) {
                util.success(res.data.msg);
                that.setData({
                  active: 2,
                  category: 1,
                  page: 1,
                  prizeData: that.data.prizeData2
                })
                that.dataRender()
              }else{
                util.noData(res.data.msg);
              }
            }
          )
        }
      }
    })
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
  toIndexTap() {
    wx.redirectTo({
      url: '../index/index'
    })
  }
})