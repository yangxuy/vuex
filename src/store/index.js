import Vue from 'vue';
import Vuex from './vuex';

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
  },
  modules: {
    a: {
      state: {
        name: 'yx'
      },
      modules: {
        c: {
          state: {
            sex: '男'
          }
        }
      }
    },
    b: {
      state: {
        age: 24
      }
    }
  }
});
/**
 * Module{
 *   state:{
 *     count:1,
 *     a:Model{
 *       state:{
 *         name:'yx'
 *       }
 *     }
 *   },
 *   _children:[
 *     Model{a}
 *   ],
 *   _rawModule:{
 *     getters,
 *     mutations,
 *     modules,
 *     actions,
 *     state,
 *   }
 * }
 * */
