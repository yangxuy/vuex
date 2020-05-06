import Vue from 'vue';
import Vuex from './vuex.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 1
  },
  getters: {
    getAge(state) {
      return state.count + 14;
    }
  },
  mutations: {
    addCount(state, payload) {
      state.count += payload;
    },
    delCount(state, payload) {
      state.count -= payload;
    },
    asyncCount(state, payload) {
      state.count += payload;
    }
  },
  actions: {
    handlerDispatchCount({commit}, payload) {
      setTimeout(() => {
        commit('asyncCount', 11);
      }, 1000);
    }
  }
});
