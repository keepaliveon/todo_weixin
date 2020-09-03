import {
  ListModel
} from '../../model/list.js';
import {
  CategoryModel
} from '../../model/category.js';
import util from '../../utils/util.js';

let listModel = new ListModel();
let categoryModel = new CategoryModel();
//var date = util.formatTime(new Date());
let date = new Date(date).getTime();
let today= new Date(date).getTime();
Page({
  data: {
    todos: [],
    addText: '',
    delBtnWidth: 120,
    isAdd: true,
    cates: [],
    date: today,
    cate: ''
  },

  //onLoad: function () {
  //var date = util.formatTime(new date());},

  //   let cates = categoryModel.getCategories();
  //   let cate = '全部'
  //   cates.unshift(cate);
  //   this.setData({
  //     cates,
  //     cate
  //   })
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let date = new Date(date).getTime();
    let today = new Date(date).getTime();    
    this.setData({
      today,
      date
    })
    this.getOpenID(this.initData)
  },

  onTap: function () {
    let todos = this.data.todos;
    todos.forEach(function (item) {
      item.txtStyle = ''
    })
    this.setData({
      todos
    })
  },

  onInput: function (event) {
    this.setData({
      addText: event.detail.value
    })
  },

  dateChange: function (event) {
    let date1 = event.detail.value;
    //date = new Date(date).getTime();
    //时间数字
    this.setData({
      date: date1
      //时间格式化
    })
    this.data.todos.date = date;
  },

  /*dateChange:function(evevt){
    console.log(e.detail.value)
    this.setData({
      date:e.detail.value
    });
  },*/

  onChange: function (event) {
    let isAdd = !this.data.isAdd;
    this.setData({
      isAdd
    })
    if (isAdd) {
      let todos = listModel.getTodos();
      this.setData({
        todos,
        addText: '',
        date: date,
        cate: '全部'
      })
    }
  },
  onConfirm: function (event) {
    let text = this.data.addText;
    if (!text) {
      return;
    }
    let isAdd = this.data.isAdd;
    if (isAdd) {
      let id = new Date().getTime();
      let date = this.data.date;
      let todo = {
        text,
        id,
        done: false,
        date: date,
        category: '默认'
      };
      let todos = listModel.getTodos();
      todos.unshift(todo);
      this.setData({
        todos,
        addText: '',
        //setDate:''
      })
      listModel.addTodos(todo);
    } else {
      let cate = this.data.cate;
      let todos = listModel.filterTodos({
        cate,
        search: text
      })
      console.log(todos)
      this.setData({
        todos
      })
    }
  },

  bindPickerChange: function (event) {
    let id = event.detail.value;
    let cate = this.data.cates[id];
    let todos = listModel.filterTodos({
      cate
    })
    this.setData({
      cate,
      todos
    })
  },

  onStateChange: function (event) {
    let todo = event.detail.todo;
    let todos = this.data.todos;
    todos = todos.filter(function (item) {
      return item.id !== todo.id;
    })
    this.setData({
      todos
    })
    listModel.updateLists(todo);
  },

  onDelete: function (event) {
    let index = event.target.dataset.index;
    let id = event.detail.id;
    let todos = this.data.todos;
    todos.splice(index, 1);
    this.setData({
      todos
    })
    listModel.deleteTodo(id);
  },

  touchStart: function (event) {
    //清除之前的样式
    let todos = this.data.todos;
    todos.forEach(function (item) {
      item.txtStyle = ''
    })
    this.setData({
      todos
    })
    //是否只有一个触摸点
    if (event.touches.length === 1) {
      this.setData({
        //触摸起始的X坐标
        startX: event.touches[0].clientX
      })
    }
  },

  touchMove: function (event) {
    if (event.touches.length === 1) {
      let moveX = event.touches[0].clientX;
      let disX = this.data.startX - moveX;
      let delBtnWidth = this.data.delBtnWidth;
      let txtStyle = '';
      if (disX <= 0) {
        txtStyle = 'left:0';
      } else if (disX > 0) {
        txtStyle = 'left:-' + disX + 'rpx';
        if (disX > delBtnWidth) {
          txtStyle = 'left:-' + delBtnWidth + 'rpx'
        }
      }
      let index = event.currentTarget.dataset.index;
      let todos = this.data.todos;
      todos[index].txtStyle = txtStyle;
      this.setData({
        todos
      })
    }
  },

  touchEnd: function (event) {
    if (event.changedTouches.length === 1) {
      //手指移动结束后触摸点的X坐标
      let end = event.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      let disX = this.data.startX - end;
      let delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      let txtStyle = disX > delBtnWidth / 2 ? 'left:-' + delBtnWidth + 'rpx' : 'left:0';
      //获取手指触摸的是哪一项
      let index = event.currentTarget.dataset.index;
      let todos = this.data.todos;
      todos[index].txtStyle = txtStyle;
      this.setData({
        todos
      })
    }
  },

  getOpenID(callback) {
    wx.login({
      success: res => {
        wx.request({
          url: 'http://127.0.0.1:8080/api/auth/wx_auth',
          data: {
            code: res.code
          },
          success: res => {
            getApp().globalData.openid = res.data
          },
          complete: () => {
            callback && callback()
          }
        })
      }
    })
  },

  initData() {
    categoryModel.getCategories().then((res) => {
      let cates = res.data;
      cates = cates.map(function (item) {
        return item.text;
      })
      let cate = '全部'
      cates.unshift(cate);
      this.setData({
        cates,
        cate,
        isAdd: true,
        addText: '',
        date: '',
      })
    })
    let todos = listModel.getTodos();
    this.setData({
      todos
    })
  }
})