<template>
    <v-dialog v-model="dialog" max-width="800px" content-class="warehouse-dialog" scrollable :retain-focus="false" @click:outside="close">
        <template v-slot:activator="{ on, attrs }">
            <span v-bind="attrs" v-on="on">
                <v-btn dark color="primary" class="btn-white btn-add-warehouse"  v-if="!isMobile">
                    Add Warehouse
                </v-btn>

                <v-btn dark color="primary" class="btn-white btn-add-warehouse" v-if="isMobile && editedIndex === -1">
                    Add Warehouse
                </v-btn>
            </span>
        </template>

        <v-card class="warehouse-dialog-card">
            <v-card-title>
                <span class="headline">{{ formTitle }}</span>

                <button icon dark class="btn-close" @click="close">
                    <v-icon>mdi-close</v-icon>
                </button>
            </v-card-title>

            <v-card-text>
                <div class="add-wrapper">
                    <div class="warehouse-info">
                        <div class="warehouse-number">
                            <p class="warehouse-title">WAREHOUSE TYPE</p>

                            <v-radio-group mandatory v-model="editedItem.warehouse_type">
                                <v-radio label="Own Facility" value="own"> </v-radio>
                                <v-radio label="3rd Party (3PL)" value="3pl"> </v-radio>
                            </v-radio-group>                            
                        </div>

                        <div class="warehouse-name mb-2">
                            <p class="warehouse-title">NAME</p>
                            <v-text-field
                                height="40px"
                                color="#002F44"
                                width="200px"
                                dense
                                class="text-fields select-items name"
                                placeholder="Enter Name"
                                outlined
                                v-model="editedItem.name">
                            </v-text-field>
                        </div>

                        <div class="warehouse-category">
                            <p class="warehouse-title">PHONE</p>
                            <VueTelInput                               
                                v-bind="telProps"
                                v-model="editedItem.phone" />
                        </div>
                    </div>

                    <div class="warehouse-description">                      
                        <div class="warehouse-notes">
                            <p class="warehouse-title">ADDRESS</p>
                            <v-textarea
                                height="100"
                                class="text-fields address"
                                outlined
                                name="input-7-4"
                                placeholder="Type full address..."
                                v-model="editedItem.address"></v-textarea>
                        </div>

                        <div class="row">
                            <div class="col-sm-12">
                                <div class="row">
                                    <div class="warehouse-each col-sm-6 pb-1">
                                        <p class="warehouse-title">COUNTRY</p>
                                        <vueSelect 
                                            height="76"
                                            class="v-text-fields v-countries select"
                                            :placeholder="getCountriesLoading ? 'Fetching countries...' : 'Type country name'"
                                            :options="countries"
                                            v-model="editedItem.country"
                                            :disabled="getCountriesLoading"
                                            @input="setSelectedCountry"/>
                                    </div>

                                    <div class="warehouse-each col-sm-6 pb-1">
                                        <p class="warehouse-title">STATE</p>
                                        <v-select
                                            class="text-fields select-items"
                                            :items="states"
                                            item-text="name"
                                            item-value="id"
                                            :placeholder="getStatesLoading ? 'Fetching states...' : 'Select state'"
                                            outlined
                                            v-model="editedItem.state"
                                            :disabled="getStatesLoading"
                                            @change="setSelectedState"></v-select>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-12">
                                <div class="row">
                                    <div class="warehouse-each col-sm-6 pb-1">
                                        <p class="warehouse-title">CITY</p>
                                        <v-select
                                            class="text-fields select-items"
                                            :items="cities"
                                            item-text="name"
                                            item-value="id"
                                            :placeholder="getCitiesLoading ? 'Fetching cities...' : 'Select city'"
                                            outlined
                                            v-model="editedItem.city"
                                            :disabled="getCitiesLoading"></v-select>
                                    </div>

                                    <div class="warehouse-each col-sm-6 pb-1">
                                        <p class="warehouse-title">ZIPCODE</p>
                                        <v-text-field
                                            height="40px"
                                            color="#002F44"
                                            width="200px"
                                            dense
                                            class="text-fields"
                                            placeholder="Type zipcode"
                                            outlined
                                            type="number"
                                            v-model="editedItem.zipcode">
                                        </v-text-field>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-card-text>

            <v-card-actions>
                <v-btn class="btn-blue" text @click="saveWarehouse">
                    <span v-if="editedIndex === -1">
                        <span>
                            {{ 
                                ( getWarehouseCreateLoading ) ? 'Adding Warehouse...' : 'Add Warehouse'
                            }}
                        </span>
                    </span>

                    <span v-if="editedIndex > -1">
                        <span>
                            {{ 
                                ( getWarehouseCreateLoading ) ? ' Saving...' : 'Save'
                            }}
                        </span>
                    </span>
                </v-btn>

                <v-btn class="btn-white" text @click="saveAndAddWarehouse" v-if="editedIndex === -1">
                    <span>
                        {{
                            ( getWarehouseSaveAddLoading ) ? 'Saving...' : 'Save & Add Another'
                        }}
                    </span>
                </v-btn>

                <v-btn class="btn-white" text @click="saveAndAddWarehouse" v-if="editedIndex > -1">
                    <span>
                        {{
                            ( getWarehouseSaveAddLoading ) ? 'Updating...' : 'Update & Add Another'
                        }}
                    </span>
                </v-btn>
                <v-btn class="btn-white" text @click="close" v-if="!isMobile">
                    Cancel
                </v-btn>
               
                <v-spacer></v-spacer>
                
                <v-btn class="btn-white" text @click="deleteWarehouse" v-if="editedIndex > -1">
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/dist/vue-tel-input.css'
import vSelect from 'vue-select'
import "vue-select/src/scss/vue-select.scss";
import globalMethods from '../../../utils/globalMethods'

