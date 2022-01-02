<template>
    <div class="text-center">
        <v-menu
            v-model="menuModel"
            :close-on-content-click="false"
            :nudge-width="200"
            offset-y>

            <template v-slot:activator="{ on, attrs }">
                <v-btn id="filters" v-bind="attrs" v-on="on">
                    <img src="../assets/images/filters.png" alt="" class="filter-img">
                    Filters
                </v-btn>
            </template>
            
            <v-card class="filters-card">
                <form style="padding: 16px">
                    <div>
                        <h4 style="color:#819FB2;margin-bottom:0; text-transform: uppercase; font-size: 14px;">Sort By</h4>

                        <v-radio-group v-model="radioGroupModel" style="margin-top:0;">
                            <div v-for="n in radios" :key="n" class="radioButtons">
                                <v-radio
                                    style="margin: unset;"
                                    :key="n"
                                    :label="`${n}`"
                                    :value="n">
                                </v-radio>

                                <div class="sortingIcons">
                                    <v-icon aria-hidden="false">
                                        mdi-sort-alphabetical-ascending
                                    </v-icon>
                                    <v-icon aria-hidden="false">
                                        mdi-sort-alphabetical-descending
                                    </v-icon>
                                </div>
                            </div>
                        </v-radio-group>
                    </div>

                    <div style="margin-bottom:20px">
                        <h4 style="color:#819FB2;text-transform: uppercase; font-size: 14px; margin-bottom: 5px;">Status</h4>

                        <v-checkbox
                            class="customCheckBox"
                            hide-details="true"
                            v-for="n in checkboxes"
                            v-model="selected"
                            :key="n"
                            :label="`${n}`"
                            :value="n">
                        </v-checkbox>
                    </div>

                    <div style="margin-bottom:10px">
                        <h4 style="color:#819FB2;margin-bottom:10px;text-transform: uppercase; font-size: 14px; margin-bottom: 10px;">Departure</h4>
                        
                        <DatePicker :date="currentDate" :menu="menu" :setMenu="(value) => { this.setMenu(value) }"/>

                        <v-text-field
                            class="location-field"
                            hide-details="true"
                            height="36px;"
                            label="Location"
                            prepend-inner-icon="mdi-map-marker"
                            solo>
                        </v-text-field>
                    </div>
                </form>

                <v-divider></v-divider>

                <v-card-actions class="card-actions">
                    <v-btn class="btn-apply" color="primary" @click="() => { this.setMenu(false) } ">
                        Apply
                    </v-btn>

                    <v-btn class="btn-cancel" @click="() => { this.setMenu(false) } ">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
import DatePicker from "@/components/DatePicker.vue"

export default {
    name: "Filters",
    components:{
        DatePicker: DatePicker
    },
    computed: {
        currentDate() {
            let dateObject = new Date()
            let year = dateObject.getFullYear()
            let month = ((dateObject.getMonth() + 1)<10) ? `0${(dateObject.getMonth() + 1)}` : (dateObject.getMonth() + 1)
            let day = ((dateObject.getDay() + 1)<10) ? `0${(dateObject.getDay() + 1)}` : (dateObject.getDay() + 1)
            return `${year}-${month}-${day}`
        }
    },
    props: ['menu', 'radioGroup', 'setMenu'],
    data() {
        return {
            menuModel: this.menu,
            radioGroupModel: this.radioGroup,
            radios: ["Departure Time", "Arrival Time", "Status"],
            checkboxes: [
                "Pending",
                "In Transit",
                "Completed",
                "Discharged",
                "Delivered",
            ],
            selected: [],
            filterItems: {
                sortBy: '',
                isAsc: true,
                isPending: false,
                isTransit: false,
                isCompleted: false,
                isDischarged: false,
                isDelivered: false,
                departureDate: '',
                departureLocation: ''
            }
        };
    },
    updated() {
        console.log(this.radioGroupModel, 'radio model');
        console.log(this.selected, 'cehcbox');
    }
}
</script>

<style>
.filters-card {
    border: 1px solid #E1ECF0;
}

.customCheckBox {
    margin: 0 !important;
    padding: 0 !important;
}
.radioButtons {
    display: flex;
    height: 30px;
    justify-content: space-between;
}

.v-label {
    font-size: 14px !important;
    color: #4A4A4A !important;
}

.sortingIcons {
    width: 20%;
    display: flex;
    justify-content: space-between;
}

.filter-img {
    margin-right: 10px;
} 

.location-field .v-input__slot {
    border: 1px solid #B3CFE0 !important;
    box-shadow: none !important;
    padding: 0 10px !important;
}

.location-field .v-input__slot i {
    color: #212121;
}

.card-actions {
    padding: 15px;
}

.card-actions button {
    letter-spacing: 0;
    text-transform: capitalize;
    font-size: 14px !important;
    padding: 10px 15px !important;
    box-shadow: none !important;
    font-weight: 500;
}

.card-actions .btn-apply {
    background-color: #039DDC !important;
}

.card-actions .btn-cancel {
    color: #002F44 !important;
    border: 1px solid #B4CFE0;
    background-color: #fff;
}
</style>
