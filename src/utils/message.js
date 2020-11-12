// 全局弹窗和提示信息
import login from '../utils/login.js';
const _login = login.getInstance();

export default class message {
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
      this.instance = new this;
    }
    return this.instance;
  }

  constructor() {
    this.showingLoginPrompt = false; // 是否正在显示登录提醒
  }

  // 登录提示弹窗
  loginTips() {
    if (this.showingLoginPrompt) return;
    const pages = getCurrentPages();
    const route = pages[pages.length - 1].route; // 当前文件路径
    if (route && route.indexOf('/mine') != -1) return;
    this.showingLoginPrompt = true;
    wx.showModal({
      title: '提示',
      content: '登录已失效， 是否重新登录？',
      success: (res) => {
        if (res.confirm) {
          _login.loginIfNeed();
        }
        this.showingLoginPrompt = false;
      },
      fail: (res) => {
        this.showingLoginPrompt = false;
      }
    });
  }
}