import { CategoryModel } from '../../model/category.js';

let categoryModel = new CategoryModel();

// pages/cate/cate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cate: {},
    text: '',
    isAdd: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cate = options.cate || '';
    if (cate) {
      cate = JSON.parse(cate);
      this.setData({
        cate,
        text: cate.text,
        isAdd: false
      })
    }
  },

  onInput: function (e) {
    let text = e.detail.value;
    this.setData({
      text
    })
  },

  addCate: function (e) {
    let text = this.data.text;
    if (!text) {
      return;
    }
    categoryModel.addCategory(text);
    wx.navigateBack({
      delta: 1
    })
  },

  editCate: function (e) {
    let text = this.data.text;
    let cate = this.data.cate;
    categoryModel.editCategory(cate.id, text);
    wx.navigateBack({
      delta: 1
    })
  },

  delCate: function () {
    let cate = this.data.cate;
    categoryModel.deleteCategory(cate.id);
    wx.navigateBack({
      delta: 1
    })
  },
})