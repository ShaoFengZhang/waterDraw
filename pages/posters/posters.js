var app = getApp();
let util = require('../../utils/util');
Page({
  data: {
    header: {
      title: '分享海报',
      navBack: true
    }
  },
  onLoad: function(options) {
    var that = this;

    that.setData({
      topHeight: app.data.topHeight,
      statusBarHeight: app.data.statusBarHeight,
      user_id: app.data.user_id
    })
    if (app.data.head_pic) {
      that.setData({
        head_pic: app.data.head_pic
      })
    } else {
      that.setData({
        head_pic: 'https://tp.datikeji.com/a/15332815744166/Xt9M427e8nsyP4ED9YJld25x1t7hqHHL8woddje7.jpeg'
      })
    }
    if (app.data.nick_name) {
      if (app.data.nick_name.length > 5) {
        app.data.nick_name = app.data.nick_name.substring(0, 5)
      }
      that.setData({
        nick_name: app.data.nick_name
      })
    } else {
      that.setData({
        nick_name: '水滴抽奖'
      })
    }
    var currentInfo = app.data.currentInfo;
    console.log(currentInfo)

    // 测试
    currentInfo.openTime = currentInfo.opening_time;
    var codeImg = app.data.api + 'api/get_qrcode?page=pages/detail/detail&scene=' + that.data.user_id + 'a' + currentInfo.rid;
    console.log(codeImg)
    that.setData({
      open_type: currentInfo.open_type,
      codeImg: codeImg,
      currentInfo: currentInfo,
      widthRate: 750 / app.data.screenWidth,
      backImg: 'https://tp.datikeji.com/a/15381884203558/l3vAm4YlVLtcsSqmrGBnrJMC7MVQl61JmfZRC9Pg.png'
    })

  },
  saveImg: function() {
    var that = this;
    util.loading('生成图片中')
    const ctx = wx.createCanvasContext('myCanvas');
    wx.downloadFile({
      url: that.data.backImg,
      success: function(bgRes) {
        ctx.drawImage(bgRes.tempFilePath, 0, 0, 700 / that.data.widthRate,965 / that.data.widthRate);
        ctx.setFillStyle('#fff')
        ctx.setFontSize(50 / that.data.widthRate)
        ctx.fillText(that.data.nick_name + '喊你领红包', 190 / that.data.widthRate, 80 / that.data.widthRate);

        ctx.setFontSize(50 / that.data.widthRate)
        ctx.fillText('帮他助把力',400 / that.data.widthRate, 160 / that.data.widthRate);

        ctx.setFillStyle('#353535')
        ctx.setFontSize(44 / that.data.widthRate)
        if (that.data.currentInfo.name.length > 7 && that.data.currentInfo.name.length < 17) {
          var infoName1 = that.data.currentInfo.name.substring(0, 7)
          var infoName2 = that.data.currentInfo.name.substring(7)
          ctx.fillText('奖品：' + infoName1, 30 / that.data.widthRate, 820 / that.data.widthRate);
          ctx.fillText(infoName2, 30 / that.data.widthRate, 870 / that.data.widthRate);
          ctx.setFillStyle('#818181')
          ctx.setFontSize(26 / that.data.widthRate)
          if (that.data.open_type == 0) {
            ctx.fillText(that.data.currentInfo.openTime + ' 自动开奖', 30 / that.data.widthRate, 920 / that.data.widthRate);
          } else {
            ctx.fillText('满' + that.data.currentInfo.award_number + '人' + ' 自动开奖', 30 / that.data.widthRate, 920 / that.data.widthRate);
          }

        } else if (that.data.currentInfo.name.length >= 17) {
          var infoName1 = that.data.currentInfo.name.substring(0, 7)
          var infoName2 = that.data.currentInfo.name.substring(7, 16) + '...'
          ctx.fillText('奖品：' + infoName1, 30 / that.data.widthRate, 820 / that.data.widthRate);
          ctx.fillText(infoName2, 30 / that.data.widthRate, 870 / that.data.widthRate);
          ctx.setFillStyle('#818181')
          ctx.setFontSize(26 / that.data.widthRate)
          if (that.data.open_type == 0) {
            ctx.fillText(that.data.currentInfo.openTime + ' 自动开奖', 30 / that.data.widthRate, 920 / that.data.widthRate);
          } else {
            ctx.fillText('满' + that.data.currentInfo.award_number + '人' + ' 自动开奖', 30 / that.data.widthRate, 920 / that.data.widthRate);
          }
        } else {
          ctx.fillText('奖品：' + that.data.currentInfo.name, 30 / that.data.widthRate, 820 / that.data.widthRate);
          ctx.setFillStyle('#818181')
          ctx.setFontSize(26 / that.data.widthRate)
          if (that.data.open_type == 0) {
            ctx.fillText(that.data.currentInfo.openTime + ' 自动开奖', 30 / that.data.widthRate, 900 / that.data.widthRate);
          } else {
            ctx.fillText('满' + that.data.currentInfo.award_number + '人' + ' 自动开奖', 30 / that.data.widthRate, 900 / that.data.widthRate);
          }
        }



        //头像
        wx.downloadFile({
          url: that.data.head_pic,
          success: function(headPic) {
            wx.downloadFile({
              url: that.data.currentInfo.share_detail_pic,
              success: function(picUrl) {
                wx.downloadFile({
                  url: that.data.codeImg,
                  success: function(codeImg) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(90 / that.data.widthRate, 100 / that.data.widthRate, 70 / that.data.widthRate, 0, 2 * Math.PI);
                    ctx.clip();
                    ctx.drawImage(headPic.tempFilePath, 20 / that.data.widthRate, 30 / that.data.widthRate, 140 / that.data.widthRate, 140 / that.data.widthRate);
                    ctx.restore();
                    ctx.drawImage(picUrl.tempFilePath, 10 / that.data.widthRate, 200 / that.data.widthRate, 682 / that.data.widthRate, 545 / that.data.widthRate);
                    ctx.drawImage(codeImg.tempFilePath, 500 / that.data.widthRate, 750 / that.data.widthRate, 170 / that.data.widthRate, 170 / that.data.widthRate);
                    ctx.draw();
                    setTimeout(function() {
                      wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: 700 / that.data.widthRate,
                        height: 965 / that.data.widthRate,
                        destWidth: bgRes.with,
                        destHeight: bgRes.height,
                        canvasId: 'myCanvas',
                        success: function(resImage) {
                          util.hideLoad();
                          wx.saveImageToPhotosAlbum({
                            filePath: resImage.tempFilePath,
                            success: function(saveRes) {
                              wx.showModal({
                                title: '分享图片给朋友，可提高中奖概率',
                                content: '图片已经成功保存到相册',
                                showCancel: true,
                                confirmText: "好的",
                                success: function(resd) {
                                  if (resd.confirm) {
                                    wx.previewImage({
                                      current: resImage.tempFilePath, // 当前显示图片的http链接  
                                      urls: [resImage.tempFilePath] // 需要预览的图片http链接列表  
                                    })
                                  }
                                }
                              })
                            },
                            fail: function(saveRes) {
                              if (saveRes.errMsg == "saveImageToPhotosAlbum:fail auth deny" || saveRes.errMsg == "saveImageToPhotosAlbum:fail:auth denied") {
                                wx.showModal({
                                  title: '提示',
                                  confirmText: "去授权",
                                  content: '保存图片功能需要授权才能正常使用哦~请点击“去授权”-“保存图片”再次授权',
                                  showCancel: false,
                                  success: function(res) {
                                    if (res.confirm) {
                                      wx.openSetting({
                                        success: (res) => {
                                          if (!res["authSetting"]["scope.writePhotosAlbum"]) {
                                            wx.previewImage({
                                              current: resImage.tempFilePath, // 当前显示图片的http链接  
                                              urls: [resImage.tempFilePath] // 需要预览的图片http链接列表  
                                            })
                                          } else {
                                            that.saveImg()
                                          }
                                        }
                                      })
                                    }
                                  }
                                })
                              }
                            }
                          })
                        }
                      })
                    }, 500)
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  imgTap() {
    var that = this;
    that.saveImg()
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
  navBack: function() {
    util.navBack()
  }
})