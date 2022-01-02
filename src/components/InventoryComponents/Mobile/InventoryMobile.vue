<template>
    <div class="warehouse-mobile-view">
        <div class="warehouse-mobile-header">
            <div class="details-breadcrumbs">
                <router-link to="/inventory" class="warehouse-link">
                   Warehouses
                </router-link>

                <span class="right-chevron">
                    <img src="@/assets/images/right_chevron.svg" alt="" srcset="" width="7px"> 
                </span>

                <p class="mobile-warehouse-name">
                    <span v-if="!getSingleWarehouseLoading">
                        {{ (typeof selectedWarehouse !== null && selectedWarehouse.name !== null) ? 
                            selectedWarehouse.name : ''
                        }}
                    </span>

                    <span v-else>Loading...</span>
                </p>
            </div>
        </div>

        <div class="warehouse-mobile-table">
            <v-data-table
                :headers="headers"
                :items="warehouseInventories"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                @page-count="pageCount = $event"
                :search="search"
                mobile-breakpoint="769"
                class="inventory-table-mobile elevation-1"
                :class="(warehouseInventories !== null && 
                        warehouseInventories.length > 0) ? '' : 'no-data-table'"    
                hide-default-footer>

                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>                           
                            <span v-if="!getSingleWarehouseLoading">
                                {{ (typeof selectedWarehouse !== null && selectedWarehouse.name !== null) ? 
                                    selectedWarehouse.name : ''
                                }}
                            </span>

                            <span v-else>Loading...</span>
                        </v-toolbar-title>
                        
                        <v-spacer></v-spacer>	

                        <div class="subheader-wrapper">
                            <div class="subheader-button">
                                <v-btn color="primary" dark class="btn-white" @click="viewWarehouse()">
                                    <img src="../../../assets/icons/visibility.svg" alt="">
                                </v-btn>

                                <v-btn color="primary" dark class="btn-white" @click="editWarehouse()">
                                    <img src="../../../assets/icons/edit-inventory.svg" alt="">
                                </v-btn>

                                <v-btn color="primary" dark class="btn-blue" @click.stop="addInventory">
                                    Add Inventory
                                </v-btn>
                            </div>
                        </div>
                    </v-toolbar>

                    <div class="inventory-search-wrapper">
                        <p class="mb-0">Showing <span class="inventory-count">{{ productsCount }}</span> products</p>

                        <v-spacer></v-spacer>

                        <button class="btn btn-primary search-warehouse" @click="inputClick" v-if="warehouseInventories.length !== 0">
                            <img src="@/assets/images/search-icon.svg" alt="" width="15px" height="15px" class="mobile-search-icon" />
                        </button>

                        <div class="search" :class="isInputExpanded ? 'expanded' : ''">
                            <img src="@/assets/images/search-icon.svg" alt="" width="15px" height="15px" class="input-search-icon" :class="isInputExpanded ? 'expanded' : ''" />
                            
                            <input
                                class="search-asd" 
                                type="text"
                                id="search-input"
                                v-model.trim="search"
                                placeholder="Search warehouse..."
                                @input="handleSearch"
                                autocomplete="off" />
                        </div>

                        <button v-if="isInputExpanded" class="close-btn" @click="clearInput">
                            <img src="@/assets/images/close.svg" alt="" width="18px">
                        </button>
                    </div>
                </template>

                <template v-slot:[`item.sku`]="{ item }">                
                    <div class="inventory-wrapper">
                        <div class="sku">
                            SKU #<span style="font-family: 'Inter-SemiBold', sans-serif;">{{ item.product.sku }}</span>
                        </div>

                        <div class="d-flex justify-center align-center">
                            <button class="btn-edit mr-2" @click.stop="editInventory(item)">
                                <img src="../../../assets/icons/edit-inventory.svg" alt="">
                            </button>

                            <button class="btn-edit" style="padding: 6px 8px !important;"
                                :class="isDeleteDisabled(item)"
                                @click.stop="deleteInnerInventory(item)">
                            
                                <img src="../../../assets/icons/delete-blue.svg" alt="">
                            </button>
                        </div>
                    </div>
                </template>

                <template v-slot:[`item.name`]="{ item }">
                    <div class="inventory-wrapper content-start">
                        <div class="inventory-img">
                            <img :src="getImgUrl(item.product.image)" class="mr-2" v-bind:alt="item.product.image" width="68px" height="68px">
                        </div>

                        <div class="info-wrapper">
                            <p class="inventory-info">{{ item.product.name }}</p>
                            <p class="inventory-category p-grey">{{ getCategoryName(item.product.category_id) }}</p>
                            <p class="p-grey">{{ item.product.units_per_carton }} Units in each carton</p>
                        </div>
                    </div>
                </template>

                <template v-slot:[`item.carton_count`]="{ item }">
                    <div class="inventory-wrapper content-start">
                        <div class="info-wrapper mr-4">
                            <p class="inventory-info p-grey">
                                <span style="color: #4a4a4a !important; font-family: 'Inter-Medium', sans-serif;">
                                    {{ item.carton_count }}
                                </span> 
                                Cartons
                            </p>
                        </div>

                        <div class="info-wrapper">
                            <p class="inventory-info p-grey">
                                <span style="color: #4a4a4a !important; font-family: 'Inter-Medium', sans-serif;">
                                    {{ item.total_unit }}
                                </span> 
                                Units
                            </p>
                        </div>
                    </div>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div class="actions">								
                        <button class="btn-edit" @click.stop="editInventory(item)">
                            <img src="../../../assets/icons/edit-inventory.svg" alt="">
                        </button>
                    </div>
                </template>

                <template v-slot:no-data>
                    <div class="no-data-preloader mt-4" v-if="getInventoryLoading">
                        <v-progress-circular
                            :size="40"
                            color="#0171a1"
                            indeterminate>
                        </v-progress-circular>
                    </div>

                    <div class="no-data-wrapper" v-if="!getInventoryLoading && warehouseInventories.length == 0">
                        <div class="no-data-heading">
                            <img src="../../../assets/icons/empty-inventory-icon.svg" width="40px" height="42px" alt="">

                            <h3> Add Inventory </h3>
                            <p>
                                This warehouse doesn’t have any product in inventory.
                                <br> Let’s add the first product.
                            </p>

                            <div class="mt-4">
                                <v-btn color="primary" dark class="btn-blue" @click.stop="addInventory">
                                    Add Inventory
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </template>
            </v-data-table>

            <Pagination 
                v-if="typeof warehouseInventories !== 'undefined' && warehouseInventories.length > 0"
                :pageData.sync="page"
                :lengthData.sync="pageCount"
                :isMobile="isMobile"
            />
        </div>

        <InventoryAddDialog
            :items.sync="items"
            :currentWarehouseSelected="selectedWarehouse"
            :isMobile="isMobile"
            :dialogAddInventory.sync="dialogAddInventory"
            :editedInventoryIndex.sync="editedIndexInventory"
            :addInventoryItems.sync="editedItemInventory"
            :defaultInventoryItems="defaultItemInventory"
            @close="closeInventory" />

        <WarehouseViewDialog 
			:dialog.sync="dialogViewWarehouse"
			@close="closeViewWarehouse" 
			:currentWarehouse.sync="selectedWarehouse"
			@editWarehouse="editWarehouse"
			@deleteWarehouse="deleteWarehouse"
			:editedIndex.sync="editedIndexWarehouse"
			@closeDelete="closeDelete" />

		<WarehouseAddDialog 
			:dialog.sync="dialogWarehouse"
			:editedIndex.sync="editedIndexWarehouse"
			@close="closeWarehouse"
			:addWarehouseItems.sync="editedItemWarehouse"
			:isMobile="isMobile"			
			@deleteWarehouse="deleteWarehouse" />

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

        <!-- Inventory Delete -->
        <DeleteDialog 
            :dialogData.sync="dialogInventoryDelete"
            :editedItemData.sync="currentSelectedInventoryDelete"
            @delete="deleteItemConfirm"
            @close="closeInventoryDelete"
            :fromComponent="'inventory'"
            :loadingDelete="getDeleteInventoryLoading"
            componentName="Inventory"/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DeleteDialog from '../../Dialog/DeleteDialog.vue'
