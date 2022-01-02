<template>
    <div class="milestone-shipments-wrapper">
        <v-stepper v-model="e13" vertical>
            <div class="preloader" v-if="loading">
                <v-progress-circular :size="40" color="#0171a1" indeterminate>
                </v-progress-circular>
            </div>

            <div v-if="!loading && milestonesData.length > 0" class="milestone-content">
                <div v-for="(item, index) in milestonesData" 
                    :key="index" class="milestone-items">
                    
                    <v-stepper-step 
                        class="custom-vue-stepper"
                        :class="`${item.isShow} ${item.className} ${(item.event == 'released_at_terminal' && item.noHolds) ? 'no-holds' : 'has-data'}`"
                        :step="index + 1"
                        color="#0171A1"
                        :complete="item.isCompleted">
                        
                        <i aria-hidden='true' :class="`${item.className} custom-padding-left`"></i>

                        <span v-if="item.event !== 'released_at_terminal' && item.event !== 'eta_logs'">
                            {{ item.event_name }}
                        </span>

                        <span v-if="item.event == 'eta_logs'" style="color: #EB9B26 !important;">
                            {{ item.event_name }}
                        </span>

                        <div :class="getStatus(item)" class="released-event" v-if="item.event == 'released_at_terminal'">
                            <span>{{ item.event_name }}</span>

                            <span class="status no-holds" v-if="item.noHolds && item.data !== null">
                                N/A
                            </span>

                            <span class="status no" v-if="!item.noHolds && item.data !== null && !item.allContainersReleased">
                                <img src="../../../assets/icons/released-no.svg" width="10px" height="10px" alt="" class="mr-1"> No
                            </span>

                            <span class="status yes" v-if="item.allContainersReleased && item.isCompleted">
                                <img src="../../../assets/icons/checkMark.png" alt="" width="12px" height="12px" class="mr-1"> Yes
                            </span>
                        </div>
                    </v-stepper-step>

                    <v-stepper-content 
                        :step="index + 1"
                        v-if="item.event === 'booking_created' || item.event === 'booking_confirmed' && item.date !== null">
                        <small>{{ convertDate(item.event_name, item.date) }}</small>
                    </v-stepper-content>                    

                    <v-stepper-content
                        :step="index + 1"
                        v-if="(typeof item.data !== 'undefined' && item.event !== 'released_at_terminal' && item.event !== 'eta_logs')">

                        <div v-for="(data, index) in item.data" 
                            :key="index">

                            <div class="milestone-container-wrapper">
                                <div class="milestone-container-num">
                                    <p>{{ data.container_num }}</p>
                                </div>

                                <div class="milestone-container-dates">
                                    <span>
                                        <small v-if="data.date !== null">{{ convertDate(item.event_name, data.date) }}</small>
                                        <small v-if="item.event == 'last_free_day' && data.date == null">N/A</small>
                                    </span>
                                    <small style="marginLeft: 5px" v-if="isContainerDateComplete(data.date) !== false">
                                        <img class="completed-icon" src="../../../assets/icons/checkMark.png" width="10px" height="10px" v-if="item.event !== 'last_free_day'" />
                                    </small>
                                </div>
                            </div>                                      

                            <!-- Only for transshipments -->
                            <!-- <div v-if="getEventName(item.event)" class="milestone-relationship-wrapper">
                                <div v-for="(otherData, index) in data.data" :key="index" class="milestone-relationship-item">
                                    <div class="milestone-container-wrapper transshipments-other-data my-1">
                                        <p>Location:</p>
                                        <small>{{ otherData.relationships.location.data.type }}</small>
                                    </div>

                                    <div class="milestone-container-wrapper transshipments-other-data mt-1">
                                        <p>Vessel:</p>
                                        <small>{{ otherData.relationships.vessel.data.type }}</small>
                                    </div>

                                    <div class="separator"></div>
                                </div>
                            </div> -->
                        </div>
                    </v-stepper-content>

                    <v-stepper-content 
                        v-if="item.event === 'released_at_terminal'" 
                        :step="index + 1">

                        <div v-for="(newItem, index) in item.data" 
                            :key="index" 
                            class="milestone-container-wrapper released"
                            v-show="!item.noHolds && !item.allContainersReleased">

                            <div class="milestone-container-num">
                                <p>{{ newItem.container_num }}</p>
                            </div>

                            <div class="milestone-container-status" 
                                v-if="(typeof newItem.data !== 'undefined' && newItem.data !== null &&
                                    newItem.data.length !== 'undefined' && newItem.data.length > 0)">

                                <div class="status" v-for="(status, index) in newItem.data" :key="index">
                                    <span>{{ `${status.name} ${status.status}` }}</span>
                                </div>
                            </div>

                            <!-- If no holds -->
                            <div class="milestone-container-status"
                            v-if="(typeof newItem.data !== 'undefined' && newItem.data !== null &&                              
                            newItem.data.length !== 'undefined' && newItem.data.length == 0)">

                                <span class="status yes" v-if="newItem.releasedEvent">
                                    <img src="../../../assets/icons/checkMark.png" alt="" width="12px" height="12px" class="mr-1"> Yes
                                </span>

                                <span class="status no" v-if="!newItem.releasedEvent">
                                    <img src="../../../assets/icons/released-no.svg" alt="" width="12px" height="12px" class="mr-1"> No
                                </span>
                            </div>                            
                        </div>
                    </v-stepper-content>

                    <v-stepper-content v-if="item.event === 'eta_logs'" :step="index + 1">
                        <div class="milestone-container-wrapper released">
                            <div class="milestone-container-num">
                                <p>The ETA of the Shipment has been updated from 
                                    {{ etaDateConvert(item.log.old_eta) }} to 
                                    {{ etaDateConvert(item.log.eta) }} </p>
                            </div>
                            <div>
                                <small>{{ convertDate(item.event_name, item.log.created_at) }}</small>
                            </div>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content v-if="(item.data == null)" :step="index + 1">
                        <span> </span>
                    </v-stepper-content>
                </div>
            </div>
        </v-stepper>
    </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
    name: "Milestones",
    props: [
        "getDetails",
        "status",
        "departedLocation",
        "arrivedLocation",
        "loading",
    ],
    components: {},
    data: () => ({
        e13: 0,
        containersLists: [],
        counter: 0
    }),
    methods: {
        convertDate(name, date) {
            let dateVal = null;

            if (name !== "Last Free Day") {
                if (date !== null) {
                    dateVal = moment.utc(date).format("hh:mmA, MMM DD, YYYY");
                } else {
                    return "";
                }
            } else {
                if (date !== null) {
                    dateVal = moment.utc(date).format("MMM DD, YYYY");
                }
            }

            return dateVal;
        },
        isContainerDateComplete(date) {
            if (date !== null) {
                if (moment(date).format("x") < moment().format("x")) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        etaDateConvert(date) {
            let dateVal = null;

            if (date !== null) {
                dateVal = moment.utc(date).format("ddd MMM DD, YYYY");
            }

            return dateVal;
        },
        getStatus(item) {
            if (item !== "undefined") {
                if (item.event == 'released_at_terminal') {                    
                    if (!item.noHolds && !item.allContainersReleased) {
                        return 'both-f no'
                    }

                    if (item.noHolds && !item.allContainersReleased) {
                        return 'no-holds'
                    }

                    if (item.allContainersReleased) {
                        return 'yes'
                    }
                }
            }
        },
        moveArrayIndex(array, fromIndex, toIndex){
            array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
        },
        getEventName(name) {
            if (name !== null) {
                if (name.includes('transshipment_') || name.includes('vessel_')) {
                    return true
                }
            }
        }
    },
    computed: {
        ...mapGetters(["getMilestonesData", "getMilestonesOtherEvents"]),
        milestonesData() {
            let data = []

            if (typeof this.getMilestonesData !== 'undefined' && 
                this.getMilestonesData !== null && 
                this.getMilestonesData.length !== 'undefined' 
                && this.getMilestonesData.length > 0) {

                data = this.getMilestonesData.filter(v => {
                    return v.isShow !== 'd-none'
                })

                if (typeof data !== 'undefined') {
                    data.map((val, index) => {
                        if (val.event == 'booking_created') {
                            // move the booking created always on first
                            this.moveArrayIndex(data, index, 0)
                        }

                        if (val.event == 'booking_confirmed') {
                            // move the booking confirmed always after booking created
                            let findBookingCreated = _.findIndex(data, e => (e.event == 'booking_created'))
                            let newBookingConfirmedIndex = findBookingCreated + 1
                            this.moveArrayIndex(data, index, newBookingConfirmedIndex)
                        }

                        if (val.event == 'released_at_terminal') {
                            let containerData = val.data
                            val.allContainersReleased = false
                            val.noHolds = true

                            if (typeof containerData !== 'undefined' && containerData!==null ) {                                
                                if (Array.isArray(containerData) && containerData.length > 0) {
                                    val.noHolds = false
                                    let containerLength = containerData.length
                                    let containersReleasedCount = 0
                                    let noHoldsData = 0

                                    containerData.map ( (c, k)=> {
                                        val.data[k].yesStatus = false

                                        if ( typeof c.releasedEvent!=='undefined' && c.releasedEvent){
                                            containersReleasedCount++
                                            val.data[k].yesStatus = true
                                        }

                                        if ( typeof c.releasedEvent!=='undefined' && !c.releasedEvent){
                                            if (typeof c.data !== 'undefined' && c.data !== null && c.data.length !== 'undefined' && c.data.length == 0) {
                                                noHoldsData++
                                            }                                            
                                        }                                       
                                    })

                                    if (containersReleasedCount === containerLength ) 
                                        val.allContainersReleased = true

                                    if (noHoldsData === containerLength) {
                                        val.noHolds = true
                                    }
                                }
                            }
                        }                        

                        if (val.event == 'last_free_day') {
                            // move the last free day after the released at terminal event
                            let findTerminalEvent = _.findIndex(data, e => (e.event == 'released_at_terminal'))
                            let newLastFreeDayIndex = findTerminalEvent + 1
                            this.moveArrayIndex(data, index, newLastFreeDayIndex)
                        }
                        
                        if (val.event == 'empty_out') {
                            // move empty out before full gated in                            
                            let findFullInEvent = _.findIndex(data, e => (e.event == 'full_in'))
                            let newEmptyOutIndex = (findFullInEvent - 1) + 1
                            this.moveArrayIndex(data, index, newEmptyOutIndex)
                        }
                    })
                }
            }
            
            return data
        }
    },
    mounted() {},
    updated() {},
};
</script>

<style>
@import "../../../assets/css/shipments_styles/milestones.css";
</style>
