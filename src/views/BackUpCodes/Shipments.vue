<template>
    <div class="containerMain" v-resize="onResize">
        <div id="shipments_header">
            <div id="shipments_root">
                <v-tabs
                    mobile-breakpoint="500"
                    class="customTab"
                    height="56px"
                    @change="onTabChange"
                    v-model="activeTab"
                >
                    <v-tab 
                        v-for="(n, i) in tabs" 
                        :key="n"
                        @click="getCurrentTab(i)">

                        {{ n }}
                        <!-- <v-badge
                            v-if="n == 'Shipments'"
                            color="#819FB2"
                            class="customBadge"
                            bordered
                            content="9"
                        >
                        </v-badge>

                        <v-badge
                            v-else-if="n != 'Completed'"
                            color="#0171A1"
                            class="customBadge"
                            bordered
                            content="10"
                        >
                        </v-badge> -->
                    </v-tab>
                </v-tabs>

                <v-dialog v-model="dialog" max-width="500px">
                    <!-- <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="#039DDC"
                            dark
                            class="mb-2 custom-button"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon aria-hidden="false"> mdi-plus </v-icon>
                            Create Shipment
                        </v-btn>
                    </template> -->

                    <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                            <v-text-field
                                v-model="editedItem.Departure"
                                label="Departure"
                            >
                            </v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.Arrival" label="Arrival">
                            </v-text-field>
                            </v-col>

                            <!-- <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.Suppliers" label="Suppliers">
                                            </v-text-field>
                                        </v-col> -->

                            <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.PO" label="PO">
                            </v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.Status" label="Status">
                            </v-text-field>
                            </v-col>
                        </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>

                        <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>

            <div class="filters-wrapper">
                <!-- <Filters
                    :setMenu="
                    (value) => {
                        this.setMenu(value);
                    }
                    "
                    :menu="menu" >
                </Filters> -->

                <div class="search-shipment" style="width: 400px; padding: 16px 16px 16px 0; height: 100%">
                    <v-text-field
                        height="40px"
                        color="#002F44"
                        width="400px"
                        v-model="search"
                        dense
                        class="search"
                        placeholder="Search Shipment"
                        outlined
                        prepend-inner-icon="mdi-magnify">
                    </v-text-field>
                </div>
            </div>
        </div>

        <v-data-table 
            :headers="activeTab == 0 ? headersPending : headersShipment" 
            :items="shipments"
            mobile-breakpoint="769"
            :page.sync="page"
            :items-per-page="!isMobile ? itemsPerPage : 15"
            :search="search"
            item-key="name"
            :class="activeTab == 0 ? 'pending-header' : 'elevation-1'"
            hide-default-footer
            style="box-shadow: none !important"
            @page-count="pageCount = $event"
            :custom-sort="customSort"
            @click:row="handleClick">
            
            <template v-slot:no-data>
                <v-progress-circular
                    :size="40"
                    color="#0171a1"
                    indeterminate
                    v-if="getShipmentLoadingStatus">
                </v-progress-circular>
            </template>

            <template v-slot:[`item.Status`]="{ item }">
                <div class="status" v-if="!isMobile">
                    <v-chip>
                        {{ item.Status }}
                    </v-chip>
                </div>
            </template>

            <template v-slot:[`item.mode`]="{ item }">
                <div style="width: 35px;" v-if="!isMobile">
                    <img v-if="item.mode == 'Ocean'" src="../assets/images/ship.svg">
                    <img v-if="item.mode == 'Air'" src="../assets/images/airplane.svg">
                </div>

                <div v-if="isMobile" class="mobile-supplier">
                    <img src="../assets/images/supplier-img.svg" alt="" width="16" style="margin-right: 10px;" />

                    <div class="mobile-supplier-content">
                        <p v-for="(name, index) in item.Suppliers" :key="index">
                            {{ name }}
                        </p>
                        <!-- <div v-if="item.Suppliers !== null && item.Suppliers !== undefined && item.Suppliers.length !== 0">
                            <p v-if="item.Suppliers.length >= 2">
                                {{ item.Suppliers.length >= 2 &&
                                item.Suppliers[0] + ', ' + (item.Suppliers.length - 1) + ' other(s)'
                                }}
                            </p>
                            <p v-else v-for="(name, index) in item.Suppliers" :key="index">
                                {{ name }}
                            </p>
                        </div> -->

                        <p v-if="item.Suppliers == null || item.Suppliers.length == 0">
                            Not Specified
                        </p>
                    </div>
                </div>
            </template>

            <template v-slot:[`item.Arrival`]="{ item }">
                <div v-if="!isMobile" class="arrival-wrapper">
                    <div>
                        <div class="flag-wrapper">
                            <p style="margin-bottom: 0px">
                                {{ item.Arrival.location }}
                            </p>
                        </div>
                        <p style="color: #039ddc">
                            {{ item.Arrival.eta }}
                        </p>
                    </div>
                </div>

                <!-- if active tab is not shipments and is mobile -->
                <div v-if="isMobile && activeTab !== 0" class="mobile-pos">
                    <div v-if="item.po_list !== null && item.po_list.length > 0" style="width: 100%; display:flex;">
                        <!-- <p> {{ item.po_list.length >= 3 
                            ? item.po_list[0] + ', ' + item.po_list[1] + ', +' + (item.po_list.length - 2) + ' other(s)'
                            : 'PO #' + item.PO
                            }} 
                        </p> -->

                        <p>
                            <span v-for="(name, index) in item.po_list" :key="index">
                                PO #{{ name }}<template v-if="index + 1 < item.po_list.length">, </template>
                            </span>
                        </p>
                        
                        <!-- <p v-for="(name, index) in item.po_list" :key="index">
                            PO #{{ name }}<template v-if="index + 1 < item.po_list.length">, </template>
                        </p> -->
                    </div>  

                    <div v-if="item.po_list == null">
                        <p> Not Specified </p>
                    </div>  
                </div>

                <!-- if active tab is shipments and is mobile -->
                <div v-if="isMobile && activeTab == 0" class="mobile-supplier">
                    <img src="../assets/images/supplier-img.svg" alt="" width="16" style="margin-right: 10px;" />

                    <div class="mobile-supplier-content">
                        <!-- <div v-if="item.Suppliers !== null && item.Suppliers !== undefined && item.Suppliers.length !== 0">
                            <p v-if="item.Suppliers.length >= 2">
                                {{ item.Suppliers.length >= 2 &&
                                item.Suppliers[0] + ', ' + (item.Suppliers.length - 1) + ' other(s)'
                                }}
                            </p>
                            <p v-else v-for="(name, index) in item.Suppliers" :key="index">
                                {{ name }}
                            </p>
                        </div> -->

                        <p v-for="(name, index) in item.Suppliers" :key="index">
                            {{ name }}
                        </p>

                        <p v-if="item.Suppliers == null || item.Suppliers.length == 0">
                            Not Specified
                        </p>
                    </div>
                </div>
            </template>

            <template v-slot:[`item.Suppliers`]="{ item }">
                <div class="supplier-desktop" v-if="!isMobile" style="max-width: 230px;">
                    <span v-for="(name, index) in item.Suppliers" :key="index">
                        <span>{{ name }}</span><span v-if="index + 1 < item.Suppliers.length">, </span>
                    </span>

                    <span v-if="item.Suppliers == null || item.Suppliers.length == 0">
                        <span>Not Specified</span>
                    </span>
                </div>

                <div v-if="isMobile" class="mobile-supplier">
                    <img src="../assets/images/supplier-img.svg" alt="" width="16" style="margin-right: 10px;" />

                    <div class="mobile-supplier-content">
                        <div v-if="item.Suppliers !== null && item.Suppliers !== undefined && item.Suppliers.length !== 0">
                            <p v-if="item.Suppliers.length >= 2">
                                {{ item.Suppliers.length >= 2 &&
                                item.Suppliers[0] + ', ' + (item.Suppliers.length - 1) + ' other(s)'
                                }}
                            </p>
                            <p v-else v-for="(name, index) in item.Suppliers" :key="index">
                                {{ name }}
                            </p>
                        </div>

                        <p v-if="item.Suppliers == null || item.Suppliers.length == 0">
                            Not Specified
                        </p>
                    </div>
                </div>
            </template>

            <template v-slot:[`item.PO`]="{ item }">
                <!-- <div v-if="item.po_list !== null && item.po_list.length > 0" class="po-num-desktop">
                    <p> {{ item.po_list.length >= 3 
                        ? item.po_list[0] + ', ' + item.po_list[1] + ', +' + (item.po_list.length - 2) + ' other(s)'
                        : item.PO
                        }} 
                    </p>
                </div> -->
                
                <div class="po-num-desktop">
                    <p>
                        <span v-for="(name, index) in item.po_list" :key="index">
                            {{ name }}<template v-if="index + 1 < item.po_list.length">, </template>
                        </span>
                    </p>
                </div>
                <div v-if="item.po_list == null">
                    <p> Not Specified </p>
                </div>              
            </template>

            <template v-slot:[`item.Departure`]="{ item }">
                <div v-if="!isMobile">
                    <div class="flag-wrapper">
                        <p style="margin-bottom: 0px">
                            {{ item.Departure.location }}
                        </p>
                    </div>

                    <div>
                        <p style="color: #039ddc">
                            {{ item.Departure.etd }}
                        </p>
                    </div>
                </div>

                <div class="mobile-dep-arr" v-if="isMobile">
                    <div>
                        <p style="margin-bottom: 0px">
                            {{ item.Departure.location }}
                        </p>

                        <p style="color: #039ddc">
                            {{ item.Departure.etd }}
                        </p>
                    </div>

                    <div v-if="item.mode !== ''" >
                        <img v-if="item.mode == 'Ocean'" src="../assets/images/ship.svg" width="25px">
                        <img v-if="item.mode == 'Air'" src="../assets/images/airplane.svg" width="25px">
                    </div>

                    <div>
                        <div>
                            <p style="margin-bottom: 0px">
                                {{ item.Arrival.location }}
                            </p>

                            <p style="color: #039ddc">
                                {{ item.Arrival.eta }}
                            </p>
                        </div>
                    </div>
                </div>
            </template> 

            <template 
                v-if="isMobile"
                v-slot:[`item.ReferenceID`]="{ item }">

                <div class="mobile-reference">
                    <div class="mobile-reference-content">
                        {{ item.ReferenceID }} 
                    </div>

                    <div class="status">
                        <v-chip style="font-size: 11px !important;">
                            {{ item.Status }}
                        </v-chip>
                    </div>
                </div>
            </template>
        </v-data-table>
        
        <div class="pagination-wrapper pt-3">
            <v-pagination
                v-model="page"
                :length="pageCount"
                prev-icon="Previous"
                next-icon="Next"
                :total-visible="!isMobile ? '11' : '5' ">
            </v-pagination>
        </div>
    </div>
