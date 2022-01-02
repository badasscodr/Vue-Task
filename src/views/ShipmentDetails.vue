<template>
    <v-container fluid>        
        <div class="shipment-details-wrapper">
           <div class="preloader" v-if="getShipmentDetailsLoading">
                <v-progress-circular
                    :size="40"
                    color="#0171a1"
                    indeterminate >
                </v-progress-circular>
           </div>

            <v-row v-if="!getShipmentDetailsLoading">
                <v-col class="first-col" sm="12" md="8">
                    <div class="details-breadcrumbs">
                        <router-link to="/shipments" class="shipment-link">
                            Shipments
                        </router-link>

                        <span class="right-chevron"> 
                            <img src="../assets/images/right_chevron.svg" alt="" srcset="" width="7px"> 
                        </span>

                        <p class="shipment-ref" v-if="getShipmentDetails.shifl_ref !== 'undefined' && getShipmentDetails.shifl_ref !== null">
                            {{ getShipmentDetails.shifl_ref }}
                        </p>
                    </div>

                    <div id="top-header" v-resize="onResize">
                        <div class="reference-status">
                            <h2 v-if="getShipmentDetails.shifl_ref !== 'undefined' && getShipmentDetails.shifl_ref !== null">Reference
                                #{{ getShipmentDetails.shifl_ref }}
                            </h2>

                            <button class="btn btn-status-white" v-if="shipment_status !== null"> 
                                {{ shipment_status }}
                            </button>
                        </div>

                        <div class="place-wrapper" style="height:30px">
                            <div class="place-content">
                                <p class="heading" style="margin-right: 25px" v-if="getShipmentDetails.type !== 'undefined' && getShipmentDetails.type !== null && getShipmentDetails.type !== 'null'">

                                    <span class="info-title">SHIPMENT TYPE: </span> 

                                    <img src="../assets/icons/ocean-mode.svg" alt="" v-if="shipment_mode == 'Ocean'"> 
                                    <img src="../assets/images/airplane.svg" alt="" v-if="shipment_mode == 'Air'"> 

                                    {{ getShipmentDetails.type }}
                                </p>

                                <div class="carrier-wrapper" v-if="getShipmentDetails.carrier !== 'undefined' && getShipmentDetails.carrier !== ''">
                                    <p class="heading">                                        
                                        <span class="info-title">CARRIER: </span> {{ getShipmentDetails.carrier }}
                                    </p>
                                </div>
                            </div>

                            <p class="heading" v-if="!isMobile && location_to_with_details !== null">
                                <span style="color: #4A4A4A !important;">
                                    {{ location_to_with_details }}
                                </span>                           
                            </p>
                        </div>

                        <div class="mobile-status" v-if="isMobile && location_to_with_details !== null">          
                            <p class="heading">
                                <span style="color: #4A4A4A !important;">
                                    {{ location_to_with_details }}
                                </span>  
                            </p>
                        </div>
                    </div>

                    <div class="documents-wrapper" style="background:white; margin: 10px 0; border: 1px solid #E1ECF0; position:relative; border-radius: 4px;">
                        <v-tabs mobile-breakpoint="500" class="customTab" height="64px">
                            <v-tab v-for="n in tabs" :key="n" v-on:click="setMainTab(n)" :class="n">
                                {{ n }}
                            </v-tab>
                        </v-tabs>

                        <div v-if="currentTab == 'Shipment Info'">
                            <ShipmentInfo 
                                :getDetails="getShipmentDetails"
                                :isMobile="isMobile"
                                :shipment_status="shipment_status"
                                :getShipmentTerms="getShipmentTerms"
                                :getShipmentContainerSizes="getShipmentContainerSizes"
                            />
                        </div>
                        <div v-if="currentTab == 'Documents'">
                            <ShipmentDocuments :getDetails="getShipmentDetails" />
                        </div>
                        <div v-if="isMobile && currentTab == 'Milestones'">
                            <Map 
                                v-show="this.getShipmentDetails.ais_link !== ''"
                                :getDetails="getShipmentDetails" />

                            <Milestones 
                                :loading="getMilestonesNewLoading"
                                :getDetails="getShipmentDetails" 
                                :status="shipment_status"
                                :departedLocation="getShipmentDetails.location_from_name"
                                :arrivedLocation="getShipmentDetails.location_to_name"
                            />
                        </div>
                    </div>
                </v-col>

                <v-col class="second-col" sm="12" md="4" v-if="!isMobile">
                    <Map v-show="this.getShipmentDetails.ais_link !== ''"
                        :getDetails="getShipmentDetails" />
                    
                    <v-card class="pa-5" outlined tile>
                        <div>
                            <h2 class="milestone-name">Milestones</h2>
                            
                            <Milestones 
                                :loading="getMilestonesNewLoading"
                                :getDetails="getShipmentDetails" 
                                :status="shipment_status"
                                :departedLocation="getShipmentDetails.location_from_name"
                                :arrivedLocation="getShipmentDetails.location_to_name"
                            />
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script>
import Milestones from "@/components/ShipmentComponents/Milestones/Milestones.vue";
import ShipmentInfo from "@/components/ShipmentInfo.vue";
import ShipmentDocuments from "@/components/ShipmentDocuments.vue";
import Map from '@/components/Map.vue'
import { mapActions, mapGetters } from "vuex";
import moment from 'moment'
import _ from 'lodash'

