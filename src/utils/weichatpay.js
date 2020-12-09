import regeneratorRuntime, { async } from '../vendor/runtime.js';
import env from '../env.js';
import request from '../service/http/request.js';
const apiRequest = request.getInstance();

export default class weChatPay {
  constructor() {
    this.params = {};
  }

  pay(params) {
    return new Promise((resolve, reject) => {
      this.getSubscribeMessage(res => {
        this.params = params;
        resolve(res);
      });
    });
  }

  // 获取订阅模板消息
  getSubscribeMessage(cb) {
    wx.requestSubscribeMessage({
      tmplIds: [env.TMPLID],
      success: () => {
        this.payment(res => cb && cb(res));
      },
      fail: () => {
        this.payment(res => cb && cb(res));
      }
    });
  }

  // 获取微信code
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        }
      });
    });
  }

  // 获取支付信息
  async getcreateOrder() {
    try {
      const { code } = await this.wxLogin();
      return new Promise((resolve, reject) => {
        apiRequest.wechatPay(Object.assign({}, code, this.params)).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    } catch (error) {
      this.toast(error);
    }
  }

  // 微信支付API
  async payment(cb) {
    try {
      const { code, message, data: { wxPayMpOrderResult } } = await this.getcreateOrder();
      if (Object.is(code, 200)) {
        wxPayMpOrderResult.packageValue = wxPayMpOrderResult.package;
        delete wxPayMpOrderResult.package;
        wx.requestPayment({
          ...wxPayMpOrderResult,
          success: res => cb && cb(res),
          fail: err => this.toast(err)
        });
      } else {
        this.toast(message);
      }
    } catch (error) {
      this.toast(error);
    }
  }

  toast(title) {
    wx.showToast({
      title,
      icon: "none",
      duration: 2000
    });
  }
}