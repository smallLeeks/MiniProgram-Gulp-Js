class formTime {
  formatTamp(date) {
    const d = new Date(date);
    return d.getTime(d);
  }
  formatTime(timestamp = '') {
    const date = new Date(parseInt(timestamp));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return (
      [year, month, day].map(this.formatNumber).join("-") + ' ' + [hours, minutes, seconds].map(this.formatNumber).join(":")
    );
  }
  formatNumber(n) {
    n = n.toString();
    return n[1] ? n : "0" + n;
  }
}

// 脱敏处理
class desensitization {
  init(str) {
    typeof str != "string" && str.toString();
    const map = new Map([
      [{ len: str.length < 4 }, () => { return str; }], // 大陆手机
      [{ len: str.length == 8 }, () => { return `${str.substring(0, 2)}****${str.substring(6)}`; }], // 港、澳手机
      [{ len: str.length == 11 }, () => { return `${str.substring(0, 3)}****${str.substring(7)}`; }], // 大陆手机
      [{ len: str.startsWith('+86-') || str.startsWith('+852-') || str.startsWith('+853-') || str.startsWith('+') && str.includes('-') }, () => { return `${str.substring(0, 7)}****${str.substring(11)}`; }], // 港、澳手机及非大陆、港、澳手机
      [{ len: str.startsWith('+86') || str.startsWith('+852') || str.startsWith('+853') || str.startsWith('+') && !str.includes('-') }, () => { return `${str.substring(0, 6)}****${str.substring(10)}`; }], // 港、澳手机及非大陆、港、澳手机
      [{ len: str && true }, () => { return `${str.substring(0, str.length - 4)}****`; }] // 固话处理
    ]);
    const action = [...map].filter(([key, value]) => Object.is(key.len, true));
    for (const [key, value] of action) return value.call(this);
  }
}

module.exports = {
  formTime,
  desensitization
};