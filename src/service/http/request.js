import regeneratorRuntime from '../../vendor/runtime.js';
import http from './http.js';
import cache from '../../utils/cache.js';
const SERVICE = require("../../env.js");
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
    this.http = new http({ serverType: 1 });
  }

  // eg：需要缓存数据
  async getJson() {
    try {
      const duration = 60 * 60;
      const cacheData = this.http.getCacheData('test', duration);
      if (cacheData) return cacheData;
      const params = {
        url: `${SERVICE.BASE_URL}getJoke?page=1&count=2&type=video`
      };
      const data = await this.http.GET(params);
      _cache.setCache('test', data, duration);
      return data;
    } catch (err) {
      Promise.reject(err);
    }
  }
}