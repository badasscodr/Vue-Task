import axios from "axios"
//import _ from 'lodash'


const state = {
	scheduleOptions: [],
	scheduleOptions_loading: true,
	selectedSchedule: null
}

const getters = {
	getScheduleOptions: state => state.scheduleOptions,
	getScheduleOptionsLoading: state => state.scheduleOptions_loading,
	getSelectedSchedule: state => state.selectedSchedule
}

const actions = {
	fetchScheduleOptions: async ({
		commit
	}, id) => {
		commit("SET_SCHEDULE_OPTIONS_LOADING", true)

		await axios.get(`/schedule-options?id=${id}`)
		.then(res => {
			if(res.status === 200) {
				if (res.data) {
					commit("SET_SCHEDULE_OPTIONS_LOADING", false)

					let value = res.data
					commit("SET_SCHEDULE_OPTIONS", value)
				}
			}
		})
		.catch(err => {
			return Promise.reject(err)
		})
	},
	sendConfirmSchedule: async ({
		commit
	}, passedData) => {
		await axios.get(`/select-schedule?id=${passedData.id}&schedule_id=${passedData.sid}`)
		.then(res => {
			if(res.status === 200) {
				if (res.data) {
					let value = res.data
					commit("SET_SELECTED_SCHEDULE", value)
				}
			}
		})
		.catch(err => {
			return Promise.reject(err)
		})
	},
}

const methods = {
	testing: () => {
		alert('testing')
	}
}
const mutations = {
	SET_SCHEDULE_OPTIONS: (state, payload) => {
		state.scheduleOptions = payload
	},
	SET_SCHEDULE_OPTIONS_LOADING: (state, payload) => {
		state.scheduleOptions_loading = payload
	},
	SET_SELECTED_SCHEDULE: (state, payload) => {
		state.selectedSchedule = payload
	}
}

export default {
	state,
	getters,
	actions,
	mutations,
	methods
}