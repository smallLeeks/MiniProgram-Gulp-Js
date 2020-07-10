//index.js
import regeneratorRuntime from '../../vendor/runtime.js';
import request from '../../service/http/request.js';
const _request = request.getInstance();

Page({
  data: {

  },
  onLoad: function () {

  },
  async test() {
    const data = await _request.getJson();
    console.log(data);
  }
});