</template>

<script>
// import Filters from "@/components/Filters.vue";
import { mapActions, mapGetters } from "vuex";
// import moment from 'moment'
import _ from 'lodash';
export default {
    components: {
        // Filters: Filters,
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
                width: "230px", 
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
                width: "250px", 
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
        }
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
        // this.initialize();

        //set current page
        this.$store.dispatch("page/setPage", "shipments")

        //set tab
        if (this.$store.state.page.currentTab !== 'undefined') {
            if (this.activeTab !== this.$store.state.page.currentTab) {
                this.activeTab = this.$store.state.page.currentTab
            }
        }
    },
    methods: {
        ...mapActions(["fetchShipments"]),
        //
        getCurrentTab(id) {
            this.$store.dispatch("page/setTab", id)
        },
        onTabChange() {
            this.page = 1;
        },
        setMenu(value) {
            this.menu = value;
        },
        onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false;
            }
            // if (window.innerWidth < 750) {
            // // this.tabs[0] = "Pending";
            // this.isMobile = true;
            // } else if (window.innerWidth < 750) {
            // // this.tabs[0] = "Pending";
            // } else {
            // this.isMobile = false;
            // // this.tabs[0] = "Pending Approval";
            // }
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
            this.$router.push(`shipment/${value.id}?status=${value.Status}`)
        },
        handleClickMobile: function (event) {
            let targetId = event.currentTarget.id;
            console.log(targetId);
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
        // console.log(this.shipments);
    }
};
</script>

