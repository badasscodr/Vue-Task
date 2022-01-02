<template>
    <div class="po-mobile-view">
        <div class="po-mobile-header">
            <div class="details-breadcrumbs">
                <router-link to="/pos" class="po-link">
                    Purchase Orders
                </router-link>

                <span class="right-chevron">
                    <img src="@/assets/images/right_chevron.svg" alt="" srcset="" width="7px"> 
                </span>

                <p class="mobile-po-num">
                    {{
                        (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.po_number!=='undefined') ? getPoDetail.po_number : ''
                    }}
                </p>
            </div>

            <div class="subheader-wrapper">
                <div class="subheader">
                    <p>
                        {{
                            (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.po_number!=='undefined') ? 'PO #' + getPoDetail.po_number : ''
                        }}
                    </p>                    
                    <span class="date pl-0">
                        {{
                            (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.created_at!=='undefined') ? getDateFormat(getPoDetail.created_at) : ''
                        }}
                    </span>
                </div>

                <POCreateDialog 
                    :dialog.sync="dialog"
                    :editedIndex.sync="editedIndex"
                    :editedItems.sync="editedItem"
                    @close="close"
                    :isMobile="isMobile" />

                <DeleteDialog 
                    :dialogData.sync="deleteInnerDialog"
                    :editedItemData.sync="currentPoToDelete"
                    :editedIndexWarehouse.sync="editedIndex"
                    :defaultItemWarehouse.sync="defaultItem"
                    @delete="deletePoConfirm"
                    @close="closePoDelete"
                    fromComponent="po"
                    :loadingDelete="getPoDeleteLoading"
                    componentName="PO" />

                <div class="subheader-button">
                    <button @click="editItem()" class="btn btn-edit">Edit</button>
                    <v-menu bottom left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn class="btn btn-more" icon v-bind="attrs" v-on="on">
                                <v-icon>mdi-dots-horizontal</v-icon>
                            </v-btn>
                        </template>

                        <v-list class="warehouse-lists-items">
                            <v-list-item @click="download(getPoDetail)">
                                <v-list-item-title>
                                    {{
                                        (getDownloadLoading) ? 'Downloading...' : 'Download'
                                    }}
                                </v-list-item-title>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-title @click="openDelete()">
                                    Delete
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </div>
        </div>      
        <div class="po-wrapper-info">
            <div class="po-info">
                <div class="po-vendor">
                    <span>VENDOR</span>
                    <p>
                        {{
                            (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.supplier_id!=='undefined') ? getVendor(getPoDetail.supplier_id) : ''
                        }}
                    </p>
                </div>

                <div class="po-ship">
                    <span>SHIP TO</span>
                    <p>
                        {{
                            (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.warehouse_id!=='undefined') ?     getWarehouseAddress(getPoDetail.warehouse_id) : ''
                        }}
                    </p>
                </div>

                <div class="po-terms">
                    <div class="po-terms-info">
                        <div class="po-terms-title">TERMS</div>
                        <p class="mb-0">
                            {{
                                (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.terms!=='undefined' && getPoDetail.terms !== null) ? getPoDetail.terms : 'N/A'
                            }}
                        </p>
                    </div>

                    <div class="po-terms-info">
                        <div class="po-terms-title">DUE BY</div>
                        <p class="mb-0">
                            {{
                                (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.due_by!=='undefined' && getPoDetail.due_by !== null) ? getPoDetail.due_by : 'N/A'
                            }}
                        </p>
                    </div>

                    <div class="po-terms-info">
                        <div class="po-terms-title">SHIP VIA</div>
                        <p class="mb-0">
                            {{
                                (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.ship_via!=='undefined' && getPoDetail.ship_via !== null) ? getPoDetail.ship_via : 'N/A'
                            }}
                        </p>
                    </div>

                    <div class="po-terms-info">
                        <div class="po-terms-title">STATUS</div>
                        <p class="mb-0">
                            {{
                                (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.status!=='undefined' && getPoDetail.status !== null) ? getPoDetail.status : 'N/A'
                            }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="po-desc-table">
            <div class="table-header">
                <p>Description</p>
                <p>Amount</p>
            </div>

            <v-data-table
                :headers="headers"
                :items="items"
                class="elevation-1 view-table"
                mobile-breakpoint="769"
                hide-default-footer>

                <template v-slot:[`item.desc`]="{ item }">
                    <div class="item-desc">
                        <p class="desc">{{ item.desc}}</p>
                        <p class="amount">{{ item.amount}}</p>
                    </div>
                </template>

                <template v-slot:no-data>
                    <div class="no-data-preloader d-flex justify-center align-center"
                        style="min-height: 150px; border-bottom: 2px solid #EDF3F6;"
                        v-if="tableLoading">

                        <v-progress-circular
                            :size="40"
                            color="#0171a1"
                            indeterminate>
                        </v-progress-circular>
                    </div>
                </template>
            </v-data-table>

            <TotalComponent>
                <template v-slot:sub_total>
                    <p class="total-component-pr-six"> {{ subTotal() }} </p>
                </template>
                <template v-slot:tax>
                    <p class="total-component-pr-six"> {{ tax() }} </p>
                </template>
                <template v-slot:shipping>
                    <p class="total-component-pr-six">
                        {{
                            (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.shipping!=='undefined') ? getPoDetail.shipping : ''
                        }}
                    </p>
                </template>
                <template v-slot:discount>
                    <p class="total-component-pr-six">
                        {{
                            (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.discount!=='undefined') ? getPoDetail.discount : ''
                        }}
                    </p>
                </template>
                <template v-slot:total>
                    <p class="total-component-pr-six">{{ total() }} </p>
                </template>
            </TotalComponent>

            <div class="notes-view">
                <span>Notes</span>
                <p>
                    {{
                        (getPoDetailLoading) ? 'Loading...' : (typeof getPoDetail.notes!=='undefined') ? getPoDetail.notes : ''
                    }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import TotalComponent from '../TotalComponent.vue'
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import POCreateDialog from '../Dialog/POCreateDialog.vue'
import DeleteDialog from '../../Dialog/DeleteDialog.vue'
import globalMethods from '../../../utils/globalMethods'

export default {
    name: 'PoMobile',
    components: {
        TotalComponent,
        POCreateDialog,
        DeleteDialog
    },
    data: () => ({
        data: {},
        isMobile: true,
        tableLoading: true,
        editedIndex: 1,
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
        editedItemData: {
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
        headers: [
			{
				text: 'DESCRIPTION',
				align: 'start',
				sortable: false,
				value: 'desc',
				fixed: true,
				width: "330px"
			},
			{
				text: 'AMOUNT',
				align: 'end',
				sortable: false,
				value: 'amount',
				fixed: true,
				width: "112px"
			},
		],
        dialog: false,
		items: [],
        deleteInnerDialog: false,
        dialogView: false,
        currentPoToDelete: null
    }),
    async mounted() {
        this.fetchProducts()
        this.$store.dispatch("page/setPage","pos")

        const params = new URLSearchParams(window.location.search)

        if (params.has('id')) {
            let getPoId = params.get('id')

            try {
                await this.getPo(getPoId)
                await this.fetchVendorLists()
                await this.fetchWarehouse()

                this.editedItem = this.getPoDetail

                if (typeof this.getPoDetail.purchase_order_products!=='undefined' && this.getPoDetail.purchase_order_products!==null && Array.isArray(this.getPoDetail.purchase_order_products) && this.getPoDetail.purchase_order_products.length > 0) {
                    this.items = this.getPoDetail.purchase_order_products.map( pp => ({
                        desc: (typeof pp.product!=='undefined' && pp.product!==null && typeof pp.product.description!=='undefined' && pp.product.description!==null && pp.product.description!=='') ? pp.product.description : '',
                        amount: pp.amount,
                        quantity: pp.quantity
                    }))

                    this.editedItem.products = this.getPoDetail.purchase_order_products.map( ipp => ({
                        id: ipp.product_id,
                        quantity: ipp.quantity, 
                        unit_price: ipp.unit_price,
                        amount: ipp.amount,
                        product_id: ipp.product_id
                    }))

                }

                this.tableLoading = false
            } catch(e) {
                console.log('get po', e)
            }
        }
    },
    methods: {
        ...globalMethods,
        ...mapActions({
            getPo: 'po/getPo',
            fetchVendorLists: 'po/fetchVendorLists',
            fetchWarehouse: 'warehouse/fetchWarehouse',
            downloadPo: 'po/downloadPo',
            fetchProducts: 'products/fetchProducts',
            deletePo: 'po/deletePo',
            fetchPo: 'po/fetchPo',
        }),
        save() {},
        editItem() {
            this.editedItem = this.getPoDetail
            if (typeof this.getPoDetail.purchase_order_products!=='undefined' && this.getPoDetail.purchase_order_products!==null && Array.isArray(this.getPoDetail.purchase_order_products) && this.getPoDetail.purchase_order_products.length > 0) {
                this.items = this.getPoDetail.purchase_order_products.map( pp => ({
                    desc: (typeof pp.product!=='undefined' && pp.product!==null && typeof pp.product.description!=='undefined' && pp.product.description!==null && pp.product.description!=='') ? pp.product.description : '',
                    amount: pp.amount,
                    quantity: pp.quantity
                }))

                this.editedItem.products = this.getPoDetail.purchase_order_products.map( ipp => ({
                    id: ipp.product_id,
                    quantity: ipp.quantity, 
                    unit_price: ipp.unit_price,
                    amount: ipp.amount,
                    product_id: ipp.product_id
                }))

            }
            this.editedIndex = 1
            this.dialog = true

        },
        close() {
            this.dialog = false
        },
        tax() {
            if (typeof this.getPoDetail.purchase_order_products!=='undefined' && this.getPoDetail.purchase_order_products!==null && Array.isArray(this.getPoDetail.purchase_order_products) && this.getPoDetail.purchase_order_products.length > 0) {
                return parseFloat(_.sumBy(this.getPoDetail.purchase_order_products, e => (e.amount)) * this.getPoDetail.tax)
                
            } else {
                return 0
            }
        },
        total() {
            return parseFloat(this.subTotal() + this.tax())
        },
        subTotal() {
            if (typeof this.getPoDetail.purchase_order_products!=='undefined' && this.getPoDetail.purchase_order_products!==null && Array.isArray(this.getPoDetail.purchase_order_products) && this.getPoDetail.purchase_order_products.length > 0) {
                return _.sumBy(this.getPoDetail.purchase_order_products, e => (e.amount))
            } else {
                return 0
            }
        },
        getVendor(id) {
            if ( Array.isArray(this.getVendorLists) && this.getVendorLists.length > 0) {
                let findVendor = _.find(this.getVendorLists, (e => e.id ===id))
                if ( typeof findVendor!=='undefined' ) {
                    return findVendor.company_name
                }
            }
            return '--'
        },
        getDateFormat(date) {
            return moment(date).format('MMM DD, YYYY');
        },
        getWarehouseAddress(id) {
            if (typeof this.getWarehouse !== 'undefined' && this.getWarehouse !== null &&
                typeof this.getWarehouse.results !== 'undefined' && this.getWarehouse.results !== null &&
                typeof this.getWarehouse.results.data !== 'undefined' && this.getWarehouse.results.data !== null &&
                typeof this.getWarehouse.results.data.length !== 'undefined' && this.getWarehouse.results.data.length !== null) {
                    
                    let getData = this.getWarehouse.results.data
                    let findSizeValue = id !== 'undefined' ? _.find(getData, (e) => (e.id == id)) : ''

                    if (typeof findSizeValue !== 'undefined') {
                        if (typeof findSizeValue.address !== 'undefined') {
                            // return findSizeValue.address
                            return `${findSizeValue.name} ${findSizeValue.address}`;
                        }
                    } else {
                        return '--'
                    }
            }
        },
        async download(item) {
            try {
                await this.downloadPo(item)
            } catch(e) {
                this.notificationError(e)
                console.log(e)
            }
        },
        openDelete() {
            this.deleteInnerDialog = true
            this.currentPoToDelete = this.getPoDetail
            this.currentPoToDelete.name = this.getPoDetail.po_number
        },
        async deletePoConfirm() {
            try {
                await this.deletePo(this.currentPoToDelete.id)
                this.notificationMessage('Purchase order successfully deleted.')
                this.fetchPo()
                this.closePoDelete()
                this.$router.push(`/pos`)
            } catch(e) {
                this.closePoDelete()
                this.notificationError(e)
            }
        },
        closePoDelete() {
            this.deleteInnerDialog = false
            this.$nextTick(() => {
				this.editedItemData = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			})
        },
    },
    updated() {
        if (typeof this.getPoDetail !== 'undefined') {
            if (this.editedItem !== this.getPoDetail) {
                this.editedItem = this.getPoDetail

                if (typeof this.getPoDetail.purchase_order_products!=='undefined' && this.getPoDetail.purchase_order_products!==null && Array.isArray(this.getPoDetail.purchase_order_products) && this.getPoDetail.purchase_order_products.length > 0) {
                    this.items = this.getPoDetail.purchase_order_products.map( pp => ({
                        desc: (typeof pp.product!=='undefined' && pp.product!==null && typeof pp.product.description!=='undefined' && pp.product.description!==null && pp.product.description!=='') ? pp.product.description : '',
                        amount: pp.amount,
                        quantity: pp.quantity
                    }))

                    this.editedItem.products = this.getPoDetail.purchase_order_products.map( ipp => ({
                        id: ipp.product_id,
                        quantity: ipp.quantity, 
                        unit_price: ipp.unit_price,
                        amount: ipp.amount,
                        product_id: ipp.product_id
                    }))

                }

                this.tableLoading = false
            }
        }
    },
    computed: {
        ...mapGetters({
            getPoDetailLoading: 'po/getPoDetailLoading',
            getPoDetail: 'po/getPoDetail',
            getVendorLists: 'po/getVendorLists',
            getWarehouse: 'warehouse/getWarehouse',
            getDownloadLoading: 'po/getDownloadLoading',
            getPoDeleteLoading: 'po/getPoDeleteLoading'
        }),
        editedItem: {
            get() {
                return this.editedItemData
            },
            set(value) {
                this.editedItemData = value
            }
        }
    },
}
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/po/po.scss';
@import '../../../assets/scss/pages_scss/po/poMobileView.scss';
@import '../../../assets/scss/pages_scss/po/poCreateEditDialog.scss';
@import '../../../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../../../assets/scss/buttons.scss';

.total-component-pr-six {
    padding-right: 6px;
}
</style>
