import Vue from 'vue'
import { AxiosInstance } from 'axios'
import VueRouter, { Route } from 'vue-router'
import { Store } from 'vuex'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $route: Route
    $http: AxiosInstance
    $store: Store<any>
  }
}
