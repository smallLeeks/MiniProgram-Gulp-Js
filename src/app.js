//app.js
import regeneratorRuntime from './vendor/runtime.js';
import login from './utils/login.js';
const _login = login.getInstance();

App({
  onLaunch: function () { },
  // 登录页：发布-订阅
  async loginIfNeed(complete) {
    _login.removeTmpLoginCb();
    if (await _login.checkToken()) {
      complete && complete(true);
    } else {
      complete && _login.addTmpLoginCb(complete);
      wx.switchTab({ url: '/pages/mine/mine' });
    }
  },
  globalData: {

  }
});