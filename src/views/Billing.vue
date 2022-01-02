<template>
    <div class="billing-wrapper" v-resize="onResize">
		<div class="billing-due">
			<div class="due-info">
				<h3>Total Due</h3>
				<h2>$15,689.00</h2>
			</div>

			<div class="due-button">
				<v-btn class="btn-blue clear-due">Clear All Due</v-btn>
			</div>
		</div>

		<BillingDesktopTable 
			:items="items"
			@makePayment="makePayment"
			@close="close"
			@viewPayment="viewPayment"
			@closeView="closeView"
			:isMobile="isMobile"
			v-if="!isMobile" />

		<BillingMobileTable 
			:items="items"
			@makePayment="makePayment"
			@viewPayment="viewPayment"
			:isMobile="isMobile"
			v-if="isMobile" />		

        <ViewPaymentDialog 
            :dialog.sync="dialogView"
            :editedIndex.sync="editedIndex"
            :editedItemData.sync="editedItem"
			:isMobile="isMobile"
            @close="closeView"/>

        <MakePaymentDialog
            :dialog.sync="dialog"
            :editedIndex.sync="editedIndex"
            :editedItemData.sync="editedItem"
			:isMobile="isMobile"
            @close="close" />
    </div>
</template>

<script>
import BillingDesktopTable from '../components/Tables/Billing/BillingDesktopTable.vue'
import BillingMobileTable from '../components/Tables/Billing/BillingMobileTable.vue'
import MakePaymentDialog from '../components/BillingComponents/Dialog/MakePaymentDialog.vue'
import ViewPaymentDialog from '../components/BillingComponents/Dialog/ViewPaymentDialog.vue'

export default {
    name: "Billing",
	components: {
		BillingDesktopTable,
		BillingMobileTable,
		MakePaymentDialog,
		ViewPaymentDialog
	},
	data: () => ({
		isMobile: false,
		dialog: false,
		dialogView: false,
		editedIndex: -1,
        editedItem: {
            invoice_no: '',
            invoice_date: '',
            shipment_reference: '',
            due_date: '',
            amuont: ''
        },
        defaultItem: {
            invoice_no: '',
            invoice_date: '',
            shipment_reference: '',
            due_date: '',
            amuont: ''
        },
		items: [
			{
				invoice_no: '1234567890',
				invoice_date: 'Mar 13, 2021',
				shipment_reference: '#76KS091',
				due_date: 'Mar 21, 2021',
				amount: '$5,689.00',
				paid: false,
				date_paid: null,
				status: 'All Invoices',
				billing_status: ['All Invoices', 'Unpaid']
			},
			{
				invoice_no: '1234567891',
				invoice_date: 'Mar 15, 2021',
				shipment_reference: '#76KS091',
				due_date: 'Mar 22, 2021',
				amount: '$6,689.00',
				paid: false,
				date_paid: null,
				status: 'All Invoices',
				billing_status: ['All Invoices', 'Unpaid']
			},
			{
				invoice_no: '1234567892',
				invoice_date: 'Mar 16, 2021',
				shipment_reference: '#76KS091',
				due_date: 'Mar 24, 2021',
				amount: '$7,020.00',
				paid: false,
				date_paid: null,
				status: 'All Invoices',
				billing_status: ['All Invoices', 'Unpaid']
			},
			{
				invoice_no: '12345678913',
				invoice_date: 'Apr 13, 2021',
				shipment_reference: '#76KS091',
				due_date: 'Apr 21, 2021',
				amount: '$8,689.00',
				paid: false,
				date_paid: null,
				status: 'Unpaid',
				billing_status: ['All Invoices', 'Unpaid']
			},
			{
				invoice_no: '1234567894',
				invoice_date: 'May 13, 2021',
				shipment_reference: '#76KS091',
				due_date: 'May 21, 2021',
				amount: '$4,000.00',
				paid: false,
				date_paid: null,
				status: 'Unpaid',
				billing_status: ['All Invoices', 'Unpaid']
			},
			{
				invoice_no: '1234567895',
				invoice_date: 'Jun 13, 2021',
				shipment_reference: '#76KS091',
				due_date: 'Jun 21, 2021',
				amount: '$5,689.00',
				paid: true,
				date_paid: 'Jun 6, 2021',
				status: 'Paid',
				billing_status: ['All Invoices', 'Paid']
			}
		]
	}),
	methods: {
		onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
		makePayment(item) {
			this.dialog = true
			this.editedIndex = this.items.indexOf(item);
            this.editedItem = Object.assign({}, item);
		},
		viewPayment(item) {
			this.dialogView = true
			this.editedItem = Object.assign({}, item)
		},
		close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },
		closeView() {
            this.dialogView = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },
		// DELETE DIALOG
        deleteItem(item) {
            this.editedIndex = this.desserts.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },
        deleteItemConfirm() {
            this.desserts.splice(this.editedIndex, 1);
            this.closeDelete();
        },
        closeDelete() {
            this.dialogDelete = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },
	},
    mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "billing");
    },
};
</script>

<style lang="scss">
@import '../assets/scss/pages_scss/billing/billing.scss';
@import '../assets/scss/buttons.scss';
</style>
