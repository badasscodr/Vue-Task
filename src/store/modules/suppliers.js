import axios from "axios"

const state = {
    suppliers: [],
    suppliersLoading: false,
	createSupplier: null,
	updateSupplier: null,
	updateSupplierLoading: false,
	createSupplierLoading: false,
	supplierSaveAddLoading: false
}

const getters = {
    getSuppliers: state => state.suppliers,
    getSuppliersLoading: state => state.suppliersLoading,
	getCreateSuppliers: state => state.createSupplier,
    getCreateSuppliersLoading: state => state.createSupplierLoading,
	getUpdateSuppliers: state => state.updateSupplier,
    getUpdateSuppliersLoading: state => state.updateSupplierLoading,
	getSupplierSaveAddLoading: state => state.supplierSaveAddLoading
}

// const poBaseUrl = "https://beta.shifl.com/api"

const actions = {
    fetchSuppliers: async ({
		commit
	}, ) => {
		commit("SET_SUPPLIERS_LOADING", true)

		// await axios.get(`/custom/customers/${id}/suppliers`)
		await axios.get(`/suppliers`)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					commit("SET_SUPPLIERS_LOADING", false)
					commit("SET_SUPPLIERS", res.data)
				}
			}
		})
		.catch(err => {
			commit("SET_SUPPLIERS_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				if (typeof err.message !== 'undefined') {
					return Promise.reject('Token has been expired. Please reload the page.')
				}
			}
		})
	},
	createSuppliers: async ({ commit }, payload ) => {
		// commit("SET_CREATE_SUPPLIERS_LOADING", true)

		let data = {
			custom_customers_id: payload.custom_customers_id,
			company_name: payload.company_name,
			address: payload.address,
			phone: payload.phone,
			emails: payload.emails
		}

		commit((payload.customerMethod=='save-add') ? 'SET_SUPPLIERS_SAVE_ADD_LOADING': 'SET_CREATE_SUPPLIERS_LOADING', true)

		await axios.post(`/suppliers`, data)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					commit((payload.customerMethod=='save-add') ? 'SET_SUPPLIERS_SAVE_ADD_LOADING': 'SET_CREATE_SUPPLIERS_LOADING', false)
					commit("SET_CREATE_SUPPLIERS", res.data)
				}
			}
		})
		.catch(err => {
			commit((payload.customerMethod=='save-add') ? 'SET_SUPPLIERS_SAVE_ADD_LOADING': 'SET_CREATE_SUPPLIERS_LOADING', false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				if (typeof err.message !== 'undefined') {
					return Promise.reject('Token has been expired. Please reload the page.')
				}
			}
		})
	},
	updateSuppliers: async ({ commit }, payload ) => {
		let data = {
			company_name: payload.company_name,
			address: payload.address,
			phone: payload.phone,
			emails: payload.emails
		}

		commit((payload.customerMethod=='save-add') ? 'SET_SUPPLIERS_SAVE_ADD_LOADING': 'SET_CREATE_SUPPLIERS_LOADING', true)
		await axios.put(`/suppliers/${payload.id}`, data)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					commit((payload.customerMethod=='save-add') ? 'SET_SUPPLIERS_SAVE_ADD_LOADING': 'SET_CREATE_SUPPLIERS_LOADING', false)
					commit("SET_UPDATE_SUPPLIERS", res.data)
				}
			}
		})
		.catch(err => {
			commit((payload.customerMethod=='save-add') ? 'SET_SUPPLIERS_SAVE_ADD_LOADING': 'SET_CREATE_SUPPLIERS_LOADING', false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				if (typeof err.message !== 'undefined') {
					return Promise.reject('Token has been expired. Please reload the page.')
				}
			}
		})
	},
}

const mutations = {
    SET_SUPPLIERS: (state, payload) => {
		state.suppliers = payload
	},
	SET_SUPPLIERS_LOADING: (state, payload) => {
		state.suppliersLoading = payload
	},
	SET_CREATE_SUPPLIERS: (state, payload) => {
		state.createSupplier = payload
	},
	SET_CREATE_SUPPLIERS_LOADING: (state, payload) => {
		state.createSupplierLoading = payload
	},
	SET_SUPPLIERS_SAVE_ADD_LOADING: (state, payload) => {
		state.supplierSaveAddLoading = payload
	},
	SET_UPDATE_SUPPLIERS: (state, payload) => {
		state.updateSupplier = payload
	},
	SET_UPDATE_SUPPLIERS_LOADING: (state, payload) => {
		state.updateSuppliersLoading = payload
	},
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}