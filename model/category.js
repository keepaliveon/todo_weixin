class CategoryModel {

  addCategory(cate) {
    let cates = [];
    this.getCategories().then((res) => {
      cates = res.data
    })
    let hasCate = cates.some(function (item) {
      return item.text == cate;
    })
    if (hasCate) {
      return;
    } else {
      wx.request({
        url: 'http://127.0.0.1:8080/api/catalog/' + getApp().globalData.openid,
        method: 'POST',
        data: {
          text: cate
        },
        success: function (e) {
          console.log("新分类:" + e.data)
        }
      })
    }
  }

  editCategory(id, text) {
    let cates = this.getCategories();
    cates.forEach(function (item) {
      if (item.id === id) {
        item.text = text;
      }
    })
    wx.setStorageSync('categories', cates);
  }

  deleteCategory(id) {
    let cates = this.getCategories();
    cates.forEach(function (item, index) {
      if (item.id === id) {
        cates.splice(index, 1);
      }
    })
    wx.setStorageSync('categories', cates);
  }

  findCategory(cate) {
    let cates = this.getCategories();
    cate = cates.filter(function (item) {
      return item.text == cate;
    })
    return cate;
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://127.0.0.1:8080/api/catalog/' + getApp().globalData.openid,
        method: 'GET',
        success: function (res) {
          resolve(res)
        },
        fail(err) {
          console.log(err)
          reject(err)
        }
      })
    })
  }
}

export {
  CategoryModel
}