import * as types from './mutations-type'

export const setUserInfo = function ({commit}, data) {
  commit(types.SET_USERINFO, data)
}
