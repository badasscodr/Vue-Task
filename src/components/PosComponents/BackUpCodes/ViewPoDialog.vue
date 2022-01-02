<template>
    <v-dialog v-model="dialogView" max-width="880px" content-class="po-view-dialog">
        <v-card class="dialog-wrapper">
            <v-card-title>
                <span class="headline">
                    <span class="po-num">PO #{{ editedItem.po_number }}</span>
                    <span class="date"> {{ getDateFormat(editedItem.created_at) }} </span>
                </span>

                <div class="header-actions">
                    <div>
                        <button @click="closeAndShowEditDialog()" class="btn btn-edit">
                            <img src="../../assets/icons/edit-white.svg" alt="">
                            Edit
                        </button>
                    </div>
                    <button @click="download(editedItem)" class="btn btn-download">
                        {{
                            (getDownloadLoading) ? 'Downloading...' : 'Download'
                        }}
                    </button>
                    <button @click="showDeleteInnerDialog()" class="btn btn-delete">Delete</button>

                    <button
                        icon
                        dark
                        class="btn-close"
                        @click="closeView">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </div>
            </v-card-title>

            <v-card-text>
                <div class="view-box-wrapper">
                    <div class="view-vendor-wrapper">
                        <p class="view-title">VENDOR</p>
                        <p class="view-data mt-2">{{ getVendor(editedItem.supplier_id) }}</p>
                    </div>

                    <div class="view-ship-wrapper">
                        <p class="view-title">SHIP TO</p>
                        <p class="view-data mt-2" 
                            v-html="getWarehouseAddress(editedItem.warehouse_id)">
                        </p>
                    </div>

                    <div class="view-terms-wrapper">
                        <div class="d-flex">
                            <p class="view-title">TERMS</p>
                            <p class="view-data">{{ editedItem.terms !== null ? editedItem.terms : 'N/A' }}</p>
                        </div>
                        <div class="d-flex">
                            <p class="view-title">DUE BY</p>
                            <p class="view-data">{{ editedItem.due_by !== null ? editedItem.due_by : 'N/A' }}</p>
                        </div>
                        <div class="d-flex">
                            <p class="view-title">SHIP VIA</p>
                            <p class="view-data">{{ editedItem.ship_via !== null ? editedItem.ship_via : 'N/A' }}</p>
                        </div>
                        <div class="d-flex">
                            <p class="view-title">STATUS</p>
                            <p class="view-data">{{ editedItem.status !== null ? editedItem.status : 'N/A' }}</p>
                        </div>
                    </div>
                </div>

                <div class="view-table-wrapper">
                    <v-data-table
                        :headers="headers"
                        :items="editedItem.products"
                        class="elevation-1 view-table"
                        hide-default-footer>
                    </v-data-table>
                </div>

                <div class="view-total-wrapper">
                    <div class="notes-wrapper">
                        <div class="view-notes">
                            <p class="view-title">NOTES</p>
                            <p class="view-data">{{ editedItem.notes }}</p>
                        </div>
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
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TotalComponent from '../TotalComponent.vue'
import moment from 'moment'
import _ from 'lodash'
import globalMethods from '../../../utils/globalMethods'

export default {
    name: 'ViewPoDialog',
    components: {
        TotalComponent
    },
    props: ['dialogViewData', 'editedItemData', 'deleteInnerData', 'createDialogData', 'editItem'],
    data: () => ({
        headers: [
			{
				text: 'SKU',
				align: 'start',
				sortable: false,
				value: 'sku',
				fixed: true,
				width: "144px"
			},
			{
				text: 'DESCRIPTION',
				align: 'start',
				sortable: false,
				value: 'description',
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
		],
        items: []
    }),
    mounted() {
        
    },
    methods: {
        ...globalMethods,
        ...mapActions({
            downloadPo: 'po/downloadPo'
        }),
        async download(item) {
            
            try {
                await this.downloadPo(item)
            } catch(e) {
                this.notificationError(e)
                console.log(e)
            }

        },
        closeAndShowEditDialog() {
            this.$emit('update:createDialogData', true)
            this.$emit('update:dialogViewData', false)
            this.$emit('editItem', this.editedItem)
        },
        getDateFormat(date) {
            return moment(date).format('MMM DD, YYYY');
        },
        showDeleteInnerDialog() {
            this.$emit('update:deleteInnerData', true)
        },
        tax() {
            return parseFloat(_.sumBy(this.editedItem.products, e => (e.amount)) * this.editedItem.tax)
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
        getVendor(id) {
            if ( Array.isArray(this.getVendorLists) && this.getVendorLists.length > 0) {
                let findVendor = _.find(this.getVendorLists, (e => e.id ===id))
                if ( typeof findVendor!=='undefined' ) {
                    return findVendor.company_name
                }
            }
            return '--'
        },
        total() {
            this.editedItem.total = parseFloat(this.subTotal() + this.tax())
            return this.editedItem.total
        },
        closeView() {
            this.$emit('update:dialogViewData', false)
        },
        getWarehouseAddress(id) {
            if (typeof this.getWarehouse !== 'undefined' && this.getWarehouse !== null &&
                typeof this.getWarehouse.results !== 'undefined' && this.getWarehouse.results !== null &&
                this.getWarehouse.results.data !== 'undefined' && this.getWarehouse.results.data !== null &&
                this.getWarehouse.results.data.length !== 'undefined' && this.getWarehouse.results.data.length !== null) {
                    
                    let getData = this.getWarehouse.results.data
                    let findSizeValue = id !== 'undefined' ? _.find(getData, (e) => (e.id == id)) : ''

                    if (typeof findSizeValue !== 'undefined') {
                        if (findSizeValue.address !== 'undefined') {
                            // return findSizeValue.address
                            return `<span>${findSizeValue.name}</span><br/><span>${findSizeValue.address}</span>`;
                        }
                    } else {
                        return '--'
                    }
            }
        },
    },
    computed: {
        ...mapGetters({
			getWarehouse: 'warehouse/getWarehouse',
            getVendorLists: 'po/getVendorLists',
            getDownloadLoading: 'po/getDownloadLoading'
        }),
        dialogView: {
            get () {
                return this.dialogViewData
            },
            set (value) {
                if (!value) {
                    this.$emit('update:dialogViewData', false)
                } else {
                    this.$emit('update:dialogViewData', true)
                }
            }
        },
        editedItem: {
            get () {
                return this.editedItemData
            },
            set (value) {
                console.log(value);
            }
        },
        // items: {
        //     get () {
        //         return this.editedItemData.product_details
        //     },
        //     set (value) {
        //         console.log(value);
        //     }
        // }
    },
    watch: {},
    updated() {}
}
</script>

<style>
@import '../../assets/css/dialog_styles/dialogHeader.css';
@import '../../assets/css/dialog_styles/dialogFooter.css';
@import '../../assets/css/po_styles/poViewDialog.css';
</style>