<template>
    <v-dialog v-model="dialogView" max-width="800px" content-class="view-payment-dialog" :retain-focus="false" @click:outside="close">
        <v-card>
            <v-card-title>
                <span class="headline">Invoice #{{ paymentData.invoice_no }}</span>

                <div class="header-actions">
                    <div>
                        <button class="btn btn-blue">
                            Make Payment
                        </button>
                    </div>

                    <button class="btn btn-white">
                        Download
                    </button>

                    <button
                        icon
                        dark
                        class="btn-close"
                        @click="close">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </div>
            </v-card-title>

            <v-card-text>
                <div class="view-payment-wrapper">
                    <div class="header-actions" v-if="isMobile">
                        <div>
                            <button class="btn btn-blue">
                                Make Payment
                            </button>
                        </div>

                        <button class="btn btn-white">
                            Download
                        </button>
                    </div>
                    
                    <div class="view-payment-info">
                        <v-row class="row-between">
                            <v-col cols="12" sm="4">
                                <div class="card-name mb-2">
                                    <p class="card-title">Bill To</p>
                                    <span>
                                        JOENJON LLC <br/>
                                        765 Hillcrest PI <br/>
                                        Valley Stream, New York <br/>
                                        11581 <br/>
                                        USA
                                    </span>
                                </div>
                            </v-col>

                            <v-col class="row-inline" cols="12" sm="4">
                                <div class="card-name mb-2">
                                    <p class="card-title">Date</p>
                                    <span>Mar 13, 2021</span>
                                </div>                                

                                <div class="card-name mb-2">
                                    <p class="card-title">Due Date</p>
                                    <span>Mar 21, 2021</span>
                                </div>

                                <div class="card-name mb-2">
                                    <p class="card-title">Reference</p>
                                    <span>#76KS091</span>
                                </div>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12" sm="4">
                                <div class="card-box first-card">
                                    <div class="card-name mb-3">
                                        <p class="card-title">Bl #</p>
                                        <span>EGLV149006764176</span>
                                    </div>

                                    <div class="card-name mb-3">
                                        <p class="card-title">From</p>
                                        <span>Yantian <br/> 01/02/2021</span>
                                    </div>

                                    <div class="card-name mb-3">
                                        <p class="card-title">To</p>
                                        <span>Los Angeles <br/> 01/15/2021</span>
                                    </div>
                                </div>
                            </v-col>

                            <v-col cols="12" sm="8">
                                <div class="card-box">
                                    <div class="card-name mb-3">
                                        <p class="card-title">Suppliers</p>
                                        <span>
                                            GUILIN BOUND IMPORT & EXPORT TRADING CO.,LTD <br/>
                                            SYDNEY TRANSCOM SHIFTER, LLC <br/>
                                            Joenjon LLC
                                        </span>
                                    </div>

                                    <div class="card-name mb-3">
                                        <p class="card-title">Purchase Orders</p>
                                        <span>
                                            3498788, 3498788, 3498788, 3498788, 3498788, 3498788, 3498788, 3498788, 3498788, 3498788, 3498788, 3498788, 3498788, 3498788
                                        </span>
                                    </div>

                                    <div class="card-name mb-3">
                                        <p class="card-title">Containers</p>
                                        <span>
                                            EITU1791949, EGSU9131097, XTUI7638XLL
                                        </span>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>

                        <v-row class="table-row">
                            <v-col>
                                <div class="table-header" v-if="isMobile">
                                    <p>Description</p>
                                    <p>Amount</p>
                                </div>
                                
                                <div class="view-table-wrapper">                                    
                                    <v-data-table
                                        :headers="headers"
                                        :items="items"
                                        class="elevation-1 view-payment-table"
                                        v-if="!isMobile"
                                        hide-default-footer>

                                        <template v-slot:[`item.name`]="{ item }">
                                            <div>
                                                <p class="mb-0">{{ item.name }}</p>
                                                <p class="description">{{ item.description }}</p>
                                            </div>
                                        </template>
                                    </v-data-table>

                                    <v-data-table
                                        :headers="headers"
                                        :items="items"
                                        class="elevation-1 view-payment-table"
                                        v-if="isMobile"
                                        hide-default-footer>

                                        <template v-slot:[`item.name`]="{ item }">
                                            <div class="layout-flex">
                                                <div class="desc-wrapper">
                                                    <p class="mb-0">{{ item.name }}</p>
                                                    <p class="mb-0">{{ item.description }}</p>
                                                    <p class="mb-0">{{ item.qty }} x {{ item.rate }}</p>
                                                </div>

                                                <div>
                                                    <p class="mb-0">{{ item.amount }}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </v-data-table>
                                </div>

                                <div class="total">
                                    <p class="balance">Balance Due</p>
                                    <p>$5,237.00</p>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import globalMethods from '../../../utils/globalMethods'

export default {
    name: "ViewPaymentDialog",
    props: ['dialog', 'editedIndex', 'editedItemData', 'isMobile'],
    components: {},
    mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "billing");
    },
    data: () => ({
        headers: [
			{
				text: 'ITEM & DESCRIPTION',
				align: 'start',
				sortable: false,
				value: 'name',
				fixed: true,
				width: "55%"
			},
			{
				text: 'QTY',
				align: 'end',
				sortable: false,
				value: 'qty',
				fixed: true,
				width: "15%"
			},
			{
				text: 'RATE',
				align: 'end',
				sortable: false,
				value: 'rate',
				fixed: true,
				width: "15%"
			},
			{
				text: 'AMOUNT',
				align: 'end',
				sortable: false,
				value: 'amount',
				fixed: true,
				width: "15%"
			},
		],
        items: [
            {
                name: 'Ocean Freight',
                description: 'Ocean Freight Lorem ispum doller Lorem ispum doller Lorem ispum doller',
                qty: 1,
                rate: '$5,087.00',
                amount: '$5,087.00'
            },
            {
                name: 'Customs Handling',
                description: '',
                qty: 1,
                rate: '$150.00',
                amount: '$150.00'
            },
        ]
    }),
    computed: {
        dialogView: {
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
        }
    },
    watch: {},
    methods: {
        ...mapActions({
            
        }),
        ...globalMethods,
        close() {
            this.$emit('close')
        },
    },
};
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/settings/viewPaymentDialog.scss';
@import '../../../assets/scss/buttons.scss'
</style>