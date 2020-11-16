//app.js
import login from './utils/login.js';
const _login = login.getInstance();

App({
  onLaunch: function () {
    _login.checkToken();
  },
  onShow() {
    _login.checkToken();
  },
  // 登录页：发布-订阅
  loginIfNeed(complete) {
    _login.removeTmpLoginCb();
    if (_login.checkToken()) {
      complete && complete(true);
    } else {
      complete && _login.addTmpLoginCb(complete);
      wx.switchTab({ url: '/pages/mine/mine' });
    }
  },
  globalData: {

  }
});