class ListModel {
  getLists() {
    let all = wx.getStorageSync('todos') || [];
    if (all.length === 0) {
      console.log("请求网络数据")
      wx.request({
        url: 'https://www.keepaliveon.xyz:8080/api/todo/all/' + getApp().globalData.openid,
        method: 'GET',
        success: res => {
          wx.setStorageSync('todos', res.data);
        },
        fail(err) {
          console.log(err)
        }
      })
      this.sleep(3000)
    }
    return wx.getStorageSync('todos') || [];
  }
  sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
        return;
    }
  }
  getTodos() {
    let lists = this.getLists();
    let todos = [];
    if (lists) {
      todos = lists.filter(function (item) {
        return item.done === false;
      }).sort(function (a, b) {
        return b.date - a.date || b.id - a.id;
      })
    }
    return todos;
  }

  getCompleted() {
    let lists = this.getLists();
    let completed = [];
    if (lists) {
      completed = lists.filter(function (item) {
        return item.done === true;
      }).sort(function (a, b) {
        return b.date - a.date || b.id - a.id;
      })
    }
    return completed;
  }

  addTodos(todo) {
    wx.request({
      url: 'https://www.keepaliveon.xyz:8080/api/todo/' + getApp().globalData.openid,
      method: 'POST',
      data: todo,
      success: res => {
        todo.category = res.data
        let lists = this.getLists();
        lists.push(todo);
        wx.setStorageSync('todos', lists);
      },
      complete: () => {}
    })
  }

  deleteTodo(id) {
    wx.request({
      url: 'https://www.keepaliveon.xyz:8080/api/todo/' + id,
      method: 'DELETE',
      success: res => {},
      complete: () => {}
    })
    let lists = this.getLists();
    lists.forEach(function (item, index) {
      if (item.id === id) {
        lists.splice(index, 1);
      }
    })
    wx.setStorageSync('todos', lists);
  }

  updateLists(todo) {
    wx.request({
      url: 'https://www.keepaliveon.xyz:8080/api/todo/' + getApp().globalData.openid,
      method: 'PUT',
      data: todo,
      success: () => {
        let lists = this.getLists()
        if (lists) {
          lists.forEach(function (item) {
            if (item.id === todo.id) {
              Object.keys(todo).forEach(function (key) {
                item[key] = todo[key]
              })
            }
          })
        }
        wx.setStorageSync('todos', lists);
      }
    })
  }

  getTodoDetail(id) {
    let lists = this.getLists();
    let todo = lists.find(function (item) {
      return item.id == id;
    })
    return todo;
  }

  filterTodos(options) {
    let {
      cate,
      search
    } = options;
    let todos = this.getTodos();
    if (cate == '全部') {
      if (!search) {
        return todos;
      } else {
        todos = todos.filter(function (item) {
          return item.text.includes(search);
        })
        return todos;
      }
    }
    todos = todos.filter(function (item) {
      return item.category == cate;
    })
    if (search) {
      todos = todos.filter(function (item) {
        return item.text.includes(search);
      })
    }
    return todos;
  }

  getListsByCate(cate) {
    let todos = this.getTodos();
    let completed = this.getCompleted();

    let lists = todos.concat(completed);

    lists = lists.filter(function (item) {
      return item.category == cate;
    })

    return lists;
  }

  getTodosOfDate(date) {
    let lists = this.getLists();

    if (!lists.length) {
      return;
    }

    lists = lists.filter(function (item) {
      let dat = new Date(item.date);
      return (date.getFullYear() === dat.getFullYear()) && (date.getMonth() === dat.getMonth()) && (date.getDate() === dat.getDate())
    })
    lists.sort(function (a, b) {
      return Number(a.done) - Number(b.done)
    })
    return lists;
  }

  getTodoDays({
    year,
    month
  }) {
    let lists = this.getLists();
    if (!lists.length) {
      return [];
    }

    let days = new Set();
    lists.forEach(function (item) {
      let date = item.date;
      date = new Date(date);
      if ((date.getFullYear() === year) && (date.getMonth() + 1 === month)) {
        days.add(date.getDate());
      }
    })
    return [...days].sort(function (a, b) {
      return a - b;
    });
  }
}

export {
  ListModel
}