<style>
#shipments_header {
    background-color: white;
}

#shipments_root {
    display: flex;
    align-items: center;
    border: 1px solid #E2EDF3;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
}

.v-data-table__wrapper .arrival-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.v-data-table__wrapper .arrival-wrapper img {
    margin-right: 25px;
}

.custom-button {
    margin: 10px 24px;
    height: 40px !important;
    font-size: 13px !important;
    text-transform: capitalize;
    letter-spacing: 0 !important;
}

.custom-button .v-btn__content i {
    margin-right: 5px !important;
}

.v-icon {
    margin-right: 5px;
}

.customTab {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.filters-wrapper {
    height: 72px;
    display: flex;
    border: 1px solid #d2e3ed;
    border-top: none;
    border-bottom: 2px solid #F1F6FA !important;
}

#filters {
    padding: 10px 24px;
    border: 1px solid #b4cfe0;
    height: 40px;
    width: 118px;
    margin: 16px;
    background-color: unset;
    box-shadow: unset;
    font-size: 14px;
    text-transform: capitalize;
    letter-spacing: 0;
    font-weight: 600;
    color: #002f44;
}

.search {
    /* padding: 10px 24px 10px 16px !important;
    margin-top: 7px !important; */
    font-size: 14px;
}

fieldset {
    border: 1px solid #b3cfe0 !important;
}

