// @ts-nocheck
import Vue from 'vue'

import $http from './axios'
// import './directive'
// import './errorHandle'
// import './filter'
// import './func'
// import './mixin'
// import './pwa'
// import './ui'

Vue.$http = $http
Object.defineProperties(Vue.prototype, {
  $http: {
    get() {
      return $http
    },
  },
})
