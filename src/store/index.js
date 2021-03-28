import Vue from 'vue'
import Vuex from 'vuex'

import loginpop from './loginpop.js'
import islogin from './islogin.js'
import vuexAlong from 'vuex-along'


Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    loginpop,
    islogin,
  },
  // plugins:[vuexAlong(scroll)]
})

export default store

