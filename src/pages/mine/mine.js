import regeneratorRuntime from '../../vendor/runtime.js';
import request from '../../service/http/request.js';
import login from '../../utils/login.js';
const apiRequset = request.getInstance();
const _login = login.getInstance();

Page({
  data: {
    msg: 'hellow world'
  },
  async bindLogin(params) {
    if (await _login.getToken(params)) {
      this.setData({
        msg: '登录成功'
      });
    }
  }
});