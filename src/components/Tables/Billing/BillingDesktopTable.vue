<template>
    <div class="billing-table-wrapper">
        <v-data-table
            :headers="headers"
            :items="billings"
            sort-by="calories"
            class="billing-table elevation-1"
            hide-default-footer
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :search="search"
            @page-count="pageCount = $event"
            mobile-breakpoint="769">

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Invoices</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <div class="search-component">
                        <Search 
                            placeholder="Search Invoices"
                            className="search custom-search"
                            :inputData.sync="search" />
                    </div>

                    <v-btn color="primary" class="btn-white manage-payment-methods-button" @click="handleManagePayment">
                        <img src="../../../assets/icons/payment-icon.svg" width="16px" height="16px" alt="" class="mr-1">
                        <span class="btn-name-manage">Manage Payment Methods</span>
                    </v-btn>

                    <!-- <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                New Item
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field
                                                v-model="editedItem.name"
                                                label="Dessert name"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field
                                                v-model="editedItem.calories"
                                                label="Calories"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field
                                                v-model="editedItem.fat"
                                                label="Fat (g)"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field
                                                v-model="editedItem.carbs"
                                                label="Carbs (g)"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field
                                                v-model="editedItem.protein"
                                                label="Protein (g)"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">
                                    Cancel
                                </v-btn>
                                <v-btn color="blue darken-1" text @click="save">
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5"
                                >Are you sure you want to delete this
                                item?</v-card-title
                            >
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="closeDelete"
                                    >Cancel</v-btn
                                >
                                <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="deleteItemConfirm"
                                    >OK</v-btn
                                >
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog> -->
                </v-toolbar>

                <v-tabs class="billing-tabs" @change="onTabChange" v-model="activeTab">
                    <v-tab 
                        v-for="(n, i) in tabs" 
                        :key="i"
                        @click="getCurrentTab(i)" >

                        {{ n }}
                    </v-tab>
                </v-tabs>                
            </template>

            <template v-slot:[`item.amount`]="{ item }">
                <div>
                    <p class="mb-0">{{ item.amount }}</p>
                    <small v-if="item.paid">Paid on {{ item.date_paid }}</small>
                </div>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <div class="manage-action-buttons">
                    <v-btn class="btn-white payment" :class="item.paid ? 'paid' : ''" :disabled="item.paid" @click="openPaymentDialog(item)">
                        <span v-if="!item.paid">Make Payment</span>
                        <span v-if="item.paid">
                            <img src="../../../assets/icons/checkMark.png" class="mr-1" width="15px" height="15px" alt="">
                            Paid
                        </span>
                    </v-btn>

                    <v-btn class="btn-white icons" @click="view(item)">
                        <img src="../../../assets/icons/visibility.svg" alt="">
                    </v-btn>

                    <v-btn class="btn-white icons" @click="download(item)">
                        <img src="../../../assets/icons/download.svg" alt="">
                    </v-btn>
                </div>
            </template>

            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>
        </v-data-table>

        <Pagination 
            v-if="typeof billings !== 'undefined' && billings.length > 0"
            :pageData.sync="page"
            :lengthData.sync="pageCount"
            :isMobile="isMobile"
        />
    </div>
</template>

<script>
import Search from '../../Search.vue'
import Pagination from '../../Pagination.vue'

export default {
    name: "BillingDesktopTable",
    props: ['items', 'isMobile'],
    components: {
        Search,
        Pagination
    },
    mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "billing");
    },
    data: () => ({
        page: 1,
        pageCount: 0,
        itemsPerPage: 35,
		search: "",
        headers: [
            {
                text: "Invoice #",
                align: "start",
                sortable: false,
                value: "invoice_no",
                width: "15%", 
                fixed: true
            },
            {
                text: "Invoice Date",
                align: "start",
                sortable: false,
                value: "invoice_date",
                width: "15%", 
                fixed: true
            },
            {
                text: "Shipment Reference",
                align: "start",
                sortable: false,
                value: "shipment_reference",
                width: "20%", 
                fixed: true
            },
            {
                text: "Due Date",
                align: "start",
                sortable: false,
                value: "due_date",
                width: "15%", 
                fixed: true
            },
            {
                text: "Amount",
                align: "end",
                sortable: false,
                value: "amount",
                width: "15%", 
                fixed: true
            },
            {
                text: "",
                align: "end",
                sortable: false,
                value: "actions",
                width: "20%", 
                fixed: true
            },
        ],
        tabs: ["All Invoices", "Unpaid", "Paid"],
        activeTab: 0,
        isInputExpanded: false,
        searchData: '',
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "New Item" : "Edit Item";
        },
        billingsData: {
            get() {
                return this.items
            },
            set(value) {
                this.$emit('update:items', value)
            }
        },
        billings() {
            let data = this.billingsData.filter((billing) => 
                billing.status === this.tabs[this.activeTab]
            )
            return data
        }
    },
    watch: {
        dialog(val) {
            val || this.close();
        },
        dialogDelete(val) {
            val || this.closeDelete();
        },
    },
    methods: {
        getCurrentTab() {
            // console.log(id);
        },
        onTabChange() {
            this.page = 1;
        },        
        openPaymentDialog(item) {
            this.$emit('makePayment', item)
        },
        close() {
            this.$emit('close')
        },
        view(item) {
            this.$emit('viewPayment', item)
        },
        closeView() {
            this.$emit('closeView')
        },
        handleManagePayment() {
            this.$router.push(`settings/?tab=manage-payment-methods`)
            this.$store.dispatch("page/setCurrentSettingsTab", 2);
        },
        download(item) {
            console.log(item);
        },
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem);
            } else {
                this.desserts.push(this.editedItem);
            }
            this.close();
        },

        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },
    },
};
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/billing/billingTable.scss';
@import '../../../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../../../assets/scss/buttons.scss';
</style>