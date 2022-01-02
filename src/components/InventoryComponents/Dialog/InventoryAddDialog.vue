<template>
    <v-dialog v-model="inventoryDialog" max-width="1040px" content-class="add-inventory-dialog" 
    :retain-focus="false" @click:outside="close">
        <v-card>
            <v-form ref="form" v-model="valid" action="#" @submit.prevent="">
                <v-card-title>
                    <span class="headline">{{ formTitle }} 
                        <span class="warehouse-name">
                            {{ `[Warehouse: ${currentWarehouseSelected !== null ? currentWarehouseSelected.name : ''}]` }}
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
                        :class="(editedInventoryIndex === -1 && typeof items!=='undefined' && items.length > 1) ? '' : 'updating-stock'"
                        mobile-breakpoint="769"
                        hide-default-footer>

                        <template v-slot:[`item.product`]="{ item, index }">
                            <div class="product-selection" v-if="!isMobile">
                                <v-select
                                    @change="updateProductInEach(index)"
                                    class="select-product"
                                    :items="productListsDropdown"
                                    item-text="name"
                                    item-value="id"
                                    return-object
                                    placeholder="Select Product"
                                    outlined 
                                    v-model="items[index].product.id"
                                    :rules="rules"
                                    hide-details="auto">
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
                                    @change="updateProductInEach(index)"
                                    class="select-product"
                                    :items="productListsDropdown"
                                    item-text="name"
                                    item-value="id"
                                    return-object
                                    placeholder="Select Product"
                                    outlined 
                                    v-model="items[index].product.id"
                                    :rules="rules"
                                    hide-details="auto">
                                </v-select>
                            </div>
                        </template>

                        <template v-slot:[`item.carton_count`]="{ item, index }">
                            <div v-if="!isMobile">
                                <v-text-field 
                                    placeholder="0" 
                                    type="number" 
                                    outlined                                
                                    @keyup="updateTotal(item, index)"
                                    class="table-text-fields icc-carton-count"
                                    v-model="item.carton_count"
                                    :rules="cartonCountRules"
                                    hide-details="auto"></v-text-field>
                            </div>

                            <div class="product-mobile-wrapper in-line" v-if="isMobile">
                                <p> Carton Count </p>

                                <v-text-field
                                    placeholder="0" 
                                    type="number" 
                                    outlined 
                                    @keyup="updateTotal(item, index)"
                                    class="table-text-fields shrink icc-carton-count"
                                    v-model="item.carton_count"
                                    :rules="cartonCountRules"
                                    hide-details="auto"></v-text-field>
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
                                    v-model="item.in_each_carton"
                                    hide-details="auto">
                                </v-text-field>
                            </div>

                            <div class="product-mobile-wrapper in-line" v-if="isMobile">
                                <p> In Each Carton </p>

                                <v-text-field 
                                    color="#4a4a4a"
                                    outlined 
                                    class="table-text-fields amount"
                                    readonly
                                    placeholder="N/A"
                                    v-model="item.in_each_carton"
                                    hide-details="auto">
                                </v-text-field>
                            </div>
                        </template>

                        <template v-slot:[`item.total_unit`]="{ item, index }">
                            <div v-if="!isMobile">
                                <v-text-field 
                                    placeholder="0" 
                                    type="number" 
                                    outlined 
                                    :rules="totalUnitRules"
                                    class="table-text-fields itu-total-unit"
                                    @change="item => updateItem(index, item)"
                                    v-model="item.total_unit"                              
                                    hide-details="auto">
                                    <!-- :rules="rules" -->
                                </v-text-field>
                            </div>

                            <div class="product-mobile-wrapper in-line" v-if="isMobile">
                                <p> Total Unit </p>

                                <v-text-field 
                                    placeholder="0" 
                                    type="number" 
                                    outlined 
                                    :rules="totalUnitRules"
                                    class="table-text-fields shrink  itu-total-unit"
                                    @change="item => updateItem(index, item)"
                                    v-model="item.total_unit"
                                    hide-details="auto">

                                    <!-- :rules="rules" -->
                                </v-text-field>
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
                        <button class="btn-white add-btn" @click="addRow">+ Add Product</button>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <button class="btn-blue" text @click="saveInventory">
                        <span v-if="!isEditing">
                            <span v-if="!loading">Add Inventory</span>
                            <span v-if="loading">Adding Inventory...</span>
                        </span>
                        <span v-if="isEditing">
                            <span v-if="!loading">Update Stock</span>
                            <span v-if="loading">Updating Stock...</span>
                        </span>
                    </button>

                    <button class="btn-white" text @click="close">
                        Cancel
                    </button>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import globalMethods from '../../../utils/globalMethods'
