// @ts-nocheck
import Vue from 'vue'

import $http from './axios'
import './element'
// import './directive'
// import './errorHandle'
// import './filter'
// import './func'
// import './mixin'
// import './pwa'

Vue.$http = $http
Object.defineProperties(Vue.prototype, {
  $http: {
    get() {
      return $http
    },
  },
})
