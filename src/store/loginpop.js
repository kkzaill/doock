export default {
  state: {
    isShow: false
  },
  getters: {
    // setDetail: state => state.details
  },
  actions: {
    setShow (context) {
      (data) => {context.commit('changeshow', data)}
    },
  },
  mutations: {
    changeshow(state, data) {
      // state.detail = [...state.detail, ...data]
      state.isShow = data
    }
  }
}