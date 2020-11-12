import regeneratorRuntime from '../vendor/runtime.js';
import request from '../service/http/request.js';
const apiRequset = request.getInstance();

export default class login {
  /**
   * [instance  当前实例]
   * @type {this}
   */
  static instance;

  /**
   * [getInstance 获取单例]
   * @method getInstance
   * @return
   */
  static getInstance() {
    if (false === this.instance instanceof this) {
      this.instance = new this();
    }
    return this.instance;
  }

  constructor() {
    // 登录监听函数注册
    this.loginMap = new Map();
    this.tmpLoginCb = '';
    // 用户信息
    this.userInfo = {};
  }

  // 获取登录状态
  isLogin() {
    return this.userInfo.token ? true : false;
  }

  // 登录页：发布-订阅
  loginIfNeed(complete) {
    this.removeTmpLoginCb();
    if (this.isLogin()) {
      complete && complete(true);
    } else {
      complete && this.addTmpLoginCb(complete);
      wx.switchTab({ url: '/pages/mine/mine' });
    }
  }

  // 注册监听登录状态变化
  onloginStatus(key, cb) {
    if (key && cb) this.loginMap.set(key, cb);
  }

  // 取消监听登录状态变化
  offLoginStatus(key) {
    key && this.loginMap.delete(key);
  }

  notifyLoginStatus() {
    [...this.loginMap.values()] && this.loginMap(true);
  }

  // 调用loginIfNeed时设置的临时回调函数
  addTmpLoginCb(fn) {
    this.tmpLoginCb = fn;
  }

  removeTmpLoginCb() {
    this.tmpLoginCb = '';
  }

  // 微信快捷登录
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => resolve(res),
        fail: err => reject(err)
      });
    });
  }

  // 检查wx-code是否过期
  checkCode() {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: res => resolve(Object.is(res.errMsg, 'checkSession:ok')),
        fail: err => resolve(false)
      });
    });
  }

  // 获取token
  async getToken(params) {
    try {
      const { errMsg, code: wxCode } = await this.wxLogin();
      const {
        detail: {
          encryptedData,
          iv
        }
      } = params;
      wx.showLoading({ title: "登录中" });
      if (Object.is(errMsg, 'login:ok')) {
        const loginParams = Object.assign({}, { code: wxCode }, { encryptedData, iv });
        const { code, message, data } = await apiRequset.login(loginParams);
        if (Object.is(code, 200)) {
          this.userInfo = data;
          this.saveTokenInfo();
        } else {
          this.showToast(message);
        }
        wx.hideLoading();
        return true;
      }
    } catch (err) {
      return false;
    }
  }

  saveTokenInfo() {
    wx.setStorage({
      key: 'token',
      data: this.userInfo.token
    });
  }

  showToast(title) {
    wx.showToast({
      title,
      icon: "none",
      duration: 2000
    });
  }
}