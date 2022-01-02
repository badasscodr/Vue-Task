<template>
    <v-dialog v-model="dialogCreate" max-width="1168px" content-class="po-dialog" :retain-focus="false" @click:outside="close">
        <v-card class="po-dialog-card">
            <v-form ref="form" v-model="valid" action="#" @submit.prevent="">
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>

                    <button icon dark class="btn-close" @click="close">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </v-card-title>

                <v-card-text>
                    <div class="create-wrapper">
                        <div class="po-info">
                            <div class="po-number mb-4">
                                <p class="po-title">Po Number</p>
                                <v-radio-group v-model="radioGroup1" mandatory v-if="editedIndex === -1" hide-details="auto">
                                    <v-radio label="System Generated" color="primary" value="generated"></v-radio>
                                    <v-radio label="Custom PO Number" color="primary" value="custom"></v-radio>

                                    <span class="custom-wrapper" v-if="radioGroup1 == 'custom'">
                                        <img src="@/assets/icons/po-icon.svg" alt="" class="box-icon" />
                                        
                                        <v-text-field
                                            type="text"
                                            height="40px"
                                            color="#002F44"
                                            width="200px"
                                            dense
                                            v-model="poItem.po_number"
                                            class="text-fields custom"
                                            placeholder="Enter Item Number"
                                            outlined
                                            :rules="rules"
                                            hide-details="auto"
                                            @keydown="inputRestrictSpecialChar($event)">
                                        </v-text-field>
                                    </span>
                                </v-radio-group>
                                
                                <div class="custom-wrapper ml-0 mb-2" v-if="editedIndex > -1">
                                    <img src="@/assets/icons/po-icon.svg" alt="" class="box-icon" />
                                    
                                    <v-text-field
                                        type="text"
                                        height="40px"
                                        color="#002F44"
                                        width="200px"
                                        dense
                                        v-model="poItem.po_number"
                                        class="text-fields custom"
                                        placeholder="Enter Item Number"
                                        outlined
                                        :rules="rules"
                                        hide-details="auto"
                                        @keydown="inputRestrictSpecialChar($event)">
                                    </v-text-field>
                                </div>
                            </div>

                            <div class="po-vendor mb-4">
                                <p class="po-title">Vendor</p>
                                <v-select
                                    v-model="poItem.supplier_id"
                                    class="select-items"
                                    :items="vendorListOptions"
                                    placeholder="Select Vendor"
                                    item-text="label"
                                    item-value="value"
                                    outlined
                                    :rules="rules"
                                    hide-details="auto">                                
                                </v-select>
                            </div>

                            <div class="po-ship mb-4">
                                <p class="po-title">Ship To</p>
                                <v-select
                                    v-model="poItem.warehouse_id"
                                    class="select-items"
                                    :items="shipLists"
                                    item-text="label"
                                    item-value="value"
                                    placeholder="Select the shipping location"
                                    outlined
                                    
                                    hide-details="auto">
                                </v-select>
                            </div>

                            <div class="po-notes">
                                <p class="po-title">Notes <span style="text-transform: capitalize !important;">(Optional)</span></p>
                                <v-textarea
                                    class="note"
                                    outlined
                                    v-model="poItem.notes"
                                    name="input-7-4"
                                    placeholder="Type your notes here..."
                                    hide-details="auto">
                                </v-textarea>
                            </div>
                        </div>

                        <div class="product-info">
                            <v-data-table
                                :headers="headers"
                                :items="dataProducts"
                                :loading="poItem.loadingState"
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
                                            v-model="poItem.products[index].id"
                                            class="select-product"
                                            @change="updateProduct(index)"                                            
                                            :items="productListsDropdown"
                                            placeholder="Select Product"
                                            outlined
                                            item-text="name"
                                            item-value="id"
                                            :menu-props="{ contentClass: 'product-lists-items' }"
                                            :rules="rules"
                                            hide-details="auto">

                                            <template v-slot:selection="{ item, index }">
                                                <div class="v-select__selection v-select__selection--comma" :key="index">
                                                    #{{ item.sku }} 
                                                    <span v-if="item.status==='deleted'" style="color: #ff5252;"> 
                                                        (Deleted) 
                                                    </span>
                                                    
                                                    <br> {{ item.name }}
                                                </div>
                                            </template>
                                            
                                            <template v-slot:item="{ item }">
                                                <div class="option-items">
                                                    <div class="sku-item">
                                                        <div class="sku-details">
                                                            <span>#{{ item.sku }}</span>
                                                            <!-- <span class="mx-2">
                                                                <img src="../../../assets/icons/separator.svg" alt="" width="6px" height="6px">
                                                            </span> -->
                                                        </div>

                                                        <div>
                                                            <p>
                                                                {{ (item.desc !== null && item.desc !== '') ? item.desc : '--' }}
                                                            </p>
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
                                            @change="updateProduct(index)"
                                            v-model="poItem.products[index].id"
                                            class="select-product"
                                            :items="productListsDropdown"
                                            placeholder="Select Product"
                                            outlined
                                            item-text="name"
                                            item-value="id"
                                            :menu-props="{ contentClass: 'product-lists-items' }"
                                            :rules="rules"
                                            hide-details="auto">

                                            <template v-slot:selection="{ item, index }">
                                                <div class="v-select__selection v-select__selection--comma" :key="index">
                                                    #{{ item.sku }} 
                                                    <span v-if="item.status==='deleted'" style="color: #ff5252;"> 
                                                        (Deleted) 
                                                    </span>
                                                    
                                                    <br> {{ item.name }}
                                                </div>
                                            </template>
                                            
                                            <template v-slot:item="{ item }">
                                                <div class="option-items" :id="item.id">
                                                    <div class="sku-item">
                                                        <div class="sku-details">
                                                            <span>#{{ item.sku }}</span>
                                                            <!-- <span class="mx-2">
                                                                <img src="../../../assets/icons/separator.svg" alt="" width="6px" height="6px">
                                                            </span> -->
                                                        </div>

                                                        <div>
                                                            <p>
                                                                {{ (item.desc !== null && item.desc !== '') ? item.desc : '--' }}
                                                            </p>
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
                                    <div>
                                    <v-text-field 
                                            type="number" 
                                            v-model="item.quantity"
                                            placeholder="0" 
                                            outlined 
                                            class="table-text-fields"
                                            :rules="quantityRules"
                                            hide-details="auto">
                                        </v-text-field>
                                    </div>
                                </template>

                                <template v-slot:[`item.unit_price`]="{ item }">
                                    <div>
                                        <v-text-field 
                                            type="number" 
                                            v-model="item.unit_price" 
                                            placeholder="$00" 
                                            outlined 
                                            class="table-text-fields"
                                            :rules="priceRules"
                                            hide-details="auto">
                                        </v-text-field>
                                    </div>
                                </template>

                                <template v-slot:[`item.amount`]="{ item }">
                                    <div>
                                        <v-text-field 
                                            outlined 
                                            :value="updateAmount(item)"
                                            readonly 
                                            class="table-text-fields amount"
                                            hide-details="auto">
                                        </v-text-field>
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
                            <PoTotalComponent 
                                :subTotal="subTotal()"
                                :tax="tax()"
                                :shipping="poItem.shipping"
                                :discount="poItem.discount"
                                :total="total()"
                            />
                        </div>
                    </div>
                </v-card-text>

                <v-card-actions class="po-button-actions">
                    <button class="btn-blue" @click="savePo()">

                        <span v-if="editedIndex === -1" >
                            {{ 
                                ( getPoCreateLoading ) ? 'Creating PO...' : 'Create PO'
                            }}
                        </span>
                        <span v-if="editedIndex > -1" >
                            {{ 
                                ( getPoCreateLoading ) ? 'Editing PO...' : 'Edit PO'
                            }}
                        </span>
                    </button>
                    
                    <button v-if="editedIndex === -1" class="btn-white" @click="addPoAnother()">
                        <span>
                            {{
                                ( getPoSaveAddLoading ) ? 'Creating...' : 'Create & Add Another'
                            }}
                        </span>
                    </button>

                    <button v-if="editedIndex > -1 && !isMobile" class="btn-white" @click="updatePoAnother()">
                        <span>
                            {{
                                ( getPoSaveAddLoading ) ? 'Updating...' : 'Update & Add Another'
                            }}
                        </span>
                    </button>

                    <button class="btn-white" @click="close" v-if="!isMobile">
                        Cancel
                    </button>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PoTotalComponent from '../PoTotalComponent.vue'
