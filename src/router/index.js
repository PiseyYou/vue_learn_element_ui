import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '../components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
import Cate from '@/components/goods/Cate'
import Params from '@/components/goods/Params'
import Goods from '@/components/goods/Goods'
import Add from '../components/goods/Add'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/Welcome',
      children: [{
          path: '/Welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Cate
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: Goods
        }, {
          path: '/goods/add',
          component: Add
        }
      ]
    }
  ]
})

// const router = new VueRouter({
//   routes
// })

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径而来
  // next 是一个函数，表示放行
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
