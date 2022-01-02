<template>
    <div class="containerMain" v-resize="onResize">
        <div id="shipments_header">
            <div id="shipments_root">
                <v-tabs class="customTab" height="56px" @change="onTabChange" v-model="activeTab">
                    <v-tab v-for="(n, i) in tabs" :key="i" @click="getCurrentTab(i)">
                        <span>
                            <span :class="n == 'Completed' ? 'tab-name-completed' : 'tab-name'">
                                <span v-if="!isMobile">{{ n }}</span>

                                <span v-if="isMobile">                                   
                                    <span v-if="n == 'Pending Approval'"> Pending </span>
                                    <span v-else> {{ n }} </span>
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
                <!-- <Filters :setMenu="(value) => {
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

        <ShipmentsDesktopTable 
            :shipments="shipments"
            :editedIndex.sync="editedIndex"
            :editedItem.sync="editedItem"
            :isMobile="isMobile"
            :activeTab.sync="activeTab"
            :tablePage.sync="page"
            :search.sync="search"
            v-if="!isMobile" />

        <ShipmentsMobileTable 
            :shipments="shipments"
            :editedIndex.sync="editedIndex"
            :editedItem.sync="editedItem"
            :isMobile="isMobile"
            :activeTab.sync="activeTab"
            :tablePage.sync="page"
            :search.sync="search"
            v-if="isMobile" />
    </div>
</template>

<script>
// import Filters from "@/components/Filters.vue"
// import CreateShipment from '../components/ShipmentComponents/CreateShipment'
import { mapActions, mapGetters } from "vuex"
import Search from '../components/Search.vue'
import ShipmentsDesktopTable from '../components/Tables/Shipments/ShipmentsDesktopTable.vue'
import ShipmentsMobileTable from '../components/Tables/Shipments/ShipmentsMobileTable.vue'
import _ from 'lodash'

export default {
    components: {
        // Filters: Filters,
        // CreateShipment
        Search,
        ShipmentsDesktopTable,
        ShipmentsMobileTable
    },
    data: () => ({
        menu: false,
        page: 1,
        dialog: false,
        isMobile: false,
        tabs: ["Pending Approval", "Shipments", "Completed"],
        activeTab: 1,
        search: "",
        dialogDelete: false,
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
    },
    updated() {}
}
</script>

<style lang="scss">
/* @import '../assets/css/shipments_styles/shipment.css'; */
@import '../assets/scss/pages_scss/shipment/shipment.scss';
</style>