import globalMethods from '../../../utils/globalMethods'
import _ from 'lodash'
import axios from "axios"

export default {
    name: 'POCreateDialog',
    props: ['dialog', 'editedItems', 'editedIndex', 'isMobile'],
    components: {
        PoTotalComponent,
    },
    data: () => ({
        valid: true,
        current_page: 1,
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
				width: "40%"
			},
			{
				text: 'QUANTITY',
				align: 'end',
				sortable: false,
				value: 'quantity',
				fixed: true,
				width: "18%"
			},
			{
				text: 'UNIT PRICE',
				align: 'end',
				sortable: false,
				value: 'unit_price',
				fixed: true,
				width: "18%"
			},
			{
				text: 'AMOUNT',
				align: 'end',
				sortable: false,
				value: 'amount',
				fixed: true,
				width: "18%"
			},
            {
				text: '',
				align: 'end',
				sortable: false,
				value: 'actions',
				fixed: true,
				width: "6%"
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
        isProductsValidData: true,
        counter: 1,
        selected: [],
        productListsDropdownData: [],
        rules: [
            (v) => !!v || "Input is required."
        ],
        quantityRules: [
            v => !!v || 'Quantity is required',
            v => (parseFloat(v)>0) || 'Quantity should be greater than 0',
        ],
        priceRules: [
            v => !!v || 'Price is required',
            v => (parseFloat(v)>0) || 'Price should be greater than 0',
        ],
    }),
    computed: {
        ...mapGetters({
            getWarehouse: 'warehouse/getWarehouse',
            getProducts: 'products/getProducts',
            getProductsPoDropdown: 'products/getProductsPoDropdown',
            poBaseUrlState: 'products/poBaseUrlState',
            getPoLoading: 'po/getPoLoading',
            getPoCreateLoading: 'po/getPoCreateLoading',
            getPoSaveAddLoading: 'po/getPoSaveAddLoading',
            getSuppliers: 'suppliers/getSuppliers',
            getVendorLists: 'po/getVendorLists',
            getUser: 'getUser'
        }),
        productListsDropdown: {
            get() {
                if (this.editedIndex === -1) {
                    let value = _.filter(this.productListsDropdownData, e => (e.status==='active'))
                    return value
                    //return this.productListsDropdownData
                } else {
                    let value = this.productListsDropdownData
                    let finalValue = []
                    if (Array.isArray(value) && value.length > 0) {
                        if (typeof this.poItem!=='undefined' && typeof this.poItem.products!=='undefined' && Array.isArray(this.poItem.products) && this.poItem.products.length > 0) {

                            value.map ( v => {
                                if ( v.status!=='active') {
                                    let findProduct = _.findIndex(this.poItem.products,e => (v.id === e.id))
                                    if (findProduct !== -1) {
                                        finalValue.push(v)
                                    }
                                } else {
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
  
                }
                
            },
            set (value) {
                this.productListsDropdownData = value
            }
        },
        dialogCreate: {
            get() {
                return this.dialog
            },
            set (value) {
                if (this.editedIndex === -1) {    
                    this.$refs.form.resetValidation()
                    this.dataProducts = (this.poItem.loadingState) ? [] : [{
                        id: null,
                        quantity: 0,
                        unit_price: 0,
                        amount: 0
                    }]

                    this.poItem =  {
                        products: [{
                            id: null,
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

                    this.$emit('update:dialog', value)
                }
            }
        },
        poItem: {
            get() {
                return this.editedItems
            },
            set(value) {
                this.$emit('update:editedItems', value)
            }
        },
        formTitle () {
            return this.editedIndex === -1 ? 'Create Purchase Order' : 'Edit Purchase Order'
        },
        vendorListOptions() {
            let newVendorLists = []
            if (typeof this.getVendorLists!=='undefined' && Array.isArray(this.getVendorLists) 
                && this.getVendorLists.length > 0) {
                newVendorLists = this.getVendorLists.map( gvl => ({
                        label: gvl.company_name,
                        value: gvl.id
                    })
                )
            }
            return newVendorLists
        },
        shipLists() {
            let shipListsData = []

            if (typeof this.getWarehouse !== 'undefined' && this.getWarehouse !== null) {
                if (typeof this.getWarehouse.results !== 'undefined' && this.getWarehouse.results !== null) {
                    if (typeof this.getWarehouse.results !== 'undefined' && this.getWarehouse.results !== null) {
                        if (typeof this.getWarehouse.results.length !== 'undefined' && this.getWarehouse.results.length !== null) {
                            shipListsData = this.getWarehouse.results.map(value => ({
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
        addPoTemplate() {
            let buildItem = {
                sys_gen: (this.radioGroup1 === 'custom') ? false : true,
                customer_id: (typeof this.getUser=='string') ? JSON.parse(this.getUser).customer.id : '',
                supplier_id: this.poItem.supplier_id,
                notes: this.poItem.notes,
                products: this.poItem.products.map(eip => ({
                    id: eip.id,
                    quantity: parseInt(eip.quantity),
                    unit_price: parseFloat(eip.unit_price),
                    amount: eip.amount,
                })),
                warehouse_id: this.poItem.warehouse_id,
                sub_total: this.poItem.sub_total,
                total: this.poItem.total,
                shipping: this.poItem.shipping,
                discount: this.poItem.discount,
                tax: this.poItem.tax
            }

            if ( !buildItem.sys_gen ){
                buildItem.po_number = this.poItem.po_number
            }

            return buildItem
        },
    },
    methods: {
        ...mapActions({
            fetchVendorLists: 'po/fetchVendorLists',
            fetchPo: 'po/fetchPo',
            createPo: 'po/createPo',
            updatePo: 'po/updatePo',
            fetchWarehouse: 'warehouse/fetchWarehouse',
            getPo: 'po/getPo',
        }),
        ...globalMethods,
        removeRow(item) {
            let getIndex = this.poItem.products.indexOf(item)
            this.poItem.products.splice(getIndex, 1)
            this.dataProducts = this.poItem.products
        }, 
        async updateProduct(index) {
            try {
                let value = this.poItem.products[index].id
                const res = await axios.get(`${this.poBaseUrlState}/products/${value}`)
                if (res.status === 200) {
                    if (typeof res.data!=='undefined') {
                        if (typeof res.data.unit_price!=='undefined' && res.data.unit_price!=='' && res.data.unit_price!==null) {
                            this.poItem.products[index].unit_price = res.data.unit_price    
                        } else {
                            this.poItem.products[index].unit_price = 0
                        }
                    } else {
                        this.poItem.products[index].unit_price = 0
                    }
                } else {
                    this.poItem.products[index].unit_price = 0
                }
            } catch(e) {
                if (typeof e.message!=='undefined' && e.message =='UnAuthenticated') {
                    this.$router.push('/login')
                } else {
                    this.poItem.products[index].unit_price = 0
                }                
            }
        },
        addRow() {
            let getItem = this.poItem

            getItem.products.push({
                id: null,
                quantity: 0,
                unit_price: 0,
                amount: 0
            })

            this.poItem = getItem
            this.dataProducts = getItem.products
        },        
        async fetchProductsPoDropdown() {
            try {
                let productsData = []
                const res = await axios.get(`${this.poBaseUrlState}/purchaseorders/products?page=${this.current_page}`)
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
                                    sku: value.sku,
                                    desc: value.description,
                                    image: value.image,
                                    status: value.status
                                }

                                return data
                            })
                            //concatonate new data
                            this.productListsDropdown = this.productListsDropdown.concat(productsData)

                            //check next page
                            if (typeof res.data.results.next_page_url!=='undefined' && res.data.results.next_page_url!==null) {
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
        getImgUrl(pic) {
            // if returned image from the API has https://po.shifl.com/storage/
            // if (pic !== 'undefined' && pic !== null) {
			// 	return pic
			// } else {
			// 	return require('../../../assets/icons/default-product-icon.svg')
			// }

            // if returned image from the API has no https://po.shifl.com/storage/
            let imageUrl = 'https://po.shifl.com/storage/'

            if (pic !== 'undefined' && pic !== null) {
                if (pic.includes(imageUrl) !== 'undefined' && !pic.includes(imageUrl)) {
                    let newImage = imageUrl + pic
                    return newImage
                } else {
                    return pic
                }
            } else {
                return require('../../../assets/icons/default-product-icon.svg')
            }
		},
        getProductNumber(index) {
            let setNumber = index + 1

            if (setNumber < 10) {
                setNumber = '0' + setNumber
            }
            return setNumber
        },
        subTotal() {
            if (typeof this.poItem.products!=='undefined' && this.poItem.products!==null && Array.isArray(this.poItem.products) && this.poItem.products.length > 0) {
                if ( this.poItem.sub_total!==_.sumBy(this.poItem.products, e => (e.amount))) {
                    this.poItem.sub_total = _.sumBy(this.poItem.products, e => (e.amount))
                }
                return (isNaN(this.poItem.sub_total)) ? 0 : this.poItem.sub_total
            } else {
                this.poItem.sub_total = 0
                return 0
            }
        },
        total() {
            if (this.poItem.total!==parseFloat(this.poItem.sub_total + this.poItem.tax)) {
                this.poItem.total = parseFloat(this.poItem.sub_total + this.poItem.tax)
            }
            return (isNaN(this.poItem.total)) ? 0 : this.poItem.total
        },
        tax() {
            this.poItem.tax = 0
            return this.poItem.tax
        },
        updateAmount( getItem ) {
            if ( typeof this.poItem.products[this.poItem.products.indexOf(getItem)]!=='undefined') {

                if (this.poItem.products[this.poItem.products.indexOf(getItem)].amount!==parseFloat(parseInt(getItem.quantity) * parseFloat(getItem.unit_price))) {
                    this.poItem.products[this.poItem.products.indexOf(getItem)].amount = parseFloat(parseInt(getItem.quantity) * parseFloat(getItem.unit_price))   
                }

                return (isNaN(this.poItem.products[this.poItem.products.indexOf(getItem)].amount)) ? 0 : this.poItem.products[this.poItem.products.indexOf(getItem)].amount
            
            } else {
                return 0
            }
        },
        close() {
            this.$refs.form.resetValidation()
            this.radioGroup1 = 'generated'
            this.$emit('close')
        },
        async savePo() {
            this.$refs.form.validate()

            if (this.$refs.form.validate()) {
                this.addPoTemplate.another = false

                try {
                    if (this.editedIndex === -1) {                    
                        await this.createPo(this.addPoTemplate)
                        this.notificationMessage('Po has been created.')
                        await this.fetchPo()
                        this.close()

                        if (this.isMobile) {
                            this.callSinglePo()
                        }
                    } else {                    
                        let editPoTemplate = this.addPoTemplate
                        editPoTemplate.id = this.poItem.id
                        editPoTemplate._method = 'PUT'
                        await this.updatePo(editPoTemplate)
                        this.notificationMessage('PO has been updated.')
                        await this.fetchPo()
                        this.close()

                        if (this.isMobile) {
                            this.callSinglePo()
                        }
                    }

                    this.radioGroup1 = 'generated'
                } catch(e) {
                    this.notificationError(e)
                    console.log(e)
                }
            }
        },
        async addPoAnother() {
            this.$refs.form.validate()

            if (this.$refs.form.validate()) {
                try {
                    // save then close
                    this.addPoTemplate.another = true
                    await this.createPo(this.addPoTemplate)
                    this.notificationMessage('Po has been created.')
                    await this.fetchPo()

                    this                
                    this.$emit('update:editedIndex', -1)
                    this.poItem = {
                        products: [{
                            id: null,
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
                    this.$refs.form.resetValidation()
                    this.radioGroup1 = 'generated'

                    if (this.isMobile) {
                        this.callSinglePo()
                    }
                } catch(e) {
                    this.notificationError(e)
                    console.log(e)
                }
            }
        },
        async updatePoAnother() {
            this.$refs.form.validate()

            if (this.$refs.form.validate()) {
                try {
                    let editPoTemplate = this.addPoTemplate
                    editPoTemplate.id = this.poItem.id
                    editPoTemplate._method = 'PUT'
                    editPoTemplate.another = true
                    await this.updatePo(editPoTemplate)
                    this.notificationMessage('PO has been updated.')
                    await this.fetchPo()

                    this.$emit('update:editedIndex', -1)
                    this.poItem = {
                        products: [{
                            id: null,
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
                    this.$refs.form.resetValidation()
                    this.radioGroup1 = 'generated'

                    if (this.isMobile) {
                        this.callSinglePo()
                    }
                } catch(e) {
                    this.notificationError(e)
                    console.log(e)
                }
            }
        },        
        async callSinglePo() {
            const params = new URLSearchParams(window.location.search)

            if (params.has('id')) {
                let getPoId = params.get('id')
                try {
                    await this.getPo(getPoId)
                    await this.fetchVendorLists()
                    await this.fetchWarehouse()
                } catch(e) {
                    console.log('get po', e)
                }
            }
        },
        inputRestrictSpecialChar(e) {
            if (/^\W$/.test(e.key)) {
                if (e.key !== '-' && e.key !== ' ') {
                    e.preventDefault();
                }
            }
        },
        isProductSelected(id) {
            if (id !== null) {
                let findSelectedOption = _.findIndex(this.poItem.products, e => (e.id == id))

                if (findSelectedOption !== -1) {
                    return true
                } else {
                    return false
                }
            }
        },
        avoidClick(e) {
            e.preventDefault()
        }
    },
    async mounted() {        
        try {
            this.fetchProductsPoDropdown()
        } catch(e) {
            console.log('An error occured.', e)
        }
        try {
            if (this.dataProducts !== this.poItem.products) {
                this.dataProducts = this.poItem.products
            }

            //fetch vendor lists
            await this.fetchVendorLists()

            if ( typeof this.poItem.is_system_generated!=='undefined' )
                this.radioGroup1 = ( this.poItem.is_system_generated===0 ) ? 'custom' : 'generated'
            else
                this.radioGroup1 = 'generated'
        } catch(e) {
            console.log('error fetching vendor lists', e)
        }
    },
    updated() {
        if (this.editedIndex === -1) {
            if (typeof this.$refs.form !== 'undefined') {
                if (typeof this.$refs.form.resetValidation() !== 'undefined') {
                    this.$refs.form.resetValidation()
                }
            }
        }

        if (typeof this.poItem !== 'undefined' && this.dataProducts !== this.poItem.products) {
            this.dataProducts = this.poItem.products
        }

        let valid = true
        //let dataProducts = (typeof this.poItem.products!=='undefined') ? this.poItem.products : []
        if (typeof this.poItem!=='undefined' && this.poItem !== null 
            && this.poItem.products !== 'undefined' && this.poItem.products ) {
            
            let dataProducts = this.poItem.products
            if (Array.isArray(dataProducts) && dataProducts.length > 0) {
                dataProducts.map( item => {
                    if (item.quantity ==='' || item.quantity === 0 || item.quantity ===null || item.quantity==="0" || parseFloat(item.quantity)==0)
                        valid = false

                    if (item.unit_price == '' || item.unit_price === 0 || item.unit_price ===null || item.unit_price==="0" || parseFloat(item.unit_price)==0)
                        valid = false

                    if (typeof item.id=='undefined'){
                        valid = false
                    } else {
                        if (item.id == '' || item.id ==null || item.id =='0' || item.id ==0)
                            valid = false
                    }
                    
                })
            }
        } else {
            valid = false
        }

        if (this.isProductsValidData!==valid)
            this.isProductsValidData = valid
    }
}
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/po/poCreateEditDialog.scss';
</style>
