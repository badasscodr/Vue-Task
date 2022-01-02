<template>
    <v-dialog v-model="dialog" max-width="560px" content-class="add-supplier-dialog" v-resize="onResize" :retain-focus="false">
        <v-card class="add-supplier-card">
            <v-form ref="form" v-model="valid" action="#" @submit.prevent="">
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>

                    <button icon dark class="btn-close" @click="close">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </v-card-title>

                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12" class="pb-0">
                            <label class="text-item-label">Name</label>
                            <v-text-field 
                                placeholder="Type name of the supplier" 
                                outlined 
                                class="text-fields"
                                v-model="editedItem.company_name"
                                :rules="rules"
                                hide-details="auto">
                            </v-text-field>
                        </v-col>                    

                        <v-col cols="12" sm="12" md="12" class="pb-1">
                            <label class="text-item-label">Phone</label>
                            <vue-tel-input-vuetify
                                class="text-fields"
                                type="number"
                                outlined
                                dense
                                single-line
                                hide-details="auto"
                                :valid-characters-only="true"
                                :rules="numberRules"
                                v-bind="telProps"
                                v-model="editedItem.phone" />
                        </v-col>

                        <v-col cols="12" sm="12" md="12" class="pb-0">
                            <label class="text-item-label">Address</label>
                            <v-textarea
                                height="76px"
                                class="text-fields"
                                outlined
                                name="input-7-4"
                                placeholder="Type the full address of the supplier" 
                                v-model="editedItem.address"
                                :rules="rules"
                                hide-details="auto">
                            </v-textarea>
                        </v-col>

                        <v-col cols="12" sm="12" md="12">
                            <label class="text-item-label">Email</label>
                            <div class="tags-email-wrapper mb-1">
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
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-btn class="btn-blue" text @click="save">
                        <span v-if="editedIndexData === -1">
                            <span>
                                {{ 
                                    ( getCreateSuppliersLoading ) ? 'Adding Supplier...' : 'Add Supplier'
                                }}
                            </span>
                        </span>

                        <span v-if="editedIndexData > -1">
                            <span>
                                {{ 
                                    ( getCreateSuppliersLoading ) ? ' Saving Supplier...' : 'Save Supplier'
                                }}
                            </span>
                        </span>
                    </v-btn>

                    <v-btn class="btn-white" text @click="saveAndAddSupplier" v-if="editedIndexData === -1">
                        {{
                            ( getSupplierSaveAddLoading ) ? 'Saving...' : 'Save & Add Another'
                        }}
                    </v-btn>

                    <v-btn class="btn-white" text @click="close" v-if="!isMobile">
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VueTelInputVuetify from "vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue"
import VueTagsInput from '@johmun/vue-tags-input';
import jQuery from 'jquery'
import globalMethods from '../../utils/globalMethods'

