<template>
    <v-dialog v-model="dialogView" max-width="880px" content-class="view-warehouse" @click:outside="close" :retain-focus="false">
        <v-card class="dialog-wrapper">
            <v-card-title>
                <span class="headline">
                    <span class="warehouse-title"> 
                        {{  currentWarehouse !== null && 
                            currentWarehouse.name !== "" && 
                            currentWarehouse.name !== null 
                            ? currentWarehouse.name : '--'
                        }}
                    </span>
                    <span class="warehouse-type ml-2"> 
                        {{  currentWarehouse !== null && 
                            getWarehouseType(currentWarehouse.warehouse_type) !== "" && 
                            getWarehouseType(currentWarehouse.warehouse_type) !== null 
                            ? getWarehouseType(currentWarehouse.warehouse_type) : '--'
                        }}
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
                                    <div class="box-data">
                                        {{  currentWarehouse !== null && 
                                            currentWarehouse.country !== "" && 
                                            currentWarehouse.country !== null 
                                            ? currentWarehouse.country : '--'
                                        }}
                                    </div>
                                </div>

                                <div class="box-info">
                                    <div class="box-title">State</div>
                                    <div class="box-data">
                                        {{  currentWarehouse !== null && 
                                            currentWarehouse.state !== "" && 
                                            currentWarehouse.state !== null 
                                            ? currentWarehouse.state : '--'
                                        }}
                                    </div>
                                </div>

                                <div class="box-info">
                                    <div class="box-title">City</div>
                                    <div class="box-data">
                                        {{  currentWarehouse !== null && 
                                            currentWarehouse.city !== "" && 
                                            currentWarehouse.city !== null 
                                            ? currentWarehouse.city : '--'
                                        }}
                                    </div>
                                </div>

                                <div class="box-info">
                                    <div class="box-title">Address</div>
                                    <div class="box-data">
                                        {{  currentWarehouse !== null && 
                                            currentWarehouse.address !== "" && 
                                            currentWarehouse.address !== null 
                                            ? currentWarehouse.address : '--'
                                        }}
                                    </div>
                                </div>

                                <div class="box-info">
                                    <div class="box-title">Zipcode</div>
                                    <div class="box-data">
                                        {{  currentWarehouse !== null && 
                                            currentWarehouse.zipcode !== "" && 
                                            currentWarehouse.zipcode !== null 
                                            ? currentWarehouse.zipcode : '--'
                                        }}
                                    </div>
                                </div>

                                <div class="box-info">
                                    <div class="box-title">Phone</div>
                                    <div class="box-data">
                                        {{  currentWarehouse !== null && 
                                            currentWarehouse.phone !== "" && 
                                            currentWarehouse.phone !== null 
                                            ? currentWarehouse.phone : '--'
                                        }}
                                    </div>
                                </div>

                                <!-- <div class="box-info">
                                    <div class="box-title">Email</div>
                                    <div class="box-data">
                                        {{  currentWarehouse !== null && 
                                            currentWarehouse.warehouse_emails !== "" && 
                                            currentWarehouse.warehouse_emails !== null &&
                                            currentWarehouse.warehouse_emails.length !== 'undefined' && 
                                            currentWarehouse.warehouse_emails.length !== 0 
                                            ? currentWarehouse.warehouse_emails : '--'
                                        }}
                                    </div>
                                </div> -->
                            </div>
                        </div>

                        <div class="col-sm-6 second-col">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="box small">
                                        <div class="box-info-next">
                                            <div class="box-title">Cartons</div>
                                            <div class="box-data">
                                                {{  currentWarehouse !== null && 
                                                    currentWarehouse.total_cartons !== "" && 
                                                    currentWarehouse.total_cartons !== null 
                                                    ? currentWarehouse.total_cartons : '--'
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="box small">
                                        <div class="box-info-next">
                                            <div class="box-title">Units</div>
                                            <div class="box-data">
                                                {{  currentWarehouse !== null && 
                                                    currentWarehouse.total_units !== "" && 
                                                    currentWarehouse.total_units !== null 
                                                    ? currentWarehouse.total_units : '--'
                                                }}
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
                                                {{  currentWarehouse !== null && 
                                                    currentWarehouse.total_products !== "" && 
                                                    currentWarehouse.total_products !== null 
                                                    ? currentWarehouse.total_products : '--'
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="box small">
                                        <div class="box-info-next">
                                            <div class="box-title">Last Updated</div>
                                            <div class="box-data">
                                                {{  currentWarehouse !== null && 
                                                    getDateFormat(currentWarehouse.updated_at) !== "" && 
                                                    getDateFormat(currentWarehouse.updated_at) !== null 
                                                    ? getDateFormat(currentWarehouse.updated_at) : '--'
                                                }}
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
                <v-btn class="btn-blue" text @click="editItem(currentWarehouse)">
                    <span>Edit</span>
                </v-btn>
                <v-btn class="btn-white" text @click="deleteItem(currentWarehouse)">
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
    name: 'WarehouseViewDialog',
    props: ['dialog', 'currentWarehouse', 'editedIndex'],
    components: {
    },
    data: () => ({}),
    computed: {
        ...mapGetters({
            getWarehouseDeleteLoading: 'warehouse/getWarehouseDeleteLoading',
            getActiveId: 'warehouse/getActiveId'
        }),
        dialogView: {
            get () {
                return this.dialog
            },
            set (value) {
                this.$emit('update:dialog', value)
            }
        },
    },
    methods: {
        deleteItem(warehouse) {
            this.$emit('deleteWarehouse', warehouse)
        },
        editItem(warehouse) {
            this.$emit('update:editedIndex', 1)
            this.$emit('editWarehouse', warehouse)
            this.close()
        },
        getWarehouseType(data) {
            if (data !== null) {
                if (data == 'own' || data == 'Own') {
                    return 'Own Facility'
                } else {
                    return '3PL'
                }
            } else {
                return ''
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
            this.$emit('close')
        },
        closeDelete() {
            this.$emit('closeDelete')
        }
    },
    updated() {}
}
</script>

<style lang="scss">
/* @import '../../assets/css/warehouse_styles/viewWarehouse.css'; */
@import '../../../assets/scss/pages_scss/warehouse/viewWarehouse.scss';
</style>
