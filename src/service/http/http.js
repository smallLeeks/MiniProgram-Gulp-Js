import regeneratorRuntime from '../../vendor/runtime.js';
import cache from '../../utils/cache.js';
import message from '../../utils/message.js';
const _cache = cache.getInstance();
const _message = message.getInstance();

export default class http {
  constructor(serverType = '') {
    this.serverType = serverType; // 不同的服务器后台
    this.BAND_RESPONSE_TEXT = "服务器异常，请稍后再试！";
    this.NETWORK_ERR_TEXT = "网络异常，请稍后再试！";
    this.CODE_SUCCESS = 200;
  }

  // 访问cache数据
  getCacheData(key, duration) {
    const cacheData = _cache.getDurationData(key, duration);
    if (cacheData) {
      return cacheData.data;
    }
  }

  // GET无token
  GET(params = {}) {
    params['header'] = this.getHeader();
    params['method'] = 'GET';
    return this.request(params);
  }

  // POST无token
  POST(params = {}) {
    params['header'] = this.getHeader();
    params['method'] = 'POST';
    return this.request(params);
  }

  // GET带token
  async GETWITHTOKEN(params = {}) {
    params['header'] = await this.getHeaderWidthToken();
    params['method'] = 'GET';
    return this.request(params);
  }

  // POST带token
  async POSTWITHTOKEN(params = {}) {
    params['header'] = await this.getHeaderWidthToken();
    params['method'] = 'POST';
    return this.request(params);
  }

  // 获取header信息
  getHeader() {
    const header = {
      'Contnet-Type': 'application/json'
    };
    return header;
  }

  // 获取带token的header信息
  async getHeaderWidthToken() {
    const header = Object.assign({}, this.getHeader(), {
      'token': wx.getStorageSync('token')
    });
    return header;
  }

  // request
  async request(params = {}) {
    try {
      if (await this.checkNetwork()) {
        return new Promise((resolve, reject) => {
          const requestOptions = {
            success: res => {
              resolve(this.beforeResponse(res));
            },
            fail: err => {
              this.toast(this.NETWORK_ERR_TEXT);
              reject(err);
            }
          };
          wx.request(Object.assign({}, requestOptions, params));
        });
      }
    } catch (err) {
      this.toast(err);
    }
  }

  // 接口返回数据之前的处理
  beforeResponse(res) {
    const { data } = res;
    if (!data) {
      this.toast(this.BAND_RESPONSE_TEXT);
      return Promise.reject(res);
    }
    const map = new Map([
      [401, () => { this.toast("无访问权限"); return Promise.reject(data); }],
      [404, () => { this.toast(this.BAND_RESPONSE_TEXT); return Promise.reject(data); }],
      [605, () => { _message.loginTips(); }]
    ]);
    map.get(Number(data.code));
    return Promise.resolve(data);
  }


  // 请求之前检查网络状态
  async checkNetwork() {
    try {
      const { networkType } = await wx.getNetworkType();
      if (Object.is(networkType, 'none') || Object.is(networkType, '2g') || Object.is(networkType, '3g')) {
        this.toast(this.NETWORK_ERR_TEXT);
        return false;
      }
      return true;
    } catch (error) {
      this.toast(this.NETWORK_ERR_TEXT);
      return false;
    }
  }

  // toast提示
  toast(title) {
    wx.showToast({
      title,
      icon: 'none',
      duration: 1500
    });
  }
}