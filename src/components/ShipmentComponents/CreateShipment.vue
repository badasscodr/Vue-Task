<template>
    <v-dialog v-model="dialog" max-width="800px" content-class="create-shipment" v-resize="onResize">
        <template v-slot:activator="{ on, attrs }">
            <div class="create-shipment-button">
                <v-btn color="#039DDC" dark class="custom-button" v-bind="attrs" v-on="on" >
                    Create Shipment
                </v-btn>
            </div>
        </template>

        <v-card class="create-shipment-card">
            <v-card-title>
                <span class="headline">{{ formTitle }}</span>

                <button icon dark class="btn-close" @click="close">
                    <v-icon>mdi-close</v-icon>
                </button>
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="12" md="12">
                        <div class="create-shipment-information">
                            <p>Shifl will contact the supplier to create the booking. You will receive an email with the booking information, scheduling options and quote for approval prior to shipping.</p>
                        </div>
                    </v-col>
                </v-row>

                <div class="create-shipment-suppliers" v-for="(item, index) in supplierLists" :key="index">
                    <div class="header-title">
                        <h3>Supplier {{ index + 1 }}</h3>
                    
                        <v-btn
                            v-show="index > 0"
                            icon
                            class="btn remove-btn"
                            @click="removeSupplier(item)">
                            <img src="../../assets/icons/deleteIcon.svg" alt="" width="20px" height="20px">
                        </v-btn>
                    </div>

                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <label class="text-item-label">Supplier</label>
                            <vueSelect 
                                class="v-text-fields v-single select"
                                placeholder="Select Supplier"
                                :options="paginated"
                                v-model="item.supplier"   
                                @open="onOpen"
                                @close="onClose"
                                @search="query => search = query"
                                label="name"                             
                                @input="changedLabel(item.supplier)">

                                <template slot="option" slot-scope="option">
                                    <span v-if="option.name == 'New Supplier'">
                                        <v-icon>mdi-plus</v-icon>
                                        {{ option.name }}
                                    </span>

                                    <span v-else>
                                        <p>{{ option.name }}</p>
                                        <small>{{ option.address }}</small>
                                    </span>
                                </template>

                            </vueSelect>

                            <AddNewSupplier 
                                :dialogData.sync="dialogAddNewSupplier"/>
                        </v-col>                    

                        <v-col cols="12" sm="6" md="6">
                            <label class="text-item-label">PO #</label>
                            <vueSelect 
                                class="v-text-fields v-multiple select"
                                taggable
                                push-tags
                                multiple
                                placeholder="Enter PO numbers"
                                :options="options"
                                v-model="item.po_nums" />
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                            <label class="text-item-label">CMB <span class="label-optional">(Optional)</span></label>
                            <v-text-field 
                                placeholder="Enter CBM" 
                                outlined 
                                class="text-fields"
                                v-model="item.cmb">
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                            <label class="text-item-label">Commodity <span class="label-optional">(Optional)</span></label>
                            <v-text-field 
                                placeholder="Type Commodity Description" 
                                outlined 
                                class="text-fields"
                                v-model="item.commodity">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </div>

                <v-row>
                    <v-col cols="12" sm="12" class="pt-0">
                        <v-btn class="add-supplier btn-white" text @click="addSupplier">
                            + Add Supplier
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-btn class="btn-blue" text @click="close">
                    Create Shipment
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
import AddNewSupplier from './AddNewSupplier.vue'
import vSelect from 'vue-select'
import "vue-select/src/scss/vue-select.scss";

export default {
    name: 'CreateShipment',
    props: ['editedItemData','editedIndexData', 'dialogData'],
    components: {
        AddNewSupplier,
        vueSelect: vSelect
    },
    data: () => ({
        supplierLists: [
            {
                supplier: '',
                po_nums: [],
                cmb: '',
                commodity: ''
            }
        ],
        supplierOptionLists: [
            {
                icon: 'fa-plus',
                name: 'New Supplier',
                address: ''
            },
            {
                name: 'Massive Dynamics',
                address: '2464 Royal Ln. Mesa, New Jersey 45463'
            },
            {
                name: 'Applied Materials',
                address: '4140 Parker Rd. Allentown, New Mexico 31134'
            },
            {
                name: 'Graybar Electric',
                address: '2972 Westheimer Rd. Santa Ana, Illinois 85486'
            },
            {
                name: 'Electric',
                address: '2972 Westheimer Rd. Santa Ana, Illinois 85486'
            }
        ],
        options: [],
        value: [],
        counter: 1,
        dialogAddNewSupplier: false,
        observer: null,
        limit: 10,
        search: '',
        isMobile: false
    }),
    computed: {
        formTitle () {
            return this.editedIndexData === -1 ? 'Create Shipment' : 'Edit Shipment'
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
        filtered () {
            return this.supplierOptionLists
        },
        paginated () {
            return this.filtered.slice(0, this.limit)
        },
        hasNextPage () {
            return this.paginated.length < this.filtered.length
        },
    },
    mounted() {
        this.observer = new IntersectionObserver(this.infiniteScroll)
    },
    methods: {
        async infiniteScroll ([{isIntersecting, target}]) {
            if (isIntersecting) {
                const ul = target.offsetParent
                const scrollTop = target.offsetParent.scrollTop
                this.limit += 10
                await this.$nextTick()
                ul.scrollTop = scrollTop
            }
        },
        async onOpen () {
            if (this.hasNextPage) {
                await this.$nextTick()
                this.observer.observe(this.$refs.load)
            }
        },
        onClose () {
            this.observer.disconnect()
        },
        close() {
            this.$emit('update:dialogData', false)
        },
        addSupplier() {
            this.counter++
            this.supplierLists.push({
                supplier: '',
                po_nums: [],
                cmb: '',
                commodity: ''
            });
        },
        removeSupplier(index) {
            this.counter--
            this.supplierLists.splice(index, 1)
        },
        changedLabel(supplier) {
            if (supplier.name == 'New Supplier') {
                this.dialogAddNewSupplier = true
            }
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
    box-shadow: none !important;
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

@media screen and (max-width: 767px) {
    .v-dialog.create-shipment {
        margin: 0;
        height: 100%;
        max-height: 100%;
        background-color: #fff;
    }

    .v-dialog.create-shipment .create-shipment-card {
        /* height: 100%; */
        box-shadow: none;
    }
}
</style>
