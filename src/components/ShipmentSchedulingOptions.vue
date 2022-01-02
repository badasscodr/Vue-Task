<template>
    <div class="shipment-info schedule-options" v-if="getScheduleOptions.length !== 0">        
        <v-divider class="shipment-info-divider"></v-divider>
        
        <v-container fluid class="cont-fluid-wrapper">
            <h3 class="schedule-title">Scheduling Options</h3>

             <div class="no-data-preloader" v-if="getScheduleOptionsLoading">
                <v-progress-circular
                    :size="40"
                    color="#0171a1"
                    indeterminate
                    v-if="getScheduleOptionsLoading">
                </v-progress-circular>
            </div>

            <div v-if="!getScheduleOptionsLoading && getScheduleOptions !== 'undefined' && getScheduleOptions !== null">
                <!-- IF ALREADY SELECTED SCHEDULE -->
                <div v-if="getScheduleOptions.current_selected_schedule !== null">
                    <ShipmentScheduleView 
                        :selectedData="getScheduleOptions.current_selected_schedule" />
                </div>

                <!-- IF STILL NEEDS TO CHOOSE SCHEDULE -->
                <div v-if="getScheduleOptions.current_selected_schedule == null && getScheduleOptions.results !== null">
                    <ShipmentScheduleChoose 
                        :scheduleOptionsData="getScheduleOptions.results"
                        :shipmentId="shipment_id" />
                </div>
            </div>
        </v-container>
    </div>
</template>

<script>
import ShipmentScheduleChoose from '@/components/ShipmentScheduleChoose';
import ShipmentScheduleView from '@/components/ShipmentScheduleView';
import { mapActions, mapGetters } from "vuex";

export default {
    name: 'ShipmentSchedulingOptions',
    props: ['getDetails', 'isMobile'],
    components: {
        ShipmentScheduleChoose,
        ShipmentScheduleView
    },
    data: () => ({
        shipment_id: null,
        loading: true,
        schedule_id: null
    }),
    methods: {
        ...mapActions(["fetchScheduleOptions"]),
    },
    async mounted() {       
        this.shipment_id = this.$route.params.id

        try {            
            await this.fetchScheduleOptions(this.shipment_id)
            this.loading = false
        } catch(e) {
            console.log(e)
            this.loading = false
        }
    },
    computed: {
        ...mapGetters(["getScheduleOptions", "getScheduleOptionsLoading"]),
    },
    updated() {}
}
</script>

<style>
@import '../assets/css/shipments_styles/shipmentSchedule.css';
</style>