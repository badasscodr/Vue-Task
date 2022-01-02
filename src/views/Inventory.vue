<template>
    <div class="inventory-body-container-wrapper" v-resize="onResize">
		<div class="inventory-content-wrapper">
			<div class="inventory-header">
				<h2>Inventory</h2>

				<v-btn dark color="primary" class="btn-white btn-add-warehouse" @click.stop="addWarehouse">
                    Add Warehouse
                </v-btn>
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
					<WarehousesLists 
						:items="warehousesLists"
						:currentWarehouseSelected.sync="currentWarehouseSelected"
						:isMobile="isMobile"
						@editWarehouse="editWarehouse"
						@deleteWarehouse="deleteWarehouse"
						@viewWarehouse="viewWarehouse" />

					<WarehouseDesktopTable
						:currentWarehouseSelected.sync="currentWarehouseSelected" 
						:isMobile="isMobile"
						@editWarehouse="editWarehouse"
						@viewWarehouse="viewWarehouse"
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
							<v-btn dark color="primary" class="btn-blue btn-add-warehouse" @click.stop="addWarehouse">
								Add Warehouse
							</v-btn>
						</div>
					</div>			
				</div>
			</div>
		</div>

		<WarehouseViewDialog 
			:dialog.sync="dialogViewWarehouse"
			@close="closeViewWarehouse" 
			:currentWarehouse.sync="addWarehouseItems"
			@editWarehouse="editWarehouse"
			@deleteWarehouse="deleteWarehouse"
			:editedIndex.sync="editedWarehouseIndex"
			@closeDelete="closeDelete" />

		<WarehouseAddDialog 
			:dialog.sync="dialogAddWarehouse"
			:editedIndex.sync="editedWarehouseIndex"
			@close="closeAddWarehouse"
			:addWarehouseItems.sync="addWarehouseItems"
			@getFirstWarehouse="getFirstWarehouse"
			:isMobile="isMobile"			
			@deleteWarehouse="deleteWarehouse" />

		<DeleteDialog 
            :dialogData.sync="dialogWarehouseDelete"
            :editedItemData.sync="currentWarehouseItemToDelete"
            :editedIndexWarehouse.sync="editedWarehouseIndex"
            :defaultItemWarehouse.sync="defaultWarehouseItems"
            @delete="deleteWarehouseConfirm"
            @close="closeDelete"
            fromComponent="warehouse"
            :loadingDelete="getWarehouseDeleteLoading"
            componentName="Warehouse" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import globalMethods from '../utils/globalMethods'
import _ from 'lodash'
import WarehouseAddDialog from '../components/WarehouseComponents/Dialog/WarehouseAddDialog.vue'
import WarehousesLists from '../components/WarehouseComponents/WarehousesLists.vue'
import WarehouseDesktopTable from '../components/Tables/Warehouses/WarehouseDesktopTable.vue'
import WarehouseViewDialog from '../components/WarehouseComponents/Dialog/WarehouseViewDialog.vue'
import DeleteDialog from '../components/Dialog/DeleteDialog.vue'

export default {
    name: "Inventory",
	components: {
		WarehouseAddDialog,
		WarehousesLists,
		WarehouseDesktopTable,
		WarehouseViewDialog,
		DeleteDialog,
	},
	data: () => ({
		isMobile: false,
		dialogAddWarehouse: false,
		editedWarehouseIndex: -1,
		currentWarehouseSelected: null,		
        addWarehouseItems: {
            name: '',
			email_address: null,
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
        defaultWarehouseItems: {
            name: '',
			email_address: null,
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
		dialogViewWarehouse: false,
		dialogWarehouseDelete: false,
		currentWarehouseItemToDelete: null,
	}),
	computed: {
		...mapGetters({
			getWarehouse: 'warehouse/getWarehouse',
			getWarehouseLoading: 'warehouse/getWarehouseLoading',
			getWarehouseDeleteLoading: 'warehouse/getWarehouseDeleteLoading'
		}),
		getAllWarehousesData() {
			return typeof this.getWarehouse !== 'undefined' && this.getWarehouse !== null ? this.getWarehouse.results : null
		},
		warehousesLists() {
			let warehouses = null

			if (typeof this.getAllWarehousesData !== 'undefined' && this.getAllWarehousesData !== null && 
				this.getAllWarehousesData.length !== 'undefined' && this.getAllWarehousesData.length !== 0) {

				warehouses = this.getAllWarehousesData
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
		onResize() {
            if (window.innerWidth < 1023) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
		...globalMethods,
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
		addWarehouse() {
			this.dialogAddWarehouse = true
			
			this.$nextTick(() => {
				this.addWarehouseItems = Object.assign({}, this.defaultWarehouseItems)
				this.editedWarehouseIndex = -1
			})
		},
		editWarehouse(warehouse) {
			this.addWarehouseItems = Object.assign({}, warehouse)
			this.editedWarehouseIndex = _.findIndex(this.warehousesLists, e => (e.id == warehouse.id))
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
			
			this.dialogAddWarehouse = true
		},
		closeAddWarehouse() {
			this.$nextTick(() => {
				this.addWarehouseItems = Object.assign({}, this.defaultWarehouseItems)
				this.editedWarehouseIndex = -1
			})
			this.dialogAddWarehouse = false
		},
		deleteWarehouse(item) {
			this.dialogWarehouseDelete = true
			this.currentWarehouseItemToDelete = item
		},
		viewWarehouse(warehouse) {
			this.addWarehouseItems = Object.assign({}, warehouse)
			this.dialogViewWarehouse = true
		},
		closeViewWarehouse() {			
			this.dialogViewWarehouse = false
		},
		async deleteWarehouseConfirm() {
			if (this.currentWarehouseItemToDelete !== null) {
                try {
                    await this.deleteSelectedWarehouse(this.currentWarehouseItemToDelete.id)
                    this.notificationMessage('Warehouse has been deleted.')
                    await this.fetchWarehouse()
					await this.getFirstWarehouse()
                    this.closeDelete()
					this.closeAddWarehouse()
					this.closeViewWarehouse()
	
                } catch (e) {
                    this.notificationError(e)
                }
            }
		},
		closeDelete() {
			this.dialogWarehouseDelete = false
		}
	},
	async mounted() {
		//set current page
        this.$store.dispatch("page/setPage", "inventory");
		this.fetchCountries()
		this.fetchCategories()
		// this.fetchProducts()

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

<style lang="scss">
@import '../assets/scss/pages_scss/inventory/inventory.scss';
@import '../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../assets/scss/buttons.scss';

/* @import '../assets/css/inventory_styles/inventory.css';
@import '../assets/css/dialog_styles/dialogHeader.css';
@import '../assets/css/dialog_styles/dialogBody.css';
@import '../assets/css/dialog_styles/dialogFooter.css'; */
</style>
