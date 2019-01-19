import Vue from 'vue'
import Router from 'vue-router'
import pos from './views/pos'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'pos',
      component: pos
    }
  ]
})
