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

class Module {
  constructor(rawModule) {
    this.state = rawModule.state;
    this._children = Object.create(null);
    this._rawModule = rawModule;
  }

  get namespaced() {
    return !!this._rawModule.namespaced;
  }

  addChild(key, module) {
    this._children[key] = module;
  }

  getChild(key) {
    return this._children[key];
  }

  removeChild(key) {
    delete this._children[key];
  }

  hasChild(key) {
    return key in this._children;
  }

  forEachChild(fn) {
    forEachValue(this._children, fn);
  }

  forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  }

  forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  }

  forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  }
}

class ModuleCollection {
  constructor(options = {}) {
    this.register([], options);
  }

  get(path) {
    return path.reduce((module, key) => {
      return module.getChild(key);
    }, this.root);
  }

  register(path, rawModule) {
    const newModule = new Module(rawModule);
    if (path.length === 0) {
      //当前是根节点
      this.root = newModule;
    } else {
      const parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
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

    // this._modules = new ModuleCollection(options);
    // console.log(this._modules);
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
