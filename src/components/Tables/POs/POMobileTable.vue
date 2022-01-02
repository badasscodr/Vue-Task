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
            class="pos-table-mobile elevation-1"
            :class="(typeof items !== 'undefined' && items !== null && items.length > 0) ? '' : 'no-data-table'"
            @click:row="viewPoMobile">

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Purchase Orders</v-toolbar-title>
                    
                    <v-spacer></v-spacer>

                    <v-btn dark color="primary" class="btn-blue create-po-button" @click.stop="createPo">
                        Create PO
                    </v-btn>
                </v-toolbar>									

                <div class="search-component">
                    <Search 
                        placeholder="Search Purchase Orders"
                        className="search custom-search"
                        :inputData.sync="search" />
                </div>
            </template>

            <template v-slot:[`item.po_number`]="{ item }">	
                <div class="po-row">
                    <p class="p-gray mb-0">PO# {{ item.po_number }}</p>
                    <p class="p-gray mb-0">{{ formatTotal(item.total) }}</p>
                </div>			
                <div class="po-row">
                    <p class="p-gray mb-0">{{ item.price }}</p>
                </div>
            </template>

            <template v-slot:[`item.created_at`]="{ item }">				
                <div class="po-row">
                    <p class="p-light-gray mb-0">{{ getDateFormat(item.created_at) }}</p>
                    <p class="p-light-gray mb-0">({{ item.total_products }} Item{{(item.total_products) > 1 ? 's' : ''}})</p>
                </div>
            </template>

            <template v-slot:[`item.supplier_id`]="{ item }">				
                <div class="po-row">
                    <p class="mb-0">{{ getVendor(item.supplier_id) }}</p>
                </div>
            </template>

            <template v-slot:[`item.warehouse_id`]="{ item }">				
                <div class="po-row">
                    <p class="p-light-gray mb-0">{{ getWarehouseAddress(item.warehouse_id) }}</p>
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
    name: "POMobileTable",
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
                width: "12%", 
                fixed: true
			},
			{
				text: "Vendor",
                align: "start",
                sortable: false,
                value: "supplier_id",
                width: "25%", 
                fixed: true
			},
			{
				text: "Ship To",
                align: "start",
                sortable: false,
                value: "warehouse_id",
                width: "25%", 
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
        formatTotal(value) {
            return `$${parseFloat(value).toFixed(2)}`
        },
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
        viewPoMobile(item) {
			this.$store.dispatch("po/setPo", item)
			this.$router.push(`pos/item?id=${item.id}`)
		}
    }
}
</script>
