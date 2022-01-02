import axios from "axios"
// // import router from '../../router/index'
// import Shipment from './../../custom/ShipmentResource'

const state = {
    warehouse: [],
    warehouseLoading: false,
	warehouseDelete: null,
	warehouseDeleteLoading: false,
	countries: [],
	countriesLoading: false,
	states: [],
	statesLoading: false,
	cities: [],
	citiesLoading: false,
	isEditing: false,
	editWarehouse: {},
	warehouseCreateLoading: false,
	warehouseSaveAddLoading: false,
	singleWarehouse: null,
	singleWarehouseLoading: false,
	currentWarehouse: null,
	currentSort: 'name-asc',
	activeId: 0
}

const getters = {
    getWarehouse: state => state.warehouse,
    getWarehouseLoading: state => state.warehouseLoading,
    getWarehouseCreateLoading: state => state.warehouseCreateLoading,
	getWarehouseDelete: state => state.warehouse,
    getWarehouseDeleteLoading: state => state.warehouseDeleteLoading,
	getCountries: state => state.countries,
    getCountriesLoading: state => state.countriesLoading,
	getStates: state => state.states,
    getStatesLoading: state => state.statesLoading,
	getCities: state => state.cities,
    getCitiesLoading: state => state.citiesLoading,
    editWarehouse: state => state.editWarehouse,
    isEditing: state => state.isEditing,
    getWarehouseSaveAddLoading: state => state.warehouseSaveAddLoading,
	getSingleWarehouse: state => state.singleWarehouse,
	getSingleWarehouseLoading: state => state.singleWarehouseLoading,
	getCurrentSort: state => state.currentSort,
	getCurrentWarehouse: state => state.currentWarehouse,
	getActiveId: state => state.activeId
}

const poBaseUrl = process.env.VUE_APP_PO_URL

const actions = {
	setIsEditing: ({
		commit
	}, payload) => {
		commit('SET_IS_EDITING', payload)
	},
	setSort({ commit }, payload) {
        commit("setSort", payload)
    },
	setCurrentWarehouse({ commit }, payload) {
        commit("setCurrentWarehouse", payload)
    },
	setActiveId({ commit }, payload) {
        commit("setActiveId", payload)
    },
	updateWarehouse: async ( {commit }, payload) => {
		commit((typeof payload.another!=='undefined') ? 'SET_WAREHOUSE_SAVE_ADD_LOADING': 'SET_WAREHOUSE_CREATE_LOADING', true)
		let { 
			id,
			...otherPayload
		} = payload

		payload = {
			...otherPayload
		}

		return new Promise((resolve, reject) => {
			axios.post(`${poBaseUrl}/warehouses/update/${id}`, payload).then(res => {				
				commit((typeof payload.another!=='undefined') ? 'SET_WAREHOUSE_SAVE_ADD_LOADING': 'SET_WAREHOUSE_CREATE_LOADING', false)
				if (typeof res!=='undefined' && res.status === 200) {
					resolve(res.data)
				}
			})
			.catch( err => {
				commit((typeof payload.another!=='undefined') ? 'SET_WAREHOUSE_SAVE_ADD_LOADING': 'SET_WAREHOUSE_CREATE_LOADING', false)
				if (typeof err.error !== 'undefined') {
					reject(err.error)
				} else {
					reject(err.message)
				}
			})
		})
	},
	createWarehouse: async ( {commit }, payload) => {

		return new Promise((resolve, reject) => {

			commit((typeof payload.another!=='undefined') ? 'SET_WAREHOUSE_SAVE_ADD_LOADING': 'SET_WAREHOUSE_CREATE_LOADING', true)

			axios.post(`${poBaseUrl}/warehouses/create`, payload).then(res => {
				commit((typeof payload.another!=='undefined') ? 'SET_WAREHOUSE_SAVE_ADD_LOADING': 'SET_WAREHOUSE_CREATE_LOADING', false)
				if (typeof res!=='undefined' && res.status === 200) {
					resolve(res.data)
				}
			})
			.catch( err => {
				commit((typeof payload.another!=='undefined') ? 'SET_WAREHOUSE_SAVE_ADD_LOADING': 'SET_WAREHOUSE_CREATE_LOADING', false)
				if (typeof err.error !== 'undefined') {
					reject(err.error)
				} else {
					reject(err.message)
				}
			})
		})
	},
    fetchWarehouse: async ({
		commit
	}, ) => {
		commit("SET_WAREHOUSE_LOADING", true)

		await axios.get(`${poBaseUrl}/warehouses`)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					commit("SET_WAREHOUSE_LOADING", false)					
					commit("SET_WAREHOUSE", res.data)
				}
			}
		})
		.catch(err => {
			commit("SET_WAREHOUSE_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				return Promise.reject(err.message)
			}
		})
	},
	deleteSelectedWarehouse: async({
		commit
	}, id) => {
		commit("SET_DELETE_WAREHOUSE_LOADING", true)

		await axios.delete(`${poBaseUrl}/warehouses/delete/${id}`)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					// console.log(res.data);
					commit("SET_DELETE_WAREHOUSE_LOADING", false)
					// commit("SET_DELETE_WAREHOUSE", res.data)
				}
			}
		})
		.catch(err => {
			commit("SET_DELETE_WAREHOUSE_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				return Promise.reject(err.message)
			}
		})
	},
	fetchCountries: async ({
		commit
	}, ) => {
		commit("SET_COUNTRIES_LOADING", true)

		await axios.get(`${poBaseUrl}/countries`)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					// console.log(res.data)
					commit("SET_COUNTRIES_LOADING", false)
					commit("SET_COUNTRIES", res.data)
				}
			}
		})
		.catch(err => {
			commit("SET_COUNTRIES_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				return Promise.reject(err.message)
			}
		})
	},
	fetchStates: async ({
		commit
	}, country ) => {
		commit("SET_STATES_LOADING", true)

		try{
			const result = await axios.get(`${poBaseUrl}/states/${country}`)
			
			commit("SET_STATES_LOADING", false)
			commit("SET_STATES", result.data)
		}catch(err){
			console.log("What is error", err)
		}

		commit("SET_STATES_LOADING", false)

		// return new Promise( (resolve, reject ) => {
		// 	axios.get(`${poBaseUrl}/states/${country}`)
		// 	.then(res => {
		// 		if (res.status === 200) {
		// 			if (res.data) {
		// 				// console.log(res.data)
		// 				commit("SET_STATES_LOADING", false)
		// 				commit("SET_STATES", res.data)
		// 				resolve('ok')
		// 			}
		// 		}
		// 	})
		// 	.catch(err => {
		// 		commit("SET_STATES_LOADING", false)
		// 		if (typeof err.error !== 'undefined') {
		// 			reject(err.error)
		// 		} else {
		// 			reject(err.message)
		// 		}
		// 	})	
		// })
		
	},
	fetchCities: async ({
		commit
	}, payload ) => {
		commit("SET_CITIES_LOADING", true)

		await axios.get(`${poBaseUrl}/cities/${payload.country}/${payload.states}`)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					// console.log(res.data)
					commit("SET_CITIES_LOADING", false)
					commit("SET_CITIES", res.data)
				}
			}
		})
		.catch(err => {
			commit("SET_CITIES_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				return Promise.reject(err.message)
			}
		})
	},
	fetchSingleWarehouse: async ({
		commit
	}, id ) => {
		commit("SET_SINGLE_WAREHOUSE_LOADING", true)

		await axios.get(`${poBaseUrl}/warehouses/${id}`)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					// console.log(res.data)
					commit("SET_SINGLE_WAREHOUSE_LOADING", false)
					commit("SET_SINGLE_WAREHOUSE", res.data)
				}
			}
		})
		.catch(err => {
			commit("SET_SINGLE_WAREHOUSE_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				return Promise.reject(err.message)
			}
		})
	},
	setStatesReset({ commit }, payload) {
		commit("setStatesReset", payload)
	},
	setCitiesReset({ commit }, payload) {
		commit("setCitiesReset", payload)
	},
}

