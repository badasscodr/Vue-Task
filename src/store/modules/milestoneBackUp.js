import axios from "axios"
import _ from 'lodash'
import * as shipmentDetails from './shipmentDetails'

const state = {
	milestones: [],
	milestones_loading: true,
	milestonesOtherData: [],
    milestonesOtherDataLoading: false
}

const getters = {
	getMilestonesData: state => state.milestones,
	getMilestonesLoading: state => state.milestones_loading,
}

const actions = {
	fetchMilestones: async ({
		commit,
	}, mbl_num) => {
		// await axios.get(`/milestones/${mbl_num}?standard=true`)
		await axios.get(`/events/${mbl_num}?standard=true`)
			.then(res => {
				if (res.status === 200) {
					if (res.data) {
						// MILESTONES DATA - containers
						let event_groups = {}					
						let new_event_groups = []					
						let getResponse = res.data.containers
						let getKeys = Object.keys(getResponse)				
						let lastFreeDayData = []
						let pickupAppointmentData = []
						let releasedAtTeminalData = []

						// ETA Logs
						let eta_data = res.data.eta_logs
						let eta_logs = []

						if (getKeys.length > 0) {
							getKeys.map(getKey => {
								// milestone
								if (typeof getResponse[getKey].milestones !== 'undefined' && 
									getResponse[getKey].milestones.length > 0) {

									var getData = getResponse[getKey].milestones

									getData.map(data => {
										let { ...otherData } = getResponse[getKey].milestones

										let extraData = Object.keys(otherData)
										let putData = []

										let isArray = false

										if (extraData.length > 0) {
											extraData.map (ed => {
												if (ed == '0') {
													isArray = true
													putData.push(otherData[ed])
												}
											})

											//if not an array
											if ( !isArray )
												putData.push(otherData)
										}									

										// check dates if not null
										let date = null

										// milestone raw dates
										// if (data.attributes.actual_at !== null) {
										// 	date = data.attributes.actual_at
										// } else {
										// 	if (data.attributes.actual_on !== null) {
										// 		date = data.attributes.actual_on
										// 	} else {
										// 		date = null
										// 	}
										// }

										if (data.attributes.timestamp !== null) {
											date = data.attributes.timestamp
										} else {
											date = null
										}

										if (typeof event_groups[data.attributes.event] == 'undefined' ) {
											event_groups[data.attributes.event] = {}

											event_groups[data.attributes.event] = {
												event: data.attributes.event,
												event_name: data.attributes.original_event,
												data: []
											}

											event_groups[data.attributes.event].data.push({
												container_num: getKey,
												date: date,
												data: putData
											})

										} else {
											// find duplicate container
											let findDuplicateEvent = _.find(event_groups[data.attributes.event].data, {
												container_num: getKey
											})

											if (typeof findDuplicateEvent == 'undefined') {
												event_groups[data.attributes.event].data.push({
													container_num: getKey,
													date: date,
													data: putData
												})	
											}
										}
									})
								}

								// last free day
								if(typeof getResponse[getKey].last_free_day !== 'undefined') {
									if (getResponse[getKey].last_free_day !== null) {
										lastFreeDayData.push({
											container_num: getKey,
											date: getResponse[getKey].last_free_day
										})
									} else {
										lastFreeDayData.push({
											container_num: null,
											date: null
										})
									}
																		
									if (typeof event_groups['last_free_day'] == 'undefined' ) {
										event_groups['last_free_day'] = {}

										event_groups['last_free_day'] = {
											event: 'last_free_day',
											event_name: 'last_free_day',
											data: lastFreeDayData
										}
									}									
								}

								// appointment
								if(typeof getResponse[getKey].pickup_appointment_at !== 'undefined') {
									if (getResponse[getKey].pickup_appointment_at !== "") {
										pickupAppointmentData.push({
											container_num: getKey,
											date: getResponse[getKey].pickup_appointment_at
										})
									}

									if (typeof event_groups['appointment'] == 'undefined' ) {
										event_groups['appointment'] = {}

										event_groups['appointment'] = {
											event: 'appointment',
											event_name: 'appointment',
											data: pickupAppointmentData
										}
									}
								}

								// released
								if(typeof getResponse[getKey].released_at_terminal !== 'undefined') {
									releasedAtTeminalData.push({
										container_num: getKey,
										data: getResponse[getKey].holds,
										releasedEvent: getResponse[getKey].released_at_terminal,
										date: null
									})
							
									if (typeof event_groups['released_at_terminal'] == 'undefined' ) {
										event_groups['released_at_terminal'] = {}

										event_groups['released_at_terminal'] = {
											event: 'released_at_terminal',
											event_name: 'released_at_terminal',
											data: releasedAtTeminalData
										}
									}
								}
							})
						}

						if (typeof eta_data !== 'undefined' && eta_data !== null && eta_data.length !== 'undefined' && eta_data.length !== 0) {
							if (eta_data.length == 1) {
								eta_logs.push(eta_data[0])
							} else if (eta_data.length > 1) {
								eta_logs.push(eta_data[eta_data.length - 1])
							}
						}

						let get_event_groups_data = Object.keys(event_groups)

						if (get_event_groups_data.length > 0) {
							get_event_groups_data.map (gegd => {
								let { data } = event_groups[gegd]

								let eventName = gegd.replace("container.transport.","")

								// find if there are dates that are null -> set completed to false if there are
								let isCompleted = false						
								let isReleased = false	
								let findDateNullIndex = _.findIndex(data, e => (e.date == null))
								let findReleasedFalseIndexInTerminal = _.findIndex(data, e => (e.releasedEvent == false))
								let findReleasedDataNull = _.findIndex(data, e => (typeof e.data !== 'undefined' && e.data !== null && e.data.length !== 'undefined' && e.data.length == 0)) 
								let className = ''

								if (findDateNullIndex === -1) {
									isCompleted = true
								} else {
									isCompleted = false
								}
								
								if (gegd == 'released_at_terminal') {
									if (findReleasedFalseIndexInTerminal === -1) {
										isReleased = true
										isCompleted = true
									} else {
										isReleased = false
										isCompleted = false
									}

									if (findReleasedDataNull === -1) {
										className = 'released has-data'
									} else {
										className = 'released has-null'
									}
								}

								new_event_groups.push({
									event: gegd,
									event_name: eventName,
									isCompleted: isCompleted,
									isReleased: isReleased,
									class: className,
									other_data: data
								})
							})
						}

						let newMilestoneData = []
						
						if (shipmentDetails.default.state !== 'undefined' && shipmentDetails.default.state !== null) {
							let { shipments_details } = shipmentDetails.default.state

							if (shipments_details !== 'undefined') {
								let bookingCreated = shipments_details.created_at !== 'undefined' 
													? shipments_details.created_at : null
								
								let bookingConfirmed = shipments_details.booking_confirmed == 1 
													? shipments_details.booking_confirmed_at : null
								
								let emptyGatedOut = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='empty_out')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='empty_out')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='empty_out')) !== 'undefined') ? _.find(new_event_groups, e => (e.isCompleted==true)).isCompleted : false,
								}

								let fullGatedIn = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='full_in')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='full_in')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='full_in')) !== 'undefined') ? _.find(new_event_groups, e => (e.isCompleted==true)).isCompleted : false
								}

								let vesselLoaded = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='vessel_loaded')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='vessel_loaded')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='vessel_loaded')) !== 'undefined') ? _.find(new_event_groups, e => (e.isCompleted==true)).isCompleted : false
								}

								let released = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='released_at_terminal')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='released_at_terminal')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='released_at_terminal')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='released_at_terminal')).isCompleted : false,
									isReleased: (typeof _.find(new_event_groups, e => (e.event_name=='released_at_terminal')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='released_at_terminal')).isReleased : false,
									class: (typeof _.find(new_event_groups, e => (e.event_name=='released_at_terminal')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='released_at_terminal')).class : 'released',
								}

								let eta_updated = {
									data: eta_logs.length !== 0 ? eta_logs : null,
								}

								let transshipmentArrived = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='transshipment_arrived')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='transshipment_arrived')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='transshipment_arrived')) !== 'undefined') ? _.find(new_event_groups, e => (e.isCompleted==true)).isCompleted : false
								}

								let transshipmentDischarged = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='transshipment_discharged')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='transshipment_discharged')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='transshipment_discharged')) !== 'undefined') ? _.find(new_event_groups, e => (e.isCompleted==true)).isCompleted : false
								}

								let transshipmentLoaded = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='transshipment_loaded')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='transshipment_loaded')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='transshipment_loaded')) !== 'undefined') ? _.find(new_event_groups, e => (e.isCompleted==true)).isCompleted : false
								}

								let transshipmentDeparted = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='transshipment_departed')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='transshipment_departed')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='transshipment_departed')) !== 'undefined') ? _.find(new_event_groups, e => (e.isCompleted==true)).isCompleted : false
								}

								let vesselDischarged = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='vessel_discharged')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='vessel_discharged')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='vessel_discharged')) !== 'undefined') ? _.find(new_event_groups, e => (e.isCompleted==true)).isCompleted : false
								}

								let lastFreeDay = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='last_free_day')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='last_free_day')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='last_free_day')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='last_free_day')).isCompleted : false
								}

								let pickupAppointment = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='appointment')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='appointment')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='appointment')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='appointment')).isCompleted : false
								}

								let fullGatedOut = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='full_out')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='full_out')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='full_out')) !== 'undefined') ? _.find(new_event_groups, e => (e.isCompleted==true)).isCompleted : false
								}

								let emptyGatedIn = {
									data: (typeof _.find(new_event_groups, e => (e.event_name=='empty_in')) !== 'undefined') ? _.find(new_event_groups, e => (e.event_name=='empty_in')).other_data : null,
									isCompleted: (typeof _.find(new_event_groups, e => (e.event_name=='empty_in')) !== 'undefined') ? _.find(new_event_groups, e => (e.isCompleted==true)).isCompleted : false
								}

								newMilestoneData = [
									{
										event_name: 'Booking Created',
										event: 'booking_created',
										date: bookingCreated,
										isCompleted: bookingCreated !== null ? true : false,
										isShow: 'd-flex',
										refName: 'booking-created',
										className: 'booking-created'
									},
									{
										event_name: 'Booking Confirmed',
										event: 'booking_confirmed',
										date: bookingConfirmed,
										isCompleted: bookingConfirmed !== null ? true : false,
										isShow: 'd-flex',
										refName: 'booking-confirmed',
										className: 'booking-confirmed'
									},
									{
										event_name: 'Empty Gated Out',
										event: 'empty_out',
										date: null,
										data: emptyGatedOut.data,
										isCompleted: emptyGatedOut.isCompleted,
										// isShow: emptyGatedOut.data !== null ? 'd-flex' : 'd-none',
										isShow: 'd-flex',
										refName: 'empty_out',
										className: 'empty_out'
									},
									{
										event_name: 'Full Gated In',
										event: 'full_in',
										date: null,
										data: fullGatedIn.data,
										isCompleted: fullGatedIn.isCompleted,
										// isShow: fullGatedIn.data !== null ? 'd-flex' : 'd-none',
										isShow: 'd-flex',
										refName: 'full_in',
										className: 'full_in'
									},
									{
										event_name: 'Vessel Loaded',
										event: 'vessel_loaded',
										date: null,
										data: vesselLoaded.data,
										isCompleted: vesselLoaded.isCompleted,
										// isShow: vesselLoaded.data !== null ? 'd-flex' : 'd-none',
										isShow: 'd-flex',
										refName: 'departed',
										className: 'departed'
									},
									{
										event_name: 'Released',
										date: null,
										event: 'released',
										data: released.data,
										isReleased: released.data !== null ? released.isReleased : null,
										isCompleted: released.isCompleted,
										isShow: 'd-flex',
										refName: 'released',
										className: released.class
									},
									{
										event_name: 'ETA Updated',
										event: 'eta_logs',
										data: eta_updated.data,
										isShow: eta_updated.data !== null ? 'd-flex' : 'd-none',
										refName: 'eta_logs',
										className: 'eta_logs'
									},
									{
										event_name: 'Transshipment Arrived',
										event: 'transshipment_arrived',
										date: null,
										data: transshipmentArrived.data,
										isCompleted: transshipmentArrived.isCompleted,
										isShow: transshipmentArrived.data !== null ? 'd-flex' : 'd-none',
										refName: 'transshipment_arrived',
										className: 'check transshipment_arrived'
									},
									{
										event_name: 'Transshipment Discharged',
										event: 'transshipment_discharged',
										date: null,
										data: transshipmentDischarged.data,
										isCompleted: transshipmentDischarged.isCompleted,
										isShow: transshipmentDischarged.data !== null ? 'd-flex' : 'd-none',
										refName: 'transshipment_discharged',
										className: 'check transshipment_discharged'
									},
									{
										event_name: 'Transshipment Loaded',
										event: 'transshipment_loaded',
										date: null,
										data: transshipmentLoaded.data,
										isCompleted: transshipmentLoaded.isCompleted,
										isShow: transshipmentLoaded.data !== null ? 'd-flex' : 'd-none',
										refName: 'transshipment_loaded',
										className: 'check transshipment_loaded'
									},
									{
										event_name: 'Transshipment Departed',
										event: 'transshipment_departed',
										date: null,
										data: transshipmentDeparted.data,
										isCompleted: transshipmentDeparted.isCompleted,
										isShow: transshipmentDeparted.data !== null ? 'd-flex' : 'd-none',
										refName: 'transshipment_departed',
										className: 'check transshipment_departed'
									},
									{
										event_name: 'Discharged',
										event: 'vessel_discharged',
										date: null,
										data: vesselDischarged.data,
										isCompleted: vesselDischarged.isCompleted,
										// isShow: vesselDischarged.data !== null ? 'd-flex' : 'd-none',
										isShow: 'd-flex',
										refName: 'vessel_discharged',
										className: 'vessel_discharged'
									},
									{
										event_name: 'Last Free Day',
										event: 'last_free_day',
										date: null,
										data: lastFreeDay.data,
										isCompleted: lastFreeDay.isCompleted,
										isShow: 'd-flex',
										refName: 'last_free_day',
										className: 'last_free_day'
									},
									{
										event_name: 'Pickup Appointment',
										event: 'appointment',
										date: null,
										data: pickupAppointment.data,
										isCompleted: pickupAppointment.isCompleted,
										isShow: pickupAppointment.data !== null && pickupAppointment.data.length !== 0 ? 'd-flex' : 'd-none',
										refName: 'appointment',
										className: 'appointment'
									},
									{
										event_name: 'Full Gated Out',
										event: 'full_out',
										data: fullGatedOut.data,
										isCompleted: fullGatedOut.isCompleted,
										// isShow: fullGatedOut.data !== null ? 'd-flex' : 'd-none',
										isShow: 'd-flex',
										refName: 'full_out',
										className: 'full_out'
									},
									{
										event_name: 'Empty Gated In',
										event: 'empty_in',
										data: emptyGatedIn.data,
										isCompleted: emptyGatedIn.isCompleted,
										// isShow: emptyGatedIn.data !== null ? 'd-flex' : 'd-none',
										isShow: 'd-flex',
										refName: 'empty_in',
										className: 'empty_in'
									},
								]	
							}
						}

						console.log(newMilestoneData);

						// commit("SET_MILESTONES", new_event_groups)
						commit("SET_MILESTONES", newMilestoneData)
					}
				}
			})
			.catch(err => {
				return Promise.reject(err)
			})
	},
	fetchOtherMilestoneData: async ({
		commit
	}, mbl_num) => {
		await axios.get(`/terminal49/shipment/${mbl_num}`)
		.then(res => {
			if (res.status === 200) {
				let getResponse = res.data

				let event_groups = []

				if (getResponse !== 'undefined' && getResponse.length !== 0) {
					let containersLists = getResponse.containers
					let getKeys = Object.keys(containersLists)					

					if (getKeys !== null && getKeys.length > 0) {
						getKeys.map(getKey => {
							if (typeof event_groups[getKey] == 'undefined' ) {
								event_groups.push({
									container_num: getKey,
									holds: containersLists[getKey].holds,
									lastFreeDay: containersLists[getKey].last_free_day,
									relasedAtTerminal: containersLists[getKey].released_at_terminal
								})

							} else {
								// find duplicate container
								let findDuplicateEvent = _.find(event_groups[getKey], {
									container_num: getKey
								})

								if (typeof findDuplicateEvent == 'undefined') {
									event_groups.push({
										container_num: getKey,
										holds: containersLists[getKey].holds,
										lastFreeDay: containersLists[getKey].last_free_day,
										relasedAtTerminal: containersLists[getKey].released_at_terminal
									})
								}
							}
						})
					}
				}

				commit('SET_MILESTONES_OTHER_DATA', event_groups)
			}
		}).catch(err => {
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
	SET_MILESTONES: (state, payload) => {
		state.milestones = payload
	},
	SET_MILESTONES_LOADING: (state, payload) => {
		state.milestones_loading = payload
	},
	SET_MILESTONES_OTHER_DATA: (state, payload) => {
		state.milestonesOtherData = payload
	},
}

export default {
	state,
	getters,
	actions,
	mutations,
	methods
}