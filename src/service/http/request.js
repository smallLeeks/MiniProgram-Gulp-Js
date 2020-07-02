export default class request {

  /**
   * instance 当前实例
   * @type { this }
   */
  static instance;

  /**
   * getInstance 获取单例
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

  }

}