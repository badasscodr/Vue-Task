<template>
    <div class="billing-table-wrapper">
        <v-data-table
            :headers="headers"
            :items="billings"
            sort-by="calories"
            class="billing-table-mobile elevation-1"
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

                    <button class="btn btn-primary search-invoice" @click="inputClick">
                        <img src="@/assets/images/search-icon.svg" alt="" width="15px" height="15px" class="mobile-search-icon" />
                    </button>

                    <div class="search" :class="isInputExpanded ? 'expanded' : ''">
                        <img src="@/assets/images/search-icon.svg" alt="" width="15px" height="15px" class="input-search-icon" :class="isInputExpanded ? 'expanded' : ''" />
                        
                        <input
                            class="search-asd" 
                            type="text"
                            id="search-input"
                            v-model.trim="searchData"
                            placeholder="Search Invoices..."
                            @input="handleSearch"
                            autocomplete="off" />
                    </div>

                    <button v-if="isInputExpanded" class="close-btn" @click="clearInput">
                        Cancel
                    </button>

                    <v-btn color="primary" class="btn-white manage-payment-methods-button" @click="handleManagePayment">
                        <img src="../../../assets/icons/payment-icon.svg" width="16px" height="16px" alt="">
                    </v-btn>
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

            <template v-slot:[`item.invoice_no`]="{ item }">
                <div class="layout-flex">
                    <p class="darker mb-0">{{ item.invoice_no }}</p>
                    <p class="darker mb-0">{{ item.amount }}</p>
                </div>
            </template>

            <template v-slot:[`item.invoice_date`]="{ item }">
                <div class="layout-inline">
                    <p class="inline-title">Invoice Date</p>
                    <p class="mb-0">{{ item.invoice_date }}</p>
                </div>
            </template>

            <template v-slot:[`item.shipment_reference`]="{ item }">
                <div class="layout-inline">
                    <p class="inline-title">Reference</p>
                    <p class="reference mb-0">{{ item.shipment_reference }}</p>
                </div>
            </template>

            <template v-slot:[`item.due_date`]="{ item }">
                <div class="layout-inline">
                    <p class="inline-title">Due Date</p>
                    <p class="mb-0">{{ item.due_date }}</p>
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
import Pagination from '../../Pagination.vue'

export default {
    name: "BillingMobileTable",
    props: ['items', 'isMobile'],
    components: {
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
        clearInput() {
            this.isInputExpanded = false
            this.searchData = ''
        },
        inputClick() {
            this.isInputExpanded = true
            document.getElementById("search-input").focus()
        },
        handleSearch() {},
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem);
            } else {
                this.desserts.push(this.editedItem);
            }
            this.close();
        },
    },
};
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/billing/billingTable.scss';
@import '../../../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../../../assets/scss/buttons.scss';
</style>