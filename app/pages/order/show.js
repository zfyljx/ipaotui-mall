// pages/order/show.js
import Countdown from '../../utils/countdown'
import { 
  countdownFormat, datetimeFormat,
  makePhoneCall
 } from '../../utils/util'
import { getOrderInfo } from '../../utils/apis'
Page({
  data: {
    activeNavIndex: 0,
    tabNavs: ['订单状态', '订单详情'],
    statusImgs: {
      '1': '/images/status/order_status_money_icon_current@2x.png',
      '2': '/images/status/order_status_shop_icon_current@2x.png',
      '3': '/images/status/order_status_rider_icon_current@2x.png',
      '4': '/images/status/order_status_service_icon_current@2x.png',
      '5': '/images/status/order_status_service_icon_fail_current@2x.png',
      '6': '/images/status/order_status_service_icon_fail_current@2x.png',
      '7': '/images/status/order_status_service_icon_fail_current@2x.png'
    },
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.id = options.id || 1395
    this.loadData()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
    if (this.countdown) {
      this.countdown.stop()
    }
  },
  tabChange(e) {
    var {current} = e.detail
    this.setData({
      activeNavIndex: current
    })
  },
  navChange(e) {
    var {id} = e.currentTarget
    this.setData({
      activeNavIndex: id
    })
  },

  initCountdown(count) {
    this.setData({
      count
    })
    var countdown = new Countdown(this, 'count')
    countdown.start((count) => {
      this.setData({
        countLabel: countdownFormat(count)
      })
    })
    this.countdown = countdown
  },

  loadData() {
    var that = this
    var order_id = this.id
    wx.showNavigationBarLoading()
    getOrderInfo({
      order_id,
      success(data) {
        data['add_time_format'] = datetimeFormat(data.add_time)
        data['flow'] = data.flow.map(item => {
           item['time_format'] = datetimeFormat(item.time)
           return item
        })
        that.setData({
          info: data
        })
        if(data.left_time > 0) {
          that.initCountdown(+data.left_time)
        }
        wx.hideNavigationBarLoading()
      },
      error() {
        wx.hideNavigationBarLoading()
      }
    })
  },

  onPhoneTap(e) {
    var that = this
    var {info: {seller_phone, localphone}} = this.data
    wx.showActionSheet({
      itemList: [
        `商家电话: ${seller_phone}`,
        `客服电话: ${localphone}`
      ],
      success: function (res) {
        var {tapIndex} = res
        if(tapIndex == 0) {
          makePhoneCall(seller_phone)
        } else if(tapIndex == 1) {
          makePhoneCall(localphone)
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }

})