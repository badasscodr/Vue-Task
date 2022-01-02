<template>
    <div>
        <v-card
            class="customCard"
            v-for="(data, index) in scheduleOptionsData"
            :key="index" >
            <v-container>
                <div class="shipment-choose">
                    <v-row>
                        <div class="option-header">
                            <h3 class="schedule-name">
                                {{ data.carrier_name }}
                            </h3>

                            <span class="selected-status"> CHEAPEST </span>
                        </div>
                    </v-row>
                    
                    <v-row>
                        <div class="col-sm-5 schedule-col" style="padding: 0 !important" >
                            <div class="schedule-info">
                                <p class="schedule-heading">From & ETD</p>
                                <p class="schedule-data">
                                    {{ data.location_from_name }},
                                    {{ data.etd_readable }}
                                </p>
                            </div>

                            <div class="schedule-info">
                                <p class="schedule-heading">To & ETA</p>
                                <p class="schedule-data">
                                    {{ data.location_to_name }},
                                    {{ data.eta_readable }}
                                </p>
                            </div>

                            <div class="schedule-info" v-for="(secData, index) in data.legs" :key="index">
                                <p class="schedule-heading">To & ETA</p>
                                <p class="schedule-data">
                                    {{ secData.location_to_name }},
                                    {{ secData.eta_readable }}
                                </p>
                            </div>

                            <div class="schedule-info">
                                <p class="schedule-heading">Transit Time</p>
                                <p class="schedule-data">{{ data.transit }} days</p>
                            </div>
                        </div>

                        <div class="col-sm-7" style="padding: 0 !important" v-show="data.sell_rates.length > 0">
                            <div v-for="(sellrates, index) in data.sell_rates" :key="index">
                                <div class="schedule-info-prices">
                                    <p class="schedule-heading">
                                        {{ sellrates.service_name }}
                                    </p>
                                    <p class="schedule-data">
                                        ${{ sellrates.amount }}/{{
                                            sellrates.container_size_name
                                        }}
                                        x {{ sellrates.qty }} = ${{
                                            sellrates.total
                                        }}
                                    </p>
                                </div>
                            </div>  

                            <v-divider class="mt-2"></v-divider>

                            <div class="schedule-info-prices">
                                <p class="total">Total</p>
                                <p class="total">${{ data.total_amount }}</p>
                            </div>                                                    
                        </div>

                        <div class="schedule-info-button">
                            <v-btn
                                color="primary"
                                class="choose-this"
                                @click="confirmItem(data)">
                                
                                <span>Choose This</span>
                            </v-btn>
                        </div>
                    </v-row>
                </div>
            </v-container>
        </v-card>
        
        <ConfirmDialog
            :dialogData.sync="dialog"
            :carrier="currentSelectedSchedule !== null ? currentSelectedSchedule.carrier_name : ''"
            @confirm="handleChoose"
            :loading.sync="loading"
        />
    </div>
</template>

<script>
import { mapActions } from "vuex";
import ConfirmDialog from "./ShipmentComponents/SchedulingOptions/ConfirmDialog.vue";
import iziToast from "izitoast";

export default {
    name: "ShipmentSchedulingOptions",
    props: ["scheduleOptionsData"],
    components: {
        ConfirmDialog,
    },
    data: () => ({
        shipment_id: null,
        loading: false,
        dialog: false,
        currentSelectedSchedule: null,
    }),
    mounted() {
        this.shipment_id = this.$route.params.id;
    },
    methods: {
        ...mapActions(["sendConfirmSchedule", "fetchScheduleOptions"]),
        notificationSuccess(name) {
            iziToast.success({
                theme: 'dark',
                message: `<h4 style="font-weight: 500 !important; color: #fff !important;">Booking has been confirmed with ${name}.</h4>`,
                backgroundColor: '#16B442',
                messageColor: '#ffffff',
                iconColor: '#ffffff',
                progressBarColor: '#ADEEBD',
                displayMode: 1,
                position: 'bottomCenter',
                timeout: 3000,
            });
        },
        notificationError() {
            iziToast.error({
                title: "Error",
                message: `Something's wrong confirming schedule. Please try again.`,
                displayMode: 1,
                position: 'bottomCenter',
                timeout: 3000
            });
        },
        confirmItem(data) {
            this.dialog = true;
            this.currentSelectedSchedule = data
        },
        async handleChoose() {
            this.loading = true

            try {
                if (this.currentSelectedSchedule !== null) {
                    if (this.shipment_id !== null && this.currentSelectedSchedule.id !== null) {
                        let passedData = {
                            id: this.shipment_id,
                            sid: this.currentSelectedSchedule.id
                        }

                        await this.sendConfirmSchedule(passedData)
                        this.loading = false                    
                        this.dialog = false
                        this.notificationSuccess(this.currentSelectedSchedule.carrier_name)
                        this.callOptions()
                    }
                }
            } catch (e) {
                this.loading = false;
                this.notificationError()
            }
        },
        async callOptions() {
            if (this.shipment_id !== null) {
                try {            
                    await this.fetchScheduleOptions(this.shipment_id)
                } catch(e) {
                    console.log(e)
                }
            }
        }
    },
};
</script>

<style>
@import "../assets/css/shipments_styles/shipmentSchedule.css";
</style>
