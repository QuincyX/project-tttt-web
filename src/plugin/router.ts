import Vue from 'vue'
import Router, { RawLocation, Route } from 'vue-router'
import routes from 'vue-auto-routing'
import { createRouterLayout } from 'vue-router-layout'
import store from '@/plugin/store'
import { log } from '@/util/index'

Vue.use(Router)

const RouterLayout = createRouterLayout((layout) => {
  return import('@/layout/' + layout + '.vue')
})

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/',
      component: RouterLayout,
      children: routes,
    },
    {
      path: '*',
      redirect: '/redirect/404',
    },
  ],
})

export default router
