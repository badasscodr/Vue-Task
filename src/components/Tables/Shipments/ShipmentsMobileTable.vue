<template>
    <div class="shipment-table-wrapper mobile">
         <v-data-table 
            :headers="activeTab == 0 ? headersPending : headersShipment" 
            :items="shipments"
            mobile-breakpoint="769"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :search="search"
            item-key="name"
            class="table-mobile"
            :class="activeTab == 0 ? 'pending-header-mobile' : 'shipments-table-mobile'"
            :id="shipments.length !== 0 ? '' : 'table-no-data'"
            hide-default-footer
            style="box-shadow: none !important"
            @page-count="pageCount = $event"
            :custom-sort="customSort"
            @click:row="handleClick"
            :item-class="itemRowBackground">
            
            <template v-slot:no-data>
                <div class="no-data-preloader" v-if="getShipmentLoadingStatus">
                    <v-progress-circular
                        :size="40"
                        color="#0171a1"
                        indeterminate
                        v-if="getShipmentLoadingStatus">
                    </v-progress-circular>
                </div>

                <div v-if="!getShipmentLoadingStatus && shipments.length == 0" class="no-data-wrapper">
                    <div class="no-data-icon">
                        <img src="../../../assets/icons/noShipmentData.svg" alt="" width="65px">
                    </div>

                    <div class="no-data-heading">
                        <p v-if="activeTab == 0">
                            No Pending Shipments
                        </p>

                        <p v-if="activeTab == 1">
                            No Shipments
                        </p>

                        <p v-if="activeTab == 2">
                            No Completed Shipments
                        </p>
                    </div>
                </div>
            </template>

            <!-- Reference ID and Status -->
            <template v-slot:[`item.ReferenceID`]="{ item }">
                <div class="table-mobile-data mobile-reference">
                    <div class="mobile-reference-content">
                        {{ item.ReferenceID }} 
                    </div>

                    <div class="status-mobile" :class="getStatusClass(item.Status)">
                        <v-chip v-html="getStatus(item.Status)">
                            <!-- {{ item.Status }} -->
                        </v-chip>
                    </div>
                </div>
            </template>

            <!-- Departure, Mode and Arrival -->
            <template v-slot:[`item.Departure`]="{ item }">
                <!-- if tab is Shipments or Completed -->
                <div class="table-mobile-data" v-if="activeTab !== 0">
                    <div class="mobile-departure-wrapper" style="text-align: left !important;">
                        <div class="flag-wrapper">
                            <p style="margin-bottom: 0px;">
                                {{  item.Departure.location !== 'Not specified' ? item.Departure.location : 'N/A' }}
                            </p>
                        </div>

                        <div>
                            <p style="color: #0171A1; text-align: left;">
                                {{ item.Departure.etd !== 'Not Specified' ? item.Departure.etd : 'N/A' }}
                            </p>
                        </div>
                    </div>

                     <div class="mobile-mode">
                        <div style="width: 25px; display: flex; grid-gap: 4px;" 
                            v-if="item.type !== null && item.type !== '' && item.type !== 'null'">
                            
                            <img v-if="item.type == 'LCL'" src="../../../assets/images/small-container.svg" />
                            <img v-if="item.type == 'Air'" src="../../../assets/images/airplane-shipment.svg" />
                            <img v-if="item.type == 'FCL'" src="../../../assets/images/big-container.svg" />
                            <span v-if="item.type == 'FCL' && item.container_num_list.length !== 0"> 
                                ({{ item.container_num_list.length }})
                            </span>
                        </div>

                        <div style="width: 30px;" v-if="item.type == null || item.type == '' || item.type == 'null'">
                            N/A
                        </div>
                    </div>

                    <div class="arrival-wrapper" style="text-align: right !important;">
                        <div class="flag-wrapper">
                            <p style="margin-bottom: 0px">
                                {{ item.Arrival.location !== 'Not specified' ? item.Arrival.location : 'N/A' }}
                            </p>
                        </div>
                        <p style="color: #0171A1;">
                            {{ item.Arrival.eta !== 'Not Specified' ? item.Arrival.eta : 'N/A' }}
                        </p>
                    </div>
                </div>
            </template>

            <!-- Supplier shown in Mode Row if tab is Shipments and Completed -->
            <template v-slot:[`item.mode`]="{ item }">
                <div class="mobile-supplier">
                    <img src="../../../assets/images/supplier-img.svg" alt="" width="16" style="margin-right: 10px;" />

                    <div class="mobile-supplier-content">
                        <p v-for="(name, index) in item.Suppliers" :key="index">
                            {{ name }}
                        </p>

                        <p v-if="item.Suppliers == null || item.Suppliers.length == 0">
                            N/A
                        </p>
                    </div>
                </div>
            </template>

            <!-- PO Number shown in Arrival -->
            <template v-slot:[`item.Arrival`]="{ item }">
                <div v-if="isMobile && activeTab !== 0" class="mobile-pos">
                    <div v-if="item.po_list !== null && item.po_list.length > 0" style="width: 100%; display:flex;">
                        <p> PO:
                            <span v-for="(name, index) in item.po_list" :key="index">
                                {{ name }}<template v-if="index + 1 < item.po_list.length">, </template>
                            </span>
                        </p>
                    </div>  

                    <div v-if="item.po_list == null">
                        <p> N/A </p>
                    </div>  
                </div>
            </template>

            <!-- PENDING TAB -->
            <!-- Departure, Mode and Arrival -->
            <template v-slot:[`item.Suppliers`]="{ item }">
                <div class="mobile-supplier">
                    <img src="../../../assets/images/supplier-img.svg" alt="" width="16" style="margin-right: 10px;" />

                    <div class="mobile-supplier-content">
                        <p v-for="(name, index) in item.Suppliers" :key="index">
                            {{ name }}
                        </p>

                        <p v-if="item.Suppliers == null || item.Suppliers.length == 0">
                            N/A
                        </p>
                    </div>
                </div>
            </template>

            <template v-slot:[`item.PO`]="{ item }">
                <div class="mobile-pos">
                    <div v-if="item.po_list !== null && item.po_list.length > 0" style="width: 100%; display:flex;">
                        <p>
                            <span v-for="(name, index) in item.po_list" :key="index">
                                PO #{{ name }}<template v-if="index + 1 < item.po_list.length">, </template>
                            </span>
                        </p>
                    </div>  

                    <div v-if="item.po_list == null">
                        <p> N/A </p>
                    </div>
                </div>
            </template>

            <!-- CARGO DATES -->
            <template v-slot:[`item.cargo_ready_date`]="{ item }">                
                <div class="mobile-cargo-date">
                    <p>
                        Cargo Ready Dates:
                        <span v-for="(date, index) in item.cargo_ready_date" :key="index">
                            {{ date }}<template v-if="index + 1 < item.cargo_ready_date.length">, </template>
                        </span>
                    </p>
                </div>

                <div v-if="item.cargo_ready_date == null">
                    <p> N/A </p>
                </div>              
            </template>
        </v-data-table>

        <Pagination 
            v-if="shipments.length !== 0"
            :pageData.sync="page"
            :lengthData.sync="pageCount"
            :isMobile="isMobile"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import Pagination from '../../../components/Pagination.vue'

