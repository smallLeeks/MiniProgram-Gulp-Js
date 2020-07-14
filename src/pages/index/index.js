//index.js
import regeneratorRuntime from '../../vendor/runtime.js';
import request from '../../service/http/request.js';
import preload from '../../utils/preload.js';
const _request = request.getInstance();

class index extends preload {
  constructor(...args) {
    super(...args);
  }

  test = async function () {
    this.$route({
      path: '/pages/test/test',
      query: await _request.getJson(),
      clazzName: 'test'
    });
  }
}

Page(new index());
