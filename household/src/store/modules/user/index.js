/**
 * Mail Module
 */
import axios from 'axios';
const state = {
    name: "",
    sub: "",
    plan: "",
    idToken: "",
    expireAt: "",
    groupInfo: "",
    isAuthenticated: false,
}


const getters = {

}

const actions = {
    async fetchUser(state, id_token) {
    await axios
      .get(process.env.VUE_APP_API + "/api/v1/check", {headers: {'Authorization': 'Bearer ' + id_token}})
      .then(response => { 
        if( response.data.name != 'none'){
            state.commit('setUser', response.data)
        }
      }).catch(error => {
        console.log(error)
      })
    }
}
const mutations = {
    setUser(state, user ) {
        state.name = user.name
        state.sub = user.sub
    },
    setIdToken(state, token) {
        state.idToken = token
    },
    setExpireAt(state, expireAt) {
        state.expireAt = expireAt
    },
    setProfile(state, profile) {
    },
    setGroupInfo(state, info) {
        state.orgInfo = info
    },
    setAuthenticated(state, auth) {
        state.isAuthenticated = auth
    },
    logout(state) {
        state.domain = ""
        state.idToken = ""
        state.expireAt = ""
        state.isAuthenticated = false
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
