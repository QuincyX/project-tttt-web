import { AxiosInstance } from 'axios'
import VueRouter, { Route } from 'vue-router'
import { Store } from 'vuex'

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $route: Route
    $curl: AxiosInstance
    $http: AxiosInstance
    $store: Store<any>
  }
}

declare global {
  interface PageQuery {
    page: number
    size: number
    total: number
  }
}

