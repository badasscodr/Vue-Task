<template>
    <div class="inventory-body-container-wrapper" v-resize="onResize">
		<div class="inventory-content-wrapper">
			<div class="inventory-header">
				<h2>Inventory</h2>

				<AddWarehouseDialog 
					:pageData.sync="page"
					:itemsPerPage="itemsPerPage"
					:lengthData.sync="pageCount"
					:editedIndexWarehouse.sync="editedIndexWarehouse"
					:dialogDataWarehouse.sync="dialogWarehouse"
					:editedItemWarehouse.sync="editedItemWarehouse"
					:defaultItemWarehouse.sync="defaultItemWarehouse"
					@closeWarehouse="closeWarehouse"
					:dialogWarehouseDelete.sync="dialogWarehouseDelete"
					@deleteWarehouse="deleteWarehouse"
					@deleteWarehouseConfirm="deleteWarehouseConfirm"
					@closeDelete="closeDelete" 
					@getFirstWarehouse="getFirstWarehouse"
					:isMobile="isMobile" />		
			</div>

			<div class="inventory-body-wrapper">
				<div class="inventory-body-load" v-if="getWarehouseLoading">
					<div class="inventory-body-loading">
						<v-progress-circular
							:size="40"
							color="#0171a1"
							indeterminate
							v-if="getWarehouseLoading">
						</v-progress-circular>
					</div>
				</div>

				<div class="inventory-body" v-if="!getWarehouseLoading && warehousesLists !== null">
					<WarehouseLists 
						:defaultItemWarehouse.sync="defaultItemWarehouse"
						:dialogWarehouseDelete.sync="dialogWarehouseDelete"
						@deleteWarehouse="deleteWarehouse"
						@deleteWarehouseConfirm="deleteWarehouseConfirm"
						@closeDelete="closeDelete"
						:editedIndexWarehouse.sync="editedIndexWarehouse"
						:editedItemWarehouse.sync="editedItemWarehouse"
						:warehousesLists="warehousesLists"
						:currentWarehouseSelected.sync="currentWarehouseSelected"
						@editWarehouse="editWarehouse"
						@viewWarehouse="viewWarehouse"
						:isMobile="isMobile" />

					<WarehousesDesktopTable
						:editedIndexWarehouse.sync="editedIndexWarehouse"
						:warehousesLists="warehousesLists"
						:currentWarehouseSelected.sync="currentWarehouseSelected"
						:viewWarehouseData.sync="viewWarehouseData"
						:dialogViewWarehouse.sync="dialogViewWarehouse"
						:dialogDataWarehouse.sync="dialogWarehouse"
						:editedItemWarehouse.sync="editedItemWarehouse"
						@editWarehouse="editWarehouse"
						@viewWarehouse="viewWarehouse"
						@deleteWarehouse="deleteWarehouse"
						@deleteWarehouseConfirm="deleteWarehouseConfirm"
						:dialogWarehouseDelete.sync="dialogWarehouseDelete"
						@closeWarehouse="closeWarehouse"
						@closeViewWarehouse="closeViewWarehouse"
						:dialogInventory.sync="dialogInventory"
						:editedIndexInventory.sync="editedIndexInventory"
						:editedItemInventory.sync="editedItemInventory"
						@editInventory="editInventory"
						@closeInventory="closeInventory"
						:isMobile="isMobile"
						v-if="!isMobile" />	
				</div>			

				<div class="inventory-body no-data" v-if="!getWarehouseLoading && warehousesLists == null">
					<div class="no-data-heading">
						<img src="../assets/icons/empty-warehouse-icon.svg" width="40px" height="42px" alt="">

						<h3> Add Warehouse </h3>
						<p>
							Let’s add your first warehouse on Shifl. <br>
							Warehouses are the location where you get your items shipped.
						</p>

						<div class="mt-4">
							<AddWarehouseDialog 
								:pageData.sync="page"
								:itemsPerPage="itemsPerPage"
								:lengthData.sync="pageCount"
								:editedIndexWarehouse.sync="editedIndexWarehouse"
								:dialogDataWarehouse.sync="dialogWarehouse"
								:editedItemWarehouse.sync="editedItemWarehouse"
								:defaultItemWarehouse.sync="defaultItemWarehouse"
								@closeWarehouse="closeWarehouse"
								:dialogWarehouseDelete.sync="dialogWarehouseDelete"
								@deleteWarehouse="deleteWarehouse"
								@deleteWarehouseConfirm="deleteWarehouseConfirm"
								@closeDelete="closeDelete" 
								@getFirstWarehouse="getFirstWarehouse"
								:isMobile="isMobile" />	
						</div>
					</div>			
				</div>
			</div>
		</div>

		<DeleteDialog 
            :dialogData.sync="dialogWarehouseDelete"
            :editedItemData.sync="currentWarehouseItemToDelete"
            :editedIndexWarehouse.sync="editedIndexWarehouse"
            :defaultItemWarehouse.sync="defaultItemWarehouse"
            @delete="deleteWarehouseConfirm"
            @close="closeDelete"
            fromComponent="warehouse"
            :loadingDelete="getWarehouseDeleteLoading"
            componentName="Warehouse" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AddWarehouseDialog from '../../components/WarehouseComponents/BackUpCodes/AddWarehouseDialog.vue'
