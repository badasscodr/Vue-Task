<template>
    <v-dialog v-model="dialogAdd" max-width="800px" content-class="warehouse-dialog" scrollable :retain-focus="false" @click:outside="close">
        <v-card class="warehouse-dialog-card">
            <v-form ref="form" v-model="valid" action="#" @submit.prevent="">
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>

                    <button icon dark class="btn-close" @click="close">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </v-card-title>

                <v-card-text>
                    <div class="add-wrapper">
                        <div class="warehouse-info">
                            <div class="warehouse-number mb-3">
                                <p class="warehouse-title">WAREHOUSE TYPE</p>

                                <v-radio-group mandatory v-model="warehouse.warehouse_type" hide-details="auto">
                                    <v-radio label="Own Facility" value="own"> </v-radio>
                                    <v-radio label="3rd Party (3PL)" value="3pl"> </v-radio>
                                </v-radio-group>
                            </div>

                            <div class="warehouse-name mb-3">
                                <p class="warehouse-title">NAME</p>
                                <v-text-field
                                    height="40px"
                                    color="#002F44"
                                    width="200px"
                                    dense
                                    class="text-fields select-items name"
                                    placeholder="Enter Name"
                                    outlined
                                    v-model="warehouse.name"
                                    :rules="warehouseNameRules"
                                    hide-details="auto">
                                </v-text-field>
                            </div>

                            <div class="warehouse-contact-number mb-4">
                                <p class="warehouse-title">DELIVERY CONTACT NUMBER</p>
                                <vue-tel-input-vuetify
                                    class="text-fields select-items name"
                                    outlined
                                    dense
                                    single-line
                                    hide-details="auto"
                                    :valid-characters-only="true"
                                    :rules="numberRules"
                                    v-bind="telProps"
                                    v-model="warehouse.phone" />
                            </div>
                        </div>

                        <div class="warehouse-description">
                            <div class="warehouse-email mb-5">
                                <p class="warehouse-title">EMAIL</p>
                                <div class="mb-1">
                                    <vue-tags-input
                                      hide-details="auto"
                                      :rules="arrayNotEmptyRules"
                                      :tags="options"
                                      :add-on-blur=true
                                      :add-on-key="[13, ',']"
                                      :validation="tagsValidation"
                                      v-model="warehouseEmailAddress"
                                      placeholder="e.g. name@email.com"
                                      @tags-changed="newTags => {
                                        this.options = newTags
                                        this.tagsInput.touched = true
                                        this.tagsInput.hasError = (this.options.length > 0) ? false : true
                                        let el = this.documentProto.getElementsByClassName('ti-input')[0]
                                        if (typeof el!=='udnefined') {
                                            if (this.tagsInput.hasError)
                                                el.classList.add('ti-new-tag-input-error')
                                            else
                                                el.classList.remove('ti-new-tag-input-error')   
                                            
                                        }   

                                      }"
                                    />
                                </div>
                                <div v-if="tagsInput.touched" class="v-text-field__details">
                                    <div class="v-messages theme--light error--text" role="alert">
                                        <div class="v-messages__wrapper">
                                            <div v-if="(options.length > 0) && warehouseEmailAddress!==''" class="v-messages__message">
                                                {{
                                                    tagsInput.errorMessage
                                                }}
                                            </div>

                                            <div v-if="options.length == 0 && warehouseEmailAddress!==''" class="v-messages__message">
                                                {{
                                                    tagsInput.errorMessage
                                                }}
                                            </div>
                                            <div v-if="options.length == 0 && warehouseEmailAddress==''" class="v-messages__message">
                                                Please provide at least 1 valid email address.
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                                <span style="color: #819FB2; font-size: 12px;">
                                    Press the "Enter" or "," key in your keyboard to confirm the email address
                                </span>
                            </div>

                            <div class="warehouse-notes mb-5">
                                <p class="warehouse-title">ADDRESS</p>
                                <v-textarea
                                    height="100"
                                    class="text-fields address"
                                    outlined
                                    name="input-7-4"
                                    placeholder="Type full address..."
                                    v-model="warehouse.address"
                                    :rules="rules"
                                    hide-details="auto">
                                </v-textarea>
                            </div>

                            <div class="row">
                                <div class="col-sm-12 mb-1">
                                    <div class="row">
                                        <div class="warehouse-each col-sm-6 py-1">
                                            <p class="warehouse-title">COUNTRY</p>
                                                <v-autocomplete
                                                    class="text-fields select-items"
                                                    v-model="warehouse.country"
                                                    :items="countries"
                                                    :disabled="getCountriesLoading"
                                                    :placeholder="getCountriesLoading ? 'Fetching countries...' : 'Type country name'"
                                                    @input="setSelectedCountry"
                                                    outlined
                                                    :rules="rules"
                                                    hide-details="auto">
                                                </v-autocomplete>
                                        </div>

                                        <div class="warehouse-each col-sm-6 py-1">
                                            <p class="warehouse-title">STATE</p>
                                            <v-select
                                                class="text-fields select-items"
                                                outlined
                                                :items="states"
                                                item-text="name"
                                                item-value="id"
                                                :placeholder="getStatesLoading ? 'Fetching states...' : 'Select state'"
                                                :disabled="getStatesLoading"
                                                @change="setSelectedState"
                                                v-model="warehouse.state"
                                                :rules="rules"
                                                hide-details="auto">
                                                <!-- @click="isStateClicked()" -->
                                            </v-select>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-12">
                                    <div class="row">
                                        <!-- <div class="warehouse-each col-sm-6 py-1">
                                            <p class="warehouse-title">CITY</p>
                                            <v-combobox
                                                class="text-fields select-items"
                                                v-model="warehouse.city"
                                                :items="cities"
                                                item-text="name"
                                                item-value="id"
                                                :disabled="getCitiesLoading"
                                                :placeholder="getCitiesLoading ? 'Fetching cities...' : 'Select city'"
                                                @click="isCitiesClicked()"
                                                outlined
                                                :rules="rules"
                                                hide-details="auto">

                                                <template v-slot:no-data>
                                                    <div tabindex="-1" class="v-list-item theme--light">
                                                        <div class="v-list-item__content">
                                                            <div class="v-list-item__title">No data available</div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </v-combobox>
                                        </div> -->

                                        <div class="warehouse-each col-sm-6 py-1">
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
                                                v-model="warehouse.zipcode"
                                                :rules="rules"
                                                hide-details="auto">
                                            </v-text-field>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <button class="btn-blue" @click.stop="saveWarehouse">
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
                    </button>

                    <button class="btn-white" @click.stop="saveAndAddWarehouse">
                        <span v-if="editedIndex === -1">
                            <span>
                                {{
                                    ( getWarehouseSaveAddLoading ) ? 'Saving...' : 'Save & Add Another'
                                }}
                            </span>
                        </span>

                        <span v-if="editedIndex > -1">
                            <span>
                                {{
                                    ( getWarehouseSaveAddLoading ) ? 'Updating...' : 'Update & Add Another'
                                }}
                            </span>
                        </span>
                    </button>

                    <button class="btn-white" @click="close" v-if="!isMobile">
                        Cancel
                    </button>
                
                    <v-spacer v-if="!isMobile"></v-spacer>
                    
                    <button class="btn-white" @click="deleteWarehouse(warehouse)" v-if="editedIndex > -1">
                        Delete
                    </button>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import jQuery from 'jquery'
