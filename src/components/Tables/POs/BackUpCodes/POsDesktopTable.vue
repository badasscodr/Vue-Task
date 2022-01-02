<template>
    <v-data-table
        :headers="headers"
        :items="items"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :search="search"
        hide-default-footer
        mobile-breakpoint="769"
        @page-count="pageCount = $event"
        class="pos-table elevation-1"
        :class="(typeof items !== 'undefined' && items !== null && items.length > 0) ? '' : 'no-data-table'">


        <template v-slot:top>

            <v-toolbar flat>
                <v-toolbar-title>Purchase Orders</v-toolbar-title>
                <v-spacer></v-spacer>
                <Search 
                    placeholder="Search Purchase Orders"
                    className="search custom-search"
                    :inputData.sync="search" />

                <CreatePoDialog 
                    :editedIndexData.sync="editedIndex"
                    :dialogData.sync="dialog"
                    :defaultItem="defaultItem"
                    :editedItemData.sync="editedItem"
                    @close="close"
                    @save="save" />

                <ViewPoDialog 
                    :dialogViewData.sync="dialogView"
                    :editedItemData.sync="editedItem"
                    :createDialogData.sync="dialog"
                    @editItem="editItem"
                    :deleteInnerData.sync="deleteInnerDialog"
                    @closeDialog="closeView" />

                <DeletePoDialog 
                    :dialogInnerData.sync="deleteInnerDialog"
                    :dialogViewData.sync="dialogView"
                    :item="editedItem"
                    :isMobile="isMobile">

                    <template v-slot:content>
                        <h2>Delete Purchase Order</h2>
                        <p>Do you want to delete the PO ‘‘{{ editedItem.po_number }}’’?</p>
                    </template>
                </DeletePoDialog>

                <!-- <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                        
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog> -->
            </v-toolbar>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">				
            <div class="item-details-wrapper">
                <p class="item-detail">{{ getDateFormat(item.created_at) }}</p>
            </div>
        </template>

        <template v-slot:[`item.warehouse_id`]="{ item }">				
            <div class="item-details-wrapper">
                <p class="item-detail">{{ getWarehouseAddress(item.warehouse_id) }}</p>
            </div>
        </template>

        <template v-slot:[`item.supplier_id`]="{ item }">				
            <div class="item-details-wrapper">
                <p class="item-detail">{{ getVendor(item.supplier_id) }}</p>
            </div>
        </template>

        <template v-slot:[`item.total`]="{ item }">				
            <div class="item-details-wrapper">
                <p class="item-detail">${{item.total }}</p>
                <p class="item-unit">{{ item.total_products }} Items</p>
            </div>
        </template>

        <template v-slot:[`item.actions`]="{ item }">				
            <div class="button-icon-wrapper">					
                <button class="btn-view" @click="viewItem(item)">
                    <img src="@/assets/icons/view-blue.svg" alt="">
                    View
                </button>

                <button class="btn-edit" @click="editItem(item)">
                    <img src="@/assets/icons/edit-blue.svg" alt="">
                    Edit
                </button>
            </div>
        </template>

        <template v-slot:no-data>
            <div class="no-data-preloader mt-4" v-if="getPoLoading">
                <v-progress-circular
                    :size="40"
                    color="#0171a1"
                    indeterminate
                    v-if="getPoLoading">
                </v-progress-circular>
            </div>

            <div class="no-data-wrapper" v-if="!getPoLoading && items !== null">
                <div class="no-data-heading">
                    <img src="../../../assets/icons/empty-po-icon.svg" width="40px" height="42px" alt="">

                    <h3> Create Purchase Order </h3>
                    <p>
                        There is no purchase order to show. <br>
                        Let’s create the first purchase order.
                    </p>

                    <div class="mt-4">

                        <CreatePoDialog 
                            :editedIndexData.sync="editedIndex"
                            :dialogData.sync="dialog"
                            :editedItemData.sync="editedItem"
                            @close="close"
                            @save="save" />
                    </div>
                </div>
            </div>
        </template>
    </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex'
