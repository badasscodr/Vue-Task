<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            sort-by="calories"
            class="methods-table elevation-1"
            hide-default-footer
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :search="search"
            @page-count="pageCount = $event"
            mobile-breakpoint="769"
            v-if="activeTab == 2">

            <template v-slot:top>
                <div class="tab-name">
                    <div class="tab-method" v-if="activeTab == 2">
                        <h3>Payment Methods</h3>

                        <v-spacer></v-spacer>

                        <v-btn color="primary" dark class="btn-blue" @click="addPaymentMethod">
                            Add Payment Method
                        </v-btn>
                    </div>                    
                </div>       
            </template>

            <template v-slot:[`item.card_number`]="{ item }">
                <div class="card-number-wrapper">
                    <div class="card-type">
                        <img :src="getImgUrl(item.card_type)" v-bind:alt="item.card_type"
                        width="56px" height="40px">
                    </div>

                    <div>                        
                        <p class="mb-0">{{ filterCardNumber(item.card_number) }}</p>
                        <p class="name mb-0">{{ item.name_on_card }}, {{ item.expiration }}</p>
                    </div>
                </div>
            </template>

            <template v-slot:[`item.default`]="{ item }">
                <div>
                    <p class="mb-0">{{ item.default ? 'Default' : '-' }}</p>
                </div>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <div class="manage-action-buttons">
                    <v-btn class="btn-white icons" @click="editPaymentMethod(item)">
                        <img src="../../../../assets/icons/edit-blue.svg" alt="">
                    </v-btn>

                    <v-btn class="btn-white icons" @click="deletePaymentMethod(item)">
                        <img src="../../../../assets/icons/delete-blue.svg" alt="">
                    </v-btn>
                </div>
            </template>

            <template v-slot:no-data>
                <v-btn color="primary"> Reset </v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import globalMethods from '../../../../utils/globalMethods'

export default {
    name: "PaymentMethodDesktopTable",
    props: ['items', 'isMobile'],
    components: {
    },
    mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "settings/manage-payment-methods");
        this.fetchCountries()
    },
    data: () => ({
        page: 1,
        pageCount: 0,
        itemsPerPage: 35,
		search: "",
        headers: [
            {
                text: "Method",
                align: "start",
                sortable: false,
                value: "card_number",
                width: "25%", 
                fixed: true
            },
            {
                text: "Date Added",
                align: "start",
                sortable: false,
                value: "date_added",
                width: "20%", 
                fixed: true
            },
            {
                text: "Last Used",
                align: "start",
                sortable: false,
                value: "last_used",
                width: "20%", 
                fixed: true
            },
            {
                text: "Type",
                align: "center",
                sortable: false,
                value: "default",
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
        activeTab: 2,
    }),
    computed: {
        paymentMethods() {
            let data = this.items.filter((payment) => 
                payment.tab === this.tabs[this.activeTab]
            )
            return data
        }
    },
    watch: {},
    methods: {
        ...mapActions({
            fetchCountries: 'warehouse/fetchCountries',
        }),
        ...globalMethods,
        getCurrentTab(id) {
            console.log(id);
        },
        onTabChange() {
            this.page = 1;
        },
        addPaymentMethod() {
            this.$emit('addPaymentMethod')
        },
        editPaymentMethod(payment) {
            this.$emit('editPaymentMethod', payment)
        },
        close() {
            this.$emit('close')
        },
        deletePaymentMethod(item) {
			this.$emit('deletePaymentMethod', item)
		},
        closeDelete() {
            this.$emit('closeDelete')
        },
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem);
            } else {
                this.desserts.push(this.editedItem);
            }
            this.close();
        },
        handleManagePayment() {
            this.$router.push(`billing/manage-payment-methods`)
        },
        managePayment(item) {
            console.log(item)
        },
        filterCardNumber(card) {
            let newCardNum = card.replace(/\d{12}(\d{4})/, "************$1")

            return newCardNum
        },
        getImgUrl(pic) {
            if (pic !== 'undefined' && pic !== null) {
				return require('../../../../assets/icons/mastercard.svg')
			} else {
				return require('../../../../assets/icons/default-product-icon.svg')
			}
        },
    },
};
</script>

<style lang="scss">
@import '../../../../assets/scss/pages_scss/settings/managePayment.scss';
@import '../../../../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../../../../assets/scss/buttons.scss';
</style>