export default {
    props: ['shipments', 'editedItem', 'editedIndex', 'activeTab', 'isMobile', 'tablePage', 'search'],
    components: {
        Pagination,
    },
    data: () => ({
        pageCount: 0,
        itemsPerPage: 15,
        headersShipment: [
            {
                text: "Reference",
                align: "start",
                sortable: false,
                value: "ReferenceID",
                width: "100px", 
                fixed: true
            },
            {
                text: "Departure",
                value: "Departure",
                sortable: false,
                width: "150px", 
                fixed: true
            },
            {
                text: "",
                value: "mode",
                sortable: false,
                width: "30px", 
                fixed: true
            },
            {
                text: "Arrival",
                value: "Arrival",
                sortable: true,
                width: "180px", 
                fixed: true
            },
            {
                text: "Suppliers",
                value: "Suppliers",
                sortable: false,
                width: "220px", 
                fixed: true
            },
            {
                text: "PO",
                value: "PO",
                sortable: false,
                width: "150px", 
                fixed: true
            },
            {
                text: "Status",
                value: "Status",
                align: 'center',
                sortable: false,
                width: "150px", 
                fixed: true
            },                       
            {
                text: "Container",
                align: ' d-none',
                sortable: false,
                value: "container_num_list",
                width: "100px", 
                fixed: true
            },
            {
                text: "Mbl",
                align: ' d-none',
                sortable: false,
                value: "mbl_num",
                width: "100px", 
                fixed: true
            },
            {
                text: "Hbl",
                align: ' d-none',
                sortable: false,
                value: "hbl_num",
                width: "100px", 
                fixed: true
            },
            {
                text: "Ams",
                align: ' d-none',
                sortable: false,
                value: "ams_num",
                width: "100px", 
                fixed: true
            },
        ],
        headersPending: [
            {
                text: "Reference",
                align: "start",
                sortable: false,
                value: "ReferenceID",
                width: "150px", 
                fixed: true
            },
            {
                text: "Suppliers",
                value: "Suppliers",
                sortable: false,
                width: "300px", 
                fixed: true
            },
            {
                text: "PO",
                value: "PO",
                sortable: false,
                width: "200px", 
                fixed: true
            },
            {
                text: "Cargo Ready Date",
                value: "cargo_ready_date",
                sortable: false,
                width: "200px", 
                fixed: true
            },
            {
                text: "Status",
                value: "Status",
                align: 'center',
                sortable: false,
                width: "200px", 
                fixed: true
            },
            {
                text: "Container",
                align: ' d-none',
                sortable: false,
                value: "container_num_list",
                width: "100px", 
                fixed: true
            },
        ],
    }),
    computed: {
        ...mapGetters(["getAllShipments", "getShipmentLoadingStatus"]),
        formTitle() {
            return this.editedIndex === -1 ? "New Item" : "Edit Item"
        },
        activeShipmentTab: {
            get() {
                return this.activeTab
            },
            set(value) {
                this.$emit('update:activeTab', value)
            }
        },
        page: {
            get() {
                return this.tablePage
            },
            set(value) {
                this.$emit('update:tablePage', value)
            }
        }
    },
    mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "shipments")

        // set current shipment page
        if (this.$store.state.page.currentShipmentPage !== 'undefined') {
            if (this.page !== this.$store.state.page.currentShipmentPage) {
                this.page = this.$store.state.page.currentShipmentPage
            }
        }
    },
    methods: {
        ...mapActions(["fetchShipments"]),
        handleClick(value) {                
            // this.$router.push(`shipment/${value.id}?status=${value.Status}`)
            this.$router.push(`shipment/${value.id}`)
        },
        customSort(items, index, isDesc) {
            items.sort((a, b) => {
                if (index[0] == 'Arrival') {
                    if (!isDesc[0]) {
                        return new Date(b[index].eta) - new Date(a[index].eta);
                    } else {
                        return new Date(a[index].eta) - new Date(b[index].eta);
                    }
                }
                else {
                    if(typeof a[index] !== 'undefined'){
                        if (!isDesc[0]) {
                            return a[index].eta.toLowerCase().localeCompare(b[index].eta.toLowerCase());
                        }
                        else {
                            return b[index].eta.toLowerCase().localeCompare(a[index].eta.toLowerCase());
                        }
                    }
                }
            });

            return items;
        },
        itemRowBackground: function (item) {
            return item.Status == 'Past last free day' ? 'light-red' : ''
        },
        getStatus(status) {
            if (status !== null) {
                if (status == 'In transit - hold') {
                    return "<span class='chip-text'>In Transit - <span class='red--text'>Pending Release</span><span>"
                }

                if (status == 'In transit - released') {
                    return "<span class='chip-text'>In Transit - <span class='green--text'>Released</span><span>"
                }

                if (status == 'Discharged') {
                    return `<span class='chip-text green--text'>${status}<span>`
                }

                if (status == 'Completed') {
                    return `<span class='chip-text green--text'>${status}<span>`
                }

                if (status == 'Past last free day') {
                    return `<span class='chip-text red--text'>${status}<span>`
                }
            }

            return `<span class='chip-text'>${status}</span>`
        },
        getStatusClass(status) {
            if (status == 'Past last free day') {
                return 'Past-day'
            } else {
                return status
            }
        }
    },
    updated() {}
}
</script>

<style></style>