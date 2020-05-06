import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;
import router from './router/index';
import store from './store/index';


new Vue({
  store,
  router,
  render: (h) => h(App),
  created() {
    console.log('根节点');
  }
}).$mount('#app');
