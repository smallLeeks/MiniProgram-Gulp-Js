import regeneratorRuntime from '../vendor/runtime.js';
import request from '../service/http/request.js';
const apiRequest = request.getInstance();

class location {
  getCoordinate() {
    return new Promise((resolve, reject) => {
      this.getSetting(async res => {
        const { latitude, longitude } = res;
        const params = {
          coordinate_x: latitude,
          coordinate_y: longitude
        };
        try {
          const { code, message, data } = await apiRequest.location(params);
          if (Object.is(code, 200)) {
            resolve(data);
          } else {
            this.toast(message);
            resolve(false);
          }
        } catch (err) {
          this.toast(err);
          reject(err);
        }
      });
    });
  }

  async getSetting(cb) {
    const { authSetting } = await wx.getSetting();
    const userLocation = authSetting["scope.userLocation"];
    if (userLocation == false) {
      this.isOpenLocation(res => cb && cb(res));
    } else if (userLocation == undefined || userLocation) {
      this.getLocation(res => cb && cb(res));
    }
  }

  async openSetting(cb) {
    try {
      const { authSetting } = await wx.openSetting();
      if (authSetting["scope.userLocation"]) {
        this.getLocation((res) => {
          cb && cb(res);
        });
      } else {
        this.toast("未打开定位权限");
      }
    } catch (error) {
      this.toast("授权失败，请手动打开定位权限");
    }
  }

  isOpenLocation(cb) {
    wx.showModal({
      title: "提示",
      content: "是否授权使用地理位置",
      success: res => res.confirm && this.openSetting(cb),
      fail: () => this.toast("打开定位失败"),
    });
  }

  getLocation(cb) {
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: res => cb && cb(res),
      fail: () => this.toast("获取定位失败")
    });
  }

  toast(title) {
    wx.showToast({
      title,
      icon: 'none',
      duration: 1500
    });
  }
}

export default new location();