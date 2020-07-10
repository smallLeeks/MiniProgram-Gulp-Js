export default class cache {
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
    this.map = new Map(); // 缓存的数据队列
    this.mapKey = new Map(); // key命中的次数
    this.capacity = 20; // 存储的最长队列
  }

  /**
   * 存储数据到内存中
   * @param {String} key 
   * @param {Object} value 
   * @param {Number} duration 
   */
  setCache(key, value, duration = -1) {
    if (key) {
      let data = {
        requestTime: parseInt(new Date().getTime() / 1000),
        data: value,
        duration
      };
      this.sort(key, data);
    }
  }

  /**
   * 存储数据到内存和本地
   * @param {String} key 
   * @param {Object} value 
   * @param {Number} duration 
   */
  setStorage(key, value, duration = -1) {
    if (key) {
      let data = {
        requestTime: parseInt(new Date().getTime() / 1000),
        data: value,
        duration
      };
      wx.setStorage({
        key,
        data
      });
      this.sort(key, data);
    }
  }

  /**
   * 获取缓存数据
   * @param {String} key 
   */
  get(key) {
    if (this.map.has(key)) {
      let num = this.mapKey.get(key);
      let value = this.map.get(key);
      this.map.delete(key);
      this.mapKey.set(key, num + 1);
      this.map.set(key, value);
      return value;
    } else {
      return '';
    }
  }

  /**
   * 删除最少使用的数据
   * @param {Sting}} key 
   * @param {Object} data 
   */
  sort(key, data) {
    if (Object.is(this.capacity, 0)) return '';
    let min = Math.min(...this.mapKey.values());
    if (this.map.has(key)) {
      this.map.set(key, data);
      let num = this.mapKey.get(key);
      this.mapKey.set(key, num + 1);
    } else {
      this.map.set(key, data);
      this.mapKey.set(key, 1);
    }
    if (this.map.size > this.capacity) {
      let keys = this.map.keys();
      let deleteKey = keys.next().value;
      while (!Object.is(this.mapKey.get(deleteKey), min)) {
        deleteKey = keys.next().value;
      }
      this.map.delete(deleteKey);
      this.mapKey.delete(deleteKey);
    }
  }
  
  // 清除缓存数据
  clear() {
    this.map = new Map();
    this.mapKey = new Map();
  }

  /**
   * 获取设定区间内的数据
   * @param {Sting} key 
   * @param {Object} duration 
   */
  getDurationData(key, duration = -1) {
    let data = this.get(key);
    if (data && (duration < 0 || (data.requestTime && parseInt(new Date().getTime() / 1000) - data.requestTime <= duration))) return data;
    return '';
  }
}