import Search from '@/components/Search.vue'
import CreatePoDialog from '@/components/PosComponents/CreatePoDialog.vue'
import ViewPoDialog from '@/components/PosComponents/ViewPoDialog.vue'
import DeletePoDialog from '@/components/PosComponents/DeletePoDialog.vue'
import moment from 'moment'
import _ from 'lodash'

export default {
    name: "POsDesktopTable",
    props: ['headers', 'items', 'pageData', 
            'itemsPerPage', 'lengthData', 'isMobile', 
            'categoryLists', 'editedItemFromParent', 'defaultItemFromParent', 
            'dialogData', 'dialogViewData', 'dialogDeleteData', 
            'editedIndexDataFromParent', 'dialogDeleteInnerData'],
	components: {
        Search,
        CreatePoDialog,
        ViewPoDialog,
        DeletePoDialog
	},
    data: () => ({
		search: ""
	}),
    computed: {
        deleteInnerDialog: {
            get() {
                return this.dialogDeleteInnerData
            },
            set(value) {
                this.$emit('update:dialogDeleteInnerData', value)
            }
        },
        ...mapGetters({
            getAllPo: 'po/getAllPo',
			getPoLoading: 'po/getPoLoading',
            getVendorLists: 'po/getVendorLists',
			getWarehouse: 'warehouse/getWarehouse'
        }),
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
        editedItem: {
            get() {
                return this.editedItemFromParent
            }, 
            set(value) {
                this.$emit('update:editedItemFromParent', value)
            }
        },
        defaultItem: {
            get() {
                return this.defaultItemFromParent
            }, 
            set(value) {
                this.$emit('update:defaultItemFromParent', value)
            }
        },
        dialog: {
            get () {
                return this.dialogData
            },
            set (value) {
                if (!value) {
                    this.$emit('update:dialogData', false)
                } else {
                    this.$emit('update:dialogData', true)
                }
            }
        },
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
        dialogDelete: {
            get () {
                return this.dialogDeleteData
            },
            set (value) {
                if (!value) {
                    this.$emit('update:dialogDeleteData', false)
                } else {
                    this.$emit('update:dialogDeleteData', true)
                }
            }
        },
        editedIndex: {
            get() {
                return this.editedIndexDataFromParent
            },
            set(value) {
                this.$emit('update:editedIndexDataFromParent', value)
            }
        },
    },
    methods: {
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
                            return findSizeValue.address
                        }
                    } else {
                        return '--'
                    }
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
        // getPoDetails(po_item) {
        //     // if (typeof po_item == 'string') {
        //     //     po_item = JSON.parse(po_item)

        //     //     let data = {
        //     //         price: po_item.total,
        //     //         items: po_item.quantity
        //     //     }

        //     //     return `<p class='item-detail'>{{ ${data.price} }}</p><p class='item-unit'>{{ ${data.items} }} Items</p>`
        //     // }

        //     return (typeof po_item)
        // },
        viewItem(item) {
            this.$emit('viewItem', item)
        },
        editItem(item) {
            this.$emit('editItem', item)
        },
        close() {
            this.$emit('update:dialogData', false)
        },
        deleteItem(item) {
            this.$emit('deleteItem', item)
        },
        deleteItemConfirm(item) {
            this.$emit('deleteItemConfirm', item)
        },
        closeDelete() {
            this.$emit('update:dialogDeleteData', false)
        },
        closeDeleteDialog() {
            this.$emit('update:dialogDeleteInnerData', false)
        },
        closeView() {
            this.$emit('update:dialogViewData', false)
        }, 
        save() {
            this.$emit('save', this.editedItem)
        },
    },
    mounted() {
    },
    updated() {
    }
}
</script>
<style type="text/css">
    .date {
        font-size: 12px;
        padding: 0 12px;
        background-color: #F1F6FA;
        border-radius: 30px;
        height: 30px;
    }
</style>