export default {
    name: 'AddWarehouseDialog',
    components: {
        VueTelInput,
        vueSelect: vSelect,
    },
    props: ['editedIndexWarehouse', 'dialogDataWarehouse', 
            'editedItemWarehouse', 'defaultItemWarehouse', 'dialogWarehouseDelete',
            'isMobile'],
    data: () => ({
        selectedCountry: '',
        selectedState: '',
        telInputOptions: {
            showDialCodeInSelection: true,
            showFlags: true
        },
        telProps: {
            mode: "international",
            defaultCountry: "US",
            placeholder: "Type phone number",
            autocomplete: "off",
            maxLen: 25,
            preferredCountries: ["US", "CN"],
            dropdownOptions: {
                showDialCodeInSelection: true,
                showFlags: true
            },
            validCharactersOnly: true,
        },
    }),
    computed: {
        ...mapGetters({
            getCountries: 'warehouse/getCountries',
			getCountriesLoading: 'warehouse/getCountriesLoading',
            getStates: 'warehouse/getStates',
            getStatesLoading: 'warehouse/getStatesLoading',
            getCities: 'warehouse/getCities',
            getCitiesLoading: 'warehouse/getCitiesLoading',
            getWarehouseDeleteLoading: 'warehouse/getWarehouseDeleteLoading',
            getUser: 'getUser',
            getWarehouseCreateLoading: 'warehouse/getWarehouseCreateLoading',
            getWarehouseLoading: 'warehouse/getWarehouseLoading',
            getWarehouseSaveAddLoading: 'warehouse/getWarehouseSaveAddLoading'
        }),
        formTitle() {
            return this.editedIndex === -1 ? 'Add Warehouse' : 'Edit Warehouse'
        },
        dialog: {
            get() {
                return this.dialogDataWarehouse
            },
            set(value) {
                if (!value) {
                    this.$emit('update:dialogDataWarehouse', false)
                } else {
                    if (this.editedIndexWarehouse==-1) {
                        this.$emit('update:editedItemWarehouse', this.defaultItem)
                    }
                    this.$emit('update:dialogDataWarehouse', true)
                }
            }
        },
        addWarehouseTemplate() {
            let {
                name,
                phone,
                address,
                country,
                city,
                state,
                zipcode,
                warehouse_type
            } = this.editedItem

            return {
                name,
                phone,
                address,
                country,
                state,
                city,
                zipcode,
                warehouse_type_id: warehouse_type,
                customer_id: (typeof this.getUser=='string') ? JSON.parse(this.getUser).customer.id : ''
            }
        },
        dialogDelete: {
            get () {
                return this.dialogWarehouseDelete
            },
            set (value) {
                if (!value) {
                    this.$emit('update:dialogWarehouseDelete', false)
                } else {
                    this.$emit('update:dialogWarehouseDelete', true)
                }
            }
        },
        editedIndex: {
            get() {
                return this.editedIndexWarehouse
            }, 
            set(value) {
                this.$emit('update:editedIndexWarehouse', value)
            }
        },
        editedItem: {
            get() {
                return this.editedItemWarehouse
            }, 
            set(value) {
                this.editedItemWarehouse = value
                console.log(value);
            }
        },
        defaultItem: {
            get() {
                return this.defaultItemWarehouse
            }, 
            set(value) {
                console.log(value);
            }
        },
        countries() {
            return typeof this.getCountries !== 'undefined' && this.getCountries !== null && this.getCountries.length !== 0 ? this.getCountries : []
        },
        states() {
            return typeof this.getStates !== 'undefined' && this.getStates !== null && this.getStates.length !== 0 ? this.getStates : []
        },
        cities() {
            return typeof this.getCities !== 'undefined' && this.getCities !== null && this.getCities.length !== 0 ? this.getCities : []
        }
    },
    methods: {
        ...mapActions({
            fetchCountries: 'warehouse/fetchCountries',
            fetchStates: 'warehouse/fetchStates',
            fetchCities: 'warehouse/fetchCities',
            createWarehouse: 'warehouse/createWarehouse',
            updateWarehouse: 'warehouse/updateWarehouse',
            fetchWarehouse: 'warehouse/fetchWarehouse'
        }),
        ...globalMethods,
        close() {
			this.$emit('closeWarehouse')
		},
        async setSelectedCountry(value) {
            if (value !== '' && value !== null) {
                try {
                    await this.fetchStates(value)
                } catch (e) {
                    console.log(e);
                }
            }
        },
        async setSelectedState(value) {
            if (value !== '' && value !== null) {
                let payload = {
                    country: this.editedItem.country,
                    states: value
                }

                try {
                    await this.fetchCities(payload)
                } catch (e) {
                    console.log(e);
                }
            }
        },
        async saveWarehouse() {
            try {
                // save then close
                if (this.editedIndex === -1) {                    
                    await this.createWarehouse(this.addWarehouseTemplate)
                    this.notificationMessage('Warehouse has been created.')
                    await this.fetchWarehouse()

                    //close dialog
                    this.close()
                    await this.getFirstWarehouse()
                    this.editedIndex = -1

                } else {
                    let editWarehouseTemplate = this.addWarehouseTemplate
                    editWarehouseTemplate.id = this.editedItem.id
                    editWarehouseTemplate._method = 'PUT'
                    await this.updateWarehouse(editWarehouseTemplate)
                    this.notificationMessage('Warehouse has been updated.')
                    await this.fetchWarehouse()
                    //close dialog
                    this.close()

                }

            } catch(e) {
                this.notificationError(e)
                console.log(e)
            }
        },
        async saveAndAddWarehouse() {
            try {
                // save then close
                if (this.editedIndex === -1) {
                    let passedTemplate = this.addWarehouseTemplate
                    passedTemplate.another = true
                    await this.createWarehouse(passedTemplate)
                    this.notificationMessage('Warehouse has been created.')
                    await this.fetchWarehouse()
                    //close dialog
                    this.close()
                    this.editedIndex = -1
                    this.dialog = true

                } else {
                    let editWarehouseTemplate = this.addWarehouseTemplate
                    editWarehouseTemplate.id = this.editedItem.id
                    editWarehouseTemplate._method = 'PUT'
                    editWarehouseTemplate.another = true
                    await this.updateWarehouse(editWarehouseTemplate)
                    this.notificationMessage('Warehouse has been updated.')
                    await this.fetchWarehouse()
                    //close dialog
                    this.close()
                    this.editedIndex = -1
                    this.dialog = true
                }

            } catch(e) {
                this.notificationError(e)
                console.log(e)
            }

        },
        deleteWarehouse() {
            this.$emit('deleteWarehouse', this.editedItemWarehouse)
        },
        deleteWarehouseConfirm() {
            this.$emit('deleteWarehouseConfirm', this.editedItemWarehouse)
        },
        closeDelete() {
            this.$emit('closeDelete')
        },
        getFirstWarehouse() {
            this.$emit('getFirstWarehouse')
        }
    },
    async mounted() {

    },
    async updated() {
        
	}
}
</script>

<style>
@import '../../assets/css/warehouse_styles/addWarehouseDialog.css';
</style>