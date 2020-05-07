import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;
import router from './router/index';
import store from './store/index';


new Vue({
  name: 'app',
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
