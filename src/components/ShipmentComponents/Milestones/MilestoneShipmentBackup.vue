<template>
    <div class="milestone-shipments">
        <v-stepper v-model="e13" vertical>
            <div v-if="!loading && getMilestonesData.length > 0" class="milestone-content">
                <div v-for="(item, index) in getMilestonesData"
                    :key="index"
                    class="milestone-items">
          
                    <v-stepper-step
                        :ref="item.refName"
                        :class="`custom-vue-stepper ${item.isShow} ${item.className}`"
                        :step="index + 1"
                        color="#0171A1"
                        :complete="item.isCompleted">

                        <i aria-hidden='true' :class="`${item.className} custom-padding-left`"></i>

                        <span v-if="item.event_name !== 'Released' && item.event_name !== 'ETA Updated'">
                            {{ item.event_name }}
                        </span>

                        <span v-if="item.event_name == 'ETA Updated'" style="color: #EB9B26 !important;">
                            {{ item.event_name }}
                        </span>

                        <div class="released-event" v-if="item.event_name == 'Released'">
                            <span>{{ item.event_name }}</span>
                            <span class="status" :class="getStatusClass(item)" v-if="getStatusClass(item) == 'no'">
                               <img src="../assets/icons/released-no.svg" width="10px" height="10px" alt="" class="mr-1"> No                              
                            </span>

                            <span class="status" :class="getStatusClass(item)" v-if="getStatusClass(item) == 'yes'">
                                <img src="../assets/icons/checkMark.png" alt="" width="12px" height="12px" class="mr-1"> Yes
                            </span> 
                        </div>
                    </v-stepper-step>

                    <div>
                        <div v-if="item.event_name == 'Booking Created' || item.event_name == 'Booking Confirmed'">
                            <v-stepper-content :step="index + 1">
                                <small>{{ convertDate(item.date) }}</small>
                            </v-stepper-content>
                        </div>

                        <div>
                            <!-- <div v-if="item.event_name == 'Departed' || item.event_name == 'Arrived'"> -->
                            <!-- <div v-if="item.event_name == 'Arrived'">
                                <v-stepper-content :step="index + 1">
                                    <p class="information"> {{ item.location }} </p>
                                    <small>{{ convertDate(item.date) }}</small>
                                </v-stepper-content>
                            </div> -->

                            <!-- <div v-if="item.event_name == 'Departed'">
                                <v-stepper-content :step="index + 1">
                                    <p class="information"> {{ item.location }} </p>
                                    <small>{{ convertDate(item.date) }}</small>
                                </v-stepper-content>
                            </div> -->

                            <div v-if="item.event_name == 'Released'">
                                <div v-for="(data, index) in item.data" :key="index">
                                    <v-stepper-content :step="index + 1">
                                        <div class="milestone-container-wrapper released">
                                            <div class="milestone-container-num">
                                                <p>{{ data.container_num }}</p>
                                                
                                                <small style="marginLeft: 5px" v-if="data.releasedEvent !== false">
                                                    <img class="completed-icon" src="../assets/icons/checkMark.png" width="10px" height="10px" />
                                                </small>
                                            </div>

                                            <div class="milestone-container-status">
                                                <div class="status" v-for="(status, index) in data.data" :key="index">
                                                    <span>{{ `${status.name} ${status.status}` }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </v-stepper-content>
                                </div>
                            </div>
                        </div>

                        <div v-if="(typeof item.data !== 'undefined' && 
                                    item.event_name !== 'Released' && 
                                    item.event_name !== 'ETA Updated')">
                            <div v-for="(data, index) in item.data" :key="index">
                                <v-stepper-content :step="index + 1">
                                    <div class="milestone-container-wrapper" v-if="data.container_num !== null">
                                        <div class="milestone-container-num">
                                            <p>{{ data.container_num }}</p>
                                        </div>

                                        <div class="milestone-container-dates" v-if="data.date !== null">
                                            <small>{{ convertDate(item.event_name, data.date) }}</small>
                                            <small style="marginLeft: 5px" v-if="isContainerDateComplete(data.date) !== false">
                                                <img class="completed-icon" src="../assets/icons/checkMark.png" width="10px" height="10px" />
                                            </small>
                                        </div>
                                    </div>
                                </v-stepper-content>
                            </div>
                        </div>

                        <div v-if="(typeof item.data !== 'undefined' && item.event_name == 'ETA Updated')">
                            <div v-for="(data, index) in item.data" :key="index">
                                <v-stepper-content :step="index + 1">
                                    <div class="milestone-container-wrapper released" v-if="data.container_num !== null">
                                        <div class="milestone-container-num">
                                            <p>The ETA of the Shipment has been updated from 
                                                {{ etaDateConvert(data.old_eta) }} to 
                                                {{ etaDateConvert(data.eta) }} </p>
                                        </div>
                                        <div>
                                            <small>{{ convertDate(item.event_name, data.created_at) }}</small>
                                        </div>
                                    </div>
                                </v-stepper-content>
                            </div>
                        </div>

                        <div v-if="(item.data == null)">
                            <v-stepper-content :step="index + 1">
                                <span> </span>
                            </v-stepper-content>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!loading && getMilestonesData.length == 0"  class="milestone-empty-wrapper">
                <div class="milestone-empty">
                    <img src="../assets/icons/alert-icon.svg" alt="" width="25px" height="25px">
                    
                    <div>
                        <h4>No Updates Yet</h4>
                        <p>It seems this shipment doesn’t have any update yet. 
                            Updates on shipment status will be shown here as milestones once available.</p>
                    </div>
                </div>
            </div>

            <div class="preloader" v-if="loading">
                <v-progress-circular
                    :size="40"
                    color="#0171a1"
                    indeterminate >
                </v-progress-circular>
            </div>
        </v-stepper>
    </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import _ from 'lodash'

