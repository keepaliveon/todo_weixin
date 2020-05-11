class CategoryModel {

  addCategory(cate) {
    return new Promise((resolve, reject) => {
      let cates = [];
      this.getCategories().then((res) => {
        cates = res.data
        let hasCate = cates.some(function (item) {
          return item.text == cate;
        })
        if (hasCate) {
          resolve();
        } else {
          wx.request({
            url: 'http://127.0.0.1:8080/api/catalog/' + getApp().globalData.openid,
            method: 'POST',
            data: {
              text: cate
            },
            success: function (res) {
              resolve(res)
            },
            fail(err) {
              console.log(err)
              reject(err)
            }
          })
        }
      })
    })
  }

  editCategory(id, text) {
    wx.request({
      url: 'http://127.0.0.1:8080/api/catalog/' + getApp().globalData.openid,
      method: 'PUT',
      data: {
        id,
        text
      },
      success: function (res) {},
      fail(err) {
        console.log(err)
      }
    })
  }

  deleteCategory(id) {
    wx.request({
      url: 'http://127.0.0.1:8080/api/catalog/' + id,
      method: 'DELETE',
      success: function (res) {

      },
      fail(err) {
        console.log(err)
      }
    })
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