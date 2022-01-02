const state = {
    currentPage: 'test page',
    currentTab: 1,
    currentShipmentPage: 1,
    currentSettingsTab: 0,
    currentSettingsTabName: 'users'
}

const actions = {
    setPage({ commit }, payload) {
        commit("setPage", payload)
    },
    setTab({ commit }, payload) {
        commit("setTab", payload)
    },
    setCurrentShipmentPage( { commit }, payload) {
        commit("setCurrentShipmentPage", payload)
    },
    setCurrentSettingsTab( { commit }, payload) {
        commit("setCurrentSettingsTab", payload)
    },
    setCurrentSettingsTabName( { commit }, payload) {
        commit("setCurrentSettingsTabName", payload)
    },
}

const mutations = {
    setPage: (state, payload) => {
        state.currentPage = payload
    },
    setTab: (state, payload) => {
        state.currentTab = payload
    },
    setCurrentShipmentPage: (state, payload) => {
        state.currentShipmentPage = payload
    },
    setCurrentSettingsTab: (state, payload) => {
        state.currentSettingsTab = payload
    },
    setCurrentSettingsTabName: (state, payload) => {
        state.currentSettingsTabName = payload
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
