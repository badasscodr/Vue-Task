<template>
    <v-dialog v-model="dialogData" max-width="1040px" content-class="add-inventory-dialog" 
    :retain-focus="false" @click:outside="close">    
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" @click="clearItems()" dark class="btn-blue add mx-auto" v-bind="attrs" v-on="on">
                Add Inventory
            </v-btn>
        </template>

        <v-card>
            <v-card-title>
                <span class="headline">{{ formTitle }} 
                    <span class="warehouse-name">
                        {{ `[Warehouse: ${this.currentWarehouseSelected !== null ? this.currentWarehouseSelected.name : ''}]` }}
                    </span>
                </span>

                <v-spacer></v-spacer>						

                <v-btn icon dark class="btn-close" @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="add-inventory-info">
                <v-data-table
                    :headers="headers"
                    :items="items"
                    class="elevation-1 add-table"
                    :class="(editedIndexData === -1 && typeof items!=='undefined' && items.length > 1) ? '' : 'updating-stock'"
                    mobile-breakpoint="769"
                    hide-default-footer>

                    <template v-slot:[`item.product`]="{ item }">
                        <div v-if="!isMobile">
                            <v-select
                                class="select-product"
                                :items="productLists"
                                item-text="name"
                                item-value="id"
                                placeholder="Select Product"
                                outlined 
                                v-model="item.product.id">
                            </v-select>
                        </div>

                        <div class="product-mobile-wrapper" v-if="isMobile">
                            <div class="product-mobile-header">
                                <p>Product</p>

                                <v-btn
                                    v-show="items.length > 1"
                                    icon
                                    class="btn remove-btn"
                                    @click="removeRow(item)">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </div>

                            <v-select
                                class="select-product"
                                :items="productLists"
                                item-text="name"
                                item-value="id"
                                placeholder="Select Product"
                                outlined 
                                v-model="item.product.id">
                            </v-select>
                        </div>
                    </template>

                    <template v-slot:[`item.carton_count`]="{ item }">
                        <div v-if="!isMobile">
                            <v-text-field 
                                placeholder="0" 
                                type="number" 
                                outlined 
                                class="table-text-fields"
                                v-model="item.carton_count"></v-text-field>
                        </div>

                        <div class="product-mobile-wrapper in-line" v-if="isMobile">
                            <p> Carton Count </p>

                            <v-text-field
                                placeholder="0" 
                                type="number" 
                                outlined 
                                class="table-text-fields shrink"
                                v-model="item.carton_count"></v-text-field>
                        </div>
                    </template>

                    <template v-slot:[`item.in_each_carton`]="{ item }">
                        <div v-if="!isMobile">
                            <v-text-field 
                                color="#4a4a4a"
                                outlined 
                                readonly 
                                class="table-text-fields amount"
                                placeholder="N/A"
                                v-model="item.in_each_carton"></v-text-field>
                        </div>

                        <div class="product-mobile-wrapper in-line" v-if="isMobile">
                            <p> In Each Carton </p>

                            <v-text-field 
                                color="#4a4a4a"
                                outlined 
                                readonly 
                                class="table-text-fields amount shrink"
                                placeholder="N/A"
                                v-model="item.in_each_carton"></v-text-field>
                        </div>
                    </template>

                    <template v-slot:[`item.total_unit`]="{ item }">
                        <div v-if="!isMobile">
                            <v-text-field 
                                placeholder="0" 
                                type="number" 
                                outlined 
                                class="table-text-fields"
                                v-model="item.total_unit"></v-text-field>
                        </div>

                        <div class="product-mobile-wrapper in-line" v-if="isMobile">
                            <p> Total Unit </p>

                            <v-text-field 
                                placeholder="0" 
                                type="number" 
                                outlined 
                                class="table-text-fields shrink"
                                v-model="item.total_unit"></v-text-field>
                        </div>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn
                            v-show="items.length > 1"
                            icon
                            class="btn remove-btn"
                            @click="removeRow(item)">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>

                <div class="add-row-wrapper" v-if="!isEditing">
                    <button class="btn add-btn" @click="addRow">+ Add Product</button>
                </div>
            </v-card-text>

            <v-card-actions>
                <v-btn class="btn-blue" text @click="saveInventory">
                    <span v-if="!isEditing">
                        <span v-if="!loading">Add Inventory</span>
                        <span v-if="loading">Adding Inventory...</span>
                    </span>
                    <span v-if="isEditing">
                        <span v-if="!loading">Update Stock</span>
                         <span v-if="loading">Updating Stock...</span>
                    </span>
                </v-btn>

                <v-btn class="btn-white" text @click="close">
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import globalMethods from '../../utils/globalMethods'

