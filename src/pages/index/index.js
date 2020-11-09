import request from '../../service/http/request.js';
const apiRequset = request.getInstance();

Page({
  data: {
    msg: 'hellow world'
  },
  onLoad() {
    this.test();
  },
  test() {
    apiRequset.getJson().then(res => {
      const data = res;
      console.log(data);
    }).catch(err => { console.log(err); });
  }
});