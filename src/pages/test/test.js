import regeneratorRuntime from '../../vendor/runtime.js';
import request from '../../service/http/request.js';
import preload from '../../utils/preload.js';
const _request = request.getInstance();

class test extends preload {
  constructor(...args) {
    super(...args);
    super.$init({
      obj: {}
    });
  }

  // 接收参数
  $onNavigator(query) {
    this.$put('indexData', this.initData.bind(this), query);
  }

  initData = function (query, resolve, reject) {
    setTimeout(() => {
      this.data = query.result;
      this.$setData(this.data);
      this.$resolve(this.data);
      console.log(JSON.parse(this.data));
    });
  }

  onLoad(options) {
    super.onLoad(options);
    let data = this.$take('indexData');
    if (data) {
      data.then(res => {
        this.$setData(data);
      });
      return;
    }
    this.initData(options);
  }
}

Page(new test({ clazzName: 'test' }));