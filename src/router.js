import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
// import Config from './views/Config';
// import Test from './Test.vue';
// import Onboarding from './views/Onboarding';
import Welcome from './views/Welcome';
import PathChoice from './views/PathChoice';
import SmtpConfig from './views/SmtpConfig';
import LdapConfig from './views/LdapConfig';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome,
    },
    {
      path: '/email',
      name: 'email',
      component: PathChoice
    },
    {
      path: '/email/sendmail',
      redirect: '/auth',  
    },
    {
      path: '/email/smtp',
      name:'smtp',
      component: SmtpConfig
    },
    {
      path: '/auth',
      name: 'auth',
      component: PathChoice
    },
    {
      path: '/auth/password',
      redirect: '/summary'
    },
    {
      path: '/auth/oauth',
      redirect: '/auth/ldap'
    },
    {
      path: '/auth/ldap',
      name: 'ldap',
      component: LdapConfig
    }
    // {
    //   path: '/v0',
    //   name: 'v0config',
    //   component: Config,
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
