let Vue;
const install = (vue) => {
  Vue = vue;
  Vue.mixin({
    beforeCreate() {
      const options = this.$options;
      if (options.store) {
        // 根节点
        this.$store = options.store;
      } else {
        // 子节点
        this.$store = options.parent && options.parent.$store;
      }
    }
  });
};

class Store {
  constructor(options = {}) {
    this.vm = new Vue({
      data() {
        return {
          state: options.state
        };
      }
    });

    let getters = options.getters || {};

    this.getters = {};
    Object.keys(getters).forEach((key) => {
      Object.defineProperty(this.getters, key, {
        get: () => {
          return getters[key](this.state);
        }
      });
    });

    let mutations = options.mutations || {};
    this.mutations = {};
    Object.keys(mutations).forEach((key) => {
      this.mutations[key] = (payload) => {
        mutations[key](this.state, payload);
      };
    });

    let actions = options.actions || {};
    this.actions = {};
    Object.keys(actions).forEach((key) => {
      this.actions[key] = (payload) => {
        actions[key](this, payload);
      };
    });
  }

  commit = (methodsName, payload) => {
    this.mutations[methodsName](payload);
  };

  dispatch(actionName, payload) {
    this.actions[actionName](payload);
  };

  get state() {
    return this.vm.state;
  }

}

export default {
  install,
  Store
};
