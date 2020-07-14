export default class navigator {
  static init(target) {
    target.name = target.constructor.name;
  }

  static pages = new Map();

  static setPage(path, value) {
    this.pages.set(path, value);
  }

  static getPage(path) {
    return this.pages.get(path);
  }

  static clearPage(path) {
    this.pages.delete(path);
  }
}