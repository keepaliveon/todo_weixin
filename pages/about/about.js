import {
  CategoryModel
} from '../../model/category.js';

let categoryModel = new CategoryModel();

//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cates: [],
    email: ''
  },
  onLoad: function () {
    wx.request({
      url: 'http://127.0.0.1:8080/api/auth/userInfo/' + app.globalData.openid,
      method: 'GET',
      success: (res) => {
        this.setData({
          email: res.data.email
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  onShow: function () {
    categoryModel.getCategories().then((res) => {
      let cates = res.data
      this.setData({
        cates
      })
    })
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.request({
      url: 'http://127.0.0.1:8080/api/auth/userInfo/' + app.globalData.openid,
      method: 'PUT',
      data: {
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        email: this.data.email
      }
    })
  },

  bindEmailInput: function (e) {
    this.setData({
      email: e.detail.value
    })
  },

  onAdd: function (e) {
    wx.navigateTo({
      url: `/pages/cate/cate?cate=${JSON.stringify(e.currentTarget.dataset.cate) || ''}`,
    })
  },

  // showLists: function (e) {
  //   wx.navigateTo({
  //     url: `/pages/lists/lists?cate=${e.currentTarget.dataset.cate}`,
  //   })
  // }
})