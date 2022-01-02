<template>
    <v-dialog v-model="dialog" max-width="560px" content-class="create-shipment" v-resize="onResize">
        <v-card class="create-shipment-card">
            <v-card-title>
                <span class="headline">Add Supplier</span>

                <button icon dark class="btn-close" @click="close">
                    <v-icon>mdi-close</v-icon>
                </button>
            </v-card-title>

            <v-card-text class="mt-5">
               <v-row>
                    <v-col cols="12" sm="12" md="12" class="pb-0">
                        <label class="text-item-label">Name</label>
                        <v-text-field 
                            placeholder="Type name of the supplier" 
                            outlined 
                            class="text-fields">
                        </v-text-field>
                    </v-col>                    

                    <v-col cols="12" sm="12" md="12" class="pb-0">
                        <label class="text-item-label">Phone</label>
                        <VueTelInput 
                            defaultCountry="us"
                            :dropdownOptions="telInputOptions"
                            placeholder="Enter" />
                    </v-col>

                    <v-col cols="12" sm="12" md="12" class="pb-0">
                        <label class="text-item-label">Address</label>
                        <v-textarea
                            height="76px"
                            class="text-fields"
                            outlined
                            name="input-7-4"
                            placeholder="Type the full address of the supplier" >
                        </v-textarea>
                    </v-col>

                    <v-col cols="12" sm="12" md="12">
                        <label class="text-item-label">Email</label>
                        <v-textarea
                            height="76px"
                            class="text-fields"
                            outlined
                            name="input-7-4"
                            placeholder="e.g. name@email.com">
                        </v-textarea>

                        <span style="color: #819FB2; font-size: 12px;">Separate multiple email addresses with comma</span>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-btn class="btn-blue" text @click="close">
                    Add Supplier    
                </v-btn>
                <v-btn class="btn-white" text @click="close">
                    Save & Add Another
                </v-btn>
                <v-btn class="btn-white" text @click="close" v-if="!isMobile">
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/dist/vue-tel-input.css'

export default {
    name: 'AddNewSupplier',
    props: ['editedItemData','editedIndexData', 'dialogData'],
    components: {
        VueTelInput
    },
    data: () => ({
        telInputOptions: {
            showDialCodeInSelection: true,
            showFlags: true
        },
        isMobile: false
    }),
    computed: {
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
        }
    },
    mounted() {
        
    },
    methods: {
        close() {
            this.$emit('update:dialogData', false)
        },
        onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
    },
    updated() {
        // console.log(this.supplierLists);
    }
}
</script>

<style>
@import '../../assets/css/dialog_styles/dialogHeader.css';
@import '../../assets/css/dialog_styles/dialogBody.css';
@import '../../assets/css/dialog_styles/dialogFooter.css';

.create-shipment-button {
    padding: 0 15px;
}

.create-shipment-button .custom-button {
    height: 40px !important;
    margin-bottom: 0 !important;
    letter-spacing: 0;
    text-transform: capitalize;
    background-color: #0171A1 !important;
    font-size: 14px;
    padding: 10px 20px;
    border-radius: 4px;
}

.create-shipment .create-shipment-card .create-shipment-information {
    padding: 24px 0px 15px;
}

.create-shipment .create-shipment-card .create-shipment-information p {
    margin-bottom: 0;
    color: #6D858F;
    font-size: 12px;
}

.create-shipment .create-shipment-card .create-shipment-suppliers {
    margin-bottom: 20px;
}

.create-shipment .create-shipment-card .create-shipment-suppliers .header-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.create-shipment .create-shipment-card .create-shipment-suppliers .header-title h3 {
    position: relative;
    z-index: 1;
    overflow: hidden;
    margin-bottom: 0;
    color: #4A4A4A;
    width: 100%;
}

.create-shipment .create-shipment-card .create-shipment-suppliers .header-title h3:after {
    position: absolute;
    top: 50%;
    overflow: hidden;
    width: 100%;
    height: 1.5px;
    content: '\a0';
    background-color: #E1ECF0;
    margin-left: 10px;
}

.create-shipment .add-supplier {
    background-color: #fff;
	border: 1px solid #B4CFE0;
    color: #0171A1 !important;
    padding: 10px 16px !important;
    font-size: 14px;
    height: 40px;
    font-family: 'Inter-Medium', sans-serif;
    text-transform: capitalize;
    letter-spacing: 0;
}
</style>
