import regeneratorRuntime from '../vendor/runtime.js';
import request from '../service/http/request.js';
import message from './message.js';
const apiRequset = request.getInstance();
const _message = message.getInstance();

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

  // 检查登录状态
  checkToken() {
    if (this.userInfo.token) return true;
    _message.loginTips();
    return false;
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
  async wxLogin() {
    try {
      return await wx.login();
    } catch (error) {
      this.showToast(error);
    }
  }

  // 检查wx-code是否过期
  async checkCode() {
    try {
      const { errMsg } = await wx.checkSession();
      return Object.is(errMsg, 'checkSession:ok');
    } catch (error) {
      return false;
    }
  }

  // 获取token
  async getToken(params) {
    try {
      const { code: wxCode } = await this.wxLogin();
      const { detail: { encryptedData, iv } } = params;
      wx.showLoading({ title: "登录中" });
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
    } catch (error) {
      return false;
    }
  }

  // 获取用户信息
  async getUserInfo() {
    try {
      const { code, message, data } = await apiRequset.getUserInfo();
      if (Object.is(code, 200)) return Object.assign({}, this.userInfo, data);
      this.showToast(message);
    } catch (error) {
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