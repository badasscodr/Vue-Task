<template>
    <v-dialog v-model="dialog" max-width="1168px" content-class="po-dialog" :retain-focus="false">
        <template v-slot:activator="{ on, attrs }">
            <v-btn dark v-if="!isMobile" color="primary" class="create-po-button" v-bind="attrs" v-on="on">
                Create PO
            </v-btn>
            <v-btn dark v-if="editedIndexData === -1 && isMobile" color="primary" class="create-po-button" v-bind="attrs" v-on="on">
                Create PO
            </v-btn>
        </template>

        <v-card class="po-dialog-card">
            <v-card-title>
                <span class="headline">{{ formTitle }}</span>

                <button icon dark class="btn-close" @click="close">
                    <v-icon>mdi-close</v-icon>
                </button>
            </v-card-title>

            <v-card-text>
                <div class="create-wrapper">
                    <div class="po-info">
                        <div class="po-number">
                            <p class="po-title">Po Number</p>
                            <v-radio-group v-model="radioGroup1" mandatory>
                                <v-radio label="System Generated" color="primary" value="generated"></v-radio>
                                <v-radio label="Custom PO Number" color="primary" value="custom"></v-radio>

                                <span class="custom-wrapper" v-if="radioGroup1 == 'custom'">
                                    <img src="@/assets/icons/po-icon.svg" alt="" class="box-icon" />
                                    
                                    <v-text-field
                                        height="40px"
                                        color="#002F44"
                                        width="200px"
                                        dense
                                        v-model="editedItem.po_number"
                                        class="text-fields custom"
                                        placeholder="Enter Item Number"
                                        outlined>
                                    </v-text-field>
                                </span>
                            </v-radio-group>
                        </div>

                        <div class="po-vendor">
                            <p class="po-title">Vendor</p>
                            <v-select
                                v-model="editedItem.supplier_id"
                                class="select-items"
                                :items="vendorListOptions"
                                placeholder="Select Vendor"
                                item-text="label"
                                item-value="value"
                                outlined></v-select>
                        </div>

                        <div class="po-ship">
                            <p class="po-title">Ship To</p>
                            <v-select
                                v-model="editedItem.warehouse_id"
                                class="select-items"
                                :items="shipLists"
                                item-text="label"
                                item-value="value"
                                placeholder="Select the shipping location"
                                outlined></v-select>
                        </div>

                        <div class="po-notes">
                            <p class="po-title">Notes</p>
                            <v-textarea
                                class="note"
                                outlined
                                v-model="editedItem.notes"
                                name="input-7-4"
                                placeholder="Type your notes here..."></v-textarea>
                        </div>
                    </div>

                    <div class="product-info">
                        <v-data-table
                            :headers="headers"
                            :items="dataProducts"
                            class="elevation-1 add-table"
                            mobile-breakpoint="769"
                            hide-default-footer>

                            <template v-slot:[`item.product`]="{ item, index }">
                                <div class="product-mobile-wrapper" v-if="isMobile">
                                    <div style="min-height: 36px;" class="product-mobile-header d-flex justify-space-between align-center">
                                        <p class="mb-0 po-create-product-title">Product {{ getProductNumber(index)}}</p>
                                        <v-btn
                                            v-show="dataProducts.length > 1"
                                            icon
                                            class="btn remove-btn"
                                            @click="removeRow(item)">
                                            <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                    </div>

                                    <v-select
                                        v-model="editedItem.products[index].id"
                                        class="select-product"
                                        :items="productLists"
                                        placeholder="Select Product"
                                        outlined
                                        item-text="name"
                                        item-value="id"
                                        :menu-props="{ contentClass: 'product-lists-items' }">

                                        <template v-slot:selection="{ item, index }">
                                            <div class="v-select__selection v-select__selection--comma" :key="index">{{ item.sku }} <br> {{ item.name }}</div>
                                        </template>
                                        
                                        <template v-slot:item="{ item }">
                                            <div class="option-items">
                                                <div class="sku-item">
                                                    <div class="sku-details">
                                                        <span>#{{ item.sku }}</span>
                                                        <span class="mx-2">
                                                            <img src="../../assets/icons/separator.svg" alt="" width="6px" height="6px">
                                                        </span>
                                                        <!-- <span>Ven #0989</span> -->
                                                    </div>

                                                    <div>
                                                        <p>{{ item.desc }}</p>
                                                    </div>
                                                </div>

                                                <div class="image-item">
                                                    <img :src="getImgUrl(item.image)" height="60px" width="60px" alt="">
                                                </div>
                                            </div>
                                        </template>
                                    </v-select>
                                </div>

                                <div v-if="!isMobile">
                                    <v-select
                                        v-model="editedItem.products[index].id"
                                        class="select-product"
                                        :items="productLists"
                                        placeholder="Select Product"
                                        outlined
                                        item-text="name"
                                        item-value="id"
                                        :menu-props="{ contentClass: 'product-lists-items' }">

                                        <template v-slot:selection="{ item, index }">
                                            <div class="v-select__selection v-select__selection--comma" :key="index">{{ item.sku }} <br> {{ item.name }}</div>
                                        </template>
                                        
                                        <template v-slot:item="{ item }">
                                            <div class="option-items">
                                                <div class="sku-item">
                                                    <div class="sku-details">
                                                        <span>#{{ item.sku }}</span>
                                                        <span class="mx-2">
                                                            <img src="../../assets/icons/separator.svg" alt="" width="6px" height="6px">
                                                        </span>
                                                        <!-- <span>Ven #0989</span> -->
                                                    </div>

                                                    <div>
                                                        <p>{{ item.desc }}</p>
                                                    </div>
                                                </div>

                                                <div class="image-item">
                                                    <img :src="getImgUrl(item.image)" height="60px" width="60px" alt="">
                                                </div>
                                            </div>
                                        </template>
                                    </v-select>
                                </div>
                            </template>

                            <template v-slot:[`item.quantity`]="{ item }">
                                <div :class="item.quantity">
                                   <v-text-field  v-model="item.quantity" placeholder="00" outlined class="table-text-fields"></v-text-field>
                                </div>
                            </template>

                            <template v-slot:[`item.unit_price`]="{ item }">
                                <div :class="item.unit_price">
                                    <v-text-field v-model="item.unit_price" placeholder="$ 00" outlined class="table-text-fields"></v-text-field>
                                </div>
                            </template>

                            <template v-slot:[`item.amount`]="{ item }">
                                <div :class="item.amount">
                                    <v-text-field outlined v-model="item.amount" :value="updateAmount(item)" readonly class="table-text-fields amount"></v-text-field>
                                </div>
                            </template>

                            <template v-slot:[`item.actions`]="{ item }">
                                <v-btn
                                    v-show="dataProducts.length > 1"
									icon
									class="btn remove-btn"
									@click="removeRow(item)">
									<v-icon>mdi-close</v-icon>
								</v-btn>
                            </template>
                        </v-data-table>
                        <div class="add-row-wrapper">
                            <button class="btn add-btn" @click="addRow">+ Add Product</button>
                        </div>

                        <TotalComponent>
                            <template v-slot:sub_total>
                                <p> {{ subTotal() }} </p>
                            </template>
                            <template v-slot:tax>
                                <p> {{ tax() }} </p>
                            </template>
                            <template v-slot:shipping>
                                <p>{{ editedItem.shipping }} </p>
                            </template>
                            <template v-slot:discount>
                                <p>{{ editedItem.discount }} </p>
                            </template>
                            <template v-slot:total>
                                <p>{{ total() }} </p>
                            </template>
                        </TotalComponent>
                    </div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn v-if="editedIndexData === -1" class="btn-blue" text @click="savePo()">
                    {{ 
                        ( getPoCreateLoading ) ? 'Creating PO...' : 'Create PO'
                    }}
                </v-btn>
                <v-btn v-if="editedIndexData > -1" class="btn-blue" text @click="savePo()">
                    {{ 
                        ( getPoCreateLoading ) ? 'Editing PO...' : 'Edit PO'
                    }}
                </v-btn>
                <v-btn v-if="editedIndexData === -1" class="btn-white" text @click="addPoAnother()">
                    {{
                        ( getPoSaveAddLoading ) ? 'Creating...' : 'Create & Add Another'
                    }}
                </v-btn>
                <v-btn v-if="editedIndexData > -1" class="btn-white" text @click="updatePoAnother()">
                    {{
                        ( getPoSaveAddLoading ) ? 'Updating...' : 'Update & Add Another'
                    }}
                </v-btn>
                <v-btn class="btn-white" text @click="close" v-if="!isMobile">
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TotalComponent from '../TotalComponent.vue'
import globalMethods from '../../../utils/globalMethods'
import _ from 'lodash'

