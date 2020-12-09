export default class model {
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
    this.subscribeMap = new Map();
  }

  /**
   * 发布订阅者
   * @method onStatus
   * @method offStatus
   * @method notifyStatus
   */
  onStatus(key, callback) {
    this.subscribeMap.set(key, callback);
  }

  offStatus(key) {
    key && this.subscribeMap.delete(key);
  }

  notifyStatus() {
    if ([...this.subscribeMap.values()].length) {
      for (const [key, value] of this.subscribeMap) {
        value && value(true);
        this.offStatus(key);
      }
    }
  }
}