/**
 * 策略模式：自定义表单验证
 * @param {Object} rules 字段规则
 * @param {Object} messages 字段提示信息
 */
class validate {
  constructor(rules = {}, messages = {}) {
    Object.assign(this, {
      data: {},
      rules,
      messages
    });
    this.init();
  }

  /**
   * 外观模式：提供上层统一调用接口
   * @method init
   */
  init() {
    this.initData();
    this.initMessages();
    this.initMethods();
  }

  /** 初始化数据 */
  initData() {
    this.from = {};
    this.errorList = [];
  }

  /** 默认提示信息 */
  initMessages() {
    this.defaults = {
      required: '这是必填字段',
      email: '请输入有效的电子邮件地址',
      telephone: '请输入11位有效的手机号码'
    };
  }

  /** 
   * 默认验证方法
   * @return
   */
  initMethods() {
    this.methods = {
      // 验证必填字段
      required(value, param) {
        if (!this.depend(param)) {
          return 'dependency-mismatch';
        } else if (typeof value === "number") {
          value = value.toString();
        } else if (typeof value === "boolean") {
          return !0;
        }
        return value.length > 0;
      },
      // 验证电子邮箱
      email(value) {
        return (
          this.optional(value) ||
          /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            value
          )
        );
      },
      // 验证手机号码
      telephone(value) {
        return this.optional(value) || /^1[34578]\d{9}$/.test(value);
      }
    };
  }

  /**
   * 自定义验证方法
   * @param {String} name 
   * @param {Function} method 
   * @param {String} message 
   */
  addMethod(name, method, message) {
    this.methods[name] = method;
    this.defaults.messages[name] = message !== undefined ? message : this.defaults.messages[name];
  }

  /**
   * 判断验证方法是否存在
   * @param {String} value 
   * @return {Boolean}
   */
  isValidMethod(value) {
    const methods = [];
    for (const method in this.methods) {
      if (method && typeof this.methods[method] === "function") {
        methods.push(method);
      }
    }
    return methods.indexOf(value) !== -1;
  }

  /**
   * 格式话提示信息模板
   * @return {String} 
   */
  formatTemplate(source, params) {
    if (arguments.length === 1) {
      return () => {
        const args = Array.from(arguments);
        args.unshift(source);
        return this.formatTemplate.apply(this, args);
      };
    }
    if (params === undefined) {
      return source;
    }
    if (arguments.length > 2 && params.constructor !== Array) {
      params = Array.from(arguments).slice(1);
    }
    if (params.constructor !== Array) {
      params = [params];
    }
    params.forEach((x, y) => {
      source = source.replace(new RegExp("\\{" + y + "\\}", "g"), () => {
        return x;
      });
    });
    return source;
  }

  /** 
   * 判断规则依赖是否存在
   * @return {String}
   */
  depend(param) {
    const map = new Map([
      ['boolean', () => { return param; }],
      ['string', () => { return !!param.length; }],
      ['function', () => { return param(); }],
      ['default', () => { return !0; }]
    ]);
    const action = map.get(param) || map.get('default');
    return action.call();
  }

  /**
   * 判断输入值为空
   * @return {String}
   */
  optional(value) {
    return !this.methods.required(value) && "dependency-mismatch";
  }

  /**
   * 设置字段的默认验证值
   * @param {String} param 字段名
   */
  setView(param) {
    this.form[param] = {
      $name: param,
      $valid: true,
      $invalid: false,
      $error: {},
      $success: {},
      $viewValue: ``
    };
  }

  /**
   * 设置字段的验证值
   * @param {String} param 字段名
   * @param {String} method 字段的方法
   * @param {Boolean} result 是否通过验证
   * @param {String} value 字段的值
   */
  setValue(param, method, result, value) {
    const params = this.form[param];
    params.$valid = result;
    params.$invalid = !result;
    params.$error[method] = !result;
    params.$success[method] = result;
    params.$viewValue = value;
  }

  /**
   * 验证所有字段规则，返回验证是否通过
   * @param {Object} data 
   */
  checkForm(data) {
    this.initData();
    for (const param in this.rules) {
      this.setView(param);
      this.checkParam(param, this.rules[param], data);
    }
    return this.valid();
  }

  /** 返回验证是否通过 */
  valid() {
    return this.errorSize() === 0;
  }

  /** 返回错误信息个数 */
  errorSize() {
    return this.errorList.length;
  }

  /** 返回所有错误信息 */
  validationErrors() {
    return this.errorList;
  }
}