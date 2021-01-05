import request from '../../service/http/request.js';
const apiRequset = request.getInstance();

Component({
  methods: {
    bindUpload() {
      this.qiNiuToken(response => {
        if (response.data.token) {
          wx.chooseImage({
            count: 1,
            sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
            success: res => this.upload({
              token: response.data.token,
              filePath: res.tempFilePaths[0]
            })
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
        success: res => this.triggerEvent('upload', res),
        fail: err => this.triggerEvent('upload', err)
      });
    }
  }
});