.search i {
    color: #002f44 !important;
}

.v-btn__content i {
    margin: 0 !important;
}

.customBadge {
    top: 5px;
    left: 5px;
    margin-right: 20px;
    background: #0171a1 !important;
}

/* .v-tab {
    text-transform: none !important;
    font-family: 'Inter-Regular', sans-serif !important;
    letter-spacing: 0 !important;
    font-weight: 600 !important;
    padding: 16px 25px !important;
    color: #4a4a4a !important;
    font-size: 16px !important;
} */

.v-tab--active {
    color: #0171a1 !important;
}

.v-badge__wrapper {
    padding-left: 5px;
}

p {
    margin-bottom: 5px;
    margin-top: 8px;
}

.v-data-table {
    border-radius: unset;
    box-shadow: unset;
    border-radius: 0 !important;
    border: 1px solid #d2e3ed;
    border-bottom: none;
    border-top: none;
}

.v-data-table table thead tr {
    height: 48px;
}

.v-data-table table tr th {
    padding: 15px 24px !important;
    text-transform: uppercase;
    color: #819fb2 !important;
    font-weight: 700 !important;
    font-size: 12px !important;
    border-bottom: 2px solid #F1F6FA !important;
}

.v-data-table table tr th:last-child,
.v-data-table table tr td:last-child {
    text-align: center !important;
}

.v-data-table table tbody tr td {
    padding: 10px 24px !important;
    font-size: 12px !important;
    color: #4a4a4a !important;
    font-weight: 600 !important;
    border-bottom: 1px solid #F1F6FA !important;
}

.v-data-table table tbody tr:hover {
    background: #f7f7f7 !important;
    cursor: pointer;
}

.v-data-table table tbody tr:hover .status span {
    background: #d9e3ec !important;
    cursor: pointer;
}

.v-data-table table tbody tr td p {
    margin: 0 !important;
}

