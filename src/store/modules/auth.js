// import axios from 'axios'

import axios from "axios"
import router from '../../router/index'

const state = {
    user_token: localStorage.getItem('user_token') || '',
    expiresAt: localStorage.getItem('expiresAt') || '',
    isRefreshing: false,
    user: (localStorage.getItem('shifl.user_details')!==null) ? JSON.parse(localStorage.getItem('shifl.user_details')) : null,
    errors: '',
    forgetPasswordLoading: false,
    resetPasswordLoading: false,
    resetPasswordGlobalLoading: false
}

const getters = {
    /*// <<<<<<< HEAD
    //  getUser: (state) => state.user,
    //  getUserToken: state => state.user_token,
    //  getExpiresAt: state => state.expiresAt
    // }
    //
    // const actions = {
    //  async login({
    //      commit,
    //      dispatch
    //  }, payload) {
    //      // console.log("hello")
    //      await axios.post('/login', payload, {
    //              withCredentials: true,
    //              credentials: 'include',
    //          })
    //          .then(res => {
    //              // console.log(res.status)
    //              if (res.status === 200) {
    //                  // console.log("here")
    //                  const expiresAt = new Date(new Date()
    //                      .getTime() + (res.data.expiresIn - 2) * 1000)
    //                  localStorage.setItem("user_token", res.data.token)
    //
    //                  // optional
    //                  localStorage.setItem("expiresAt", expiresAt)
    //                  commit("SET_TOKEN", {
    //                      token: res.data.token,
    //                      expiresAt: expiresAt
    //                  })
    //
    //                  // fetch user
    //                  dispatch("fetchUser")
    //                      .then(res => {
    //                          if (res.status === 200) {
    //                              router.push('/')
    //                          }
    //                      })
    //
    //
    //
    //              }
    //          })
    //          .catch(err => console.log(err))
    //  },
    //  async logout({
    //      commit
    //  }) {
    //      localStorage.removeItem("user_token")
    //      localStorage.removeItem("expiresAt")
    //
    //      commit("SET_TOKEN", {
    //          token: '',
    //          expiresAt: ''
    //      })
    //      commit("SET_USER", null)
    //
    //      //
    //      router.push({
    //              name: "Login"
    //          })
    //          .catch(err => {
    //              // Ignore the vuex err regarding  navigating to the page they are already on.
    //              if (
    //                  err.name !== 'NavigationDuplicated' &&
    //                  !err.message.includes('Avoided redundant navigation to current location')
    //              ) {
    //                  // But print any other errors to the console
    //                  console.log(err);
    //              }
    //          });
    //
    //  },
    //  fetchUser: ({
    //      commit
    //  }) => {
    //
    //      return new Promise((resolve, reject) => {
    //          axios.post('/details')
    //              .then(res => {
    //                  if (res) {
    //
    //                      if (res.status === 200) {
    //                          commit("SET_USER", res.data)
    //                          resolve(res)
    //                      }
    //                  }
    //              })
    //              .catch(err => {
    //                  // console.log(err)
    //                  reject(err)
    //              })
    //      })
    //  },
    //
    //
    //
    //  refreshToken: async ({
    //      commit,
    //      dispatch
    //  }) => {
    //      return new Promise((resolve, reject) => {
    //
    //          axios.defaults.withCredentials = true
    //
    //          axios.post(`/refresh-token`, {}, {
    //                  withCredentials: true,
    //                  credentials: 'include',
    //              })
    //              .then(res => {
    //                  if (res.status === 200) {
    //                      // console.log("here")
    //                      const expiresAt = new Date(new Date()
    //                          .getTime() + (res.data.expiresIn - 2) * 1000)
    //
    //                      localStorage.setItem("user_token", res.data.token)
    //                      localStorage.setItem("expiresAt", expiresAt) // optional
    //
    //
    //                      commit("SET_TOKEN", {
    //                          token: res.data.token,
    //                          expiresAt: expiresAt
    //                      })
    //
    //                      // fetch user
    //                      dispatch("fetchUser")
    //
    //                  }
    //                  resolve(res);
    //              })
    //              .catch(error => {
    //                  reject(error);
    //              });
    //      })
    //  }
    // }
    // const mutations = {
    //  SET_TOKEN: (state, payload) => {
    //      state.user_token = payload.token
    //      state.expiresAt = payload.expiresAt
    //  },
    //  SET_USER: (state, payload) => {
    //      state.user = payload
    //  }
    // =======*/
    getUser: (state) => state.user,
    getUserToken: state => state.user_token,
    getExpiresAt: state => state.expiresAt,
    getErrorMessage: state => state.errors,
    getforgetPasswordLoading: state => state.forgetPasswordLoading,
    getResetPasswordLoading: state => state.resetPasswordLoading,
    getResetPasswordGlobalLoading: state => state.resetPasswordGlobalLoading
}

