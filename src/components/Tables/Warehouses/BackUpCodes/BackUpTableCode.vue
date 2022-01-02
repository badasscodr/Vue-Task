<template>
    <div class="warehouse-table-wrapper">
        <v-data-table
            :headers="headers"
            :items="currentWarehouseProducts"
            :search="search"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
            mobile-breakpoint="769"
            class="inventory-table elevation-1"
            :class="(currentWarehouseProducts !== null && 
                    currentWarehouseProducts.length > 0) ? '' : 'no-data-table'"
            hide-default-footer>

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>
                        {{ currentWarehouseSelected !== 'undefined' && currentWarehouseSelected !== null && currentWarehouseSelected.name !== '' ?  currentWarehouseSelected.name : ''}}
                    </v-toolbar-title>
                    
                    <v-spacer></v-spacer>									

                    <v-btn color="primary" dark class="btn-white" @click="viewWarehouse(currentWarehouseSelected)" 
                        v-if="currentWarehouseSelected !== null">
                        <img src="../../../assets/icons/visibility.svg" alt="">
                    </v-btn>

                    <v-btn color="primary" dark class="btn-white" @click="editWarehouse(currentWarehouseSelected)" 
                        v-if="currentWarehouseSelected !== null">
                        <img src="../../../assets/icons/edit-inventory.svg" alt="">
                    </v-btn>

                    <ViewWarehouse 
                        :dialogWarehouseDelete.sync="dialogWarehouseDeleteData"
                        @editWarehouse="editWarehouse"
                        :editedIndexWarehouse.sync="editedIndexWarehouseData"
                        :dialogEdit.sync="dialogEdit"
                        :editedItemWarehouse.sync="editedItemWarehouse"
                        :dialogView.sync="dialogView"
                        :dialogDataWarehouse.sync="dialogDataWarehouse"
                        :selectedWarehouse="currentWarehouseSelected"
                        @closeViewWarehouse="closeViewWarehouse"
                        :viewWarehouseData.sync="viewWarehouseData"
                        @deleteWarehouse="deleteWarehouse" />

                    <AddInventoryDialog
                        :items.sync="items"
                        :dialogData.sync="dialogEditInventory"
                        :currentWarehouseSelected="currentWarehouseSelected"
                        :editedItemData.sync="editedInventoryItem"
                        :editedIndexData.sync="editedIndexInventory"
                        @editInventory="editInventory"
                        @closeInventory="closeInventory"
                        :isMobile="isMobile" />

                   <DeleteDialog 
                        :dialogData.sync="dialogDelete"
                        :editedItemData.sync="currentSelectedInventoryDelete"
                        @delete="deleteItemConfirm"
                        @close="closeDelete"
                        :fromComponent="'inventory'"
                        :loadingDelete="getDeleteInventoryLoading"
                        componentName="Inventory"/>
                </v-toolbar>

                <div class="inventory-search-wrapper">
                    <p>Showing <span class="inventory-count">{{ productsCount }}</span> products</p>
                    <v-spacer></v-spacer>
                    
                    <Search 
                        placeholder="Search Products"
                        className="search custom-search"
                        :inputData.sync="search" />
                </div>
            </template>

            <template v-slot:[`item.sku`]="{ item }">                
                <div class="inventory-wrapper">
                    <div> {{ item.sku }}</div>
                </div>
            </template>

            <template v-slot:[`item.name`]="{ item }">
                <div class="inventory-wrapper">
                    <div class="inventory-img">
                        <img :src="getImgUrl(item.image)" v-bind:alt="item.image" width="56px" height="56px">
                    </div>

                    <div class="info-wrapper">
                        <p class="inventory-info">{{ item.name }}</p>
                        <p class="inventory-category">{{ getCategoryName(item.category_id) }}</p>
                    </div>
                </div>
            </template>

            <template v-slot:[`item.carton_count`]="{ item }">                
                <span>{{ item.carton_count !== null ? item.carton_count : 0 }}</span>
            </template>

            <template v-slot:[`item.total_unit`]="{ item }">                
                <span>{{ item.total_unit !== null ? item.total_unit : 0 }}</span>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <div class="actions">								
                    <button class="btn-edit mr-2" @click.stop="editInventory(item)">
                        <img src="../../../assets/icons/edit-inventory.svg" alt="">
                    </button>

                    <button class="btn-delete" 
                        :class="isDeleteDisabled(item)"
                        @click.stop="deleteInnerInventory(item)">
                        
                        <img src="../../../assets/icons/delete-blue.svg" alt="">
                    </button>
                </div>
            </template>

            <template v-slot:no-data>
                <div class="loading-wrapper" v-if="getInventoryLoading">
                    <v-progress-circular
                        :size="40"
                        color="#0171a1"
                        indeterminate>
                    </v-progress-circular>
                </div>
                
                <div class="no-data-wrapper" v-if="!getInventoryLoading && currentWarehouseProducts.length == 0">
                    <div class="no-data-heading">
                        <img src="../../../assets/icons/empty-inventory-icon.svg" width="40px" height="42px" alt="">

                        <h3> Add Inventory </h3>
                        <p>
                            This warehouse doesn’t have any product in inventory.
                            <br> Let’s add the first product.
                        </p>

                        <div class="mt-4">
                            <AddInventoryDialog
                                :items.sync="items"
                                :dialogData.sync="dialogEditInventory"
                                :currentWarehouseSelected="currentWarehouseSelected"
                                :editedItemData.sync="editedInventoryItem"
                                :editedIndexData.sync="editedIndexInventory"
                                @editInventory="editInventory"
                                @closeInventory="closeInventory"
                                :isMobile="isMobile" />
                        </div>
                    </div>
                </div>
            </template>
        </v-data-table>        
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import ViewWarehouse from '../../../WarehouseComponents/ViewWarehouse.vue'
import AddInventoryDialog from '../../../InventoryComponents/AddInventoryDialog.vue'
import DeleteDialog from '../../../Dialog/DeleteDialog.vue'
import Search from '../../../Search.vue'
import globalMethods from '../../../../utils/globalMethods'
import _ from 'lodash'

