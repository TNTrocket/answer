import * as types from './mutations-type'

const mutations = {
  [types.SET_USERINFO] (state, userInfo) {
    state.userInfo = {
      ...state.userInfo,
      ...userInfo
    }
  }
}

export default mutations