const actions = {
    async checkForgotPasswordCode({
        commit
    }, payload) {
        return new Promise((resolve, reject) => {
            commit('SET_RESET_PASSWORD_GLOBAL_LOADING', true)
            axios.get(`/check-forgot-password-code?code=${payload}`).then(res => {
                commit('SET_RESET_PASSWORD_GLOBAL_LOADING', false)
                if (res.status === 200) {
                    if (typeof res.data!=='undefined')
                        resolve(res.data)
                    else
                        reject('not ok')
                } else {
                    reject('not ok')
                }
            }).catch(err => {
                console.log(err)
                commit('SET_RESET_PASSWORD_GLOBAL_LOADING', false)
                reject(err)
            })
        })
    },
    async forgetPassword({
        commit
    },payload) {
        return new Promise((resolve, reject) => {
            commit('SET_FORGET_PASSWORD_LOADING', true)
            axios.post('/forgot-password', payload).then(res => {
                commit('SET_FORGET_PASSWORD_LOADING', false)
                if (res.status === 200) {
                    if (typeof res.data!=='undefined')
                        resolve(res.data)
                    else
                        reject('not ok')
                } else {
                    reject('not ok')
                }
            }).catch(err => {
                console.log(err)
                commit('SET_FORGET_PASSWORD_LOADING', false)
                reject(err)
            })
        })

    },
    async resetPassword({
        commit
    },payload) {
        return new Promise((resolve, reject) => {
            commit('SET_RESET_PASSWORD_LOADING', true)
            axios.post('/change-password', payload).then(res => {
                commit('SET_RESET_PASSWORD_LOADING', false)
                if (res.status === 200) {
                    if (typeof res.data!=='undefined'){
                        resolve(res.data)
                    }
                    else
                        reject('not ok')
                } else {
                    reject('not ok')
                }
            }).catch(err => {
                console.log(err)
                commit('SET_RESET_PASSWORD_LOADING', false)
                reject(err)
            })
        })

    },
    async login({
        commit,
        dispatch
    }, payload) {
        commit("SET_ERROR_MESSAGE", "")
        await axios.post('/login', payload, {
                withCredentials: true,
                credentials: 'include',
            })
            .then(res => {

                if (res.status === 200) {
                    const expiresAt = new Date(new Date()
                        .getTime() + (res.data.expiresIn - 2) * 1000)
                    localStorage.setItem("user_token", res.data.token)
                    // optional
                    localStorage.setItem("expiresAt", expiresAt)
                    commit("SET_TOKEN", {
                        token: res.data.token,
                        expiresAt: expiresAt
                    })
                    // check if the remember me is ticked
                    if (typeof payload.checkbox!=='undefined' && payload.checkbox) {
                        localStorage.setItem("shifl.user_rememberme_email", payload.email)
                    } else {
                        localStorage.removeItem("shifl.user_rememberme_email")
                    }
                    // fetch user
                    dispatch("fetchUser")
                        .then(res => {
                            if (res.status === 200) {
                                router.push('/')
                            }
                        })
                }
            })
            .catch(err => {
                let errorMessage = (typeof err.response.data !== 'undefined' && typeof err.response.data.message !== 'undefined') ? err.response.data.message : 'Wrong username or password.'
                errorMessage = 'Wrong username or pssword.'
                commit("SET_ERROR_MESSAGE", errorMessage)
            })
    },
    async logout({
        commit
    }) {
        localStorage.removeItem("user_token")
        localStorage.removeItem("expiresAt")
        localStorage.removeItem("shifl.user_details")
        commit("SET_TOKEN", {
            token: '',
            expiresAt: ''
        })
        commit("SET_USER", null)
        //
        router.push({
                name: "Login"
            })
            .catch(err => {
                // Ignore the vuex err regarding  navigating to the page they are already on.
                if ( err.name !== 'NavigationDuplicated' &&
                    !err.message.includes('Avoided redundant navigation to current location')) {
                    // But print any other errors to the console
                    console.log(err);
                }
            });
    },
    fetchUser: ({
        commit
    }) => {
        return new Promise((resolve, reject) => {
            axios.post('/details')
                .then(res => {
                    if (res) {
                        if (res.status === 200) {
                            if (res.data) {
                                localStorage.setItem("shifl.user_details", JSON.stringify(res.data.success))
                                commit("SET_USER", localStorage.getItem("shifl.user_details"))
                            }
                            //commit("SET_USER", res.data.success)
                            resolve(res)
                        }
                    }
                })
                .catch(err => {
                    // console.log(err)
                    reject(err)
                })
        })
    },
    refreshToken: async ({
        commit,
        dispatch
    }) => {
        return new Promise((resolve, reject) => {
            axios.defaults.withCredentials = true
            axios.post(`/refresh-token`, {}, {
                    withCredentials: true,
                    credentials: 'include',
                })
                .then(res => {
                    if (res.status === 200) {
                        const expiresAt = new Date(new Date()
                            .getTime() + (res.data.expiresIn - 2) * 1000)
                        localStorage.setItem("user_token", res.data.token)
                        localStorage.setItem("expiresAt", expiresAt) // optional
                        commit("SET_TOKEN", {
                            token: res.data.token,
                            expiresAt: expiresAt
                        })
                        // fetch user
                        dispatch("fetchUser")
                    }
                    resolve(res);
                })
                .catch(error => {
                    reject(error);
                });
        })
    }
}
const mutations = {
    SET_RESET_PASSWORD_GLOBAL_LOADING: (state, payload) => {
        state.resetPasswordGlobalLoading = payload
    },
    SET_FORGET_PASSWORD_LOADING: (state, payload) => {
        state.forgetPasswordLoading = payload
    },
    SET_RESET_PASSWORD_LOADING: (state, payload) => {
        state.resetPasswordLoading = payload
    },
    SET_TOKEN: (state, payload) => {
        state.user_token = payload.token
        state.expiresAt = payload.expiresAt
    },
    SET_USER: (state, payload) => {
        state.user = payload
    },
    SET_ERROR_MESSAGE: (state, payload) => {
        state.errors = payload
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
