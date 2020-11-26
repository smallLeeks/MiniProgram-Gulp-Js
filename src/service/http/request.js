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
    this.http = new http();
  }

  // eg：需要缓存数据
  async getJson() {
    try {
      const cacheData = this.http.getCacheData('test', 60 * 60);
      if (cacheData) return cacheData;
      const data = await this.http.GET({
        url: `${SERVICE.BASE_URL}getJoke?page=1&count=2&type=video`
      });
      _cache.setCache('test', data, 60 * 60);
      return data;
    } catch (error) {
      Promise.reject(error);
    }
  }

  // 微信授权手机号登录
  async login(data = {}) {
    try {
      return await this.http.POST({
        url: `${SERVICE.BASE_URL}/api/user/login`,
        data
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  // 获取用户信息
  async getUserInfo(data = {}) {
    try {
      return await this.http.POSTWITHTOKEN({
        url: `${SERVICE.BASE_URL}/api/user/get_userinfo`,
        data
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  // 更新个人资料
  async updateUserInfo(data = {}) {
    try {
      return await this.http.POSTWITHTOKEN({
        url: `${SERVICE.BASE_URL}/api/user/update_user_info`,
        data
      });
    } catch (error) {
      Promise.reject(error);
    }
  }

  // 微信定位
  async location(data = {}) {
    try {
      return await this.http.POSTWITHTOKEN({
        url: `${SERVICE.BASE_URL}/api/home/index`,
        data
      });
    } catch (error) {
      Promise.reject(error);
    }
  }
}