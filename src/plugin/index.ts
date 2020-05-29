// @ts-nocheck
import Vue from 'vue'

import $http from './axios'
import $curl from './curl'
import './element'
// import './directive'
// import './errorHandle'
import './filter'
// import './func'
// import './mixin'
// import './pwa'

Vue.$http = $http
Vue.$curl = $curl
Object.defineProperties(Vue.prototype, {
  $http: {
    get() {
      return $http
    }
  },
  $curl: {
    get() {
      return $curl
    }
  }
})
