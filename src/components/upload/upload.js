import request from '../../service/http/request.js';
const apiRequset = request.getInstance();

Component({
  properties: {
    count: {
      type: Number,
      value: 9
    },
    width: {
      type: Number,
      value: 160
    },
    height: {
      type: Number,
      value: 160
    },
  },
  data: {
    url: 'http://shishangmallqiniu.meimei.life/',
    status: 0, // 0: 待伤处  1：上传中  2：已上传
    src: ''
  },
  methods: {
    bindUpload() {
      this.qiNiuToken(response => {
        if (response.data.token) {
          wx.chooseImage({
            count: this.data.count,
            sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
            success: res => this.setData({
              status: 1
            }, this.upload({
              token: response.data.token,
              filePath: res.tempFilePaths[0]
            }))
          });
        }
      });
    },
    qiNiuToken(cb) {
      apiRequset.qiNiuToken().then(res => {
        if (res && res.data) {
          cb && cb(res);
        }
      }).catch(error => { console.error(error); });
    },
    upload(params = {}) {
      if (!params.filePath) {
        console.error('请选择图片路径');
        return;
      }
      wx.uploadFile({
        url: `https://up-z2.qiniup.com`,
        filePath: params.filePath,
        name: 'file',
        formData: {
          token: params.token,
          key: params.filePath.split('//')[1]
        },
        success: res => this.setData({
          status: 2,
          src: JSON.parse(res.data).key
        }),
        fail: err => console.log(err)
      });
    },
    bindDelete(e) {
      const { src } = e.currentTarget.dataset;
    }
  }
});