import _ from 'lodash'
import Pagination from '../../Pagination.vue'
import globalMethods from '../../../utils/globalMethods'

import WarehouseAddDialog from '../../../components/WarehouseComponents/Dialog/WarehouseAddDialog.vue'
import WarehouseViewDialog from '../../../components/WarehouseComponents/Dialog/WarehouseViewDialog.vue'
import InventoryAddDialog from '../Dialog/InventoryAddDialog.vue'

export default {
    name: 'InventoryMobile',
    props: [],
    components: {
        Pagination,
        DeleteDialog,
        WarehouseAddDialog,
        WarehouseViewDialog,
        InventoryAddDialog
    },
    data: () => ({
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        headers: [
			{
				text: 'SKU',
				align: 'start',
				sortable: false,
				value: 'sku',
				fixed: true,
				width: "135px"
			},
			{ 
				text: 'Name & Category',
				align: 'start',
				sortable: false,
				value: 'name',
				fixed: true,
				width: "300px" 
			},
			{ 
				text: 'Carton',
				align: 'end',
				sortable: false,
				value: 'carton_count',
				fixed: true,
				width: "100px" 
			},
			{ 
				text: 'In Each',
				align: 'end',
				sortable: false,
				value: 'in_each_carton',
				fixed: true,
				width: "100px" 
			},
			{ 
				text: 'Unit',
				align: 'end',
				sortable: false,
				value: 'total_unit',
				fixed: true,
				width: "120px" 
			},
			{ 
				text: '', 
				align: 'end',
				value: 'actions', 
				sortable: false,
				fixed: true,
				width: "50px" 
			},
		],
        search: '',
        isInputExpanded: false,
        searchData: '',
        isMobile: true,
        // Warehouse
        dialogViewWarehouse: false,
        dialogWarehouse:false,
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
        dialogWarehouseDelete: false,
        currentWarehouseItemToDelete: null,
        viewWarehouseData: null,
        // Inventory
        dialogAddInventory: false,
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
        dialogInventoryDelete: false,
        currentSelectedInventoryDelete: null
    }),
    async mounted() {
        // this.fetchWarehouse()
        // this.fetchProducts()

        let pageId = new URL(location.href).searchParams.get('id')

        if (pageId !== 'undefined' && pageId !== null) {
            this.fetchSingleWarehouse(pageId)

            try {
                await this.fetchInventories(pageId)
            } catch(e) {
                // console.log(e);
            }
        }
    },
    computed: {
        ...mapGetters({
            getInventory: 'inventory/getInventory',
            getInventoryLoading: 'inventory/getInventoryLoading',
            getCategories: 'category/getCategories',
            getSingleWarehouse: 'warehouse/getSingleWarehouse',
            getSingleWarehouseLoading: 'warehouse/getSingleWarehouseLoading',
            getWarehouse: 'warehouse/getWarehouse',
            getEditInventory: 'inventory/editInventory',
            getWarehouseDeleteLoading: 'warehouse/getWarehouseDeleteLoading',
            getDeleteInventoryLoading: 'inventory/getDeleteInventoryLoading'
        }),
        items: {
            get() {
                return this.getEditInventory
            },
            set (value) {
                this.setEditInventory(value)
            }
        },
        warehouseInventories() {
            let inventoryProducts = []

            if (typeof this.getInventory !== 'undefined' && this.getInventory !== null) {
                if (typeof this.getInventory.results !== 'undefined' && this.getInventory.results !== null) {
                    if (this.getInventory.results.length !== 'undefined') {
                        inventoryProducts = this.getInventory.results                      
                    }
                }
            }
            
            return inventoryProducts
        },
        productsCount() {
            let dataLength = 0

            if (this.warehouseInventories !== 'undefined' && this.warehouseInventories !== null) {
                if (this.warehouseInventories.length !== 'undefined') {
                    dataLength = this.warehouseInventories.length
                }
            }

            return dataLength
        },
        selectedWarehouse() {
            return (typeof this.getSingleWarehouse !== 'undefined' && this.getSingleWarehouse !== null) ? this.getSingleWarehouse : {}
        },
        warehousesLists() {
            return (typeof this.getWarehouse !== 'undefined' && this.getWarehouse !== null && this.getWarehouse.results !== 'undefined' && this.getWarehouse.results !== null && this.getWarehouse.results.data !== 'undefined' && this.getWarehouse.results.data !== null && this.getWarehouse.results.data.length !== 'undefined' && this.getWarehouse.results.data.length !== 0) ? this.getWarehouse.results.data : null
        }
    },
    methods: {
        ...mapActions({
			fetchInventories: 'inventory/fetchInventories',
            fetchSingleWarehouse: 'warehouse/fetchSingleWarehouse',
            fetchStates: 'warehouse/fetchStates',
            fetchCities: 'warehouse/fetchCities',
            fetchWarehouse: 'warehouse/fetchWarehouse',
            setIsEditing: 'inventory/setIsEditing',
            setEditInventory: 'inventory/setEditInventory',
            fetchProducts: 'products/fetchProducts',
            deleteSelectedWarehouse: 'warehouse/deleteSelectedWarehouse',
            deleteInventory: 'inventory/deleteInventory'
        }),
        ...globalMethods,
        inputClick() {
			this.isInputExpanded = true
		},
        clearInput() {
            this.isInputExpanded = false
        },
        handleSearch() {},
        getImgUrl(pic) {
            if (pic !== 'undefined' && pic !== null) {
				return pic
			} else {
				return require('../../../assets/icons/default-product-icon.svg')
			}
        },
        getCategoryName(id) {
			if(typeof this.getCategories !== 'undefined' && this.getCategories !== null 
                && this.getCategories.length !== 'undefined' && this.getCategories.length !== 0 && id) {
                let findSizeValue = _.find(this.getCategories, (e) => (e.id == id))

                if (typeof findSizeValue !== 'undefined') {
                    if (findSizeValue.name !== 'undefined') {
                        return findSizeValue.name
                    }
                } else {
                    return ''
                }
            }
		},
        // Warehouse
        viewWarehouse(warehouse) {
            this.viewWarehouseData = warehouse
            this.dialogViewWarehouse = true
        },
        async editWarehouse() {
			this.editedIndexWarehouse = _.findIndex(this.warehousesLists, e => (e.id == this.selectedWarehouse.id))
			this.editedItemWarehouse = Object.assign({}, this.selectedWarehouse)

			if (typeof this.selectedWarehouse.country!=='undefined' 
                && this.selectedWarehouse.country!==null && this.selectedWarehouse.country!=='') {
				this.fetchStates(this.selectedWarehouse.country)
				.then( response => {
					console.log(response)
					this.fetchCities({
					country: this.selectedWarehouse.country,
					states: this.selectedWarehouse.state
				})
				}).catch(e => {
					this.notificationError(e)
				})
            }

			this.dialogWarehouse = true
		},
        deleteWarehouse(item) {
			this.dialogWarehouseDelete = true
			this.currentWarehouseItemToDelete = item
		},
		async deleteWarehouseConfirm() {
			if (this.currentWarehouseItemToDelete !== null) {
                try {
                    await this.deleteSelectedWarehouse(this.currentWarehouseItemToDelete.id)
                    this.fetchWarehouse()
                    this.closeDelete()
                    this.closeWarehouse()
                    this.notificationMessage('Warehouse has been deleted.')
                    this.$router.push(`/inventory`)
                } catch (e) {
                    this.closeDelete()
                    this.notificationError(e)
                }
            }
		},
        closeViewWarehouse() {
			this.dialogViewWarehouse = false
		},
        closeWarehouse() {
            this.$nextTick(() => {
				this.editedItemWarehouse = Object.assign({}, this.defaultItemWarehouse)
				this.editedIndexWarehouse = -1
			})			
			this.dialogWarehouse = false
        },
        closeDelete() {
			this.$nextTick(() => {
				this.editedItemWarehouse = Object.assign({}, this.defaultItemWarehouse)
				this.editedIndexWarehouse = -1
			})
			this.dialogWarehouseDelete = false
		},
        // Inventory
        addInventory() {
            this.dialogAddInventory = true
        },
        editInventory(item) {
            let buildEditItem = [
                {
                    product: {
                        id: item.product_id,
                    },
                    carton_count: item.carton_count,
                    in_each_carton: item.in_each_carton,
                    total_unit: item.total_unit,
                    id: item.id
                }
            ]
            this.setEditInventory(buildEditItem)
            this.editedIndexInventory = _.findIndex(this.warehouseInventories, e => (e.id == buildEditItem.id))
			this.editedItemInventory = Object.assign({}, this.warehouseInventories[this.editedIndexInventory])
			this.setIsEditing(true)
            
            this.dialogAddInventory = true
        },
        closeInventory() {
            this.dialogAddInventory = false
			this.$nextTick(() => {
				this.editedIndexInventory = -1
				this.editedItemInventory = Object.assign({}, this.defaultItemInventory)				
			})
        },
        isDeleteDisabled(item) {
            if ((item.carton_count == 0 || item.carton_count == null) && 
                (item.total_unit == 0 || item.total_unit == null)) {
                return ''
            } else {
                return 'has-inventory-count'
            }
        },
        deleteInnerInventory(item) {
            if (item !== null) {
                if ((item.carton_count == 0 || item.carton_count == null) && 
                    (item.total_unit == 0 || item.total_unit == null)) {
                    this.dialogInventoryDelete = true
                    this.currentSelectedInventoryDelete = item
                    this.currentSelectedInventoryDelete.name = item.product.name
                } else {
                   this.notificationErrorCustom("Product can’t be deleted as there’s unit available in the inventory.")
                }
            }            
        },
        async deleteItemConfirm() {
            if (this.currentSelectedInventoryDelete !== null) {
                let { warehouse_id, id } = this.currentSelectedInventoryDelete

                let payload = {
                    warehouseId: warehouse_id,
                    inventoryId: id
                }
                
                try {
                    await this.deleteInventory(payload)
                    this.fetchInventories(warehouse_id)
                    this.closeInventoryDelete()
                    this.notificationMessage('Inventory has been deleted.')
                } catch(e) {
                    this.closeInventoryDelete()
                    this.notificationError(e)
                }
            }
        },  
        closeInventoryDelete() {
            this.dialogInventoryDelete = false
        }
    },
    updated() {}
}
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/inventory/inventoryMobile.scss';
@import '../../../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../../../assets/scss/buttons.scss';

/* @import '../../../assets/css/inventory_styles/inventoryMobile.css';
@import '../../../assets/css/dialog_styles/dialogHeader.css';
@import '../../../assets/css/dialog_styles/dialogBody.css';
@import '../../../assets/css/dialog_styles/dialogFooter.css'; */
</style>
