import regeneratorRuntime from '../../vendor/runtime.js';
export default class http {
  constructor(params) {
    this.serverType = params.serverType || ''; // 不同的服务器后台
    this.BAND_RESPONSE_TEXT = "服务器异常，请稍后再试！";
    this.NETWORK_ERR_TEXT = "网络异常，请稍后再试！";
    this.CODE_SUCCESS = 200;
  }

  // GET无token
  GET(params = {}) {
    params['methos'] = 'GET';
    return this.request(params);
  }

  // POST无token
  POST(params = {}) {
    params['methos'] = 'POST';
    return this.request(params);
  }

  // GET带token
  GETWITHTOKEN(params = {}) {
    params['methos'] = 'GET';
    return this.request(params);
  }

  // POST带token
  POSTWITHTOKEN(params = {}) {
    params['methos'] = 'POST';
    return this.request(params);
  }

  // 获取header信息
  getHeader() {
    let header = {
      'Contnet-Type': 'application/json',
      cookie: ''
    };

    switch(this.serverType) {
      case '1':
        {

        }
        break;
      case '2':
        {

        }
        break;
    }
    return header;
  }

  // 获取带token的header信息
  getHeaderWidthToken() {
    let header = this.getHeader();
    switch(this.serverType) {
      case '1':
        {

        }
        break;
      case '2':
        {
          
        }
        break;
    }
    return header;
  }

  // request
  async request(params = {}) {
    try {
      await this.checkNetwork();
      return new Promise((resolve, reject) => {
        wx.request(this.buildData(params, resolve, reject));
      });
    } catch (err) {
      this.toast(err);
    } 
  }

  // 数据请求参数
  buildData(params = {}, resolve = Promise.resolve(), reject = Promise.reject()) {
    let requestOptions = {
      header: this.getHeader(),
      success: res => {
        resolve(this.beforeResponse(res));
      },
      fail: err => {
        this.toast(this.NETWORK_ERR_TEXT);
        reject(err);
      }
    };
    Object.assign({}, requestOptions, params);
    return requestOptions;
  }

  // 接口返回数据之前的处理
  beforeResponse(res) {
    let {
      data
    } = res;
    if (!data) {
      this.toast(this.BAND_RESPONSE_TEXT);
      return Promise.reject(res);
    }
    let map = new Map([
      [401, () => { this.toast("无访问权限"); return Promise.reject(data); }],
      [404, () => { this.toast(this.BAND_RESPONSE_TEXT); return Promise.reject(data); }]
    ]);
    map.get(Number(data.code));
    return Promise.resolve(data);
  }


  // 请求之前检查网络状态
  checkNetwork() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success: res => {
          let { 
            networkType
          } = res;
          if (Object.is(networkType, 'none') || Object.is(networkType, '2g') || Object.is(networkType, '3g')) {
            this.toast(this.NETWORK_ERR_TEXT);
            resolve(res);
          } else {
            resolve(res);
          }
        },
        fail: err => { 
          reject(err);
        },
      });
    });
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