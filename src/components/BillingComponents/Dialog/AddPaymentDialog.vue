<template>
    <v-dialog v-model="dialogAdd" max-width="560px" content-class="add-payment-dialog" :retain-focus="false" @click:outside="close">
        <v-card>
            <v-form ref="form" v-model="valid" action="#" @submit.prevent="">
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>

                    <button icon dark class="btn-close" @click="close">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </v-card-title>

                <v-card-text>
                    <div class="add-payment-wrapper">
                        <div class="add-payment-info">
                            <v-row>
                                <v-col>
                                    <div class="card-name mb-2">
                                        <p class="card-title">Card Number</p>
                                        <v-text-field
                                            height="40px"
                                            color="#002F44"
                                            width="200px"
                                            dense
                                            class="text-fields select-items"
                                            placeholder="xxxx xxxx xxxx xxxx"
                                            outlined
                                            type="number"
                                            v-model="paymentData.card_number"
                                            :rules="rules"
                                            hide-details="auto">
                                        </v-text-field>
                                    </div>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" sm="6">
                                    <div class="card-name mb-2">
                                        <p class="card-title">Expiry</p>
                                        <v-text-field
                                            height="40px"
                                            color="#002F44"
                                            width="200px"
                                            v-model="paymentData.expiration"
                                            @input="expirationInput"
                                            dense
                                            class="text-fields select-items"
                                            placeholder="MM / YY"
                                            outlined
                                            :rules="rules"
                                            hide-details="auto">
                                        </v-text-field>
                                    </div>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="card-name mb-2">
                                        <p class="card-title">CVC</p>
                                        <v-text-field
                                            height="40px"
                                            color="#002F44"
                                            width="200px"
                                            dense
                                            class="text-fields select-items"
                                            placeholder="Enter CVC code"
                                            outlined
                                            v-model="paymentData.cvc"
                                            :rules="rules"
                                            hide-details="auto">
                                        </v-text-field>
                                    </div>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" sm="6">
                                    <div class="card-name mb-2">
                                        <p class="card-title">Name on Card</p>
                                        <v-text-field
                                            height="40px"
                                            color="#002F44"
                                            width="200px"
                                            dense
                                            class="text-fields select-items"
                                            placeholder="Enter name"
                                            outlined
                                            v-model="paymentData.name_on_card"
                                            :rules="rules"
                                            hide-details="auto">
                                        </v-text-field>
                                    </div>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="card-name mb-2">
                                        <p class="card-title">Country</p>
                                        <v-autocomplete
                                            class="text-fields select-items"
                                            :items="countries"
                                            :disabled="getCountriesLoading"
                                            :placeholder="getCountriesLoading ? 'Fetching countries...' : 'Type country name'"
                                            outlined
                                            v-model="paymentData.country"
                                            hide-details="auto">
                                        </v-autocomplete>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>

                        <v-checkbox
                            class="payment-checkbox"
                            v-model="paymentData.default"
                            label="Make it default payment method"
                            hide-details="auto">
                        </v-checkbox>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <button class="btn-blue" @click="save">               
                        <span v-if="editedIndex === -1">
                            <span>Add Method</span>
                        </span>

                        <span v-if="editedIndex > -1">
                            <span>Update Method</span>
                        </span>
                    </button>

                    <button class="btn-white" @click="close">
                        Cancel
                    </button>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import globalMethods from '../../../utils/globalMethods';

export default {
    name: 'AddPaymentDialog',
    props: ['dialog', 'editedIndex', 'editedItemData'],
    components: {},
    data: () => ({
        valid: true,
        makeDefault: false,
        rules: [
            (v) => !!v || 'Input is required.'
        ],
        max: 5
    }),
    computed: {
        ...mapGetters({
            getCountries: 'warehouse/getCountries',
			getCountriesLoading: 'warehouse/getCountriesLoading',
        }),
        formTitle () {
            return this.editedIndex === -1 ? 'Add Payment' : 'Edit Payment'
        },
        dialogAdd: {
            get() {
                return this.dialog
            },
            set(value) {
                this.$emit('update:dialog', value)
            }
        },
        paymentData: {
            get() {
                return this.editedItemData
            },
            set(value) {
                this.$emit('update:editedItemData', value)
            }
        },
        countries() {
            return typeof this.getCountries !== 'undefined' && this.getCountries !== null && this.getCountries.length !== 0 ? this.getCountries : []
        },
        isValid() {
            let valid = true

            if (this.paymentData.card_number !== '' && this.paymentData.expiration !== '' && 
                this.paymentData.cvc !== '' && this.paymentData.name_on_card !== '') {
                valid = true
            } else {
                valid = false
            }

            return valid
        }
    },
    methods: {
        ...mapActions({           
            
        }),
        ...globalMethods,
        expirationInput() {
            // var inputChar = String.fromCharCode(event.keyCode)
            // var code = event.keyCode;
            // var allowedKeys = [8];
            // if (allowedKeys.indexOf(code) !== -1) {
            //     return;
            // }

            // event.target.value = event.target.value.replace(
            //     /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
            // ).replace(
            //     /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
            // ).replace(
            //     /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
            // ).replace(
            //     /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
            // ).replace(
            //     /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
            // ).replace(
            //     /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
            // ).replace(
            //     /\/\//g, '/' // Prevent entering more than 1 `/`
            // );
        },
        close() {
            this.$refs.form.resetValidation()
            this.$emit('close')
        },
        save() {
            this.$refs.form.validate()
        }
    },
    watch: {},
    mounted() {},
    updated() {},
}
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/billing/addPaymentDialog.scss';
</style>