import regeneratorRuntime from '../../vendor/runtime.js';
import request from '../../service/http/request.js';
import login from '../../utils/login.js';
import location from '../../utils/location.js';
const apiRequset = request.getInstance();
const _login = login.getInstance();

Page({
  data: {
    msg: '获取定位'
  },
  onLoad() {
    location.getCoordinate();
  }
});