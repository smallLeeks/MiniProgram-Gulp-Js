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
    if (false === instance instanceof this) {
      this.instance = new this();
    }
    return this.instance;
  }

  constructor(capacity) {
    this.map = new Map();
    this.mapKey = new Map();
    this.capacity = capacity;
  }

  setCache(key, value, duration = -1) {
    if (key) {
      let data = {
        requestTime: parseInt(new Date().getTime / 1000),
        data: value,
        duration
      };
      this.sort(key, data);
    }
  }

  setStorage(key, value, duration = -1) {
    if (key) {
      let data = {
        requestTime: parseInt(new Date().getTime / 1000),
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

  get() {

  }

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
  
  clear() {
    
  }
}