export default {
    props: ["getDetails", "status", "departedLocation", "arrivedLocation", "loading"],
    data: () => ({
        e13: 0,
        containersLists: [],
    }),
    methods: {
        convertDate(name, date) {
            let dateVal = null

            if (name !== 'Last Free Day' && name !== 'Pickup Appointment') {
                if (date !== null) {
                    dateVal = moment.utc(date).format("hh:mmA, MMM DD, YYYY")
                } else {
                    return ''
                }
            } else {
                if (date !== null) {
                    dateVal = moment.utc(date).format("MMM DD, YYYY")
                }
            }

            return dateVal
        },
        isContainerDateComplete(date) {
            if (date !== null) {
                if (moment(date).format("x") < moment().format("x")) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        etaDateConvert(date) {
            let dateVal = null

            if (date !== null) {
                dateVal = moment.utc(date).format("ddd MMM DD, YYYY")
            }

            return dateVal
        },
        getStatusClass(item) {
            console.log(item);

            if (item !== 'undefined') {
                if (item.isCompleted == false) {
                   let findReleasedDataNull = _.findIndex(item, e => (typeof e.data !== 'undefined' && e.data !== null && e.data.length !== 'undefined' && e.data.length == 0))

                    if (findReleasedDataNull === -1) {
                        return 'no'
                    } else {
                        return 'has-null'
                    }
                } else {
                    return 'yes'
                }
            }
        },
        getStatus(item) {
            if (item !== "undefined") {
                if (item.event == 'released_at_terminal') {
                    if (typeof item.noHolds !== 'undefined') {
                        if (item.data !== null && item.noHolds) {
                            return 'no'
                        }
                    }

                    if (typeof item.allContainersReleased !== 'undefined') {
                        if (item.data !== null && item.allContainersReleased) {
                            return 'yes'
                        }
                    }

                    if (!item.noHolds && !item.allContainersReleased) {
                        return 'both-f'
                    }
                }
            }
        },
    },
    computed: {
        ...mapGetters(["getMilestonesData"]),
    },
    mounted() {
        
    },
    updated() {
    },
};
</script>

<style>
@import "../assets/css/shipments_styles/milestoneShipments.css";
</style>
