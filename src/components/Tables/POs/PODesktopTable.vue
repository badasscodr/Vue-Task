<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :search="search"
            hide-default-footer
            mobile-breakpoint="1023"
            @page-count="pageCount = $event"
            class="pos-table elevation-1"
            :class="(typeof items !== 'undefined' && items !== null && items.length > 0) ? '' : 'no-data-table'"
            fixed-header>

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Purchase Orders</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <Search 
                        placeholder="Search Purchase Orders"
                        className="search custom-search"
                        :inputData.sync="search" />

                    <v-btn dark color="primary" class="btn-blue create-po-button" @click.stop="createPo">
                        Create PO
                    </v-btn>
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
                    <p class="item-unit">{{ item.total_products }} Item{{(item.total_products) > 1 ? 's' : ''}}</p>
                </div>
            </template>

            <template v-slot:[`item.actions`]="{ item }">				
                <div class="button-icon-wrapper">					
                    <button class="btn-view" @click="viewPo(item)">
                        <img src="@/assets/icons/view-blue.svg" alt="">
                        View
                    </button>

                    <button class="btn-edit" @click="editPo(item)">
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
                            <v-btn dark color="primary" class="btn-blue create-po-button" @click.stop="createPo">
                                Create PO
                            </v-btn>
                        </div>
                    </div>
                </div>
            </template>
        </v-data-table>

        <Pagination 
            v-if="typeof items !== 'undefined' && items.length > 0"
            :pageData.sync="page"
            :lengthData.sync="pageCount"
            :isMobile="isMobile"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Search from '@/components/Search.vue'
import Pagination from '../../Pagination.vue'
import moment from 'moment'
import _ from 'lodash'

export default {
    name: "PODesktopTable",
    props: ['items', 'isMobile'],
	components: {
        Search,
        Pagination
	},
    data: () => ({
        page: 1,
        pageCount: 0,
        itemsPerPage: 15,
		search: "",
        headers: [
			{
				text: "Po No",
                align: "start",
                sortable: false,
                value: "po_number",
                width: "12%", 
                fixed: true
			},
			{
				text: "Date",
                align: "start",
                sortable: false,
                value: "created_at",
                width: "14%", 
                fixed: true
			},
			{
				text: "Vendor",
                align: "start",
                sortable: false,
                value: "supplier_id",
                width: "24%", 
                fixed: true
			},
			{
				text: "Ship To",
                align: "start",
                sortable: false,
                value: "warehouse_id",
                width: "24%", 
                fixed: true
			},
			{
				text: "Details",
                align: "start",
                sortable: false,
                value: "total",
                width: "12%", 
                fixed: true
			},
			{
				text: "",
                align: "center",
                sortable: false,
                value: "actions",
                width: "14%", 
                fixed: true
			},
		],
	}),
    computed: {
        ...mapGetters({
            getAllPo: 'po/getAllPo',
			getPoLoading: 'po/getPoLoading',
            getVendorLists: 'po/getVendorLists',
			getWarehouse: 'warehouse/getWarehouse'
        }),
    },
    methods: {
        getDateFormat(date) {
            return moment(date).format('MMM DD, YYYY');
        },
        getWarehouseAddress(id) {
            if (typeof this.getWarehouse !== 'undefined' && this.getWarehouse !== null &&
                typeof this.getWarehouse.results !== 'undefined' && this.getWarehouse.results !== null &&
                typeof this.getWarehouse.results !== 'undefined' && this.getWarehouse.results !== null &&
                typeof this.getWarehouse.results.length !== 'undefined' && this.getWarehouse.results.length !== null) {
                    
                    let getData = this.getWarehouse.results
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
        createPo() {
            this.$emit('createPo')
        },
        editPo(item) {
            this.$emit('editPo', item)
        },
        viewPo(item) {
            this.$emit('viewPo', item)
        },
    },
    mounted() {},
    updated() {}
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
