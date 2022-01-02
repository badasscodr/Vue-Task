<template>
    <div class="shipment-info supplier-wrapper" v-if="getDetails.shipment_suppliers !== 'undefined' && getDetails.shipment_suppliers !== null && getDetails.shipment_suppliers.length > 0">
        <v-divider class="shipment-info-divider"></v-divider>
        
        <v-container fluid class="cont-fluid-wrapper">
            <h3 class="supplier-title">Suppliers</h3>
            
            <v-card class="customCard" v-for="(item, index) in getDetails.shipment_suppliers" :key="index">              
                <div class="ribbon" v-if="getDetails.shipment_suppliers.length > 0"> 
                    {{ getDetails.shipment_suppliers.length > 9
                        ? `${index + 1}` 
                        : `0${index + 1}`
                    }} 
                </div>

                <v-container class="container-wrapper">
                    <v-row style="margin:0px; margin-right: 15%;">
                        <h3 class="supplier-name">
                            {{ item.supplier_name }}
                        </h3>
                    </v-row>

                    <div class="po-wrapper">
                        <span class="po-num-item" v-if="item.po_num !== ''">
                            {{ 'PO #' + item.po_num }}
                        </span>
                    </div>

                    <v-row v-if="!isMobile" class="supplier-desktop-row">
                        <div class="col-sm-2 col-md-2 supplier-col" v-if="item.total_cartons !== 'undefined' && item.total_cartons !== null">
                            <p class="heading-supplier">Total Cartons</p>
                            <p class="heading-content">
                                {{ item.total_cartons }}
                            </p>
                        </div>

                        <div class="col-sm-12 col-md-2 supplier-col" v-if="item.cbm !== 'undefined' && item.cbm !== null">
                            <p class="heading-supplier">Volume</p>
                            <p class="heading-content">
                                {{ item.cbm }}
                            </p>
                        </div>

                        <div class="col-sm-12 col-md-2 supplier-col" v-if="item.kg !== 'undefined' && item.kg !== null">
                            <p class="heading-supplier">Weight</p>
                            <p class="heading-content">
                                {{ item.kg }}
                            </p>
                        </div>

                        <div class="col-sm-12 col-md-3 supplier-col" v-if="item.ams_num !== 'undefined' && item.ams_num !== null && item.ams_num !== ''">
                            <p class="heading-supplier">AMS</p>
                            <p class="heading-content">
                                {{ item.ams_num }}
                            </p>
                        </div>

                        <div class="col-sm-12 col-md-3 supplier-col" v-if="item.hbl_num !== 'undefined' && item.hbl_num !== null">
                            <p class="heading-supplier">HBL</p>
                            <p class="heading-content">
                                {{ item.hbl_num }}
                            </p>
                        </div>

                        <div class="col-sm-12 col-md-2 supplier-col" v-if="item.incoterm_id !== 'undefined' && item.incoterm_id !== null">
                            <p class="heading-supplier">Terms</p>
                            <p class="heading-content">
                                {{ getSupplierTerms(item.incoterm_id) }}
                            </p>
                        </div>

                        <div class="col-sm-12 col-md-2 supplier-col" v-if="item.bl_status !== 'undefined' && item.bl_status !== null">
                            <p class="heading-supplier">BL Status</p>
                            <p class="heading-content" style="color: #0171A1 !important;">
                                {{ item.bl_status }}
                            </p>
                        </div>

                        <div class="col-sm-12 col-md-3 supplier-col" v-if="shipment_status == 'Pending Approval'">
                            <p class="heading-supplier">Cargo Ready Date</p>
                            <p class="heading-content">
                                {{ date(item.cargo_ready_date) }}
                            </p>
                        </div>

                        <div class="col-sm-12 col-md-8 supplier-col" v-if="item.product_description !== 'undefined' && item.product_description !== null">
                            <p class="heading-supplier">Product Description</p>
                            <p class="heading-content">
                                {{ item.product_description }}
                            </p>
                        </div>
                    </v-row>

                    <v-row v-if="isMobile" :style="item.po_num !== '' ? 'padding: 10px 0 15px;' : 'padding: 0 0 15px;'">
                        <div class="mobile-supplier-info-wrapper" v-if="(item.total_cartons !== 'undefined' && item.total_cartons !== null) || (item.cbm !== 'undefined' && item.cbm !== null)" >
                            <div class="mobile-supplier-info" v-if="item.total_cartons !== 'undefined' && item.total_cartons !== null">
                                <p class="heading-supplier">Total Cartons</p>
                                <p class="heading-content">
                                    {{ item.total_cartons }}
                                </p>
                            </div>

                            <div class="mobile-supplier-info" v-if="item.cbm !== 'undefined' && item.cbm !== null">
                                <p class="heading-supplier">Volume</p>
                                <p class="heading-content">
                                    {{ item.cbm }}
                                </p>
                            </div>
                        </div>

                        <div class="mobile-supplier-info-wrapper" v-if="(item.kg !== 'undefined' && item.kg !== null) || (item.ams_num !== 'undefined' && item.ams_num !== null && item.ams_num !== '')">
                            <div class="mobile-supplier-info" v-if="item.kg !== 'undefined' && item.kg !== null">
                                <p class="heading-supplier">Weight</p>
                                <p class="heading-content">
                                    {{ item.kg }}
                                </p>
                            </div>

                            <div class="mobile-supplier-info" v-if="item.ams_num !== 'undefined' && item.ams_num !== null && item.ams_num !== ''">
                                <p class="heading-supplier">AMS</p>
                                <p class="heading-content">
                                    {{ item.ams_num }}
                                </p>
                            </div>
                        </div>

                        <div class="mobile-supplier-info-wrapper">
                            <div class="mobile-supplier-info" v-if="item.hbl_num !== 'undefined' && item.hbl_num !== null">
                                <p class="heading-supplier">HBL</p>
                                <p class="heading-content">
                                    {{ item.hbl_num }}
                                </p>
                            </div>

                            <div class="mobile-supplier-info" v-if="item.incoterm_id !== 'undefined' && item.incoterm_id !== null">
                                <p class="heading-supplier">Terms</p>
                                <p class="heading-content">
                                    {{ getSupplierTerms(item.incoterm_id) }}
                                </p>
                            </div>
                        </div>

                        <div class="mobile-supplier-info-wrapper">
                            <div class="mobile-supplier-full" v-if="item.bl_status !== 'undefined' && item.bl_status !== null">
                                <p class="heading-supplier">BL Status</p>
                                <p class="heading-content" style="color: #0171A1 !important;">
                                    {{ item.bl_status }}
                                </p>
                            </div>
                        </div>

                        <div class="mobile-supplier-info-wrapper">
                            <div class="mobile-supplier-full" v-if="item.product_description !== 'undefined' && item.product_description !== null">
                                <p class="heading-supplier">Product Description</p>
                                <p class="heading-content-desc">
                                    {{ item.product_description }}
                                </p>
                            </div>
                        </div>                                    

                        <div class="mobile-supplier-info-wrapper" v-if="shipment_status == 'Pending Approval'">
                            <div class="mobile-supplier-full">
                                <p class="heading-supplier">Cargo Ready Date</p>
                                <p class="heading-content-desc">
                                    {{ date(item.cargo_ready_date) }}
                                </p>
                            </div>
                        </div>
                    </v-row>
                </v-container>
            </v-card>         
        </v-container>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import _ from 'lodash'
import moment from 'moment'

export default {
    name: 'ShipmentSupplier',
    props: ['getDetails', 'isMobile', "shipment_status", "getShipmentTerms"],
    data: () => ({
        incoterms: []
    }),
    async mounted() {
        // get all terms
        try {
            await this.fetchTerms()
            if (this.getShipmentTerms !== 'undefined' && this.getShipmentTerms.length > 0) {
                this.getShipmentTerms.map((value) => {
                    this.incoterms.push({ 
                        id: value.id,
                        name: value.name
                    })
                })
            }
        } catch(e) {
            console.log(e)
        }
    },
    methods:{ 
        ...mapActions(["fetchTerms"]),
        getSupplierTerms(id) {
            if(id) {
                let findTerm = _.find(this.incoterms, (e) => (e.id == id))

                if (typeof findTerm !== 'undefined') {
                    if (findTerm.name !== 'undefined') {
                        return findTerm.name
                    }
                } else {
                    return ''
                }
            }
        },
        date(date) {
            return moment(date).format('MM/DD/YYYY');
        }
    },
    computed: {
        // ...mapGetters(["getShipmentTerms"])
    },
}
</script>

<style>
@import '../assets/css/shipments_styles/shipmentInfo.css';
</style>