export default {
    components: {
        Milestones,
        ShipmentInfo,
        ShipmentDocuments,
        Map
    },
    data: () => ({
        tabs: ["Shipment Info", "Documents", "Milestones"],
        tabs2: ["Shipments"],
        currentTab: "Shipment Info",
        currentTabMileStone : "Shipments",        
        isMobile: false,
        shipment_id: null,
        title: '',
        detailsLoading: true,
        location_to_with_details: null,
        shipment_status: null,
        term_id: null,
        items: [
            {
                text: "Shipments",
                disabled: false,
                href: "/shipments",
            },
            {
                text: '#',
                disabled: true,
                href: "breadcrumbs_link_1",
            },
        ],
        fetchMilestoneLoading: true,
        mbl_num: '',
        shipment_mode: '',
    }),
    methods:{
        ...mapActions(["fetchShipmentDetails", "fetchMilestones", "setMilestonesNewLoading", "setMilestonesOtherEvents", "fetchTerms", "fetchContainers"]),
        setMainTab(value){
            this.currentTab = value
        },
        setMilestoneTab(value){
            this.currentTabMileStone = value
        },
        onResize() {
            if (window.innerWidth < 960) {
                this.isMobile = true;
            } else {
                this.isMobile = false;
            }
        },
        isDisabled(value) {
            if(value == 'Container' && this.shipment_status == 'Pending Approval') {
                this.isDisabled = true
            }
        },
        async loadShipmentMetaData() {
            this.setMilestonesOtherEvents([])
            this.setMilestonesNewLoading(true)
            
            // this.fetchTerms()
            // this.fetchContainers()
            
            try {                
                await this.fetchShipmentDetails(this.shipment_id)
                this.detailsLoading = false
                this.title = this.getShipmentDetails.shifl_ref

                let etaDetails = this.getShipmentDetails.eta !== null 
                                ? ', ETA ' + moment.utc(this.getShipmentDetails.eta).format('MMM DD, YYYY') 
                                : ''
                let to_name = this.getShipmentDetails.location_to_name !== null && this.getShipmentDetails.location_to_name !== ""
                                ? this.getShipmentDetails.location_to_name : "No Name"
                this.location_to_with_details = to_name !== "No Name" ? `${to_name}${etaDetails}` : ''
                this.mbl_num = this.getShipmentDetails.mbl_num !== null ? this.getShipmentDetails.mbl_num : null

                // get shipment mode
                this.getShipmentDetails.schedules_group_bookings = 
                    typeof this.getShipmentDetails.schedules_group_bookings !== 'undefined' &&
                    this.getShipmentDetails.schedules_group_bookings !== '' &&
                    this.getShipmentDetails.schedules_group_bookings !== null &&
                    JSON.parse(this.getShipmentDetails.schedules_group_bookings.length) > 0
                    ? JSON.parse(this.getShipmentDetails.schedules_group_bookings)
                    : []

                if (this.getShipmentDetails.schedules_group_bookings !== 'undefined' && this.getShipmentDetails.schedules_group_bookings !== '') {
                    this.shipment_mode = (typeof _.find(this.getShipmentDetails.schedules_group_bookings, e => (e.is_confirmed==1))!=='undefined') ? _.find(this.getShipmentDetails.schedules_group_bookings, e => (e.is_confirmed==1)).mode : null               
                }

                // get shipment status
                const setTo = moment.utc(moment()).format('YYYY-MM-DD HH:mm:ss')
                const setFrom = moment
                    .utc(moment(this.getShipmentDetails.eta))
                    .format('YYYY-MM-DD HH:mm:ss')

                // check if the eta is already past 10 days
                let eta_diff_from_today = moment.duration(
                    moment(setTo).diff(setFrom)
                )

                // check now how many days since eta
                let eta_diff_from_today_as_days = eta_diff_from_today.asDays()

                if (this.getShipmentDetails.shipment_status !== 'Completed') {
                    if (this.getShipmentDetails.booking_confirmed === 0 && this.getShipmentDetails.cancelled === 0) {
                        this.shipment_status = 'Pending Approval'
                    }

                    if (this.getShipmentDetails.booking_confirmed === 1) {
                        if (this.getShipmentDetails.status_v2 !== null) {
                            if (this.getShipmentDetails.status_v2 == 'In transit - hold') {
                                this.shipment_status = 'In Transit - Pending Release'
                            } else {                                
                                this.shipment_status = this.getShipmentDetails.status_v2
                            }
                        } else {
                            if (moment(this.getShipmentDetails.etd).format('x') > moment().format('x')) {
                                this.shipment_status = 'Awaiting Departure'
                            }
            
                            if (moment(this.getShipmentDetails.etd).format('x') < moment().format('x')) {
                                this.shipment_status = 'In Transit'
                            }
                        }
                    }

                    if (parseInt(eta_diff_from_today_as_days) >= 10) {
                        if (this.getShipmentDetails.status_v2 !== null) {
                            this.shipment_status = this.getShipmentDetails.status_v2
                        } else {
                            this.shipment_status = 'Completed'
                        }
                    }
                }
            } catch(e) {
                console.log(e)
                this.detailsLoading = false
            }

            try {
                if (this.mbl_num !== '') {
                    await this.fetchMilestones(this.mbl_num)                
                    this.fetchMilestoneLoading = false
                } else {
                    this.setMilestonesNewLoading(false)
                }
            } catch (e) {
                console.log(e)
                this.setMilestonesNewLoading(false)
                this.fetchMilestoneLoading = false
            }

            //set current page
            this.$store.dispatch("page/setPage", "shipments")
        },
    },
    async mounted() {
        this.shipment_id = this.$route.params.id
        this.loadShipmentMetaData()
    },
    async updated() {
        if (this.shipment_id!==this.$route.params.id) {
            this.shipment_id = this.$route.params.id
            this.loadShipmentMetaData()
        }
    },
    created() {},
    computed: {
        ...mapGetters(["getShipmentDetails", "getShipmentDetailsLoading", "getMilestonesNewLoading", "getShipmentTerms", "getShipmentContainerSizes"]),
    },
    watch: {
        title() {
            this.items[1].text = this.title
        }
    }
};
</script>

<style lang="scss">
@import '../assets/scss/pages_scss/shipment/shipmentDetails.scss';
</style>
