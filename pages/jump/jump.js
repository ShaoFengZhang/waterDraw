var app = getApp();
let util = require('../../utils/util');
Page({

    data: {

    },

    onLoad: function(options) {
      console.log(options)
        if (options && options.uid) {
            wx.showLoading({
                title: '正在跳转',
            })
            this.uid = options.uid;
            this.indexRender();
        } else {
            wx.showModal({
                title: '提示',
                content: '参数传递不正确',
                showCancel: false,
                success: function() {
                    wx.redirectTo({
                        url: `../index/index`
                    })
                }
            })
        }
    },

    onShow: function() {

    },

    onHide: function() {

    },

    onUnload: function() {

    },

    indexRender() {
        var _this = this;
        util.postHttp(
            'api/prizes_list', {
                user_id: '',
                page: 1,
                per_page: 50,
                type: 1
            },
            function(res) {
                wx.hideLoading();
                if (res.data.status == 0) {
                    let ridList = res.data.data.prizes;
                    let random = Math.floor(Math.random() * ridList.length);
                    _this.rid = ridList[random].rid;
                    wx.redirectTo({
                        url: `../detail/detail?uid=${_this.uid}&rid=${_this.rid}`
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '当前没有正在抽奖的奖品',
                        showCancel: false,
                        success: function() {
                            wx.redirectTo({
                                url: `../index/index`
                            })
                        }
                    })
                }
            }
        )
    },
})