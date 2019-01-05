import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import Config from './views/Config';
import Test from './Test.vue';
import Onboarding from './views/Onboarding';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'config',
      component: Config,
    },
    {
      path: '/onboard',
      name: 'onboarding',
      component: Onboarding,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
    },
  ]
})