export default {
    name: 'SupplierDialog',
    props: ['editedItemData','editedIndexData', 'dialogData', 'defaultItemData'],
    components: {
        VueTelInputVuetify,
        VueTagsInput
    },
    data: () => ({
        valid: true,
        telInputOptions: {
            showDialCodeInSelection: true,
            showDialCodeInList: true,
            showFlags: true,
        },
        options: [],
        value: [],
        isMobile: false,
        rules: [
            (v) => !!v || "Input is required."
        ],
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
        numberRules: [
            (v) => !!v || "Input is required.",
            (v) => /^(?=.*[0-9])[- +()0-9]+$/.test(v) || "Letters are not allowed."
        ],
        tagsValidation: [
            {
            classes: 't-new-tag-input-text-error',
            rule: (/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/),
            disableAdd: true
            }
        ],
        documentProto: document,
        tagsInput: {
            touched: false,
            hasError: false,
            errorMessage: 'Please confirm the entered email address by pressing the "Enter" or "," key in your keyboard.'
        },
        warehouseEmailAddress: '',
        arrayNotEmptyRules: [
            (v) => !!v || "Email is required",
            () => this.optionsFiltered.length > 0 || "Make sure to supply at least 1 email." 
        ],
    }),
    computed: {
        ...mapGetters({
            getUser: 'getUser',
            getCreateSuppliersLoading: 'suppliers/getCreateSuppliersLoading',
            getSupplierSaveAddLoading: 'suppliers/getSupplierSaveAddLoading'
        }),
        formTitle () {
            return this.editedIndexData === -1 ? 'Add Supplier' : 'Edit Supplier'
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
        editedItem: {
            get () {
                return this.editedItemData
            },
            set (value) {
                console.log(value);
            }
        },
        defaultItem: {
            get () {
                return this.defaultItemData
            },
            set (value) {
                console.log(value);
            }
        },
        addSupplierTemplate() {
            let { company_name, address, phone, emails } = this.editedItem

            return {
                custom_customers_id: [(typeof this.getUser=='string') ? JSON.parse(this.getUser).customer.id : ''],
                company_name, 
                address, 
                phone, 
                emails
            }
        },
        optionsFiltered: {
            get() {
                let validEmailAddress = []

                if (this.editedItem.emails !== null && this.editedItem.emails.length > 0) {                    
                    this.editedItem.emails.map(wea => {
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
    },
    methods: {
        ...mapActions({
            createSuppliers: 'suppliers/createSuppliers',
            fetchSuppliers: 'suppliers/fetchSuppliers',
            updateSuppliers: 'suppliers/updateSuppliers'
        }),
        ...globalMethods,
        generateErrorMessage() {
            this.tagsInput.hasError = (this.options.length > 0) ? false : true
            if (this.tagsInput.hasError)
                jQuery('.ti-input').addClass('ti-new-tag-input-error')
            else
                jQuery('.ti-input').removeClass('ti-new-tag-input-error')
        },
        onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
        close() {
            this.$refs.form.resetValidation()
            this.$emit('update:dialogData', false)
        },
        async save() {
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

                            if (this.editedIndexData === -1) {
                                let finalEmailAddress = (this.options.length > 0) ? this.options.map(o => {
                                    return o.text
                                }) : []

                                let addSupplierTemplate = this.addSupplierTemplate
                                addSupplierTemplate.emails = finalEmailAddress

                                await this.createSuppliers(this.addSupplierTemplate)
                                
                                this.notificationMessage('Supplier has been created.')
                                await this.fetchSuppliers()

                                //close dialog
                                this.close()
                                this.editedIndexData = -1
                            } else {
                                let finalEmailAddress = (this.options.length > 0) ? this.options.map(o => {
                                    return o.text
                                }) : []

                                const { custom_customers_id, ...newSupplierTemplate } = this.addSupplierTemplate
                                newSupplierTemplate.id = this.editedItem.id
                                newSupplierTemplate.emails = finalEmailAddress

                                await this.updateSuppliers(newSupplierTemplate)
                                console.log(custom_customers_id)
                                this.notificationMessage('Supplier has been updated.')
                                await this.fetchSuppliers()

                                // close dialog
                                this.close()
                            }
                        } catch (e) {
                            this.notificationError(e)
                            console.log(e)
                        }
                    }
                    
                } 
            }, 200)               
        },
        async saveAndAddSupplier() {
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

                            if (this.editedIndexData === -1) {
                                let finalEmailAddress = (this.options.length > 0) ? this.options.map(o => {
                                    return o.text
                                }) : []

                                this.addSupplierTemplate.customerMethod = 'save-add'
                                this.addSupplierTemplate.emails = finalEmailAddress
                                await this.createSuppliers(this.addSupplierTemplate)
                                

                                await this.fetchSuppliers()                    
                                this.setToDefault()

                                this.notificationMessage('Supplier has been created.')
                            }
                        } catch(e) {
                            this.notificationError(e)
                            console.log(e)
                        }
                    }
                    
                }
             }, 200)

            
        },
        setToDefault() {
            this.$emit('setToDefault')
            this.tagsInput.touched = false
            this.options = []
        }
    },
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
                    if (this.editedItem.emails !== null && this.editedItem.emails.length > 0) {
                        
                        this.editedItem.emails.map(wea => {
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
    updated() {
        if (this.editedIndexData === -1) {
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
@import '../../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../../assets/scss/pages_scss/supplier/supplierAddDialog.scss';

.v-autocomplete__content.v-menu__content {
    border-radius: 4px !important;
}
</style>
