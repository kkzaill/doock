export default {
  state: {
    isLogin: false
  },
  getters: {
    // setDetail: state => state.details
  },
  actions: {
    setLogin (context) {
      (data) => {context.commit('changelogin', data)}
    },
  },
  mutations: {
    changelogin(state, data) {
      // state.detail = [...state.detail, ...data]
      state.isLogin = data
    }
  }
}