.po-content .v-chip {
    padding: 0 !important;
    border-radius: 4px !important;
    font-size: 12px !important;
    background-color: #fff !important;
    color: #4a4a4a !important;
    font-weight: 600 !important;
    margin-bottom: 5px !important;
}

.po-content .v-chip span {
    font-family: 'Inter-Regular', sans-serif !important;
}

.v-data-table table tbody tr:hover .po-content span,
.v-data-table table tbody tr:hover .po-content span:before {
    background: #f7f7f7 !important;
    cursor: pointer;
}

.status .v-chip {
    padding: 6px 8px !important;
    border-radius: 4px !important;
    font-size: 12px !important;
    background-color: #f1f6fa !important;
    color: #4a4a4a !important;
    font-weight: 600 !important;
    margin-bottom: 5px !important;
}

.status .v-chip__content {
    margin-bottom: 0;
    font-family: "Inter-Regular", sans-serif !important;
}

.rowItem {
    background-color: white;
    margin-top: 15px;
    padding: 16px;
    border-radius: 10px;
}

.v-input--selection-controls {
    margin: unset;
    padding: unset;
}

.pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    align-content: center;
    padding: 15px 24px;
    align-content: center; 
    border: 1px solid #d2e3ed;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

.pagination-wrapper .v-pagination li button {
    width: 100%;
    font-size: 14px;
    box-shadow: none;
}

.pagination-wrapper .v-pagination li button:focus {
    outline: 0 !important;
}

.pagination-wrapper .v-pagination li button i {
    font-size: 14px;
    font-style: normal;
    font-family: "Inter-Medium", sans-serif;
    font-weight: 600;
}

.pagination-wrapper .v-pagination__navigation i {
    color: #0171a1 !important;
}

.pagination-wrapper .v-pagination__navigation--disabled i {
    color: #b4cfe0 !important;
}

.v-pagination__item {
    color: #4a4a4a !important;
    outline: none !important;
}

.theme--light.v-pagination .v-pagination__item--active {
    color: #002f44 !important;
    background-color: transparent !important;
    border: none;
    font-family: "Inter-Bold", sans-serif;
    outline: none !important;
}

.theme--light.v-pagination .v-pagination__item--active:focus {
    border: none !important;
    outline: none !important;
}

.icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon-img {
    width: 14px;
    height: 14px;
    margin: 0 5px;
}

.flag-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.flag-wrapper img {
    margin-right: 5px;
}