import _ from 'lodash'
import axios from "axios"
import jQuery from 'jquery'

export default {
    name: 'InventoryAddDialog',
    props: ['items','currentWarehouseSelected', 'editedInventoryIndex', 
            'isMobile', 'dialogAddInventory', 'defaultInventoryItems',
            'addInventoryItems', 'value'],
    components: {
    },
    data: () => ({
        current_page: 1,
        valid: true,
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
        counter: 0,
        selected: null,
        productListsDropdownData: [],
        rules: [
            (v) => !!v || "Input is required."
        ],
        cartonCountRules: [
            (v) => !!v || "Carton count is required.",
            (v) => parseInt(v)>0 || "Carton count should be greater than 0."
        ],
        totalUnitRules: [
            (v) => !!v || "Total unit is required.",
            (v) => parseFloat(v)>0 || "Total unit should be greater than 0."
        ]
    }),
    watch: {},
    computed: {
        ...mapGetters({
            getProducts: 'products/getProducts',
            poBaseUrlState: 'products/poBaseUrlState',
            loading: 'inventory/getInventoryLoading',
            getUser: 'getUser',
            getEditInventory: 'inventory/editInventory',
            isEditing: 'inventory/isEditing'
        }),
        saveInventoryState() {

            let getItems = this.items
            let invalid = false            
            if ( getItems.length > 0 ) {

                getItems.map(gi => {
                    if (gi.total_unit=='' || gi.carton_count=='' || gi.total_unit==null || gi.carton_count==null || gi.carton_count==0 || gi.total_unit==0)
                        invalid = true
                })
            } else
                invalid = true 

            return invalid

        },
        productListsDropdown: {
            get() {
                let value = this.productListsDropdownData
                let finalValue = []

                if (Array.isArray(value) && value.length > 0) {
                    if (typeof this.getProducts!=='undefined' && Array.isArray(this.getProducts) && 
                        this.getProducts.length > 0) {
                        value.map ( v => {
                            let findProduct = _.findIndex(this.getProducts, e => (v.id === e.id))
                            if (findProduct !== -1) {
                                finalValue.push(v)
                            }
                        })

                        return finalValue

                    } else {
                        return value
                    }
                } else {
                    return value
                }                
            },
            set (value) {
                this.productListsDropdownData = value
            }
        },
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
                        id: id.id,
                        //sku: (typeof id.sku!=='undefined') ? id.sku : '',
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
            return !this.isEditing ? 'Add Inventory' : 'Edit Stock'
        },
        productLists() {
            let productsData = []

            if (typeof this.getProducts !== 'undefined' && this.getProducts !== null && this.getProducts.length > 0) {
                productsData = this.getProducts.map((value) => {
					return {
						id: value.id,
						name: value.name,
                        units: value.units_per_carton,
					}
				})
            }

            return productsData
        },
        total() {
            if ( typeof this.items!=='undefined' && this.items!==null && this.items.length > 0 ) {
               let newItems = this.items.map ( item => {
                    let {
                        in_each_carton,
                        carton_count,
                    } = item

                    return {
                        total_unit: parseInt(parseInt(in_each_carton) * parseInt(carton_count))
                    }
                })

                return {
                    newItems
                }
            } else {
                return {}
            }
        },
        inventoryDialog: {
            get() {
                return this.dialogAddInventory
            },
            set(value) {
                this.$emit('update:dialogAddInventory', value)
            }
        },     
        isValid() {
            let valid = true

            if (typeof this.items!=='undefined' && this.items !== null && this.items.length > 0 ) {
                this.items.map((item) => {
                    if (item.product.id !== '' && item.carton_count !== '' && item.total_unit !== '') {
                        valid = true
                        
                        // if (item.carton_count !== 0 && item.total_unit !== 0) {
                        //     valid = true
                        // } else {
                        //     valid = false
                        // }
                    } else
                        valid = false
                })
            }
            
            return valid
        },
    },
    methods: {
        ...mapActions({
            createInventory: 'inventory/createInventory',
            fetchInventories: 'inventory/fetchInventories',
            setEditInventory: 'inventory/setEditInventory',
            setIsEditing: 'inventory/setIsEditing',
            updateInventory: 'inventory/updateInventory',
            fetchWarehouse: 'warehouse/fetchWarehouse'
        }),
        ...globalMethods,
        async fetchProductsPoDropdown() {
            try {
                let productsData = []
                const res = await axios.get(`${this.poBaseUrlState}/products?page=${this.current_page}`)
                if (res.status === 200) {
                    if (typeof res.data!=='undefined') {
                        if (typeof res.data.results!=='undefined' && typeof res.data.results.data!=='undefined') {
                            
                            //iterate data to new data
                            productsData = res.data.results.data

                            productsData = productsData.map (value => {
                                let data = {
                                    product_id: value.id,
                                    id: value.id,
                                    name: value.name,
                                    sku: value.sku
                                }

                                return data
                            })

                            //concatonate new data
                            this.productListsDropdown = this.productListsDropdown.concat(productsData)

                            //check next page
                            if (typeof res.data.results.next_page_url!=='undefined' 
                                && res.data.results.next_page_url!==null) {
                                this.current_page = parseInt(this.current_page + 1)
                                await this.fetchProductsPoDropdown()
                            }

                        }                        
                        return Promise.resolve('ok')
                    } else {
                        return Promise.reject('not ok')
                    }
                } else {
                    return Promise.reject('not ok')
                }
            } catch(e) {
                return Promise.reject('not ok')
            }            
        },
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
            this.$emit('close')
            this.clearItems()
            this.$refs.form.resetValidation()
        },
        removeRow(item) {
            let getIndex = this.items.indexOf(item)
            this.items.splice(getIndex, 1)
        },
        addRow() {
            let getItem = this.items

            getItem.push({
                product: {
                    id: ''
                },
                carton_count: "",
                in_each_carton: "",
                total_unit: ""
            })

            this.items = getItem
        },
        async updateProductInEach(index) {
            try {
                let value = this.items[index].product.id

                jQuery('.icc-carton-count > div > div:first-child > div > input').attr('disabled','disabled')
                jQuery('.itu-total-unit > div > div:first-child > div > input').attr('disabled','disabled')
                const res = await axios.get(`${this.poBaseUrlState}/products/${value.id}`)

                jQuery('.icc-carton-count > div > div:first-child > div > input').removeAttr('disabled')
                jQuery('.itu-total-unit > div > div:first-child > div > input').removeAttr('disabled')

                if (res.status === 200) {
                    if (typeof res.data!=='undefined') {
                        if (typeof res.data.sku!=='undefined' && 
                            res.data.sku!=='' && res.data.sku!==null) {
                            this.items[index].sku = res.data.sku
                        }

                        if (typeof res.data.units_per_carton!=='undefined' && 
                            res.data.units_per_carton!=='' && res.data.units_per_carton!==null) {
                            this.items[index].in_each_carton = res.data.units_per_carton
                        } else {
                            this.items[index].in_each_carton = 0
                        }
                    } else {
                        this.items[index].in_each_carton = 0
                    }
                } else {
                    this.items[index].in_each_carton = 0
                }
            } catch(e) {
                if (typeof e.message!=='undefined' && e.message =='UnAuthenticated') {
                    this.$router.push('/login')
                } else {
                    this.items[index].in_each_carton = 0
                }                
            }
        },
        async saveInventory() {
            this.$refs.form.validate()

            if (this.$refs.form.validate()) {
                try {
                    if (!this.isEditing) {
                        await this.createInventory(this.addInventoryTemplate)
                        this.notificationMessage('Inventory has been created.')
                    } else {
                        await this.updateInventory(this.editInventoryTemplate)
                        this.notificationMessage('Inventory has been updated.')
                    }
                    
                    this.fetchWarehouse()
                    this.close()
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
        updateTotal(item, index) {
            if (typeof this.total.newItems[index].total_unit !== 'undefined') {
                this.total.newItems[index].total_unit = parseInt(parseInt(item.carton_count) * parseInt(item.in_each_carton))

                this.items[this.items.indexOf(item)].total_unit = this.total.newItems[index].total_unit
                
                return this.total.newItems[index].total_unit
            } else {
                return 0
            }
        },
        updateItem(index, item) {
            this.total.newItems[index].total_unit = parseInt(item)
            this.items[index].total_unit = this.total.newItems[index].total_unit

            return this.total.newItems[index].total_unit
        }
    },
    mounted() {
        try {
            this.fetchProductsPoDropdown()
        } catch(e) {
            console.log('An error occured.', e)
        }
    },
    updated() {}
}
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/inventory/addInventory.scss';

/* @import '../../../assets/css/inventory_styles/addInventory.css';
@import '../../../assets/css/inventory_styles/inventory.css';
@import '../../../assets/css/dialog_styles/dialogHeader.css';
@import '../../../assets/css/dialog_styles/dialogBody.css';
@import '../../../assets/css/dialog_styles/dialogFooter.css'; */
</style>
