import 'lib-flexible';
import lang from './lang/zh-cn';
import config from './config';
import Vue from 'vue';
import App from './App';
import router from './router';
import * as filters from './filters';
import * as directives from './directives/index.js';


import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI);
window.i18n = lang;
window.CT = config;

// register global utility filters.
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

// register global utility directives.
Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key]);
});

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});

