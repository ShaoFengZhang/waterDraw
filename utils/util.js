var app = getApp();
const Promise = require('./../libs/es6-promise.min.js').Promise;
const md5 = require('./../libs/md5.js');

//登录
function login(callback, parentid) {
    wx.login({
        success: function(res) {
            var code = res.code;
            wx.request({
                url: app.data.api + 'api/login',
                method: "POST",
                data: {
                    code: code,
                    parent_id: parentid ? parentid : ''
                },
                success: function(firstRes) {
                    var firstData = firstRes.data.data;
                
                    app.data.user_id = firstData.user_id;

                    app.data.nick_name = firstData.nick_name;
                    app.data.head_pic = firstData.head_pic;
                    app.data.share_writing = firstData.share_writing;
                     app.data.share_pic = firstData.share_pic;

                    wx.setStorageSync('app.data', app.data);
                  //测试

                    // firstData.is_new = 0;

                    //测试
                    var is_new = firstData.is_new;
                    
                    if (callback) {
                        callback(firstData.user_id, is_new)
                    }
                }
            })
        }
    })
}

function checkNumber(num){
  if (isNaN(num)){
    return true
  }else{
    return false
  }
}

// 授权
function author(info, callback) {
    wx.login({
        success: function(res) {
            var code = res.code;
            wx.request({
                url: app.data.api + 'api/login',
                method: "POST",
                data: {
                    code: code
                },
                success: function(firstRes) {
                    var firstData = firstRes.data.data;
                    //测试
                    app.data.user_id = firstData.user_id;
                    app.data.share_pic = firstData.share_pic;
                    app.data.share_writing = firstData.share_writing
                    app.data.nick_name = firstData.nick_name;
                    app.data.head_pic = firstData.head_pic;
                    wx.setStorageSync('app.data', app.data);
                    console.log('login')
                    console.log(firstRes)
                    //测试
                    wx.request({
                        url: app.data.api + 'api/get_userinfo',
                        method: "POST",
                        data: {
                            user_id: firstData.user_id,
                            session_key: firstData.session_key,
                            encryptedData: info.encryptedData,
                            iv: info.iv
                        },
                        success: function(res) {
                            console.log('授权')
                            console.log(res)
                            if (res.data.status == 0) {
                                var data = res.data.data;
                                app.data.nick_name = data.nick_name;
                                app.data.head_pic = data.head_pic;
                                // //测试
                                wx.setStorageSync('app.data', app.data);
                                callback()
                            }
                        }
                    })
                }
            })
        }
    })
}

//post网络请求
function postHttp(url, data, callBack) {
    var that = this;
    wx.request({
        url: app.data.api + url,
        data: data,
        method: "POST",
        success(res) {
            callBack(res)
        },
        fail(error) {
          noData('您的网络有问题，请稍后重试',5000)
        }
    })
}

function dateformat(value, have) {
    var second = Math.floor(value);
    var day = Math.floor(second / 3600 / 24);
    var hr = Math.floor(second / 3600 % 24);
    var min = Math.floor(second / 60 % 60);
    var sec = Math.floor(second % 60);
    if (day > 0) {
        var day = day + "天"
    } else {
        var day = ''
    }

    if (day.indexOf('天') > 0 || hr > 0) {
        var hr = hr + "小时"
    } else {
        var hr = ''
    }

    if (hr.indexOf('小时') > 0 || min > 0 && !have) {
        var min = min + '分'
    } else {
        var min = ''
    }

    return day + hr + min;
}

//成功
function success(res) {
    wx.showToast({
        icon: "success",
        title: res,
        duration: 1500,
        mask: false
    })
}

//失败
function noData(res, time) {
    if (!time) {
        time = 1500
    }
    wx.showToast({
        icon: "none",
        title: res,
        duration: time,
        mask: false
    })
}
// 加载中
function loading(res) {
    wx.showLoading({
        title: res,
        mask: true
    })
}
// 隐藏加载
function hideLoad() {
    wx.hideLoading()
}

function showMsgSave(title, msg) {
    wx.showModal({
        title: title,
        content: msg,
        showCancel: false
    })
}

function showMsg(title, msg) {
    wx.showModal({
        title: title,
        content: msg
    })
}

// 获取年月日
function getNowFormatDate(oldDate) {
    console.log(oldDate)
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var str = year + '' + month + strDate;
    if (!oldDate) {
        app.data.oldDate = str;
        wx.setStorageSync('app.data', app.data);
        return true
    } else if (oldDate != str) {
        app.data.oldDate = str;
        wx.setStorageSync('app.data', app.data);
        return true
    } else if (oldDate == str) {
        return false
    }
}

//转化时间
function format(time, type) {
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
     * 可以用 1-2 个占位符 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) eg: (new
     * Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 (new
     * Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04 (new
     * Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04 (new
     * Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04 (new
     * Date()).format("yyyy-M-d h:m:s.S q ") ==> 2006-7-2 8:9:4.18
     */
    Date.prototype.format = function(fmt) {
        var o = {
            "Y+": this.getFullYear(),
            "M+": this.getMonth() + 1,
            // 月份
            "d+": this.getDate(),
            // 日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
            // 小时
            "H+": this.getHours(),
            // 小时
            "m+": this.getMinutes(),
            // 分
            "s+": this.getSeconds(),
            // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3),
            // 季度
            "S": this.getMilliseconds()
            // 毫秒
        };
        var week = {
            "0": "日",
            "1": "一",
            "2": "二",
            "3": "三",
            "4": "四",
            "5": "五",
            "6": "六"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
    return new Date(time).format(type);
}

function navBack() {
    if (getCurrentPages().length == 1) {

    } else {
        wx.navigateBack();
    }
}

function filterStr(str) {
    var pattern = new RegExp("[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,。.、]");
    var specialStr = "";
    for (var i = 0; i < str.length; i++) {
        specialStr += str.substr(i, 1).replace(pattern, '');
    }
    return specialStr;
}


function md5Fun(a1, a2, a3) {
    var str = a1 + a2 + a3 + '';
    var returnData = md5(str);
    return returnData
}

function md5Toke(a) {
    var str = a + 'dati';
    var returnData = md5(str);
    return returnData
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


module.exports = {
    login: login,
    postHttp: postHttp,
    dateformat: dateformat,
    noData: noData,
    hideLoad: hideLoad,
    loading: loading,
    format: format,
    success: success,
    showMsgSave: showMsgSave,
    author: author,
    navBack: navBack,
    showMsg: showMsg,
    md5Fun: md5Fun,
    md5Toke: md5Toke,
    filterStr: filterStr,
    getNowFormatDate,
  checkNumber,
  random
}