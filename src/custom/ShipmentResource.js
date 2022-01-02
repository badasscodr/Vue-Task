import moment from 'moment'
import _ from 'lodash'

const Shipment = class {
    #SHIPMENTS = []

    constructor(data) {
        this.#SHIPMENTS = data
    }

    #CAST = p => {

        // p.eta = moment.utc(p.eta)
        //     .local()
        //     .format('MMM D, YYYY')
        // p.etd = moment.utc(p.etd)
        //     .local()
        //     .format('MMM D, YYYY')

        p.eta_in_good_format = moment.utc(p.eta).format('MMM DD, YYYY')
        p.etd_in_good_format = moment.utc(p.etd).format('MMM DD, YYYY')

        p.eta = moment.utc(p.eta).format('MM/DD/YYYY')
        p.etd = moment.utc(p.etd).format('MM/DD/YYYY')


        p.eta_timestamp = moment(p.eta).format('x')
        p.original_shipment_status = p.shipment_status


        p.location_from_name =
            p.location_from_name == null ||
                typeof p.location_from_name == 'undefined'
                ? 'Not specified'
                : p.location_from_name
        p.location_to_name =
            p.location_to_name === null ||
                typeof p.location_to_name === 'undefined'
                ? 'Not specified'
                : p.location_to_name

        const setTo = moment.utc(moment()).format('YYYY-MM-DD HH:mm:ss')
        const setFrom = moment
            .utc(moment(p.eta))
            .format('YYYY-MM-DD HH:mm:ss')

        // check if the eta is already past 10 days
        p.eta_diff_from_today = moment.duration(
            moment(setTo).diff(setFrom)
        )

        // check now how many days since eta
        p.eta_diff_from_today_as_days = p.eta_diff_from_today.asDays()

        // detect old shipment with shipment status completed
        if (p.shipment_status !== 'Completed') {
            if (p.booking_confirmed === 0 && p.cancelled === 0) {
                p.shipment_status = 'Pending Approval'
                p.original_shipment_status = 'Pending Approval'
            }

            if (p.booking_confirmed === 1) {
                p.shipment_status = 'Shipments'

                if (p.status_v2 !== null) {
                    p.original_shipment_status = p.status_v2
                } else {
                    if (moment(p.etd).format('x') > moment().format('x')) {
                        p.original_shipment_status = 'Awaiting Departure'
                    }
    
                    if (moment(p.etd).format('x') < moment().format('x')) {
                        p.original_shipment_status = 'In Transit'
                    }
                }                         

                if (p.status_v2 === 'Past last free day') {
                    p.shipment_status = 'Shipments'
                }
            }   

            if (parseInt(p.eta_diff_from_today_as_days) >= 10) {
                p.shipment_status = 'Completed'
                
                if (p.status_v2 !== null) {
                    p.original_shipment_status = p.status_v2
                    // p.original_shipment_status = 'Completed'
    
                    if (p.status_v2 == 'Past last free day') {
                        p.shipment_status = 'Shipments'
                    }
                } else {
                    p.original_shipment_status = 'Completed'
                }
            }
        }        

        // set the shipment status to completed if the milestone cancelled is true
        if (p.cancelled === 1) {
            /* if (parseInt(p.eta_diff_from_today_as_days) >= 10) {
              p.shipment_status = 'Completed'
              p.original_shipment_status = 'Completed'
            } */

            p.shipment_status = 'NA'
            // p.shipment_status = 'Cancelled'
        }

        // e
        p.po_num_concatonate = ''
        p.po_num_list_array = []
        p.container_number = []
        p.ams_num = []
        p.hbl_num = []
        p.cargo_ready_date = []

        // old code
        // p.containers_group =
        //     typeof p.containers_group !== 'undefined' &&
        //         p.containers_group !== '' &&
        //         p.containers_group !== null &&
        //         JSON.parse(p.containers_group.length) > 0
        //         ? JSON.parse(p.containers_group)
        //         : []

        // if (p.containers_group !== 'undefined' &&
        //     p.containers_group !== '' &&
        //     JSON.parse(p.containers_group.length) > 0) {

        //     p.containers_group.map((item) => {
        //         if (item.container_num !== '' && item.container_num !== null) {
        //             p.container_number.push(item.container_num)
        //         }
        //     })
        // }

        // remove duplicate containers - p
        if (p.containers_group !== '' && 
            p.containers_group !== null && 
            JSON.parse(p.containers_group.length) > 0) {
            p.containers_group = _.uniqBy(
                JSON.parse(p.containers_group),
                (e) => e.id
            )                

            p.containers_group.map((item) => {
                if (item.container_num !== '' && item.container_num !== null) {
                    p.container_number.push(item.container_num)
                }
            })
        }

        if (p.suppliers_group !== '' &&
            p.suppliers_group !== null &&
            JSON.parse(p.suppliers_group.length) > 0 ) {
                p.suppliers_group = _.uniqBy(
                    JSON.parse(p.suppliers_group),
                    (e) => e.po_num
                )

                p.suppliers_group.map((pp) => {
                    if (pp.po_num !== '' && pp.po_num != null) {
                        p.po_num_concatonate += pp.po_num + ', '
                        // let stringUpdate = pp.po_num.replace(/,/g, ", ")
                        p.po_num_list_array.push(pp.po_num)

                        if (p.po_num_list_array !== 'undefined') {
                            p.po_num_list_array.map((po_single, key) => {
                                let po_explode = po_single.split(',')
                                let po_final = po_single

                                if (po_explode.length > 0) {
                                    po_explode.map((v, k) => {
                                        po_explode[k] = v.trim()
                                    })
                                    po_final = po_explode.join(', ')
                                }
                                p.po_num_list_array[key] = po_final
                            })
                        }
                    }

                    if (pp.ams_num !== '' && pp.ams_num !== null) {
                        p.ams_num.push(pp.ams_num)
                    }

                    if (pp.hbl_num !== '' && pp.hbl_num !== null) {
                        p.hbl_num.push(pp.hbl_num)
                    }

                    if (pp.cargo_ready_date !== '' && pp.cargo_ready_date !== null) {
                        p.cargo_ready_date.push(moment.utc(pp.cargo_ready_date).format('MM/DD/YYYY'))
                    }
                })

            if (p.po_num_concatonate !== '') {
                p.po_num_concatonate = p.po_num_concatonate.substr(
                    0,
                    p.po_num_concatonate.length - 2
                )
            }
        }

        p.schedules_group_bookings =
            typeof p.schedules_group_bookings !== 'undefined' &&
                p.schedules_group_bookings !== '' &&
                p.schedules_group_bookings !== null &&
                JSON.parse(p.schedules_group_bookings.length) > 0
                ? JSON.parse(p.schedules_group_bookings)
                : []

        if (p.schedules_group_bookings !== 'undefined' && p.schedules_group_bookings !== '') {
            p.mode = (typeof _.find(p.schedules_group_bookings, e => (e.is_confirmed==1)) !== 'undefined')
                ? _.find(p.schedules_group_bookings, e => (e.is_confirmed==1)).mode
                : null
        }

        return p
    }

    #PROCESS_DATA = data => {

        if (data.length > 0) {
            data = data.map((shipment) => {
                shipment = this.#CAST(shipment)

                return {
                    eta_sortable: moment(shipment.eta).format('x'),
                    ReferenceID: shipment.shifl_ref,
                    Departure: {
                        location: shipment.location_from_name,
                        etd: shipment.etd_in_good_format === "Invalid date" ? "Not Specified" : shipment.etd_in_good_format,
                    },
                    Departure_Text: shipment.location_from_name + "<br>" + (shipment.etd_in_good_format === "Invalid date" ? "Not Specified" : shipment.etd_in_good_format),
                    Arrival: {
                        location: shipment.location_to_name,
                        eta: shipment.eta_in_good_format === "Invalid date" ? "Not Specified" : shipment.eta_in_good_format
                    },
                    Suppliers: shipment.suppliers_name,
                    PO: shipment.po_num_concatonate == "" ? "Not Specified" : shipment.po_num_concatonate,
                    Status: shipment.original_shipment_status,
                    TabStatus: shipment.shipment_status,
                    id: shipment.id,
                    mode: shipment.mode,
                    po_list: shipment.po_num_list_array.length == 0 ? null : shipment.po_num_list_array,
                    container_num_list: shipment.container_number,
                    hbl_num: shipment.hbl_num.length == 0 ? null : shipment.hbl_num,
                    mbl_num: shipment.mbl_num !== null ? shipment.mbl_num : '',
                    ams_num: shipment.ams_num.length == 0 ? null : shipment.ams_num,
                    cargo_ready_date: shipment.cargo_ready_date.length == 0 ? null : shipment.cargo_ready_date,
                    type: shipment.type,
                    // FlagDep: "cn",
                    // FlagArr: "au"
                }
            })

        }

        return data
    }

    all() {
        return this.#PROCESS_DATA(this.#SHIPMENTS);
    }
    pending() {
        return this.#SHIPMENTS;
    }
    completed() {
        return this.#SHIPMENTS;
    }
    shipments() {
        return this.#SHIPMENTS;
    }

}

export default Shipment
