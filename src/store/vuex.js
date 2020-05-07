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

const forEachValue = (obj, fn) => {
  Object.keys(obj).forEach(key => fn(obj[key], key));
};

class VuexModule {
  constructor(rawModule) {
    this.state = rawModule.state;
    this._children = Object.create(null);
    this._rawModule = rawModule;
  }
}

class ModuleCollection {
  constructor(options = {}) {
    this.register([], options);
  }

  register(path, rawModule) {
    const newModule = new VuexModule(rawModule);
    if (path.length === 0) {
      //当前是根节点
      this.root = newModule;
    } else {
      const parent = path.slice(0, -1).reduce((module, current) => {
        return this.root._children[current];
      }, this.root);
      parent._children[path[path.length - 1]] = newModule;
    }
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule);
      });
    }
  }
}

class Store {
  constructor(options = {}) {
    this.vm = new Vue({
      data() {
        return {
          state: options.state
        };
      }
    });
    this._modules = new ModuleCollection(options);
    const state = this._modules.root.state;

    this.getters = {};
    this.mutations = {};
    this.actions = {};
    this.modules = {};
    installModule(this, state, [], this._modules.root);
  }

  commit = (methodsName, payload) => {
    this.mutations[methodsName].forEach(fn => fn(payload));
  };

  dispatch = (actionName, payload) => {
    this.actions[actionName].forEach(fn => fn(payload));
  };

  get state() {
    return this.vm.state;
  }

}

const installModule = (store, rootState, path, module) => {
  const isRoot = !path.length;
  if (!isRoot) {
    const parent = path.slice(0, -1).reduce((state, current) => {
      return state[current];
    }, rootState);
    const moduleName = path[path.length - 1];
    Vue.set(parent, moduleName, module.state);
  }

  let getters = module._rawModule.getters || {};
  if (getters) {
    Object.keys(getters).forEach((key) => {
      Object.defineProperty(store.getters, key, {
        get: () => {
          return getters[key](module.state);
        }
      });
    });
  }

  let mutations = module._rawModule.mutations || {};
  if (mutations) {
    forEachValue(mutations, (mutation, key) => {
      let arr = store.mutations[key] || (store.mutations[key] = []);
      arr.push((payload) => {
        mutation(module.state, payload);
      });
    });
  }

  let actions = module._rawModule.actions || {};
  if (actions) {
    forEachValue(actions, (action, key) => {
      let arr = store.actions[key] || (store.actions[key] = []);
      arr.push((payload) => {
        action(store, payload);
      });
    });
  }

  forEachValue(module._children, (child, key) => {
    installModule(store, rootState, path.concat(key), child);
  });
};

const getNestedState = (state, path) => {
  return path.reduce((state, key) => state[key], state);
};
export default {
  install,
  Store
};
