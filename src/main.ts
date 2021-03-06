// @ts-nocheck

import Vue from 'vue'
import App from './App.vue'
import router from './plugin/router'
import store from './plugin/store'
import './plugin/index'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