export default {
    name: 'CreatePoDialog',
    props: ['editedItemData','editedIndexData', 'dialogData', 'isMobile', 'defaultItem'],
    components: {
        TotalComponent
    },
    data: () => ({
        dataProducts: [],
        radioGroup1: 'generated',
        headersMobile: [
            {
                text: 'QUANTITY',
                align: 'start',
                sortable: false,
                value: 'quantity',
                fixed: true,
                width: "90%"
            },
            {
                text: 'UNIT PRICE',
                align: 'end',
                sortable: false,
                value: 'unit_price',
                fixed: true,
                width: "90%"
            },
            {
                text: 'AMOUNT',
                align: 'end',
                sortable: false,
                value: 'amount',
                fixed: true,
                width: "90%"
            },
        ],
        headers: [
			{
				text: 'PRODUCT',
				align: 'start',
				sortable: false,
				value: 'product',
				fixed: true,
				width: "330px"
			},
			{
				text: 'QUANTITY',
				align: 'end',
				sortable: false,
				value: 'quantity',
				fixed: true,
				width: "112px"
			},
			{
				text: 'UNIT PRICE',
				align: 'end',
				sortable: false,
				value: 'unit_price',
				fixed: true,
				width: "112px"
			},
			{
				text: 'AMOUNT',
				align: 'end',
				sortable: false,
				value: 'amount',
				fixed: true,
				width: "112px"
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
		items: [
            {
                id: '',
                quantity: 0,
                unit_price: 0,
                amount: 0
            }
        ],
        counter: 1,
        selected: [],
    }),
    methods: {
        getProductNumber(index) {
            let setNumber = index + 1

            if (setNumber < 10) {
                setNumber = '0' + setNumber
            }
            return setNumber
        },
        subTotal() {
            if (typeof this.editedItem.products!=='undefined' && this.editedItem.products!==null && Array.isArray(this.editedItem.products) && this.editedItem.products.length > 0) {
                this.editedItem.sub_total = _.sumBy(this.editedItem.products, e => (e.amount))
                return this.editedItem.sub_total
            } else {
                this.editedItem.sub_total = 0
                return 0
            }
        },
        total() {
            this.editedItem.total = parseFloat(this.subTotal() + this.tax())
            return this.editedItem.total
        },
        tax() {
            /*
            console.log('tax')
            console.log(_.sumBy(this.editedItem.products, e => (e.amount)) * this.editedItem.tax)
            this.editedItem.tax =  (typeof this.editedItem.products!=='undefined') ? _.sumBy(this.editedItem.products, e => (e.amount)) * this.editedItem.tax : 0
            return this.editedItem.tax*/

            this.editedItem.tax = 0
            return this.editedItem.tax
        },
        updateAmount( getItem ) {
            // console.log('update mount', getItem)
            if (typeof this.editedItem.products[this.editedItem.products.indexOf(getItem)]!=='undefined') {
                this.editedItem.products[this.editedItem.products.indexOf(getItem)].amount = parseFloat(parseInt(getItem.quantity) * parseFloat(getItem.unit_price))
                return this.editedItem.products[this.editedItem.products.indexOf(getItem)].amount
            } else {
                return 0
            }
        },
        close() {
            this.$emit('update:dialogData', false)
        },
        ...globalMethods,
        async addPoAnother() {
            try {
                // save then close
                this.addPoTemplate.another = true
                await this.createPo(this.addPoTemplate)
                this.notificationMessage('Po has been created.')
                await this.fetchPo()

                this
                this.editedIndex = -1
                this.editedItem = {
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
                }
            } catch(e) {
                this.notificationError(e)
                console.log(e)
            }
        },
        async updatePoAnother() {
            try {
                let editPoTemplate = this.addPoTemplate
                editPoTemplate.id = this.editedItem.id
                editPoTemplate._method = 'PUT'
                editPoTemplate.another = true
                await this.updatePo(editPoTemplate)
                this.notificationMessage('PO has been updated.')
                await this.fetchPo()

                this.editedIndex = -1
                this.editedItem = {
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
                }
            } catch(e) {
                this.notificationError(e)
                console.log(e)
            }
        },      
        async savePo() {
            this.addPoTemplate.another = false
            try {
                if (this.editedIndex === -1) {                    
                    await this.createPo(this.addPoTemplate)
                    this.notificationMessage('Po has been created.')
                    await this.fetchPo()
                    this.close()
                    this.editedIndex = -1
                } else {                    
                    let editPoTemplate = this.addPoTemplate
                    editPoTemplate.id = this.editedItem.id
                    editPoTemplate._method = 'PUT'
                    await this.updatePo(editPoTemplate)
                    this.notificationMessage('PO has been updated.')
                    await this.fetchPo()
                    this.close()
                }
            } catch(e) {
                this.notificationError(e)
                console.log(e)
            }
        },
        removeRow(item) {
            let getIndex = this.editedItem.products.indexOf(item)
            this.editedItem.products.splice(getIndex, 1)
            this.dataProducts = this.editedItem.products
        }, 
        addRow() {
            let getItem = this.editedItem

            getItem.products.push({
                id: '',
                quantity: 0,
                unit_price: 0,
                amount: 0
            })

            this.editedItem = getItem
            this.dataProducts = getItem.products
        },
        getImgUrl(pic) {
			if (pic !== 'undefined' && pic !== null) {
				return pic
			} else {
				return require('../../assets/icons/default-product-icon.svg')
			}
		},
        ...mapActions({
            fetchVendorLists: 'po/fetchVendorLists',
            fetchPo: 'po/fetchPo',
            createPo: 'po/createPo',
            updatePo: 'po/updatePo'
        })
    },
    computed: {
        ...mapGetters({
            getWarehouse: 'warehouse/getWarehouse',
            getProducts: 'products/getProducts',
            getPoLoading: 'po/getPoLoading',
            getPoCreateLoading: 'po/getPoCreateLoading',
            getPoSaveAddLoading: 'po/getPoSaveAddLoading',
            getSuppliers: 'suppliers/getSuppliers',
            getVendorLists: 'po/getVendorLists',
            getUser: 'getUser'
        }),
        vendorListOptions() {
            let newVendorLists = []
            if (typeof this.getVendorLists!=='undefined' && Array.isArray(this.getVendorLists) && this.getVendorLists.length > 0) {
                newVendorLists = this.getVendorLists.map( gvl => ({
                        label: gvl.company_name,
                        value: gvl.id
                    })
                )
            }
            return newVendorLists
        },
        addPoTemplate() {
            let buildItem = {
                sys_gen: (this.radioGroup1 === 'custom') ? false : true,
                customer_id: (typeof this.getUser=='string') ? JSON.parse(this.getUser).customer.id : '',
                supplier_id: this.editedItem.supplier_id,
                notes: this.editedItem.notes,
                products: this.editedItem.products.map(eip => ({
                    id: eip.id,
                    quantity: parseInt(eip.quantity),
                    unit_price: parseFloat(eip.unit_price),
                    amount: eip.amount,
                })),
                warehouse_id: this.editedItem.warehouse_id,
                sub_total: this.editedItem.sub_total,
                total: this.editedItem.total,
                shipping: this.editedItem.shipping,
                discount: this.editedItem.discount,
                tax: this.editedItem.tax
            }

            if ( !buildItem.sys_gen ){
                buildItem.po_number = this.editedItem.po_number
            }

            return buildItem
        },
        formTitle () {
            return this.editedIndexData === -1 ? 'Create Purchase Order' : 'Edit Purchase Order'
        },
        dialog: {
            get () {
                return this.dialogData
            },
            set (value) {
                if (this.editedIndexData === -1) {
                    this.dataProducts = [{
                        id: '',
                        quantity: 0,
                        unit_price: 0,
                        amount: 0
                    }]

                    this.editedItem =  {
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
                    }
                }
                if (!value) {
                    this.$emit('update:dialogData', false)
                } else {
                    this.$emit('update:dialogData', true)
                }
            }
        },
        editedIndex: {
            get() {
                return this.editedIndexData
            },
            set(value) {
                this.$emit('update:editedIndexData', value)
            }
        },
        editedItemProducts: {
            get() {
                return this.editedItemData.products   
            }
        },
        editedItem: {
            get () {
                return this.editedItemData
            },
            set (value) {
                this.$emit('update:editedItemData', value)
            }
        },
        shipLists() {
            let shipListsData = []

            if (typeof this.getWarehouse !== 'undefined' && this.getWarehouse !== null) {
                if (typeof this.getWarehouse.results !== 'undefined' && this.getWarehouse.results !== null) {
                    if (typeof this.getWarehouse.results.data !== 'undefined' && this.getWarehouse.results.data !== null) {
                        if (typeof this.getWarehouse.results.data.length !== 'undefined' && this.getWarehouse.results.data.length !== null) {
                            shipListsData = this.getWarehouse.results.data.map(value => ({
                                label: `${value.name}, ${value.address}`,
                                value: value.id
                            }))
                        }
                    }
                }
            }

            return shipListsData
        },
        productLists() {
            let productListsData = []

            if (typeof this.getProducts !== 'undefined' && this.getProducts !== null) {
                if (this.getProducts.length !== 'undefined' && this.getProducts.length !== null) {
                    productListsData = this.getProducts.map(value => {
                        let data = {
                            product_id: value.id,
                            id: value.id,
                            name: value.name,
                            sku: value.sku,
                            desc: value.description,
                            image: value.image
                        }

                        return data
                    })
                }
            }

            return productListsData
        },
        isValid() {
            let valid = false
            if (typeof this.poItem!=='undefined' && this.poItem !== null 
                && this.poItem.products !== 'undefined' && this.poItem.products ) {
                
                this.poItem.products.map((item) => {
                    if (this.radioGroup1 == 'custom') {
                        if (this.poItem.po_number !== '' && this.poItem.supplier_id !== '' && this.poItem.warehouse_id !== '' && item.id !== '' && item.quantity !== '' && item.unit_price !== '') {
                            if (item.quantity !== 0 && item.unit_price !== 0) {
                                valid = true
                            } else {
                                valid = false
                            }
                        } else {
                            valid = false
                        }
                    } else {
                        if (this.poItem.supplier_id !== '' && this.poItem.warehouse_id !== '' && item.id !== '' && item.quantity !== '' && item.unit_price !== '') {
                            if (item.quantity !== 0 && item.unit_price !== 0) {
                                valid = true
                            } else {
                                valid = false
                            }
                        } else
                            valid = false                        
                    }
                })
            }
            
            return valid           
        }
    },
    async mounted() {
        try {
            if (this.dataProducts!==this.editedItem.products)
                this.dataProducts = this.editedItem.products
            //fetch vendor lists
            await this.fetchVendorLists()

            if ( typeof this.editedItem.is_system_generated!=='undefined' )
                this.radioGroup1 = ( this.editedItem.is_system_generated===0 ) ? 'custom' : 'generated'
            else
                this.radioGroup1 = 'generated'
        } catch( e) {
            console.log('error fetching vendor lists', e)
        }
    },
    updated() {
        if (typeof this.editedItem!=='undefined' && this.dataProducts!==this.editedItem.products) {
            this.dataProducts = this.editedItem.products
        }
    }
}
</script>

<style>
@import '../../assets/css/po_styles/po.css';
@import '../../assets/css/dialog_styles/dialogHeader.css';
@import '../../assets/css/dialog_styles/dialogBody.css';
@import '../../assets/css/dialog_styles/dialogFooter.css';
@import '../../assets/css/po_styles/poCreateEditDialog.css';
</style>
