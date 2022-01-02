<template>
	<div class='purchase-wrapper' v-resize="onResize">
		<!-- Desktop -->
		<POsDesktopTable 
			:headers="headers"
			:items="pos"
			:pageData.sync="page"
			:itemsPerPage="itemsPerPage"
			:lengthData.sync="pageCount"
			:isMobile="isMobile"
			:editedItemFromParent.sync="editedItem"
			:defaultItemFromParent.sync="defaultItem"
			:dialogData.sync="dialog"
			:dialogViewData.sync="dialogView"
			:dialogDeleteData.sync="dialogDelete"
			:dialogDeleteInnerData.sync="dialogDeleteInner"
			:editedIndexDataFromParent.sync="editedIndex"
			@viewItem="viewItem"
			@deleteItem="deleteItem"
			@editItem="editItem"
			@close="close"
			@save="save"
			@deleteItemConfirm="deleteItemConfirm"
			@closeDelete="closeDelete"
			@closeView="closeView"
			v-if="!isMobile"
		/>

		<!-- Mobile -->
		<POsMobileTable 
			:headers="headers"
			:items="pos"
			:pageData.sync="page"
			:itemsPerPage="itemsPerPage"
			:lengthData.sync="pageCount"
			:isMobile="isMobile"
			:editedItemFromParent.sync="editedItem"
			:defaultItemFromParent.sync="defaultItem"
			:dialogData.sync="dialog"
			:dialogViewData.sync="dialogView"
			:dialogDeleteData.sync="dialogDelete"
			:dialogDeleteInnerData.sync="dialogDeleteInner"
			:editedIndexDataFromParent.sync="editedIndex"
			@viewPoMobile="viewPoMobile"
			@viewItem="viewItem"
			@deleteItem="deleteItem"
			@editItem="editItem"
			@close="close"
			@save="save"
			@deleteItemConfirm="deleteItemConfirm"
			@closeDelete="closeDelete"
			@closeView="closeView"
			v-if="isMobile"
		/>

		<Pagination 
			v-if="typeof pos !== 'undefined' && pos.length > 0"
			:pageData.sync="page"
			:lengthData.sync="pageCount"
			:isMobile="isMobile"
		/>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import POsDesktopTable from '../../components/Tables/POs/BackUpCodes/POsDesktopTable.vue'
import POsMobileTable from '../../components/Tables/POs/BackUpCodes/POsMobileTable.vue'
import Pagination from '../../components/Pagination.vue'
import _ from 'lodash'

