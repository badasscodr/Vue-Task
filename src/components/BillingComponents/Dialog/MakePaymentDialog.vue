<template>
    <v-dialog v-model="dialogAdd" max-width="560px" content-class="make-payment-dialog" :retain-focus="false" @click:outside="close">
        <v-card>
            <v-form ref="form" v-model="valid" action="#" @submit.prevent="">
                <v-card-title>
                    <span class="headline">Make Payment</span>

                    <button icon dark class="btn-close" @click="close">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </v-card-title>

                <v-card-text>
                    <div class="make-payment-wrapper">
                        <div class="make-payment-info">
                            <v-row class="row-inline">
                                <v-col cols="12" sm="6">
                                    <div class="card-name mb-2">
                                        <p class="card-title">Invoice #</p>
                                        <span>{{ makePaymentData.invoice_no }}</span>
                                    </div>

                                    <div class="card-name mb-2">
                                        <p class="card-title">Date</p>
                                        <span>{{ makePaymentData.invoice_date }}</span>
                                    </div>

                                    <div class="card-name mb-2">
                                        <p class="card-title">Reference</p>
                                        <span>{{ makePaymentData.shipment_reference }}</span>
                                    </div>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <div class="card-name mb-2">
                                        <p class="card-title">Due Date</p>
                                        <span>{{ makePaymentData.due_date }}</span>
                                    </div>

                                    <div class="card-name mb-2">
                                        <p class="card-title">Amount</p>
                                        <span class="amount">{{ makePaymentData.amount }}</span>
                                    </div>
                                </v-col>
                            </v-row>

                            <div class="divider" />

                            <v-row>
                                <v-col cols="12">
                                    <div class="card-name mb-3">
                                        <p class="card-title">Payment Method</p>
                                        <v-select
                                            class="text-fields select-items"
                                            :items="paymentMethods"
                                            item-text="name"
                                            item-value="id"
                                            placeholder="Select Payment Method"
                                            height="45px"
                                            dense
                                            outlined
                                            :rules="rules"
                                            hide-details="auto">
                                        </v-select>
                                    </div>
                                </v-col>

                                <v-col cols="12">
                                    <div class="card-name mb-3">
                                        <p class="card-title">CVC</p>
                                        <v-text-field
                                            height="40px"
                                            color="#002F44"
                                            width="200px"
                                            dense
                                            class="text-fields select-items"
                                            placeholder="Enter CVC code"
                                            outlined
                                            type="number"
                                            :rules="rules"
                                            hide-details="auto">
                                        </v-text-field>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <button class="btn-blue" @click="save"> 
                        <span>Make Payment</span>
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
import { mapActions } from 'vuex'
import globalMethods from '../../../utils/globalMethods'

export default {
    name: "MakePaymentDialog",
    props: ['dialog', 'editedIndex', 'editedItemData'],
    components: {},
    mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "billing");
    },
    data: () => ({
        isMobile: false,
        valid: true,
        rules: [
            (v) => !!v || 'Input is required.'
        ],
        paymentMethods: [
            '**** **** **** 3840'
        ]
    }),
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Make Payment' : 'Update Payment'
        },
        dialogAdd: {
            get() {
                return this.dialog
            },
            set(value) {
                this.$emit('update:dialog', value)
            }
        },
        makePaymentData: {
            get() {
                return this.editedItemData
            },
            set(value) {
                this.$emit('update:editedItemData', value)
            }
        }
    },
    watch: {},
    methods: {
        ...mapActions({
            
        }),
        ...globalMethods,
        onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
        close() {
            this.$refs.form.resetValidation()
            this.$emit('close')
        },
        save() {
            this.$refs.form.validate()
        }
    },
};
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/settings/makePaymentDialog.scss';
</style>