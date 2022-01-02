<template>
    <div class="shipment-info">
        <v-container fluid class="cont-fluid-wrapper">
            <div class="row shipment-info-wrapper">
                <div class="col-xs-12 col-sm-12 col-md-6">
                    <div class="row" v-if="getDetails.customer !== 'undefined' && getDetails.customer !== null 
                        && getDetails.customer.company_name !== 'undefined'">
                        <h3 class="building-name">
                            {{ getDetails.customer.company_name }}
                        </h3>
                    </div>

                    <div class="row" v-if="getDetails.location_from_name !== null || getDetails.etd !== null">
                        <span class="heading shipment-info-content">{{`FROM & ETD`}}</span>

                        <p class="shipment-info-content">
                            <span class="heading-place" v-if="getDetails.location_from_name !== 'undefined' && getDetails.      location_from_name !== '' && getDetails.location_from_name !== null">
                                {{ getDetails.location_from_name }},
                            </span>

                            <span class="heading-date" v-if="shipment_etd !== null">
                                {{ shipment_etd }}
                            </span>
                        </p>
                    </div>

                    <div class="row" v-if="getDetails.location_to_name !== null || getDetails.eta !== null">
                        <span class="heading shipment-info-content">{{`TO & ETA`}}</span>

                        <p class="shipment-info-content">
                            <span class="heading-place" v-if="getDetails.location_to_name !== 'undefined' && getDetails.      location_to_name !== '' && getDetails.location_to_name !== null">
                                {{ getDetails.location_to_name }},
                            </span>

                            <span class="heading-date" v-if="shipment_eta !== null">
                                {{ shipment_eta }}
                            </span>
                        </p>
                    </div>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6">
                    <div class="row" v-if="getDetails.carrier !== 'undefined' && getDetails.carrier !== null && getDetails.carrier !== ''">
                        <span class="heading shipment-info-content">Carrier</span>

                        <p class="heading-place shipment-info-content">
                            {{ getDetails.carrier }}
                        </p>
                    </div>

                    <div class="row" v-if="getDetails.vessel !== 'undefined' && getDetails.vessel !== null">
                        <span class="heading shipment-info-content">Vessel</span>

                        <p class="heading-place shipment-info-content">
                            {{ getDetails.vessel }}
                        </p>
                    </div>

                    <div class="row" v-if="getDetails.mbl_num !== 'undefined' && getDetails.mbl_num !== null">
                        <span class="heading shipment-info-content">MBL#</span>

                        <p class="heading-place shipment-info-content">
                            {{ getDetails.mbl_num }}
                        </p>
                    </div>

                    <!-- <div class="row" v-if="getDetails.type !== 'undefined' && getDetails.type !== null && getDetails.type !== 'null'">
                        <span class="heading shipment-info-content">Shipment Type</span>

                        <p class="heading-place shipment-info-content">
                            {{ getDetails.type }}
                        </p>
                    </div> -->
                </div>
            </div>
        </v-container>

        <!-- SUPPLIERS -->
        <ShipmentSupplier 
            :getDetails="getDetails"
            :isMobile="isMobile"
            :shipment_status="shipment_status"
            :getShipmentTerms="getShipmentTerms"
        />
        
        <!-- CONTAINERS -->
        <MileStoneContainers 
            :getDetails="getDetails"
            :isMobile="isMobile" 
            :getShipmentContainerSizes="getShipmentContainerSizes"
        />

        <ShipmentSchedulingOptions 
            :getDetails="getDetails"
            :isMobile="isMobile"    
        />
    </div>
</template>

<script>
import MileStoneContainers from "@/components/MileStoneContainers.vue";
import ShipmentSupplier from "@/components/ShipmentSupplier.vue";
import ShipmentSchedulingOptions from '@/components/ShipmentSchedulingOptions';
import moment from 'moment'
// import { mapActions } from "vuex";

export default {
    props: ['getDetails', 'isMobile', 'shipment_status', 'getShipmentTerms', 'getShipmentContainerSizes'],
    components: {
        MileStoneContainers,
        ShipmentSupplier,
        ShipmentSchedulingOptions
    },
    methods: {
        // ...mapActions(["fetchMilestones"]),
    },
    data: () => ({
        shipment_eta: null,
        shipment_etd: null,
        incoterms: [],
        mbl_num: null,
    }),
    async mounted() {
        this.shipment_id = this.$route.params.id    
        this.shipment_eta = this.getDetails.eta !== null ? moment.utc(this.getDetails.eta).format('MMM DD, YYYY') : null
        this.shipment_etd = this.getDetails.etd !== null ? moment.utc(this.getDetails.etd).format('MMM DD, YYYY') : null
        // this.mbl_num = this.getDetails.mbl_num !== null ? this.getDetails.mbl_num : null

        // try {
        //     await this.fetchMilestones(this.mbl_num)
        //     this.fetchMilestonesLoading = false
        // } catch (e) {
        //     console.log(e);
        // }
                
        //set current page
        this.$store.dispatch("page/setPage", "shipments")
    },
    updated() {
        
    },
    created() {
        
    },
    computed: {
        
    }
}
</script>

<style lang="scss">
/* @import '../assets/css/shipments_styles/shipmentInfo.css'; */
@import '../assets/scss/pages_scss/shipment/shipmentInfo.scss';
</style>