import regeneratorRuntime from '../../vendor/runtime.js';
import http from './http.js';
import cache from '../../utils/cache.js';
const _cache = cache.getInstance();

export default class request {
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
    this.http = new http({serverType: 1});
  }

  async getJson() {
    try {
      let duration = 60 * 60;
      let cacheData = this.http.getCacheData('test', duration);
      if (cacheData) {
        return cacheData;
      }
      let params = {
        url: 'https://api.apiopen.top/getJoke?page=1&count=2&type=video'
      };
      let data = await this.http.GET(params);
      _cache.setCache('test', data, duration);
      return data;
    } catch (err) {
      Promise.reject(err);
    }
  }
}