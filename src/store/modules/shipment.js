import axios from "axios"
import Shipment from './../../custom/ShipmentResource'

const state = {
	shipments: [],
	shipment_loading: false,
}

const getters = {
	getAllShipments: state => state.shipments,
	getShipmentLoadingStatus: state => state.shipment_loading,
}

const actions = {
	fetchShipments: async ({
		commit
	}) => {
		commit("SET_SHIPMENT_LOADING", true)
		await axios.get('/shipments')
		// await axios.get('/shipmentss')
		.then(res => {
			if (res.status === 200) {
				if (typeof res.data !== 'undefined') {

					//start
					let newShipments = []
					if ( Array.isArray(res.data.data) && res.data.data.length > 0 ) {
						res.data.data.map((val) => {

							if ((val.booking_confirmed === 0 && val.cancelled ===0)) {
								if (typeof val.schedules_group_bookings!=='undefined' && val.schedules_group_bookings!=='' && val.schedules_group_bookings!==null) {

									try {
										let push_to_shipments = false
										let set_schedules = (Array.isArray(val.schedules_group_bookings)) ? val.schedules_group_bookings : JSON.parse(val.schedules_group_bookings)

										if (set_schedules.length > 0) {
											set_schedules.map( s => {
												if (typeof s.sell_rates!=='undefined' && s.sell_rates!=='' && s.sell_rates!==null) {
													let sell_rates = (Array.isArray(s.sell_rates)) ? s.sell_rates : JSON.parse(s.sell_rates)

													if (sell_rates.length > 0)
														push_to_shipments = true

												}
											})
										}

										if (push_to_shipments)
											newShipments.push(val)

									} catch(e) {
										console.log(e)
									}

								}
							} else {
								newShipments.push(val)
							}

							
							
						})
					}
					const shipment = new Shipment(newShipments)
					//end

					//const shipment = new Shipment(res.data.data)
					
					commit("SET_SHIPMENTS", shipment.all())
					// const shipment = []
					// commit("SET_SHIPMENTS", shipment)
				}
			}
			commit("SET_SHIPMENT_LOADING", false)
		})
		.catch(err => {
			commit("SET_SHIPMENT_LOADING", false)
			if (typeof err.error !== 'undefined') {
				return Promise.reject(err.error)
			} else {
				if (typeof err.message !== 'undefined') {
					return Promise.reject('Token has been expired. Please reload the page.')
				}
			}
		})
	},
	setReset({ commit }, payload) {
		commit("setReset", payload)
	},
}

const mutations = {
	SET_SHIPMENTS: (state, payload) => {
		state.shipments = payload
	},
	SET_SHIPMENT_LOADING: (state, payload) => {
		state.shipment_loading = payload
	},
	setReset: (state, payload) => {
		state.shipments = payload
	},
}

export default {
	state,
	getters,
	actions,
	mutations
}