const mutations = {	
	setSort: (state, payload) => {
		state.currentSort = payload
	},
	setActiveId: (state, payload) => {
		state.activeId = payload
	},
	setCurrentWarehouse: (state, payload) => {
		state.currentWarehouse = payload
	},
    SET_WAREHOUSE: (state, payload) => {
		state.warehouse = payload
	},
	SET_WAREHOUSE_LOADING: (state, payload) => {
		state.warehouseLoading = payload
	},
	SET_WAREHOUSE_CREATE_LOADING: (state, payload) => {
		state.warehouseCreateLoading = payload
	},
	SET_WAREHOUSE_SAVE_ADD_LOADING: (state, payload) => {
		state.warehouseSaveAddLoading = payload
	},
	SET_DELETE_WAREHOUSE: (state, payload) => {
		state.warehouseDelete = payload
	},
	SET_DELETE_WAREHOUSE_LOADING: (state, payload) => {
		state.warehouseDeleteLoading = payload
	},
	SET_COUNTRIES: (state, payload) => {
		state.countries = payload
	},
	SET_COUNTRIES_LOADING: (state, payload) => {
		state.countriesLoading = payload
	},
	SET_STATES: (state, payload) => {
		state.states = payload
	},
	SET_STATES_LOADING: (state, payload) => {
		state.statesLoading = payload
	},
	SET_CITIES: (state, payload) => {
		state.cities = payload
	},
	SET_CITIES_LOADING: (state, payload) => {
		state.citiesLoading = payload
	},
	SET_IS_EDITING: (state, payload) => {
		state.isEditing = payload
	},
	SET_SINGLE_WAREHOUSE: (state, payload) => {
		state.singleWarehouse = payload
	},
	SET_SINGLE_WAREHOUSE_LOADING: (state, payload) => {
		state.singleWarehouseLoading = payload
	},
	setStatesReset: (state, payload) => {
		state.states = payload
	},
	setCitiesReset: (state, payload) => {
		state.cities = payload
	},
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}