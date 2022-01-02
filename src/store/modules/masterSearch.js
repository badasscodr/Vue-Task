import axios from "axios"
// import router from '../../router/index'
import Shipment from './../../custom/ShipmentResource'

const state = {
	masterSearch: [],
	masterSearchLoad: true
}

const getters = {
	getAllMasterSearch: state => state.masterSearch,
	masterSearchLoading: state => state.masterSearchLoad
}

const actions = {
	fetchMasterSearch: async ({
		commit
	}, data ) => {
		commit("SET_MASTER_SEARCH_LOADING", true)

        // axios({
        //     method: "post",
        //     url: "/search",
        //     cancelToken: new CancelToken(function executor(c) {
        //         cancel = c
        //     }),
        //     params: {
        //         search_text: searchData
        //     }
        // })
        // .then(res => {                    
        //     if (res.status == 200) {
        //         this.searching = false
        //         this.searchResults = JSON.parse(JSON.stringify(res.data.data))
        //         console.log(res.data.data);
        //         this.isOpen = true
        //     }
        // })
        // .catch(err => {
        //     if (err.status == 'undefined') {
        //         this.isOpen = true
        //         this.searching = false
        //         this.searchResults = []
        //         console.log(JSON.stringify(err.response))
        //         throw Error(err)
        //     }
        // })

		await axios(data)
		.then(res => {                    
			if (res.status == 200) {
				if (res.data) {
					const shipment = new Shipment(res.data.data.shipments)
                    
					let finalData = {
                        customers:  res.data.data.customers,
                        shipments: shipment.all()
                    }
					// commit("SET_MASTER_SEARCH", shipment.all())
					commit("SET_MASTER_SEARCH", finalData)
				}
			}

			commit("SET_MASTER_SEARCH_LOADING", false)
		})
		.catch(err => {
			if (err.status == 'undefined') {
				commit("SET_MASTER_SEARCH_LOADING", false)
				console.log(JSON.stringify(err.response))
				throw Error(err)				
			}
		})
	}
}

const mutations = {
	SET_MASTER_SEARCH: (state, payload) => {
		state.masterSearch = payload
	},
	SET_MASTER_SEARCH_LOADING: (state, payload) => {
		state.masterSearchLoad = payload
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}