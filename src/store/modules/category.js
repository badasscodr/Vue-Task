import axios from "axios"

const state = {
    categories: [],
	categoriesLoading: false,
	createCat: null,
	createCatLoading: false,
	updateCat: null,
	updateCatLoading: false,
	deleteCat: null,
	deleteCatLoading: false,
	currentCat: null,
	currentCatLoading: false,
	error: ''
}

const getters = {
    getCategories: state => state.categories,
	getCategoriesLoading: state => state.categoriesLoading,
	getCreateCat: state => state.createCat,
	getCreateCatLoading: state => state.createCatLoading,
	getUpdateCat: state => state.updateCat,
	getUpdateCatLoading: state => state.updateCatLoading,
	getDeleteCat: state => state.deleteCat,
	gettDeleteCatLoading: state => state.deleteCatLoading,
	getCurrentCategory: state => state.currentCat,
	getCurrentCategoryLoading: state => state.currentCatLoading,
	getError: state => state.error
}

const actions = {
    fetchCategories: async ({
		commit
	}, ) => {
		commit("SET_CATEGORIES_LOADING", true)
		await axios.get(`${process.env.VUE_APP_PO_URL}/categories`)
		.then(res => {

			commit("SET_CATEGORIES_LOADING", false)
			if (res.status === 200) {
				if (typeof res.data!=='undefined' && typeof res.data.results!=='undefined' && typeof res.data.results.data!=='undefined') {
					// console.log(res.data.results);
					//commit("SET_CATEGORIES", res)
					commit("SET_CATEGORIES", res.data.results.data)
				} else {
					commit("SET_CATEGORIES", [])
				}
			}
		})
		.catch(err => {
			commit("SET_CATEGORIES_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				if (typeof err.message !== 'undefined') {
					return Promise.reject('Token has been expired. Please reload the page.')
				}
			}
		})
	},
	createCategories: async ({
		commit
	}, payload ) => {
		
		commit("SET_CREATE_CATEGORIES_LOADING", true)

		await axios.post(`${process.env.VUE_APP_PO_URL}/categories/create`, payload)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					// console.log(res.data);
					commit("SET_CREATE_CATEGORIES_LOADING", false)
					// commit("SET_CREATE_CATEGORIES", res.data)
				}
			}
		})
		.catch(err => {
			commit("SET_CREATE_CATEGORIES_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				if (typeof err.message !== 'undefined') {
					return Promise.reject('Token has been expired. Please reload the page.')
				}
			}
		})
	},
	updateCategories: async ({
		commit
	}, payload, ) => {

		commit("SET_UPDATE_CATEGORIES_LOADING", true)

		await axios.put(`${process.env.VUE_APP_PO_URL}/categories/update/${payload.cat_id}`, payload.passedData)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					// console.log(res.data);
					commit("SET_UPDATE_CATEGORIES_LOADING", false)
					// commit("SET_UPDATE_CATEGORIES", res.data)
				}
			}
		})
		.catch(err => {
			commit("SET_UPDATE_CATEGORIES_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				if (typeof err.message !== 'undefined') {
					return Promise.reject('Token has been expired. Please reload the page.')
				}
			}
		})
	},
	deleteCategories: async({
		commit
	}, id) => {
		commit("SET_DELETE_CATEGORIES_LOADING", true)

		await axios.delete(`${process.env.VUE_APP_PO_URL}/categories/delete/${id}`)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					commit("SET_DELETE_CATEGORIES_LOADING", false)
					// commit("SET_DELETE_CATEGORIES", res.data)
				}
			}
		})
		.catch(err => {
			commit("SET_ERROR", err)
			commit("SET_DELETE_CATEGORIES_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				if (typeof err.message !== 'undefined') {
					return Promise.reject('Token has been expired. Please reload the page.')
				}
			}
		})
	},
	getCurrentCategory: async({
		commit
	}, id) => {
		commit("SET_CURRENT_CATEGORY_LOADING", true)

		await axios.get(`${process.env.VUE_APP_PO_URL}/categories/${id}`)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					console.log(res.data);
					commit("SET_CURRENT_CATEGORY_LOADING", false)
					// commit("SET_CURRENT_CATEGORY", res.data.results)
				}
			}
		})
		.catch(err => {
			commit("SET_CURRENT_CATEGORY_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				if (typeof err.message !== 'undefined') {
					return Promise.reject('Token has been expired. Please reload the page.')
				}
			}
		})
	}
}

const methods = {
	testing: () => {
		alert('testing')
	}
}

const mutations = {
    SET_CATEGORIES: (state, payload) => {
		state.categories = payload
	},
	SET_CATEGORIES_LOADING: (state, payload) => {
		state.categoriesLoading = payload
	},
	SET_CREATE_CATEGORIES: (state, payload) => {
		state.createCat = payload
	},
	SET_CREATE_CATEGORIES_LOADING: (state, payload) => {
		state.createCatLoading = payload
	},
	SET_UPDATE_CATEGORIES: (state, payload) => {
		state.updateCat = payload
	},
	SET_UPDATE_CATEGORIES_LOADING: (state, payload) => {
		state.updateCatLoading = payload
	},
	SET_DELETE_CATEGORIES: (state, payload) => {
		state.deleteCat = payload
	},
	SET_DELETE_CATEGORIES_LOADING: (state, payload) => {
		state.deleteCatLoading = payload
	},
	SET_CURRENT_CATEGORY: (state, payload) => {
		state.currentCat = payload
	},
	SET_CURRENT_CATEGORY_LOADING: (state, payload) => {
		state.currentCatLoading = payload
	},
	SET_ERROR: (state, payload) => {
		state.error = payload
	}
}

export default {
    namespaced: true,
    state,
	getters,
	actions,
	mutations,
	methods
}