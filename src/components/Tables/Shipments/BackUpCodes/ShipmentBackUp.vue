<template>
    <div class="containerMain" v-resize="onResize">
        <div id="shipments_header">
            <div id="shipments_root">
                <v-tabs class="customTab" height="56px" @change="onTabChange" v-model="activeTab">
                    <v-tab 
                        v-for="(n, i) in tabs" 
                        :key="i"
                        @click="getCurrentTab(i)">

                        <span>
                            <span :class="n == 'Completed' ? 'tab-name-completed' : 'tab-name'">
                                <span v-if="!isMobile">{{ n }}</span>

                                <span v-if="isMobile">                                   
                                    <span v-if="n == 'Pending Approval'">
                                        Pending
                                    </span>

                                    <span v-else>
                                        {{ n }}
                                    </span>
                                </span>
                            </span>

                            <v-badge
                                v-if="n !== 'Completed'"
                                color="#819FB2"
                                class="customBadge"
                                bordered
                                :content="getShipmentCount(n)">
                            </v-badge>
                        </span>
                    </v-tab>
                </v-tabs>
                
                <!-- <CreateShipment 
                    :editedIndexData.sync="editedIndex"
                    :dialogData.sync="dialog"
                    :editedItemData.sync="editedItem"
                    @close="close"
                    @save="save" /> -->
            </div>

            <div class="filters-wrapper" v-if="shipments.length !== 0">
                <!-- <Filters 
                    :setMenu="(value) => {
                        this.setMenu(value)
                    }"
                    :menu="menu" >
                </Filters> -->
                
                <Search 
                    placeholder="Search Shipment"
                    className="search"
                    :inputData.sync="search" />
            </div>
        </div>

        <!-- FOR DESKTOP VIEW -->
        <v-data-table 
            :headers="activeTab == 0 ? headersPending : headersShipment" 
            :items="shipments"
            mobile-breakpoint="769"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :search="search"
            item-key="name"
            :class="activeTab == 0 ? 'pending-header' : 'shipments-table'"
            :id="shipments.length !== 0 ? '' : 'table-no-data'"
            hide-default-footer
            style="box-shadow: none !important"
            @page-count="pageCount = $event"
            :custom-sort="customSort"
            @click:row="handleClick"
            v-if="!isMobile">
            
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
                        <img src="../assets/icons/noShipmentData.svg" alt="" width="65px">
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

            <!-- Reference ID -->
            <template v-slot:[`item.ReferenceID`]="{ item }">
                <div class="reference">
                    <div class="reference-content">
                        {{ item.ReferenceID }} 
                    </div>
                </div>
            </template>

            <!-- Departure -->
            <template v-slot:[`item.Departure`]="{ item }">
                <div>
                    <div class="flag-wrapper">
                        <p style="margin-bottom: 0px">
                            {{ item.Departure.location !== 'Not specified' ? item.Departure.location : 'N/A' }}
                        </p>
                    </div>

                    <div>
                        <p style="color: #0171A1;">
                            {{ item.Departure.etd !== 'Not Specified' ? item.Departure.etd : 'N/A' }}
                        </p>
                    </div>
                </div>
            </template>

            <!-- Mode -->
            <template v-slot:[`item.mode`]="{ item }">
                <div style="width: 60px;" v-if="item.mode !== null">
                    <img v-if="item.mode == 'Ocean'" src="../assets/images/ship.svg" width="20px">
                    <img v-if="item.mode == 'Air'" src="../assets/images/airplane.svg" width="20px">
                </div>

                <div style="width: 60px;" v-if="item.mode == null || item.mode == ''">
                    N/A
                </div>
            </template>

            <!-- Arrival -->
            <template v-slot:[`item.Arrival`]="{ item }">
                <div class="arrival-wrapper">
                    <div>
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

            <!-- Suppiers -->
            <template v-slot:[`item.Suppliers`]="{ item }">
                <div class="supplier-desktop" :style="activeTab == 0 ? 'max-width: 350px;' : 'max-width: 200px;'">
                    <span v-for="(name, index) in item.Suppliers" :key="index">
                        <span>{{ name }}</span><span v-if="index + 1 < item.Suppliers.length">, </span>
                    </span>

                    <span v-if="item.Suppliers == null || item.Suppliers.length == 0">
                        <span>N/A</span>
                    </span>
                </div>
            </template>

            <!-- PO -->
            <template v-slot:[`item.PO`]="{ item }">                
                <div class="po-num-desktop">
                    <p style="max-width: 150px;">
                        <span v-for="(name, index) in item.po_list" :key="index">
                            {{ name }}<template v-if="index + 1 < item.po_list.length">, </template>
                        </span>
                    </p>
                </div>

                <div v-if="item.po_list == null">
                    <p> N/A </p>
                </div>              
            </template>

            <!-- Status -->
            <template v-slot:[`item.Status`]="{ item }">
                <div class="status">
                    <v-chip>
                        {{ item.Status }}
                    </v-chip>
                </div>
            </template>
        </v-data-table>

        <!-- FOR MOBILE VIEW -->
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
            v-if="isMobile">
            
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
                        <img src="../assets/icons/noShipmentData.svg" alt="" width="65px">
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

                    <div class="status-mobile">
                        <v-chip>
                            {{ item.Status }}
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
                        <div v-if="item.mode !== null">
                            <img v-if="item.mode == 'Ocean'" src="../assets/images/ship.svg" width="25px">
                            <img v-if="item.mode == 'Air'" src="../assets/images/airplane.svg" width="25px">
                        </div>

                        <div v-if="item.mode == null || item.mode == ''">
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
                    <img src="../assets/images/supplier-img.svg" alt="" width="16" style="margin-right: 10px;" />

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
                    <img src="../assets/images/supplier-img.svg" alt="" width="16" style="margin-right: 10px;" />

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
// import Filters from "@/components/Filters.vue"
import { mapActions, mapGetters } from "vuex"
import Pagination from '../components/Pagination.vue'
import Search from '../components/Search.vue'
// import CreateShipment from '../components/ShipmentComponents/CreateShipment'
import _ from 'lodash'

