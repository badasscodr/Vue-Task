import axios from "axios"
// // import router from '../../router/index'
// import Shipment from './../../custom/ShipmentResource'

const state = {
    currentPoSelected: null,
    po: [],
    poLoading: false,
    editPo: {},
	poCreateLoading: false,
	poSaveAddLoading: false,
	vendorLists: [],
	poDeleteLoading: false,
	vendorListsLoading: false,
	poDetailLoading: false,
	downloadLoading: false,
	poDetail: {}
}

const getters = {
    getCurrentSelectedPo: state => state.currentPoSelected,
    getAllPo: state => state.po,
    getPoLoading: state => state.poLoading,
    getPoCreateLoading: state => state.poCreateLoading,
    getPoSaveAddLoading: state => state.poSaveAddLoading,
    getVendorListsLoading: state => state.vendorListsLoading,
    getVendorLists: state => state.vendorLists,
    getPoDeleteLoading: state => state.poDeleteLoading,
    getPoDetailLoading: state => state.poDetailLoading,
    getPoDetail: state => state.poDetail,
    getDownloadLoading: state => state.downloadLoading
}

const poBaseUrl = process.env.VUE_APP_PO_URL

const actions = {

	downloadPo: async({commit}, item) => {

		commit('SET_PO_DOWNLOAD_LOADING', true)
		
		await axios({
			url: `${poBaseUrl}/purchaseorders/${item.id}/download`,
			method: 'GET',
			responseType: 'blob'
		}).then(response => {
			commit('SET_PO_DOWNLOAD_LOADING', false)
			let fileURL = window.URL.createObjectURL(new Blob([response.data]))
			let fileLink = document.createElement('a')
			fileLink.href = fileURL
			fileLink.setAttribute('download', `PO-${(typeof item.po_number!=='undefined') ? item.po_number : ''}.pdf`)
			fileLink.click()
			return Promise.resolve('ok')

		})
		.catch( err => {
			commit('SET_PO_DOWNLOAD_LOADING', false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				return Promise.reject(err.message)
			}
		})
	},
	getPo: async({commit}, id) => {

		commit('SET_PO_DETAIL_LOADING', true)
		await axios.get(`${poBaseUrl}/purchaseorders/${id}`).then(res => {
			commit('SET_PO_DETAIL_LOADING', false)
			if (typeof res!=='undefined' && res.status === 200) {
				commit('SET_PO_DETAIL', res.data)
				return Promise.resolve(res.data)
			}
		})
		.catch( err => {
			commit('SET_PO_DETAIL_LOADING', false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				return Promise.reject(err.message)
			}
		})
	},
	setPoDefault({ commit }) {
		commit('SET_PO', [])
	},
    setPo({ commit }, payload) {
        commit("setPo", payload)
    },
    updatePo: async ( {commit }, payload) => {
		
		commit((payload.another) ? 'SET_PO_SAVE_ADD_LOADING': 'SET_PO_CREATE_LOADING', true)
		let { 
			id,
			...otherPayload
		} = payload

		payload = {
			...otherPayload
		}

		return new Promise((resolve, reject) => {

			axios.post(`${poBaseUrl}/purchaseorders/update/${id}`, payload).then(res => {
				commit((payload.another) ? 'SET_PO_SAVE_ADD_LOADING': 'SET_PO_CREATE_LOADING', false)
				if (typeof res!=='undefined' && res.status === 200) {
					resolve(res.data)
				}
			})
			.catch( err => {
				commit((payload.another) ? 'SET_PO_SAVE_ADD_LOADING': 'SET_PO_CREATE_LOADING', false)
				if (typeof err.error !== 'undefined') {
					reject(err.error)
				} else {
					reject(err.message)
				}
			})
		})

	},
    createPo: async ( {commit }, payload) => {

		return new Promise((resolve, reject) => {

			commit((payload.another) ? 'SET_PO_SAVE_ADD_LOADING': 'SET_PO_CREATE_LOADING', true)			
			axios.post(`${poBaseUrl}/purchaseorders/create`, payload).then(res => {
				commit((payload.another) ? 'SET_PO_SAVE_ADD_LOADING': 'SET_PO_CREATE_LOADING', false)
				if (typeof res!=='undefined' && res.status === 200) {
					resolve(res.data)
				}
			})
			.catch( err => {
				commit((payload.another) ? 'SET_PO_SAVE_ADD_LOADING': 'SET_PO_CREATE_LOADING', false)
				if (typeof err.error !== 'undefined') {
					reject(err.error)
				} else {
					reject(err.message)
				}
			})

		})
	},
    fetchVendorLists: async ({
		commit
	}) => {

		return new Promise( (resolve, reject) => {
			commit("SET_VENDOR_LISTS_LOADING", true)

			axios.get('suppliers').then(res => {
				commit("SET_VENDOR_LISTS_LOADING", false)
				if ( res.status === 200 ) {
					if ( res.data ) {
						if (res.data.data){
							commit("SET_VENDOR_LISTS", res.data.data)
							resolve('ok')
						} else {
							reject('not ok')
						}
					} else {
						reject('not ok')
					}
				} else {
					reject('not ok')
				}
			}).catch(err => {
				commit("SET_VENDOR_LISTS_LOADING", false)
				if (typeof err.error !== 'undefined') {
					reject(err.error)
				} else {
					reject(err.message)
				}
			})

		})
		
	},
    fetchPo: async ({
		commit
	}, ) => {
		commit("SET_PO_LOADING", true)

		await axios.get(`${poBaseUrl}/purchaseorders`)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					commit("SET_PO_LOADING", false)
					commit("SET_PO", res.data)
					return Promise.resolve('ok')
				} else {
					return Promise.reject('not ok')
				}
			} else {
				return Promise.reject('not ok')
			}
		})
		.catch(err => {
			commit("SET_PO_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				return Promise.reject(err.message)
			}
		})
	},
	deletePo: async({
		commit
	}, id) => {
		commit("SET_DELETE_PO_LOADING", true)
		await axios.delete(`${poBaseUrl}/purchaseorders/delete/${id}`)
		.then(res => {
			commit("SET_DELETE_PO_LOADING", false)
			return Promise.resolve(res)
		})
		.catch(err => {
			commit("SET_DELETE_PO_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				return Promise.reject(err.message)
			}
		})
	}
}

const mutations = {
    setPo: (state, payload) => {
        state.currentPoSelected = payload
    },
    SET_DELETE_PO_LOADING: (state, payload) => {
		state.poDeleteLoading = payload
    },
    SET_PO: (state, payload) => {
		state.po = payload
	},
	SET_PO_LOADING: (state, payload) => {
		state.poLoading = payload
	},
	SET_PO_CREATE_LOADING: (state, payload) => {
		state.poCreateLoading = payload
	},
	SET_PO_SAVE_ADD_LOADING: (state, payload) => {
		state.poSaveAddLoading = payload
	},
	SET_VENDOR_LISTS_LOADING: (state, payload) => {
		state.vendorListsLoading = payload
	},
	SET_VENDOR_LISTS: (state, payload) => {
		state.vendorLists = payload
	},
	SET_PO_DETAIL_LOADING: (state, payload) => {
		state.poDetailLoading = payload
    },
    SET_PO_DETAIL: (state, payload) => {
		state.poDetail = payload
    },
    SET_PO_DOWNLOAD_LOADING: (state, payload) => {
		state.downloadLoading = payload
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}