export default {
    name: 'AddInventoryDialog',
    props: ['dialogData', 'currentWarehouseSelected', 'editedItemData',
            'editedIndexData', 'isMobile', 'items'],
    components: {
    },
    data: () => ({
        headers: [
			{
				text: 'PRODUCT',
				align: 'start',
				sortable: false,
				value: 'product',
				fixed: true,
				width: "200px"
			},
			{
				text: 'CARTON COUNT',
				align: 'end',
				sortable: false,
				value: 'carton_count',
				fixed: true,
				width: "100px"
			},
			{
				text: 'IN EACH CARTON',
				align: 'end',
				sortable: false,
				value: 'in_each_carton',
				fixed: true,
				width: "100px"
			},
			{
				text: 'TOTAL UNIT',
				align: 'end',
				sortable: false,
				value: 'total_unit',
				fixed: true,
				width: "100px"
			},
            {
				text: '',
				align: 'end',
				sortable: false,
				value: 'actions',
				fixed: true,
				width: "30px"
			},
		],
        counter: 0
    }),
    computed: {
        ...mapGetters({
            getProducts: 'products/getProducts',
            loading: 'inventory/getInventoryLoading',
            getUser: 'getUser',
            getEditInventory: 'inventory/editInventory',
            isEditing: 'inventory/isEditing'
        }),
        editInventoryTemplate() {
            if ( typeof this.items!=='undefined' && this.items!==null && this.items.length > 0 ) {
                let item = this.items[0]

               return {
                   id: item.id,
                   product_id: item.product.id,
                   carton_count: item.carton_count,
                   in_each_carton: item.in_each_carton,
                   total_unit: item.total_unit,
                   warehouse_id: this.currentWarehouseSelected.id,
                   customer_id: (typeof this.getUser=='string') ? JSON.parse(this.getUser).customer.id : ''
                }
            } else {
                return {}
            }
        },
        addInventoryTemplate() {            
            if ( typeof this.items!=='undefined' && this.items!==null && this.items.length > 0 ) {
               let newItems = this.items.map ( item => {
                    let {
                        product: {
                            id
                        },
                        carton_count,
                        in_each_carton,
                        total_unit
                    } = item

                    return {
                        id,
                        in_each_carton: parseInt(in_each_carton),
                        carton_count: parseInt(carton_count),
                        total_unit: parseInt(total_unit)
                    }
                })

                return {
                    customer_id: (typeof this.getUser=='string') ? JSON.parse(this.getUser).customer.id : '',
                    products: newItems,
                    warehouse_id: this.currentWarehouseSelected.id
                }
            } else {
                return {}
            }
        },
        formTitle() {
            //return this.editedIndexData === -1 ? 'Add Inventory' : 'Edit Stock'
            return !this.isEditing ? 'Add Inventory' : 'Edit Stock'
        },
        productLists() {
            let productsData = []

            if (typeof this.getProducts !== 'undefined' && this.getProducts !== null && this.getProducts.length > 0) {
                productsData = this.getProducts.map((value) => {
					return {
						id: value.id,
						name: value.name
					}
				})
            }

            return productsData
        },
        editedItemInventory: {
            get() {
                return this.editedItemData
            },
            set(value) {
                return this.items[value]
            }
        },
        inventoryDialog: {
            get() {
                return this.dialogData
            },
            set(value) {
                if (!value) {
                    this.$emit('update:dialogData', false)
                } else {
                    this.$emit('update:dialogData', true)
                }
            }
        }
    },
    methods: {
        ...mapActions({
            createInventory: 'inventory/createInventory',
            fetchInventories: 'inventory/fetchInventories',
            setEditInventory: 'inventory/setEditInventory',
            setIsEditing: 'inventory/setIsEditing',
            updateInventory: 'inventory/updateInventory'
        }),
        ...globalMethods,
        clearItems() {
            this.setIsEditing(false)

            //clear edit item too
            this.setEditInventory([
                {
                    product: {
                        id: ''
                    },
                    carton_count: '',
                    in_each_carton: '',
                    total_unit: ''
                }
            ])
        },
        close() {
            this.$emit('closeInventory')
        },
        removeRow(index) {
            this.counter--
            this.items.splice(index, 1)
        },
        addRow() {
            this.counter++
            this.items.push({
                product: {
                    id: ''
                },
                carton_count: "",
                in_each_carton: "",
                total_unit: ""
            })
        },
        async saveInventory() {
            try {
                //create or update now the inventory
                if (!this.isEditing) {
                    await this.createInventory(this.addInventoryTemplate)
                    this.notificationMessage('Inventory has been created.')
                    this.close()
                } else {
                    await this.updateInventory(this.editInventoryTemplate)
                    this.notificationMessage('Inventory has been updated.')
                    this.close()
                }
                
                //clear items
                this.clearItems()

                try {
                    //fetch now updated inventories
                    await this.fetchInventories(this.currentWarehouseSelected.id)
                } catch(e) {
                    this.notificationError(e)
                }

            } catch(e) {
                this.notificationError(e)
            }
        }
    },
    mounted() {},
    updated() {}
}
</script>

<style>
@import '../../assets/css/inventory_styles/addInventory.css';
@import '../../assets/css/inventory_styles/inventory.css';
@import '../../assets/css/dialog_styles/dialogHeader.css';
@import '../../assets/css/dialog_styles/dialogBody.css';
@import '../../assets/css/dialog_styles/dialogFooter.css';
</style>