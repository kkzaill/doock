// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
// import Vue from 'vue'
import App from './App'
import router from './router'
// import ElementUI from 'element-ui';
import FastClick from 'fastclick'
import store from './store/index'
import MetaInfo from 'vue-meta-info'
// import md5 from 'js-md5'
// import 'element-ui/lib/theme-chalk/index.css';
import './main.scss'
import './fonts/font.scss'
// import './util/rem'

// Vue.prototype.$md5 = md5;
Vue.use(MetaInfo)
// Vue.use(ElementUI);
FastClick.attach(document.body)
Vue.config.productionTip = false

// Vue.use(router);
// router.afterEach((to,from,next) => {
//   window.scrollTo(0,0);
// });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted () {
    document.dispatchEvent(new Event('render-event'))
  }
})
