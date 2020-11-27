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

module.exports = {
  formTime
};