//import vSelect from 'vue-select'
import "vue-select/src/scss/vue-select.scss";
import globalMethods from '../../../utils/globalMethods'
import VueTelInputVuetify from "vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue"
import VueTagsInput from '@johmun/vue-tags-input';

export default {
    name: 'WarehouseAddDialog',
    components: {
        VueTelInputVuetify,
      // vueSelect: vSelect,
        VueTagsInput
    },
    props: ['dialog', 'editedIndex', 'addWarehouseItems', 'isMobile'],
    data: () => ({
        tagsValidation: [
            {
            classes: 't-new-tag-input-text-error',
            rule: (/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/),
            disableAdd: true
            }
        ],
        documentProto: document,
        valid: true,
        tagsInput: {
            touched: false,
            hasError: false,
            errorMessage: 'Please confirm the entered email address by pressing the "Enter" or "," key in your keyboard.'
            //errorMessage: ''
        },
        warehouseEmailAddress: '',
        emailTagActive: false,
        options: [],
        selectedCountry: '',
        selectedState: '',
        telProps: {
            mode: "international",
            defaultCountry: "US",
            placeholder: "Type phone number",
            label: 'Type phone number',
            autocomplete: "off",
            maxLen: 25,
            preferredCountries: ["US", "CN"],
            enabledCountryCode: true,
            dropdownOptions: {
                showDialCodeInSelection: true,
                showFlags: true
            },
            validCharactersOnly: true
        },
        rules: [
            (v) => !!v || "Input is required."
        ],
        arrayNotEmptyRules: [
            (v) => !!v || "Email is required",
            () => this.optionsFiltered.length > 0 || "Make sure to supply at least 1 email." 
        ],
        numberRules: [
            (v) => !!v || "Input is required.",
            (v) => /^(?=.*[0-9])[- +()0-9]+$/.test(v) || "Letters are not allowed."
        ],
        warehouseNameRules: [
            (v) => !!v || "Input is required.",
            (v) => /^.{1,250}$/.test(v) || 'Only 250 maximum characters allowed.'
        ]
    }),
    watch: {
        tagsInput(value) {
            if ( value.hasError) {
                jQuery('.ti-input').addClass('ti-new-tag-input-error')
            } else {
                jQuery('.ti-input').removeClass('ti-new-tag-input-error')
            }
        },
        dialog(value, oldValue) {

            this.tagsInput.hasError = false
            this.tagsInput.touched = false
            jQuery('.ti-input').removeClass('ti-new-tag-input-error')
            if (typeof el!=='undefined') {
                let el = document.getElementsByClassName('ti-input')[0]
                el.classList.remove('ti-new-tag-input-error')
            }
           
            
            if ( !value ) {
                this.options = []
                this.warehouseEmailAddress = ''

                

            } else if(value && !oldValue) {

                if (this.editedIndex==-1) {
                    this.options = []
                } else {
                    let validEmailAddress = []
                    if (this.warehouse.email_address.length > 0) {
                        
                        this.warehouse.email_address.map(wea => {
                            if (wea!==null) {
                                validEmailAddress.push({text: wea,tiClasses:["ti-valid"]})
                            }
                        })
                    }
                    this.options = validEmailAddress    
                }
                
            }
        }
    },
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
        dialogAdd: {
            get() {
                return this.dialog
            },
            set(value) {
                this.$refs.form.resetValidation()
                this.$emit('update:dialog', value)
            }
        },
        optionsFiltered: {
            get() {

                let validEmailAddress = []

                if (this.warehouse.email_address.length > 0) {
                    
                    this.warehouse.email_address.map(wea => {
                        if (wea!==null) {
                            validEmailAddress.push({text: wea,tiClasses:["ti-valid"]})
                        }
                    })
                }
                return validEmailAddress
            },
            set(value) {
                this.options = value
            }
            
        },
        dialogIndex: {
            get() {
                return this.editedIndex
            },
            set(value) {
                this.$emit('update:editedIndex', value)
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
        },
        warehouse: {
            get() {
                return this.addWarehouseItems
            },
            set(value) {               
                this.$emit('update:addWarehouseItems', value)
            }
        },
        addWarehouseTemplate() {
            let {
                name,
                email_address,
                phone,
                address,
                country,
                city,
                state,
                zipcode,
                warehouse_type
            } = this.warehouse

            return {
                name,
                email_address,
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
    },
    methods: {
        pushEmail(value) {
            console.log(value)
            console.log('here')
        },
        ...mapActions({
            fetchCountries: 'warehouse/fetchCountries',
            fetchStates: 'warehouse/fetchStates',
            fetchCities: 'warehouse/fetchCities',
            createWarehouse: 'warehouse/createWarehouse',
            updateWarehouse: 'warehouse/updateWarehouse',
            fetchWarehouse: 'warehouse/fetchWarehouse',
            fetchSingleWarehouse: 'warehouse/fetchSingleWarehouse',
            fetchInventories: 'inventory/fetchInventories'
        }),
        ...globalMethods,
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
                    country: this.warehouse.country,
                    states: value
                }

                try {
                    await this.fetchCities(payload)
                } catch (e) {
                    console.log(e);
                }
            }
        },
        generateErrorMessage() {
            this.tagsInput.hasError = (this.options.length > 0) ? false : true
            if (this.tagsInput.hasError)
                jQuery('.ti-input').addClass('ti-new-tag-input-error')
            else
                jQuery('.ti-input').removeClass('ti-new-tag-input-error')
        },
        async saveWarehouse() {

            if (!this.tagsInput.touched)
                this.tagsInput.touched = true

            this.$refs.form.validate()
            this.tagsInput.hasError = (this.options.length > 0) ? false : true
            
    
            this.generateErrorMessage()
           
            setTimeout(async () => {
                if (this.$refs.form.validate()) {

                    if (!this.tagsInput.hasError) {
                        try {
                        
                            jQuery('.ti-new-tag-input').trigger(
                                jQuery.Event( 'keyup', { keyCode: 13, which: 13 } )
                            )
                            //this.warehouseEmailAddress = ''
                            
                            // save then close
                            if (this.editedIndex === -1) {
                                
                                let finalEmailAddress = (this.options.length > 0) ? this.options.map(o => {
                                    return o.text
                                }) : []

                                let addWarehouseTemplate = this.addWarehouseTemplate
                                addWarehouseTemplate.email_address = finalEmailAddress

                                await this.createWarehouse(addWarehouseTemplate)                
                                //await this.createWarehouse(this.addWarehouseTemplate)
                                this.notificationMessage('Warehouse has been created.')
                                await this.fetchWarehouse()

                                this.close()
                                await this.getFirstWarehouse()

                                if (this.isMobile) {
                                    this.callSingleWarehouse()
                                }

                            } else {

                                let finalEmailAddress = (this.options.length > 0) ? this.options.map(o => {
                                    return o.text
                                }) : []

                                let editWarehouseTemplate = this.addWarehouseTemplate
                                editWarehouseTemplate.email_address = finalEmailAddress
                                editWarehouseTemplate.id = this.warehouse.id
                                editWarehouseTemplate._method = 'PUT'
                                await this.updateWarehouse(editWarehouseTemplate)
                                this.notificationMessage('Warehouse has been updated.')
                                await this.fetchWarehouse()
                                await this.getFirstWarehouse()
                                this.close()

                                if (this.isMobile) {
                                    this.callSingleWarehouse()
                                }
                            }

                        } catch(e) {
                            this.notificationError(e)
                            console.log(e)
                        }    
                    }
                    
                }
            },200)
            
        },
        async saveAndAddWarehouse() {

            if (!this.tagsInput.touched)
                this.tagsInput.touched = true

            this.$refs.form.validate()
            this.tagsInput.hasError = (this.options.length > 0) ? false : true
            

            this.generateErrorMessage()
            setTimeout(async () => {
                if (this.$refs.form.validate()) {
                
                    if (!this.tagsInput.hasError) {
                        try {
                        
                            jQuery('.ti-new-tag-input').trigger(
                                jQuery.Event( 'keyup', { keyCode: 13, which: 13 } )
                            )

                            if (this.editedIndex === -1) {

                                let finalEmailAddress = (this.options.length > 0) ? this.options.map(o => {
                                    return o.text
                                }) : []

                                let passedTemplate = this.addWarehouseTemplate
                                passedTemplate.another = true
                                passedTemplate.email_address = finalEmailAddress
                                await this.createWarehouse(passedTemplate)
                                this.notificationMessage('Warehouse has been created.')
                                await this.fetchWarehouse()
                                
                                this.close()
                                this.dialogIndex = -1
                                this.dialogAdd = true

                                if (this.isMobile) {
                                    this.callSingleWarehouse()
                                }
                            } else {
                                let editWarehouseTemplate = this.addWarehouseTemplate
                                let finalEmailAddress = (this.options.length > 0) ? this.options.map(o => {
                                    return o.text
                                }) : []
                                editWarehouseTemplate.email_address = finalEmailAddress
                                editWarehouseTemplate.id = this.warehouse.id
                                editWarehouseTemplate._method = 'PUT'
                                editWarehouseTemplate.another = true
                                await this.updateWarehouse(editWarehouseTemplate)
                                this.notificationMessage('Warehouse has been updated.')
                                await this.fetchWarehouse()
                                
                                this.close()
                                this.dialogIndex = -1
                                this.dialogAdd = true

                                if (this.isMobile) {
                                    this.callSingleWarehouse()
                                }
                            }
                            //this.warehouseEmailAddress = ''
                            
                            // save then close
                            
                        } catch(e) {
                            this.notificationError(e)
                            console.log(e)
                        }
                    }
                    
                }
            },200)
                        
        },
        async callSingleWarehouse() {
            let pageId = new URL(location.href).searchParams.get('id')

            if (pageId !== 'undefined' && pageId !== null) {
                this.fetchSingleWarehouse(pageId)

                try {
                    await this.fetchInventories(pageId)
                } catch(e) {
                    // console.log(e);
                }
            }
        },
        close() {
            this.$store.dispatch("warehouse/setStatesReset", [])
            this.$store.dispatch("warehouse/setCitiesReset", [])
            this.$refs.form.resetValidation()
            this.$emit('close')
        },
        deleteWarehouse(warehouse) {
            this.$emit('deleteWarehouse', warehouse)
        },
        getFirstWarehouse() {
            this.$emit('getFirstWarehouse')
        },
        isStateClicked() {
            if (this.warehouse.country == '') {
                this.notificationErrorCustom('Please select a country first.')
            }
        },
        isCitiesClicked() {
            if (this.warehouse.country == '') {
                this.notificationErrorCustom('Please select a country first.')
            } else {                
                if (this.warehouse.state == '') {
                    this.notificationErrorCustom('Please select a state first.')
                }
            }
        },
        handlers: (map, vm) => ({
            ...map,
            50: (e) => {
                e.preventDefault()
                if (e.key === '@' && vm.search.length > 0) {
                    // autocomplete email if @ key was clicked
                    vm.search = `${vm.search}@gmail.com`
                }
            },
        }),
        isButtonDisabled(warehouse) {
           // let  { name, email_address, phone, address, country, state, city, zipcode } = warehouse
           let final_email_address = this.options
           let  { name, phone, address, country, state, city, zipcode } = warehouse
            
            if (name !== ""  && this.options !== "" && phone !== "" 
                && address !== "" && country !== "" 
                && city !== "" && state !== "" && zipcode !== "" && final_email_address.length > 0 && this.warehouseEmailAddress=='') {
                return ''
            } else {
                return 'has-empty'
            }
        },
    },
    async mounted() {
        //this.options = (this.addWarehouseItems.email_address==null) ? [] : this.addWarehouseItems.email_address

        if (this.editedIndex!==-1) {
            let validEmailAddress = []
            if (this.warehouse.email_address.length > 0) {
                
                this.warehouse.email_address.map(wea => {
                    if (wea!==null) {
                        validEmailAddress.push({text: wea,tiClasses:["ti-valid"]})
                    }
                })
            }
            this.options = validEmailAddress
        }
    },
    async updated() {
        if (this.editedIndex === -1) {
            if (typeof this.$refs.form !== 'undefined') {
                if (typeof this.$refs.form.resetValidation() !== 'undefined') {
                    this.$refs.form.resetValidation()
                }
            }
        }
    }
}
</script>

