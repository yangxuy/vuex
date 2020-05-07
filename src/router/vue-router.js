import Link from './link';
import View from './view';

let Vue;
export default class VueRouter {
  constructor(options = {}) {
    this.mode = options.mode || 'hash';
    this.history = {current: ''};
    this.routes = options.routes || [];
    this.matcher = this.createMatcher(this.routes);
    this.init();
  }

  createMatcher(routes) {
    return routes.reduce((prev, item) => {
      prev[item.path] = item.component;
      return prev;
    }, {});
  }

  init() {
    if (this.mode === 'hash') {
      if (!location.hash) {
        location.hash = '/';
      }
      window.addEventListener('load', () => {
        this.history.current = location.hash.slice(1);
      });

      window.addEventListener('hashchange', () => {
        this.history.current = location.hash.slice(1);
      });
    } else {
      if (!location.pathname) {
        location.pathname = '/';
      }
      window.addEventListener('load', () => {
        this.history.current = location.pathname;
      });

      window.addEventListener('popstate', () => {
        this.history.current = location.pathname;
      });
    }
  }

  go() {

  }

  replace() {

  }

  push() {

  }
}


VueRouter.install = (vue) => {
  Vue = vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.router) {
        this._root = this;
        this._router = this.$options.router;
        Vue.util.defineReactive(this, '_route', this._router.history);
      } else {
        this._root = this.$parent && this.$parent._root;
      }
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._root._router;
    }
  });
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._root._router.history.current;
    }
  });

  Vue.component('RouterLink', Link);
  Vue.component('RouterView', View);
};