.mobile-loader {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.search-shipment {
    padding: 16px !important;
}

.supplier-desktop {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.supplier-desktop span,
.po-num-desktop span,
.mobile-pos span {
    font-family: 'Inter-Regular', sans-serif !important;
}

.po-num-desktop p {
    max-width: 130px;
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
    /* padding-right: 3px; */
}

@media screen and (max-width: 768px) {
    #shipments_header {
        background-color: unset;
    }

    .custom-button {
        margin-top: 16px;
        width: 100%;
        font-size: 16px !important;
        height: 45px !important;
    }

    #shipments_root {
        display: flex;
        background-color: white;
        flex-direction: column-reverse;
        padding: 0 8px;
    }

    .containerMain {
        padding: 0px !important;
    }

    .filters-wrapper {
        height: 85px;
    }

    #filters {
        background: white;
        /* margin: 20px 16px; */
        margin: 20px 10px 20px 16px;
        font-size: 12px;
        padding: 0 12px !important;
        width: 100px;
    }

    .search-shipment {
        padding: 20px 16px 20px 16px !important;
    }

    .search div:nth-of-type(1) > div:nth-of-type(1) {
        background: white;
        font-size: 13px;
    }

    .v-tab {
        padding: 12px 8px !important;
        font-size: 13px !important;
    }

    .v-slide-group__content {
        justify-content: center;
        align-items: center;
    }

    .v-tab:before,
    .v-tab:focus,
    .v-tab:hover {
        background-color: transparent !important;
    }

    /* .pagination-wrapper, */
    .v-slide-group__prev.v-slide-group__prev--disabled {
        display: none !important;
    }

    .mobile-num-status {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .mobile-arr p,
    .mobile-dep p {
        margin: 0;
        font-size: 14px;
    }

    .mobile-supplier {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .mobile-supplier-content {
        width: 100%;
    }

    .mobile-supplier-content p {
        font-size: 12px;
        color: #4a4a4a !important;
        text-align: left !important;
        max-width: 70vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .mobile-pos {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mobile-pos p {
        margin: 0 !important;
        font-size: 12px;
        color: #819fb2 !important;
        text-align: left;
    }
    
    .pagination-wrapper {
        position: absolute;
        bottom: 0px;
        left: 0;
        right: 0;
        padding: 10px;
        margin-top: 20px;
    }

    /* v-data-table mobile */
    .v-data-table {
        background-color: #f1f6fa !important;
        margin-bottom: 90px;
    }

    .v-data-table table {
        table-layout: unset;
        overflow-x: scroll !important;
        max-width: 100%;
    }

    .v-data-table .v-data-table__wrapper {
        padding: 0 15px;
    }

    .v-data-table .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row {
        background-color: #fff !important;
        border: 2px solid #E1ECF0;
    }

    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row:nth-child(1) {
        border-bottom: none !important;
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
        padding: 0 15px !important;
    }

    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row:nth-child(2),
    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row:nth-child(3) {
        border-top: none;
        border-bottom: none !important;
        padding: 10px 15px !important;
    }

    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row:nth-child(4) {
        margin-bottom: 10px;
        padding: 0 15px 10px !important;
        border-top: none;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom: 2px solid #E1ECF0 !important;
        min-height: 35px;
    }

    .v-data-table__wrapper .v-data-table-header.v-data-table-header-mobile tr  {
        height: 10px !important;
    }

    .v-data-table__wrapper .v-data-table-header.v-data-table-header-mobile tr th {
        width: 100%;
        height: 10px !important;
        border: none !important;
    }

    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row .v-data-table__mobile-row__cell {
        font-size: 16px;
        width: 100%;
    }

    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row .mobile-reference {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
    }

    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row .mobile-reference-content {
        color: #4A4A4A;
        font-family: 'Inter-Bold', sans-serif;
    }   

    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row .mobile-dep-arr {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: start;
        font-size: 12px;
    }   

    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row .v-data-table__mobile-row__header,
    .v-data-table__wrapper .v-data-table-header.v-data-table-header-mobile tr th .v-data-table-header-mobile__wrapper,
    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row:nth-child(5),
    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row:nth-child(6),
    .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row:last-child,    
    /* For mobile, hide container column but allow search */
    .v-data-table.elevation-1 .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row:nth-last-child(2) {
        display: none;
    }
    
    .pagination-wrapper .v-pagination li button {
        font-size: 12px !important;
    }

    .pagination-wrapper .v-pagination li button i {
        font-size: 13px !important;
        margin: 0;
    }

    /* FOR SHIPMENT TABLE MOBILE */
    .pending-header .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row:nth-child(3) {
        margin-bottom: 10px !important;
        color: #819fb2 !important;
        padding: 0 15px 10px !important;
        border-top: none;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom: 2px solid #E1ECF0 !important;
    }

    .pending-header .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row:nth-child(3) p {
        text-align: left !important;
        font-size: 12px !important;
    }

    .pending-header .v-data-table__wrapper .v-data-table__mobile-table-row .v-data-table__mobile-row:nth-child(4) {
        display: none;
    }
}

@media screen and (min-width: 960px) {
    /* .containerMain .v-data-table .v-data-table-header tr th:nth-child(3) {
        padding-left: 60px !important;
    } */

    .containerMain .v-data-table.pending-header .v-data-table-header tr th:nth-child(3) {
        padding-left: 24px !important;
    }
}

@media screen and (max-width: 1200px) {
    .v-data-table table {
        table-layout: unset; 
        overflow-x: scroll !important;
        max-width: 100%;
    }   
}
</style>