<style lang="scss">
/* @import '../../../assets/css/warehouse_styles/addWarehouseDialog.css'; */
@import '../../../assets/scss/pages_scss/warehouse/addWarehouseDialog.scss';

.v-autocomplete__content.v-menu__content {
    border-radius: 4px !important;
}
.ti-tag {
    border-radius: 99px !important;
    font-size: 14px;
    font-family: 'Inter-Medium', sans-serif;
    padding: 3px 10px !important;
    line-height: 1;
    height: 30px;
    background-color: #F7F7F7 !important;
    border: 1px solid #E1ECF0;
    color: #6D858F !important;
    margin: 6px 2px 2px 2px;
    min-width: 75px;
    justify-content: space-between;
    align-items: center;
}
.ti-new-tag-input {
    flex: 1 1 auto;
    line-height: 20px;
    padding: 8px 0 8px;
    max-width: 100%;
    min-width: 0px;
    width: 100%;
}
.ti-input {
    border: 1px solid #B4CFE0 !important;
    border-radius: 4px;
    min-height: 45px;
    font-size: 14px;

}
.ti-new-tag-input::placeholder,
.ti-input::placeholder{
    color: #B4CFE0 !important;
}
.ti-new-tag-input-error {
    border: 1px solid #ff5252 !important;
}
.t-new-tag-input-text-error {
    color: #ff5252 !important;
}

.ti-new-tag-input-wrapper input {
    font-size: 14px !important;
}

</style>
