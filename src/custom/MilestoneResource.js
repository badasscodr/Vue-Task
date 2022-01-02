import moment from 'moment'
// import _ from 'lodash'

const MilestoneResource = class {
    #MILESTONE = []

    constructor(data) {
        this.#MILESTONE = data
    }

    #CAST = p => {
        p.created_at_date = p.created_at !== 'undefined' && p.created_at !== null ? moment.utc(p.created_at).format("hh:mmA, MMM DD, YYYY") : ""

        p.booking_confirmed_at_date = p.booking_confirmed_at !== null ? 
        moment.utc(this.booking_confirmed_at).format("hh:mmA, MMM DD, YYYY") : "";

        p.etd_date = p.etd !== null ? moment.utc(p.etd).format("hh:mmA, MMM DD, YYYY") : "";

        if (p.booking_confirmed === 1 && p.cancelled === 0 ) {
            if (moment(p.etd).format("x") > moment().format("x")) {
                p.departed_status_done = false
                p.departed_date = p.etd !== "" ? "Estimated at " + moment.utc(p.etd).format("hh:mmA, MMM DD, YYYY") : ""
            }
            if (moment(p.etd).format("x") < moment().format("x")) {
                p.departed_status_done = true
                p.departed_date = moment.utc(p.etd).format("hh:mmA, MMM DD, YYYY")
            }
        } else {
            p.departed_status_done = false
            p.departed_date = p.etd !== null ? "Estimated at " + moment.utc(p.etd).format("hh:mmA, MMM DD, YYYY") : ""
        }

        if (moment(p.eta).format("x") > moment().format("x")) {
            p.arrival_status_done = false
            p.arrival_date = p.eta !== "" && p.eta !== null ? "Estimated at " + moment.utc(moment(p.eta)).format("hh:mmA, MMM DD, YYYY") : "";
        }
        if (moment(p.eta).format("x") < moment().format("x")) {
            p.arrival_status_done = true
            p.arrival_date = moment.utc(moment(p.eta)).format("hh:mmA, MMM DD, YYYY");
        }

        return p
    }

    #PROCESS_DATA = data => {
        if (data !== 'undefined' && data !== null) {
            data = this.#CAST(data)

            return {
                bookingCreated: {
                    name: 'Booking Created',
                    date: data.created_at_date,
                    isDone: data.created_at_date !== "" ? true : false,
                    refName: "bookingCreated",
                    className: "booking-created"
                },
                bookingConfirmed: {
                    name: 'Booking Confirmed',
                    date: data.booking_confirmed_at_date,                        
                    isDone: data.booking_confirmed == 1 ? true : false,
                    refName: "bookingConfirmed",
                    className: "booking-confirmed"
                },
                emptyGatedOut: {
                    name: "Empty Gated Out",
                    containers: [],
                    refName: "emptyGatedOut",
                    className: "emptyGatedOut",
                    identifier: "container-based-data"
                },
                fullGatedIn: {
                    name: "Full Gated In",
                    containers: [],
                    refName: "fullGatedIn",
                    className: "fullGatedIn",
                    identifier: "container-based-data"
                },
                departed: {
                    name: "Departed",
                    location: data.location_from_name,
                    date: data.etd_date,
                    isDone: data.departed_status_done !== '' ? data.departed_status_done : null,
                    refName: "departed",
                    className: "departed",
                },
                customCleared: {
                    name: "Custom Cleared",
                    date: null,
                    isDone: false,
                    refName: "customCleared",
                    className: "custom-cleared",
                },
                freightReleased: {
                    name: "Freight Released",
                    date: null,
                    isDone: false,
                    refName: "freightReleased",
                    className: "freight-released",
                },
                arrived: {
                    name: "Arrived",
                    location: data.location_to_name,
                    date: data.arrival_date,
                    isDone: data.arrival_status_done,
                    refName: "arrived",
                    className: "arrived",
                },
                discharged: {
                    name: "Discharged",
                    location: null,
                    date: null,
                    isDone: false,
                    refName: "discharged",
                    className: "discharged",
                    identifier: "container-based-data"
                },
                fullGatedOut: {
                    name: "Full Gated Out",
                    location: null,
                    date: null,
                    isDone: false,
                    refName: "fullGatedOut",
                    className: "fullGatedOut",
                    identifier: "container-based-data"
                },
                emptyGatedIn: {
                    name: "Empty Gated In",
                    location: null,
                    date: null,
                    isDone: false,
                    refName: "emptyGatedIn",
                    className: "emptyGatedIn",
                    identifier: "container-based-data"
                },
            }
        }

        return data
    }

    all() {
        return this.#PROCESS_DATA(this.#MILESTONE);
    }
    milestones() {
        return this.#MILESTONE;
    }

}

export default MilestoneResource