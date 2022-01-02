<template>
    <div class="warehouse-lists-wrapper">
        <div class="warehouse-lists-header">
            <div class="warehouse-header">
                <h3>Warehouses</h3>
            </div>
        </div>

        <div class="warehouse-search">
            <p class="mb-0">
                <span class="mr-1" style="color: #6D858F;">Sort by</span> 
                <span style="color: #4a4a4a !important; font-family: 'Inter-Medium', sans-serif;">{{ selectedName }}</span>
                
                <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-chevron-down</v-icon>
                        </v-btn>
                    </template>                    

                    <v-list class="warehouse-lists-sort-items">
                        <v-radio-group mandatory v-model="selected">
                            <v-radio
                                v-for="(items, index) in radioItems" 
                                @click="itemType({ 'value': items.value, 'label': items.label })"
                                :key="index" 
                                :value="items.value" 
                                :label="items.label"> 
                            </v-radio>
                        </v-radio-group>
                    </v-list>
                </v-menu>
            </p>

            <button class="btn btn-primary search-warehouse" @click="inputClick">
                <img src="@/assets/images/search-icon.svg" alt="" width="15px" height="15px" class="mobile-search-icon" />
            </button>

            <div class="search" :class="isInputExpanded ? 'expanded' : ''">
                <img src="@/assets/images/search-icon.svg" alt="" width="15px" height="15px" class="input-search-icon" :class="isInputExpanded ? 'expanded' : ''" />
                
                <input
                    class="search-asd" 
                    type="text"
                    id="search-input"
                    v-model.trim="searchData"
                    placeholder="Search warehouse..."
                    @input="handleSearch"
                    autocomplete="off" />
            </div>

            <button v-if="isInputExpanded" class="close-btn" @click="clearInput">
                Cancel
            </button>
        </div>

        <div class="warehouse-body-lists">
            <div class="warehouse-lists">
                <div v-for="(warehouse, index) in filteredWarehouseLists" 
                    :key="index" 
                    class="warehouse-item" 
                    :class="(getActiveId === warehouse.id && !isMobile) ? 'active' : ''"
                    @click="currentSelectedWarehouse(warehouse)">

                    <div class="warehouse-name">
                        {{ warehouse.name }}

                        <v-menu bottom left>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon>mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </template>

                            <v-list class="warehouse-lists-items">
                                <v-list-item @click="viewWarehouse(warehouse)">
                                    <v-list-item-title>
                                        <img src="../../assets/icons/visibility-black.svg" class="mr-2" alt="">
                                            View
                                    </v-list-item-title>
                                </v-list-item>

                                <v-list-item @click="editWarehouse(warehouse)">
                                    <v-list-item-title>
                                        <img src="../../assets/icons/edit-black.svg" class="mr-2" alt="">
                                            Edit
                                    </v-list-item-title>
                                </v-list-item>

                                <v-list-item @click="deleteWarehouse(warehouse)">
                                    <v-list-item-title>
                                        <img src="../../assets/icons/deleteIcon.svg" class="mr-2" alt="">
                                            Delete
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>

                    <div class="warehouse-address">
                        {{ warehouse.address }}
                    </div>

                    <div class="warehouse-units">
                        <div class="cartons">
                            <span>{{ warehouse.total_cartons }}</span> Cartons
                        </div>

                        <div class="units">
                            <span>{{ warehouse.total_units }}</span> Units
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters} from 'vuex'
import _ from 'lodash'

export default {
    name: 'WarehouseLists',
    components: {
    },
    props: ['warehousesLists', 'isMobile', 'dialogWarehouseDelete', 
            'editedItemWarehouse', 'editedIndexWarehouse', 'defaultItemWarehouse'],
    data: () => ({
        deleteItem: {
            name: ''
        },
        selected: 'name-asc',
        radioItems: [
            {
                label: 'Name (A-Z)',
                value: 'name-asc'
            },
            {
                label: 'Name (Z-A)',
                value: 'name-desc'
            },
            {
                label: 'Location (A-Z)',
                value: 'location-asc'
            },
            {
                label: 'Location (Z-A)',
                value: 'location-desc'
            },
            {
                label: 'Cartons (Asc)',
                value: 'cartons-asc'
            },
            {
                label: 'Cartons (Dsc)',
                value: 'cartons-desc'
            },
            {
                label: 'Units (Asc)',
                value: 'units-asc'
            },
            {
                label: 'Units (Dsc)',
                value: 'units-desc'
            },
            {
                label: 'Type',
                value: 'type'
            },
        ],
        selectedName: 'Name (A-Z)',
        isInputExpanded: false,
        searchData: '',
    }),
    watch: {},
    computed: {
        ...mapGetters({
            getWarehouseDeleteLoading: 'warehouse/getWarehouseDeleteLoading',
            getActiveId: 'warehouse/getActiveId'
        }),
        filteredWarehouseLists() {
            //filter data based on the searched value
            let filteredItems = []
            
            if (this.searchData!=='') {
                filteredItems = _.filter(this.warehousesLists, e => (e.name.toLowerCase().indexOf(this.searchData.toLowerCase())!==-1))
            } else {
                filteredItems = this.warehousesLists
            }

            return filteredItems
        },
        editedItem: {
            get() {
                return this.editedItemWarehouse
            }, 
            set(value) {
                //this.editedItemWarehouse = value
                // this.$emit('update:editedItemWarehouse', value)
                console.log(value);
            }
        },
    },
    methods: {
        ...mapActions({
			fetchInventories: 'inventory/fetchInventories',
            fetchCategories: 'category/fetchCategories',
            setSort: 'warehouse/setSort',
            setActiveId: 'warehouse/setActiveId'
        }),
        async currentSelectedWarehouse(item) {
            this.$emit('update:currentWarehouseSelected', item)

            if (item !== null) {
                let id = item.id

                if (!this.isMobile) {
                    this.setActiveId(id)

                    try {
                        await this.fetchInventories(id)
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    try {                        
                        this.$router.push(`warehouses/inventory?id=${id}`)
                        await this.fetchInventories(id)
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        },
        viewWarehouse(warehouse) {
            this.$emit('viewWarehouse', warehouse)
        },
        editWarehouse(warehouse) {
            this.$emit('editWarehouse', warehouse)
        },
        deleteWarehouse(warehouse) {
            // this.deleteItem = warehouse
            // this.editedItem = warehouse
            this.$emit('deleteWarehouse', warehouse)
        },
        deleteWarehouseConfirm() {
            this.$emit('deleteWarehouseConfirm', this.editedItem)
        },
        closeDelete() {
            this.$emit('closeDelete')
        },
        itemType(val) {
            this.selectedName = val.label
            this.setSort(this.selected)
        },
        inputClick() {
			this.isInputExpanded = true
		},
        handleSearch() {},
        clearInput() {
            this.isInputExpanded = false
            this.searchData = ''
        },
    },
    mounted() {
        this.fetchCategories()
    },
    updated() {}
}
</script>

<style>
@import '../../assets/css/warehouse_styles/warehouseLists.css';
</style>