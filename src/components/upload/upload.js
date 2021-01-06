import request from '../../service/http/request.js';
import env from '../../env.js';
const apiRequset = request.getInstance();

Component({
  properties: {
    count: {
      type: Number,
      value: 9
    }, // 每次上传图片时可选个数
    width: {
      type: Number,
      value: 160
    }, // 容器宽
    height: {
      type: Number,
      value: 160
    }, // 容器高
    num: {
      type: Number,
      value: 1
    }, // 上传图片的数量
  },
  data: {
    url: env.imgUrl, // 图片域名
    status: 0, // 0: 待伤处  1：上传中  2：已上传
    imgArr: [], // 存储上传的图片
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
      const { imgArr, num } = this.data;
      if (!params.filePath) {
        console.error('请选择图片路径');
        return;
      }
      wx.uploadFile({
        url: env.uploadFile, // 上传地址
        filePath: params.filePath,
        name: 'file',
        formData: {
          token: params.token,
          key: params.filePath.split('//')[1]
        },
        success: res => {
          const dataObject = JSON.parse(res.data);
          imgArr.push(dataObject.key);
          this.triggerEvent('upload', imgArr);
          this.setData({
            status: imgArr.length < num ? 0 : 2,
            imgArr
          });
        },
        fail: err => console.log(err)
      });
    },
    bindDelete(e) {
      const { imgArr } = this.data;
      const { index } = e.currentTarget.dataset;
      imgArr.splice(index, 1);
      this.triggerEvent('upload', imgArr);
      this.setData({
        status: 0,
        imgArr
      });
    }
  }
});