export default {
    components: {
        // Filters: Filters,
        Pagination,
        Search,
        // CreateShipment
    },
    data: () => ({
        menu: false,
        page: 1,
        pageCount: 0,
        itemsPerPage: 35,
        dialog: false,
        isMobile: false,
        tabs: ["Pending Approval", "Shipments", "Completed"],
        activeTab: 1,
        search: "",
        dialogDelete: false,
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
        editedIndex: -1,
        editedItem: {
            Departure: "",
            Arrival: "",
            Suppliers: "",
            PO: "",
            Status: "",
            id: "",
            mode: "",
            container_num_list: ""
        },
        defaultItem: {
            Departure: "",
            Arrival: "",
            Suppliers: "",
            PO: "",
            Status: "",
            id: "",
            mode: "",
            container_num_list: ""
        },
    }),
    computed: {
        ...mapGetters(["getAllShipments", "getShipmentLoadingStatus"]),
        formTitle() {
            return this.editedIndex === -1 ? "New Item" : "Edit Item"
        },
        shipments() {
            let data = this.getAllShipments.filter((shipment) => 
                shipment.TabStatus === this.tabs[this.activeTab]
            )

            //if active tab is Shipments earliest to latest
            let orderRule = 'asc'

            if (this.activeTab == 2)
                orderRule = 'desc'

            let bottomItems = _.filter(data, (e => (e.eta_sortable =='Invalid date')))
            let filteredItems = _.filter(data, (e => (e.eta_sortable !=='Invalid date')))
            data = _.orderBy(filteredItems, ['eta_sortable'], [orderRule])

            if (bottomItems.length > 0) {
                bottomItems.map( bottomItem => {
                    data.push(bottomItem)
                })
            }

            return data
        },
    },
    watch: {
        dialog(val) {
            val || this.close();
        },
        dialogDelete(val) {
            val || this.closeDelete();
        },
    },
    created() {
        this.fetchShipments();
    },
    mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "shipments")

        //set tab
        if (this.$store.state.page.currentTab !== 'undefined') {
            if (this.activeTab !== this.$store.state.page.currentTab) {
                this.activeTab = this.$store.state.page.currentTab
            }
        }

        // set current shipment page
        if (this.$store.state.page.currentShipmentPage !== 'undefined') {
            if (this.page !== this.$store.state.page.currentShipmentPage) {
                this.page = this.$store.state.page.currentShipmentPage
            }
        }
    },
    methods: {
        ...mapActions(["fetchShipments"]),
        //
        getCurrentTab(id) {
            this.$store.dispatch("page/setTab", id)
        },
        getShipmentCount(tab) {
            let data = ''

            if (tab === 'Pending Approval') {
                data = this.getAllShipments.filter((shipment) => 
                    shipment.TabStatus === this.tabs[0]
                )
            } else if (tab === 'Shipments') {
                data = this.getAllShipments.filter((shipment) => 
                    shipment.TabStatus === this.tabs[1]
                )
            } else {
                data = this.getAllShipments.filter((shipment) => 
                    shipment.TabStatus === this.tabs[2]
                )
            }

            let finalData = data.length !== 0 ? data.length : '0'

            return finalData
        },
        onTabChange() {
            this.page = 1;
            // set current shipment page back to 1 if user changes tab
            this.$store.dispatch("page/setCurrentShipmentPage", 1)
        },
        setMenu(value) {
            this.menu = value;
        },
        onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
        editItem(item) {
            this.editedIndex = this.shipments.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },
        deleteItem(item) {
            this.editedIndex = this.shipments.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },
        deleteItemConfirm() {
            this.shipments.splice(this.editedIndex, 1);
            this.closeDelete();
        },
        close() {
            this.dialog = false;
            this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
            });
        },
        closeDelete() {
            this.dialogDelete = false;
            this.$nextTick(() => {
            this.editedItem = Object.assign({}, this.defaultItem);
            this.editedIndex = -1;
            });
        },
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.shipments[this.editedIndex], this.editedItem);
            } else {
                this.shipments.push(this.editedItem);
            }

            this.close();
        },
        handleClick(value) {                
            // this.$router.push(`shipment/${value.id}?status=${value.Status}`)
            this.$router.push(`shipment/${value.id}`)
        },
        handleClickMobile: function (event) {
            let targetId = event.currentTarget.id;
            // console.log(targetId);
            this.$router.push(`shipment/${targetId}`)
        },
        customSort: function(items, index, isDesc) {
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
        }
    },
    updated() {
        
    }
}
</script>

<style>
@import '../assets/css/shipments_styles/shipment.css';
</style>
