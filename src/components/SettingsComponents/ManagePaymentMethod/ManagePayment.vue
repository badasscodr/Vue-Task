<template>
    <div class="manage-payment-methods-wrapper" v-resize="onResize">
        <PaymentMethodDesktopTable 
            :items="items"
            @addPaymentMethod="addPaymentMethod"
            @editPaymentMethod="editPaymentMethod"
            @close="close"
            @deletePaymentMethod="deletePaymentMethod"
            @closeDelete="closeDelete"
            :isMobile="isMobile"
            v-if="!isMobile"/>

        <PaymentMethodMobileTable 
            :items="items"
            @addPaymentMethod="addPaymentMethod"
            @editPaymentMethod="editPaymentMethod"
            @close="close"
            @deletePaymentMethod="deletePaymentMethod"
            @closeDelete="closeDelete"
            :isMobile="isMobile"
            v-if="isMobile"/>

        <AddPaymentDialog 
            :dialog.sync="dialog"
            :editedIndex.sync="editedIndex"
            :editedItemData.sync="editedItem"
            @close="close" />

        <DeleteDialog 
            :dialogData.sync="dialogDelete"
            :editedItemData.sync="currentItemToDelete"
            :editedIndexWarehouse.sync="editedIndex"
            :defaultItemWarehouse.sync="defaultItem"
            @delete="deletePaymentMethodConfirm"
            @close="closeDelete"
            fromComponent="card"
            :loadingDelete="getDeletePaymentMethod"
            componentName="Payment Method" />
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import PaymentMethodDesktopTable from '../../Tables/Settings/PaymentMethods/PaymentMethodDesktopTable.vue'
import PaymentMethodMobileTable from '../../Tables/Settings/PaymentMethods/PaymentMethodMobileTable.vue'
import AddPaymentDialog from '../../BillingComponents/Dialog/AddPaymentDialog.vue'
import DeleteDialog from '../../Dialog/DeleteDialog.vue'
import globalMethods from '../../../utils/globalMethods'

export default {
    name: "ManagePayment",
    components: {
        PaymentMethodDesktopTable,
        PaymentMethodMobileTable,
        AddPaymentDialog,
        DeleteDialog
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
        dialog: false,
        dialogDelete: false,
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
        items: [
            {
                card_number: '1234568765983840',
                name_on_card: 'Alfraid Johson',
                expiration: '06/24',
                cvc: '1234',
                coutry: 'United States',
                date_added: 'Mar 10, 2020',
                last_used: 'Apr 27, 2021',
                default: true,
                card_type: 'mastercard',
                tab: 'Payment Methods'
            },
            {
                card_number: '1234567894563840',
                name_on_card: 'Alfraid Johson',
                expiration: '06/24',
                cvc: '1234',
                coutry: 'United States',
                date_added: 'Jan 31, 2020',
                last_used: 'Aug 03, 2020',
                default: false,
                card_type: 'visa',
                tab: 'Payment Methods'
            },
            {
                card_number: '1124554233023840',
                name_on_card: 'Alfraid Johson',
                expiration: '06/24',
                cvc: '1234',
                date_added: 'Dec 23, 2019',
                last_used: 'Jun 27, 2020',
                default: false,
                coutry: 'United States',
                card_type: 'amex',
                tab: 'Payment Methods'
            },
        ],
        editedIndex: -1,
        editedItem: {
            card_number: '',
            expiration: '',
            cvc: '',
            name_on_card: '',
            country: '',
            default: false
        },
        defaultItem: {
            card_number: '',
            expiration: '',
            cvc: '',
            name_on_card: '',
            country: '',
            default: false
        },
        isMobile: false,
        tabs: ["Users", "Notifications", "Payment Methods"],
        activeTab: 2,
        currentItemToDelete: null,
        getDeletePaymentMethod: false
    }),
    computed: {},
    watch: {
        dialog(val) {
            val || this.close();
        },
        dialogDelete(val) {
            val || this.closeDelete();
        },
    },
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
            this.dialog = true
        },
        editPaymentMethod(payment) {
            this.editedIndex = this.items.indexOf(payment)
			this.editedItem = Object.assign({}, payment)
			this.dialog = true
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        deletePaymentMethod(item) {
			this.dialogDelete = true
			this.currentItemToDelete = item
		},
		async deletePaymentMethodConfirm() {
			if (this.currentItemToDelete !== null) {
                this.getDeletePaymentMethod = true
                // try {
                //     await this.deleteProduct(this.currentProductToDelete.id)
                //     this.fetchProducts()
                //     this.closeDeleteProduct()
                //     this.notificationMessage('Product has been deleted.')
                // } catch (e) {
                //     this.closeDeleteProduct()
                //     this.notificationError(e)
                // }

                setTimeout(() => {
                    this.notificationMessage('Payment method has been deleted.')
                    this.getDeletePaymentMethod = false
                    this.closeDelete()
                }, 3000)
            }
		},
        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1;
            })
        },
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem);
            } else {
                this.desserts.push(this.editedItem);
            }
            this.close();
        },
        onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
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
				return require(`../../../assets/icons/${pic}.svg`)
			} else {
				return require('../../../assets/icons/default-product-icon.svg')
			}
        },
    },
};
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/settings/managePayment.scss';
@import '../../../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../../../assets/scss/buttons.scss';
</style>