export default {
    name: 'WarehousesDesktopTable',
    props: ['warehousesLists', 'currentWarehouseSelected', 'dialogViewWarehouse', 
            'dialogDataWarehouse', 'editedItemWarehouse', 'dialogInventory',
            'editedIndexInventory', 'editedItemInventory', 'isMobile',
            'pageData', 'itemsPerPage', 'lengthData', 'editedIndexWarehouse', 
            'dialogWarehouseDelete', 'viewWarehouseData'],
    components: {
        ViewWarehouse,
        AddInventoryDialog,
        Search,
        DeleteDialog
    },
    data: () => ({
        search: '',
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
				value: 'product_in_each_carton',
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
        currentSelectedInventoryDelete: null,
        dialogDelete: false,
        dialogDeleteWarehouse: false
    }),
    computed: {
        ...mapGetters({
            getInventory: 'inventory/getInventory',
            getInventoryLoading: 'inventory/getInventoryLoading',
            getCategories: 'category/getCategories',
            getEditInventory: 'inventory/editInventory',
            getDeleteInventoryLoading: 'inventory/getDeleteInventoryLoading',
            getCurrentWarehouse: 'warehouse/getCurrentWarehouse'
        }),
        dialogWarehouseDeleteData: {
            get() {
                return this.dialogWarehouseDelete
            },
            set(value) {
                this.$emit('update:dialogWarehouseDelete', value)
            }
        },
        editedIndexWarehouseData: {
            get() {
                return this.editedIndexWarehouse
            },
            set(value) {
                this.$emit('update:editedIndexWarehouse', value)
            }
        },
        items: {
            get() {
                return this.getEditInventory
            },
            set (value) {
                this.setEditInventory(value)
            }
        },
        categoryLists() {
            let categoryListsData = []

            if (typeof this.getCategories !== 'undefined' && this.getCategories!==null && this.getCategories.length > 0) {
				categoryListsData = this.getCategories.map((value) => {
					return {
						id: value.id,
						name: value.name
					}
				})
			} 

            return categoryListsData
        },
        page: {
            get() {
                return this.pageData
            },
            set (value) {
                this.$emit('update:pageData', value)
            }
        },
        pageCount: {
            get() {
                return this.lengthData
            },
            set (value) {
                this.$emit('update:lengthData', value)
            }
        },
        // warehouse
        dialogEdit: {
            get() {
                return this.dialogDataWarehouse
            },
            set(value) {
                if (!value) {
                    this.$emit('update:dialogDataWarehouse', false)
                } else {
                    this.$emit('update:dialogDataWarehouse', true)
                }
            }
        },
        dialogView: {
            get() {
                return this.dialogViewWarehouse
            },
            set(value) {
                if (!value) {
                    this.$emit('update:dialogViewWarehouse', false)
                } else {
                    this.$emit('update:dialogViewWarehouse', true)
                }
            }
        },
        editedWarehouseItem: {
            get() {
                return this.editedItemWarehouse
            },
            set(value) {
                console.log(value);
            }
        },        
		currentWarehouseProducts() {
            let inventoryProducts = []

            if (typeof this.getInventory !== 'undefined' && this.getInventory !== null) {
                if (typeof this.getInventory.results !== 'undefined' && this.getInventory.results !== null) {
                    if (this.getInventory.results.data !== 'undefined' && this.getInventory.results.data !== null) {
                        if (this.getInventory.results.data.length !== 'undefined') {
                            inventoryProducts = this.getInventory.results.data
                            
                            inventoryProducts = inventoryProducts.map ( item => {

                                let newItem = {}
                                let {
                                    product,
                                    ...otherItems
                                } = item

                                newItem = {
                                    name: product!==null ? product.name : '',
                                    sku: product!==null ? product.sku : '',
                                    category_id: product!==null ? product.category_id : '',
                                    image: product!==null ? product.image : null,
                                    product_in_each_carton: product !== null ? product.units_per_carton : null,
                                    ...otherItems
                                }

                                return newItem
                            })                            
                        }
                    }
                }
            }
            
            return inventoryProducts
        },
        productsCount() {
            let dataLength = 0

            if (this.currentWarehouseProducts !== 'undefined' && this.currentWarehouseProducts !== null) {
                if (this.currentWarehouseProducts.length !== 'undefined') {
                    dataLength = this.currentWarehouseProducts.length
                }
            }

            return dataLength
        },
        // inventory
        dialogEditInventory: {
            get() {
                return this.dialogInventory
            },
            set(value) {
                if (!value) {
                    this.$emit('update:dialogInventory', false)
                } else {
                    this.$emit('update:dialogInventory', true)
                }
            }
        },
        editedInventoryItem: {
            get() {
                return this.editedItemInventory
            },
            set(value) {
                console.log(value);
            }
        },
    },
    methods: {
        ...mapActions({
            fetchSingleProduct: 'products/fetchSingleProduct',
            setEditInventory: 'inventory/setEditInventory',
            deleteInventory: 'inventory/deleteInventory',
            fetchInventories: 'inventory/fetchInventories'
        }),
        ...globalMethods,
        getImgUrl(pic) {
            if (pic !== 'undefined' && pic !== null) {
				return pic
			} else {
				return require('../../../assets/icons/default-product-icon.svg')
			}
        },
        getCategoryName(id) {
			if(this.categoryLists.length !== 0 && id) {
                let findSizeValue = _.find(this.categoryLists, (e) => (e.id == id))

                if (typeof findSizeValue !== 'undefined') {
                    if (findSizeValue.name !== 'undefined') {
                        return findSizeValue.name
                    }
                } else {
                    return ''
                }
            }
		},
        // warehouse
        viewWarehouse(warehouse) {
            this.$emit('viewWarehouse', warehouse)
        },
        editWarehouse(warehouse) {
            this.$emit('editWarehouse', warehouse)
        },
        closeViewWarehouse() {
            this.$emit('closeViewWarehouse')
        },
        deleteWarehouse(item) {
            this.$emit('deleteWarehouse', item)
        },
        deleteWarehouseConfirm() {
            this.$emit('deleteWarehouseConfirm', this.editedItemWarehouse)
        },
        // inventory
        editInventory(item) {            
            let buildEditItem = [
                {
                    product: {
                        id: item.product_id
                    },
                    carton_count: item.carton_count,
                    in_each_carton: item.in_each_carton,
                    total_unit: item.total_unit,
                    id: item.id
                }
            ]
            this.setEditInventory(buildEditItem)
            this.$emit('editInventory', buildEditItem)
        },
        closeInventory() {
            this.$emit('closeInventory')
        },
        deleteInnerInventory(item) {
            if (item !== null) {
                if ((item.carton_count == 0 || item.carton_count == null) && 
                    (item.total_unit == 0 || item.total_unit == null)) {
                    this.dialogDelete = true
                    this.currentSelectedInventoryDelete = item
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
                    this.closeDelete()
                    this.notificationMessage('Inventory has been deleted.')
                } catch(e) {
                    this.closeDelete()
                    this.notificationError(e)
                }
            }
        },        
        isDeleteDisabled(item) {
            if ((item.carton_count == 0 || item.carton_count == null) && 
                (item.total_unit == 0 || item.total_unit == null)) {
                return ''
            } else {
                return 'has-inventory-count'
            }
        },
        closeDelete() {
            this.dialogDelete = false
        },
    },
    async mounted() {},
    updated() {}
}
</script>

<style>
@import '../../../assets/css/warehouse_styles/warehouseTable.css';
</style>