import axios from "axios"
//import { filter } from "vue/types/umd"
// import { has } from "core-js/fn/reflect"
// import router from '../../router/index'
import Shipment from './../../custom/ShipmentResource'
// import MilestoneDetails from './../../custom/MilestoneResource'
//import _ from 'lodash'
import moment from 'moment'


const state = {
	shipments_details: [],
	shipment_details_loading: true,
	shipment_terms: null,
	shipment_containers_sizes: null,
	shipment_milestones: []
}

const getters = {
	getShipmentDetails: state => state.shipments_details,
	getShipmentDetailsLoading: state => state.shipment_details_loading,
	getShipmentTerms: state => state.shipment_terms,
	getShipmentContainerSizes: state => state.shipment_containers_sizes,
	getMilestonesDetails: state => state.shipment_milestones
}

const actions = {	
	fetchShipmentDetails: async({
		commit
	}, id) => {
		commit("SET_SHIPMENT_DETAILS_LOADING", true)
		await axios.get(`/shipment/${id}`)
		// await axios.get(`/shipmentt/${id}`)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					let d = res.data.data

					//s
					/*if (typeof d.schedules_group!=='undefined' && d.schedules_group !== null 
						&& d.schedules_group !== "" && d.schedules_group !== "[]") {

						let mergeSchedules = JSON.parse(d.schedules_group)
						let mergeToSchedulesBookings = JSON.parse(d.schedules_group_bookings)
						
						let newSchedules = []

						if (mergeSchedules !== null && mergeToSchedulesBookings !== null) {
							if (mergeSchedules.length > 0) {
								mergeSchedules.map(ms => {
									newSchedules.push(ms.id)
								})
							}
				
							if (mergeToSchedulesBookings.length > 0) {
								mergeToSchedulesBookings.map(ms => {
									if (newSchedules.indexOf(ms.id)==-1)
										newSchedules.push(ms.id)
								})
							}
							
							let newFinalSchedules = [];
				
							if (newSchedules.length > 0) {
								newSchedules.map (ns => {
									let setId = null
									if (mergeSchedules.length > 0) {
										mergeSchedules.map(ms => {
											if (ns==ms.id) {
												newFinalSchedules.push(ms)
												setId = ms.id
											}
										})
									}
				
									if (mergeToSchedulesBookings.length > 0) {
										mergeToSchedulesBookings.map(ms => {
											if (ns==ms.id && setId!=ms.id) {
												newFinalSchedules.push(ms)
											}
										})
									}
								})
							}
				
							if (newFinalSchedules.length > 0) {
								let has_confirmed = false;							
								let selectedSchedule = []
	
								newFinalSchedules.map(newFinalSchedule => {
									if (typeof newFinalSchedule.is_confirmed !== 'undefined' && newFinalSchedule.is_confirmed == 1) {
										if(!has_confirmed) {
											has_confirmed = true
											selectedSchedule = newFinalSchedule
										}
									}
								})
				
								if (!has_confirmed) {
									selectedSchedule = newFinalSchedules[0]
								}
								
								axios.get(`/terminal/${selectedSchedule.location_from}`).then( response => {
									if (response.status == 200) {
										if (typeof response.data!=='undefined') {
											// d.location_from_name = response.data.data.name
											d.location_from_name_bookings = response.data.data.name
										}
				
										axios.get(`/terminal/${selectedSchedule.location_to}`).then( responseSecond => {
											if (responseSecond.status==200) {
												if (typeof responseSecond.data!=='undefined') {
													// d.location_to_name = responseSecond.data.data.name
													d.location_to_name_bookings = responseSecond.data.data.name
												}
												
												if (typeof d.location_from_name!=='undefined') {
													let etd = moment.utc(d.etd).format('ddd MMM DD, YYYY')
													// d.location_from_with_etd = `${d.location_from_name}, ${etd}`
													d.location_from_with_etd = `${etd}`
												}
												
												if (typeof d.location_to_name!=='undefined') {
													let eta = moment.utc(d.eta).format('ddd MMM DD, YYYY')
													let etaDetails = moment.utc(d.eta).format('MMM DD, YYYY')
													// d.location_to_with_eta = `${d.location_to_name}, ${eta}`
													d.location_to_with_eta = `${eta}`
													d.location_to_with_eta_details = `${d.location_to_name}, ETA ${etaDetails}`
												}
												
												// shipmentDetailsUpdate = new Shipment(d)
												// commit("SET_SHIPMENTS_DETAILS", shipmentDetailsUpdate.all())	
												// return Promise.resolve('ok')
											}	
										})
									}	
								})
							}
						}
						
						
					}*/

					var shipmentDetailsUpdate = new Shipment(d)
					commit("SET_SHIPMENTS_DETAILS", shipmentDetailsUpdate.all())
					
					// var milestoneDetails = new MilestoneDetails(d)
					// // commit("SET_MILESTONES_DETAILS", milestoneDetails.all())

					// var getKeys = Object.keys(milestoneDetails.all())
					// var setData = []

					// getKeys.map(getKey => {
					// 	setData.push({
					// 		...milestoneDetails.all()[getKey]
					// 	})
					// })

					// // console.log(setData);
					// commit("SET_MILESTONES_DETAILS", setData)
				}
			}

			commit("SET_SHIPMENT_DETAILS_LOADING", false)
		})
		.catch(err => {
			commit("SET_SHIPMENT_DETAILS_LOADING", false)
			return Promise.reject(err)
		})
	},
	fetchTerms: async({
		commit
	}) => {
		await axios.get(`/incoterms`)
		.then(res => {
			if(res.status === 200) {
				if (res.data) {
					let value = res.data.data
					commit("SET_SHIPMENT_TERMS", value)
				}
			}
		})
		.catch(err => {
			return Promise.reject(err)
		})
	},
	fetchContainers: async({
		commit
	}) => {
		await axios.get(`/container-sizes`)
		.then(res => {
			if(res.status === 200) {
				if (res.data) {
					let value = res.data.data
					commit("SET_SHIPMENT_CONTAINERS_SIZES", value)
				}
			}
		})
		.catch(err => {
			return Promise.reject(err)
		})
	},

	fetchShipmentDetailsBack: async ({
		commit
	}, id) => {
		commit("SET_SHIPMENT_DETAILS_LOADING", true)
		
		await axios.get(`/shipment/${id}`)
		.then(res => {
			if (res.status === 200) {
				if (res.data) {
					let d = res.data.data

					//s
					if (typeof d.schedules_group!=='undefined' && d.schedules_group !== null) {
						let mergeSchedules = JSON.parse(d.schedules_group)
						let mergeToSchedulesBookings = JSON.parse(d.schedules_group_bookings)
						
						let newSchedules = []
			
						if (mergeSchedules.length > 0) {
							mergeSchedules.map(ms => {
								newSchedules.push(ms.id)
							})
						}
			
						if (mergeToSchedulesBookings.length > 0) {
							mergeToSchedulesBookings.map(ms => {
								if (newSchedules.indexOf(ms.id)==-1)
									newSchedules.push(ms.id)
							})
						}
						
						let newFinalSchedules = [];
			
						if (newSchedules.length > 0) {
							newSchedules.map (ns => {
								let setId = null
								if (mergeSchedules.length > 0) {
									mergeSchedules.map(ms => {
										if (ns==ms.id) {
											newFinalSchedules.push(ms)
											setId = ms.id
										}
									})
								}
			
								if (mergeToSchedulesBookings.length > 0) {
									mergeToSchedulesBookings.map(ms => {
										if (ns==ms.id && setId!=ms.id) {
											newFinalSchedules.push(ms)
										}
									})
								}
							})
						}
			
						if (newFinalSchedules.length > 0) {
							let has_confirmed = false
							let selectedSchedule = {}

							newFinalSchedules.map(newFinalSchedule => {
								if (typeof newFinalSchedule.is_confirmed!=='undefined' &&newFinalSchedule.is_confirmed==1) {
									if(!has_confirmed) {
										has_confirmed = true
										selectedSchedule = newFinalSchedule
									}
								}
							})
			
							if (!has_confirmed) {
								selectedSchedule = newFinalSchedules[0]
							}
							
							axios.get(`/terminal/${selectedSchedule.location_from}`).then( response => {
								if (response.status==200) {
									if (typeof response.data!=='undefined') {
										d.location_from_name = response.data.data.name
									}
			
									axios.get(`/terminal/${selectedSchedule.location_to}`).then( responseSecond => {
										if (responseSecond.status==200) {
											if (typeof responseSecond.data!=='undefined') {
												d.location_to_name = responseSecond.data.data.name
											}
											
											if (typeof d.location_from_name!=='undefined') {
												let etd = moment.utc(d.etd).format('ddd MMM DD, YYYY')
												// d.location_from_with_etd = `${d.location_from_name}, ${etd}`
												d.location_from_with_etd = `${etd}`
											}
											
											if (typeof d.location_to_name!=='undefined') {
												let eta = moment.utc(d.eta).format('ddd MMM DD, YYYY')
												let etaDetails = moment.utc(d.eta).format('MMM DD, YYYY')
												// d.location_to_with_eta = `${d.location_to_name}, ${eta}`
												d.location_to_with_eta = `${eta}`
												d.location_to_with_eta_details = `${d.location_to_name}, ETA ${etaDetails}`
											}
											
											
											let shipmentDetailsUpdate = new Shipment(d)
											commit("SET_SHIPMENTS_DETAILS", shipmentDetailsUpdate.all())	

											console.log(d)
										}	
									})
								}	
							})
						}
					}
					//e
					
					// let shipmentDetails = new Shipment(res.data.data)
					// commit("SET_SHIPMENTS_DETAILS", shipmentDetails.all())	
				}
			}

			commit("SET_SHIPMENT_DETAILS_LOADING", false)
		})
		.catch(err => {
			console.log(err)
		})
	}
}

const methods = {
	testing: () => {
		alert('testing')
	}
}
const mutations = {
	SET_SHIPMENTS_DETAILS: (state, payload) => {
		state.shipments_details = payload
	},
	SET_SHIPMENT_DETAILS_LOADING: (state, payload) => {
		state.shipment_details_loading = payload
	},
	SET_SHIPMENT_TERMS: (state, payload) => {
		state.shipment_terms = payload
	},
	SET_SHIPMENT_CONTAINERS_SIZES: (state, payload) => {
		state.shipment_containers_sizes = payload
	},
	SET_MILESTONES_DETAILS: (state, payload) => {
		state.shipment_milestones = payload
	}
}

export default {
	state,
	getters,
	actions,
	mutations,
	methods
}