import WarehouseLists from '../../components/WarehouseComponents/WarehouseLists.vue'
import WarehousesDesktopTable from '../../components/Tables/Warehouses/BackUpCodes/BackUpTableCode.vue'
import DeleteDialog from '../../components/Dialog/DeleteDialog.vue'
import globalMethods from '../../utils/globalMethods'
import _ from 'lodash'

export default {
    name: "Inventory",
	components: {
		AddWarehouseDialog,
		WarehouseLists,
		WarehousesDesktopTable,
		DeleteDialog,
	},
	data: () => ({
		page: 1,
        pageCount: 0,
        itemsPerPage: 35,
		// warehouse data
		defaultWarehouseType: 'own',
		dialogWarehouse: false,
		dialogViewWarehouse: false,
		dialogWarehouseDelete: false,
		editedIndexWarehouse: -1,
		editedItemWarehouse: {
            name: '',
            phone: '',
            address: '',
            country: '',
            state: '',
            city: '',
            zipcode: '',
            products: [],
            warehouse_type: null,
			warehouse_type_id: null
        },
        defaultItemWarehouse: {
            name: '',
            phone: '',
            address: '',
            country: '',
            state: '',
            city: '',
            zipcode: '',
            products: [],
            warehouse_type: null,
			warehouse_type_id: null
        },
		currentWarehouseItemToDelete: null,
		viewWarehouseData: null,
		// selectedWarehouse: null,
		currentWarehouseSelected: null,
		currentWarehouseSelectedCopy: null,
		// inventory data
		dialogInventory: false,
		editedIndexInventory: -1,
		editedItemInventory: {
			product: {
				id: '',
			},
			carton_count: '',
			in_each_carton: '',
			total_unit: ''
		},
		defaultItemInventory: {
			product: {
				id: '',
			},
			carton_count: '',
			in_each_carton: '',
			total_unit: ''
		},
		isMobile: false,
	}),
	computed: {
		...mapGetters({
            getWarehouse: 'warehouse/getWarehouse',
			getWarehouseLoading: 'warehouse/getWarehouseLoading',
			getInventory: 'inventory/getInventory',
			getInventoryLoading: 'inventory/getInventoryLoading',
			getStates: 'warehouse/getStates',
			getWarehouseDeleteLoading: 'warehouse/getWarehouseDeleteLoading'
        }),
		getAllWarehousesData() {
			return typeof this.getWarehouse !== 'undefined' && this.getWarehouse !== null ? this.getWarehouse.results : null
		},
		warehousesLists() {
			// get the warehouse lists under this.getWarehouse.data
			let warehouses = null

			if (typeof this.getAllWarehousesData !== 'undefined' && this.getAllWarehousesData !== null && 
				this.getAllWarehousesData.data !== 'undefined' && this.getAllWarehousesData.data.length !== 0) {

				warehouses = this.getAllWarehousesData.data
				let warehouseSort = this.$store.state.warehouse.currentSort

				if (warehouses !== null) {
					if ( warehouseSort==='name-asc') {
						warehouses = _.orderBy(warehouses, ['name'], ['asc']);
					} else if( warehouseSort=='name-desc') {
						warehouses = _.orderBy(warehouses, ['name'], ['desc']);
					} else if ( warehouseSort=='location-asc') {
						warehouses = _.orderBy(warehouses, ['address'], ['asc'])
					} else if ( warehouseSort=='location-desc') {
						warehouses = _.orderBy(warehouses, ['address'], ['desc'])
					} else if ( warehouseSort=='cartons-asc') {
						warehouses = _.orderBy(warehouses, ['total_cartons'], ['asc'])
					} else if ( warehouseSort=='cartons-desc') {
						warehouses = _.orderBy(warehouses, ['total_cartons'], ['desc'])
					} else if ( warehouseSort=='units-asc') {
						warehouses = _.orderBy(warehouses, ['total_units'], ['asc'])
					} else if ( warehouseSort=='units-desc') {
						warehouses = _.orderBy(warehouses, ['total_units'], ['desc'])
					} else {
						warehouses = _.orderBy(warehouses, ['name'], ['asc'])
					}
				}
			}

			return warehouses
		},		       
		warehousesLength() {
			// get the length of the warehousesLists
			return typeof this.warehousesLists !== 'undefined' && 
                this.warehousesLists !== null && 
                this.warehousesLists.length !== 'undefined' ? 
                this.warehousesLists.length : null
		},
		warehouseProducts() {
			return typeof this.getInventory !== 'undefined' && this.getInventory !== null && 
				typeof this.getInventory.results !== 'undefined' && this.getInventory.results !== null && 
				this.getInventory.results.data !== 'undefined' && this.getInventory.results.data !== null &&
				this.getInventory.results.data.length !== 'undefined' ? this.getInventory.results.data : null
		}
	},
	watch: {},
	created () {},
	methods: {
		...mapActions({
            fetchWarehouse: 'warehouse/fetchWarehouse',
			fetchCountries: 'warehouse/fetchCountries',
			deleteSelectedWarehouse: 'warehouse/deleteSelectedWarehouse',
			fetchInventories: 'inventory/fetchInventories',
			fetchCategories: 'category/fetchCategories',
			fetchProducts: 'products/fetchProducts',
			setEditInventory: 'inventory/setEditInventory',
			setIsEditing: 'inventory/setIsEditing',
            fetchStates: 'warehouse/fetchStates',
            fetchCities: 'warehouse/fetchCities',
			setActiveId: 'warehouse/setActiveId'
        }),
		...globalMethods,
		onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
		// warehouse
		async getFirstWarehouse() {
			if (this.warehousesLists !== null) {
				this.currentWarehouseSelected = this.warehousesLists[0]

				if (this.currentWarehouseSelected !== null) {
					let id = this.currentWarehouseSelected.id
					this.setActiveId(id)

					try {
						await this.fetchInventories(id)
					} catch(e) {
						console.log(e);
					}
				}
			} else {
				this.currentWarehouseSelected = null
			}
		},
		async editWarehouse(warehouse) {
			if (typeof warehouse !== 'undefined' && warehouse !== 'undefined') {
				this.editedIndexWarehouse = this.warehousesLists.indexOf(warehouse)
				this.editedItemWarehouse = Object.assign({}, warehouse)
				if (typeof warehouse.country!=='undefined' && warehouse.country!==null && warehouse.country!=='') {
					this.fetchStates(warehouse.country)
					.then( response => {
						console.log(response)
						this.fetchCities({
							country: warehouse.country,
							states: warehouse.state
						})
					}).catch(e => {
						console.log(e)
					})	
				}
			} else {
				this.editedIndexWarehouse = this.warehousesLists.indexOf(this.currentWarehouseSelected)
				this.editedItemWarehouse = Object.assign({}, this.currentWarehouseSelected)
				if (typeof this.currentWarehouseSelected.country!=='undefined' && this.currentWarehouseSelected.country!==null && this.currentWarehouseSelected.country!=='') {
					this.fetchStates(this.currentWarehouseSelected.country)
					.then( response => {
						console.log(response)
						this.fetchCities({
							country: this.currentWarehouseSelected.country,
							states: this.currentWarehouseSelected.state
						})
					}).catch(e => {
						console.log(e)
					})	
				}
			}

			this.dialogWarehouse = true
		},
		viewWarehouse(warehouse) {
			this.viewWarehouseData = warehouse
			this.dialogViewWarehouse = true
		},
		closeWarehouse() {
			this.$nextTick(() => {
				this.editedItemWarehouse = Object.assign({}, this.defaultItemWarehouse)
				this.editedIndexWarehouse = -1
			})			
			this.dialogWarehouse = false
		},
		closeViewWarehouse() {
			this.dialogViewWarehouse = false
		},
		deleteWarehouse(item) {
			this.dialogWarehouseDelete = true
			this.currentWarehouseItemToDelete = item
		},
		async deleteWarehouseConfirm() {
			if (this.currentWarehouseItemToDelete !== null) {
                try {
                    await this.deleteSelectedWarehouse(this.currentWarehouseItemToDelete.id)
                    this.notificationMessage('Warehouse has been deleted.')
                    this.closeDelete()
					this.closeWarehouse()
					this.closeViewWarehouse()
                    await this.fetchWarehouse()
					await this.getFirstWarehouse()
	
                } catch (e) {
                    this.closeDelete()
					this.closeWarehouse()
					this.closeViewWarehouse()
                    this.notificationError(e)
                }
            }
		},
		closeDelete() {
			this.$nextTick(() => {
				this.editedItemWarehouse = Object.assign({}, this.defaultItemWarehouse)
				this.editedIndexWarehouse = -1
			})
			this.dialogWarehouseDelete = false
		},
		// inventory
		editInventory(item) {
			this.editedIndexInventory = this.warehouseProducts.indexOf(item)
			this.editedItemInventory = Object.assign({}, this.warehouseProducts[this.editedIndexInventory])
			this.dialogInventory = true
			this.setIsEditing(true)
			//this.setEditInventory(item)
		},
		closeInventory() {
			this.dialogInventory = false
			this.$nextTick(() => {
				this.editedIndexInventory = -1
				this.editedItemInventory = Object.assign({}, this.defaultItemInventory)				
			})
		},
		deleteInventory() {},
	},
	async mounted() {
		//set current page
        this.$store.dispatch("page/setPage", "inventory");
		this.fetchCountries()
		this.fetchCategories()
		this.fetchProducts()

		try {
			await this.fetchWarehouse()
			if (!this.isMobile) {
				await this.getFirstWarehouse()
			}			
		} catch(e) {
			// console.log(e);
		}
	},
	updated() {}
};
</script>

<style>
@import '../assets/css/inventory_styles/inventory.css';
@import '../assets/css/dialog_styles/dialogHeader.css';
@import '../assets/css/dialog_styles/dialogBody.css';
@import '../assets/css/dialog_styles/dialogFooter.css';
</style>