<template>
    <v-dialog v-model="dialog" max-width="880px" content-class="view-warehouse" @click:outside="close" :retain-focus="false">
        <v-card class="dialog-wrapper">
            <v-card-title>
                <span class="headline">
                    <span class="warehouse-title"> {{ viewWarehouseData !== null ? viewWarehouseData.name : '' }} </span>
                    <span class="warehouse-type ml-2"> 
                        {{ viewWarehouseData !== null ? getWarehouseType(viewWarehouseData.warehouse_type) : ''}} 
                    </span>
                </span>

                <div class="header-actions">
                    <button icon dark class="btn-close" @click="close">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </div>
            </v-card-title>

            <v-card-text>
                <div class="view-box-wrapper">
                    <div class="row">
                        <div class="col-sm-6 first-col">
                            <div class="box big">
                                <div class="box-info">
                                    <div class="box-title">Country</div>
                                    <div class="box-data">{{ viewWarehouseData !== null ? viewWarehouseData.country : ''}}</div>
                                </div>

                                <div class="box-info">
                                    <div class="box-title">State</div>
                                    <div class="box-data">{{ viewWarehouseData !== null ? viewWarehouseData.state : ''}}</div>
                                </div>

                                <div class="box-info">
                                    <div class="box-title">City</div>
                                    <div class="box-data">{{ viewWarehouseData !== null ? viewWarehouseData.city : ''}}</div>
                                </div>

                                <div class="box-info">
                                    <div class="box-title">Address</div>
                                    <div class="box-data">{{ viewWarehouseData !== null ? viewWarehouseData.address : ''}}</div>
                                </div>

                                <div class="box-info">
                                    <div class="box-title">Zipcode</div>
                                    <div class="box-data">{{ viewWarehouseData !== null ? viewWarehouseData.zipcode : ''}}</div>
                                </div>

                                <div class="box-info">
                                    <div class="box-title">Phone</div>
                                    <div class="box-data">{{ viewWarehouseData !== null ? viewWarehouseData.phone : ''}}</div>
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-6 second-col">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="box small">
                                        <div class="box-info-next">
                                            <div class="box-title">Cartons</div>
                                            <div class="box-data">
                                                {{ viewWarehouseData !== null ? viewWarehouseData.total_cartons : ''}}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="box small">
                                        <div class="box-info-next">
                                            <div class="box-title">Units</div>
                                            <div class="box-data">
                                                {{ viewWarehouseData !== null ? viewWarehouseData.total_units : ''}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="box small">
                                        <div class="box-info-next">
                                            <div class="box-title">Products</div>
                                            <div class="box-data">
                                                {{ viewWarehouseData !== null ? viewWarehouseData.total_products : ''}}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="box small">
                                        <div class="box-info-next">
                                            <div class="box-title">Last Updated</div>
                                            <div class="box-data">
                                                {{ viewWarehouseData !== null ? getDateFormat(viewWarehouseData.updated_at) : ''}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-card-text>

            <v-card-actions>
                <v-btn class="btn-blue" text @click="editItem(viewWarehouseData)">
                    <span>Edit</span>
                </v-btn>
                <v-btn class="btn-white" text @click="deleteItem(viewWarehouseData)">
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment' 

export default {
    name: 'ViewWarehouse',
    props: ['dialogView', 'selectedWarehouse', 'editedItemWarehouse', 
            'dialogDataWarehouse', 'dialogEdit', 'editedIndexWarehouse', 
            'dialogWarehouseDelete', 'viewWarehouseData'],
    components: {
    },
    data: () => ({}),
    computed: {
        ...mapGetters({
            getWarehouseDeleteLoading: 'warehouse/getWarehouseDeleteLoading',
            getActiveId: 'warehouse/getActiveId'
        }),
        dialog: {
            get () {
                return this.dialogView
            },
            set (value) {
                if (!value) {
                    this.$emit('update:dialogView', false)
                } else {
                    this.$emit('update:dialogView', true)
                }
            }
        },
        dialogDelete: {
            get() {
                return this.dialogWarehouseDelete
            }, 
            set(value) {
                if (!value) {
                    this.$emit('update:dialogWarehouseDelete', false)
                } else {
                    this.$emit('update:dialogWarehouseDelete', true)
                }
            }
        }
    },
    methods: {
        deleteItem(warehouse) {
            this.$emit('deleteWarehouse', warehouse)
        },
        deleteItemConfirm() {
            this.$emit('deleteWarehouseConfirm', this.viewWarehouseData)
        },
        editItem(warehouse) {
            this.$emit('update:editedIndexWarehouse', 1)
            this.$emit('editWarehouse', warehouse)
            this.$emit('closeViewWarehouse')
        },
        getWarehouseType(data) {
            if (data !== null) {
                if (data == 'own' || data == 'Own') {
                    return 'Own Facility'
                } else {
                    return '3PL'
                }
            }
        },
        getDateFormat(date) {
            if (date !== null) {
                return moment(date).format('MM/DD/YYYY');
            } else {
                return ''
            }
        },
        close() {
            this.$emit('closeViewWarehouse')
        },
        closeDelete() {
            this.$emit('update:dialogWarehouseDelete', false)
        }
    },
    updated() {}
}
</script>

<style>
@import '../../assets/css/warehouse_styles/viewWarehouse.css';
</style>