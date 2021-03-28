// import Vue from 'vue'
import Router from 'vue-router'

const Error = resolve => require(['@/views/error'], resolve);
const Index = resolve => require(['@/views/index'], resolve);
const Course = resolve => require(['@/views/course'], resolve);
const Chapter = resolve => require(['@/views/chapter'], resolve);

// Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'error',
      component: Error
    },
    {
      path: '/',
      name: 'index',
      component: Index
    },
    // {
    //   path: '/',
    //   name: '',
    //   redirect: '/index'
    // },
    // {
    //   path: '/index',
    //   name: 'index',
    //   component: Index,
    // },
    {
      path: '/course/:cid',
      name: 'course',
      component: Course,
    },
    {
      path: '/course/:cid/chapter/:id',
      name: 'chapter',
      component: Chapter,
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

export default router