export default {
	name: "POs",
	components: {
		POsDesktopTable,
		POsMobileTable,
		Pagination
	},
	data: () => ({
		page: 1,
        pageCount: 0,
        itemsPerPage: 35,
		search: "",
		dialog: false,
		dialogView: false,
		dialogDelete: false,
		dialogDeleteInner: false,
		headers: [
			{
				text: "Po No",
                align: "start",
                sortable: false,
                value: "po_number",
                width: "144px", 
                fixed: true
			},
			{
				text: "Date",
                align: "start",
                sortable: false,
                value: "created_at",
                width: "144px", 
                fixed: true
			},
			{
				text: "Vendor",
                align: "start",
                sortable: false,
                value: "supplier_id",
                width: "240px", 
                fixed: true
			},
			{
				text: "Ship To",
                align: "start",
                sortable: false,
                value: "warehouse_id",
                width: "240px", 
                fixed: true
			},
			{
				text: "Details",
                align: "start",
                sortable: false,
                value: "total",
                width: "160px", 
                fixed: true
			},
			{
				text: "",
                align: "center",
                sortable: false,
                value: "actions",
                width: "212px", 
                fixed: true
			},
		],
		editedIndex: -1,
		defaultItem: {
			products: [{
                id: '',
                quantity: 0,
                unit_price: 0,
                amount: 0
            }],
            po_number: '',
			is_system_generated: 1,
			supplier_id: '',
			customer_id: '',
			notes: '',
			created_by: '',
			tax: 0,
			warehouse_id: '',
			sub_total: '',
			shipping: 0,
			total: '',
			discount: 0
		},
		editedItem: {
			products: [{
                id: '',
                quantity: 0,
                unit_price: 0,
                amount: 0
            }],
            po_number: '',
			is_system_generated: 1,
			supplier_id: '',
			customer_id: '',
			notes: '',
			created_by: '',
			tax: 0,
			warehouse_id: '',
			sub_total: '',
			shipping: 0,
			total: '',
			discount: 0
		},
		isMobile: false,
		warehousesAddress: []
	}),
	computed: {
		...mapGetters({
            getAllPo: 'po/getAllPo',
			getPoLoading: 'po/getPoLoading'
        }),
		formTitle () {
			return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
		},
		pos() {
			let posData = []

			if (typeof this.getAllPo !== 'undefined' && this.getAllPo !== null) {
				if (typeof this.getAllPo.results !== 'undefined' && this.getAllPo.results !== null) {
					if (this.getAllPo.results.data !== 'undefined' && this.getAllPo.results.data !== null) {
						if (this.getAllPo.results.data.length !== 'undefined' && this.getAllPo.results.data.length !== null) {
							posData = this.getAllPo.results.data

							if (posData !== 'undefined' && posData.length !== 'undefined') {
								posData.map(value => {
									if (typeof value.po_items == 'string') {
										value.po_items = JSON.parse(value.po_items)
									}
								})
							}
						}
					}
				}
			}

			return posData
        },
	},
	watch: {
		dialog (val) {
			val || this.close()
		},
		dialogView (val) {
			val || this.closeView()
		},
	},
	created () {
		
	},
	methods: {
		...mapActions({
            fetchPo: 'po/fetchPo',
			fetchWarehouse: 'warehouse/fetchWarehouse',
			fetchProducts: 'products/fetchProducts'
        }),
		viewItem (item) {
			//this.editedIndex = this.pos.indexOf(item)
			this.editedIndex = _.findIndex(this.pos, e => (e.id === item.id))
			item.products = []
			if (typeof item.purchase_order_products!=='undefined' && Array.isArray(item.purchase_order_products) && item.purchase_order_products.length > 0) {
				item.products = item.purchase_order_products.map(ipp => ({
					id: ipp.product_id,
					quantity: ipp.quantity,
					unit_price: ipp.unit_price,
					amount: ipp.amount,
					sku: (typeof ipp.product!=='undefined' && ipp.product!==null) ? ipp.product.sku : '',
					description: (typeof ipp.product!=='undefined' && ipp.product!==null) ? ipp.product.description : ''
				}))
			}
			this.editedItem = Object.assign({}, item)
			this.dialogView = true
		},
		editItem (item) {
			//this.editedIndex = this.pos.indexOf(item)
			this.editedIndex = _.findIndex(this.pos, e => (e.id === item.id))
			item.products = []

			if (typeof item.purchase_order_products!=='undefined' && Array.isArray(item.purchase_order_products) && item.purchase_order_products.length > 0) {
				item.products = item.purchase_order_products.map(ipp => ({
					id: ipp.product_id,
					quantity: ipp.quantity,
					unit_price: ipp.unit_price,
					amount: ipp.amount,
					product_id: ipp.product_id
				}))
			}


			this.editedItem = Object.assign({}, item)
			this.dialog = true
		},
		deleteItem (item) {
			this.editedIndex = this.pos.indexOf(item)
			this.editedItem = Object.assign({}, item)
			this.dialogDelete = true
		},
		deleteItemConfirm () {
			this.pos.splice(this.editedIndex, 1)
			this.closeDelete()
		},
		closeView () {
			this.dialogView = false
			this.$nextTick(() => {
				//this.editedItem = Object.assign({}, this.defaultItem)
				//this.editedIndex = -1
			})
		},
		close () {
			this.dialog = false
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			})
		},
		closeDelete () {
			this.dialogDelete = false
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			})
		},
		save () {
			if (this.editedIndex > -1) {
				Object.assign(this.pos[this.editedIndex], this.editedItem)
			} else {
				this.pos.push(this.editedItem)
			}
				this.close()
		},
		onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
		viewPoMobile(item) {
			// console.log(item);
			this.$store.dispatch("po/setPo", item)
			//this.$router.push(`pos/item?po_num=${item.po_number}`)
			//this.$router.push(`pos/item?po_num=${item.po_num}`)
			this.$router.push(`pos/item?id=${item.id}`)
		}
	},
	async mounted() {
		//set current page
		this.$store.dispatch("page/setPage","pos")
		this.fetchPo()
		this.fetchWarehouse()
		this.fetchProducts()
	},	
	updated() {
		
	}
};
</script>

<style>
@import '../assets/css/po_styles/po.css';
@import '../assets/css/dialog_styles/dialogHeader.css';
@import '../assets/css/dialog_styles/dialogBody.css';
@import '../assets/css/dialog_styles/dialogFooter.css';

</style>