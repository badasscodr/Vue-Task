<template>
    <v-card class="customCard" v-if="selectedData !== null">
        <v-container>
            <v-row>
                <div class="option-header">
                    <h3 class="schedule-name">
                        {{ selectedData.carrier_name !== '' ? selectedData.carrier_name : ''}}
                    </h3>
                    
                    <span class="selected-status" v-if="selectedData.is_confirmed === 1">
                        <img src="../assets/icons/checkMark.png" class="mr-1" width="12" height="12" alt="">
                        SELECTED
                    </span>
                </div>
            </v-row>

            <v-row>
                <div class="col-sm-5 schedule-col" style="padding: 0 !important;">
                    <div class="schedule-info">
                        <p class="schedule-heading">From & ETD</p>
                        <p class="schedule-data">{{ selectedData.location_from_name}}, {{ selectedData.etd_readable }}</p>
                    </div>

                    <div class="schedule-info">
                        <p class="schedule-heading">To & ETA</p>
                        <p class="schedule-data">{{ selectedData.location_to_name}}, {{ selectedData.eta_readable }}</p>
                    </div>

                    <div class="schedule-info">
                        <p class="schedule-heading">Transit Time</p>
                        <p class="schedule-data">{{ selectedData.transit }} days</p>
                    </div>
                </div>

                <div class="col-sm-7" style="padding: 0 !important;" v-show="selectedData.sell_rates.length > 0">
                    <div v-for="(data, index) in selectedData.sell_rates" :key="index">
                        <div class="schedule-info-prices">
                            <p class="schedule-heading">{{ data.service_name }}</p>
                            <p class="schedule-data">${{ data.amount }}/{{ data.container_size_name }} x {{ data.qty }} = ${{ data.total }}</p>
                        </div>
                    </div>

                    <v-divider class="mt-2"></v-divider>

                    <div class="schedule-info-prices">
                        <p class="total">Total</p>
                        <p class="total">${{ selectedData.total_amount }}</p>
                    </div>
                </div>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
export default {
    name: 'ShipmentSchedulingOptions',
    props: ['selectedData', 'totalAmount'],
    mounted() {
        
    },
}
</script>

<style>
@import '../assets/css/shipments_styles/shipmentSchedule.css';
</style>
