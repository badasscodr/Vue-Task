<template>
	<div class="shipment-info milestone-container-wrapper">
		<v-container fluid class="cont-fluid-wrapper" 
            v-if="getDetails.containers !== 'undefined' && 
                  getDetails.containers !== null && 
                  getDetails.containers.length > 0">

            <h3 class="container-title">Containers</h3>
            
            <div class="container-grid" v-if="!isMobile">            
                <v-data-table
                    :page.sync="page"
                    :headers="containerHeader"
                    :items="itemsWithIndex"
                    :items-per-page="itemsPerPage"
                    hide-default-footer
                    class="elevation-1 container-table">

                    <template v-slot:[`item.size`]="{ item }">
                        <span>{{ getContainerSizes(item.size) }}</span>
                    </template>

                    <template v-slot:[`item.cbm`]="{ item }">
                        <span>{{ item.cbm }} CBM</span>
                    </template>

                    <template v-slot:[`item.kg`]="{ item }">
                        <span>{{ item.kg }} KG</span>
                    </template>
                </v-data-table>
            </div>

            <div class="container-grid-mobile" v-if="isMobile">
                <div class="container-items-mobile" v-for="(item, index) in getDetails.containers" :key="index">
                    <div class="ribbon-container" v-if="getDetails.containers.length > 0">
                        {{ getDetails.containers.length > 9 
                            ? `${index + 1}` 
                            : `0${index + 1}`
                        }}
                    </div>

                    <div class="container-data-wrapper">
                        <h3 class="supplier-name" style="margin-bottom: 10px; margin-right: 15%;" v-if="item.container_num !== 'undefined'"> 
                            {{ item.container_num !== 'undefined' ? item.container_num : "Not specified" }} 
                        </h3>

                        <v-row style="margin-top: 0">
                            <div class="container-data" v-if="item.size !== 'undefined' && item.size !== null && item.size !== 0">
                                <p class="heading">SIZE</p>
                                <p class="heading-content">
                                    {{ getContainerSizes(item.size) }}
                                </p>
                            </div>
                            <div class="container-data" v-if="item.cbm !== 'undefined' && item.cbm !== null">
                                <p class="heading">Volume</p>
                                <p class="heading-content">
                                    {{ item.cbm + ' CBM' }}
                                </p>
                            </div>
                            <div class="container-data" v-if="item.kg !== 'undefined' && item.kg !== null">
                                <p class="heading">Weight</p>
                                <p class="heading-content">
                                    {{ item.kg + ' KG' }}
                                </p>
                            </div>
                            <div class="container-data" v-if="item.cartons !== 'undefined' && item.cartons !== null ">
                                <p class="heading">Carton Count</p>
                                <p class="heading-content">
                                    {{ item.cartons }}
                                </p>
                            </div>
                        </v-row>
                    </div>
                </div>
            </div>
        </v-container>
	</div>
</template>

<script>
import { mapActions } from "vuex";
import _ from 'lodash'

export default {
	props: ['getDetails', 'isMobile', 'getShipmentContainerSizes'],
	data: () => ({
		page: 1,
        pageCount: 0,
        itemsPerPage: 35,
		items: [],
        container_sizes: [],
        containerHeader: [
            {
                text: "#SL",
                align: "start",
                sortable: false,
                value: "index",
                width: "6%", 
                fixed: true
            },
            {
                text: "NUMBER",
                value: "container_num",
                align: "start",
                sortable: false,
                width: "25%", 
                fixed: true
            },
            {
                text: "SIZE",
                value: "size",
                align: "right",
                sortable: false,
                width: "15%", 
                fixed: true
            },
            {
                text: "VOLUME",
                value: "cbm",
                align: "right",
                sortable: false,
                width: "18%", 
                fixed: true
            },
            {
                text: "WEIGHT",
                value: "kg",
                align: 'right',
                sortable: false,
                width: "18%", 
                fixed: true
            },
            {
                text: "CARTON COUNT",
                value: "cartons",
                align: 'right',
                sortable: false,
                width: "18%", 
                fixed: true
            },
        ],
	}),
	methods:{
		...mapActions(["fetchTerms", "fetchContainers"]),
		getContainerSizes(id) {
            if(id) {
                let findSizeValue = _.find(this.container_sizes, (e) => (e.id == id))

                if (typeof findSizeValue !== 'undefined') {
                    if (findSizeValue.name !== 'undefined') {
                        return findSizeValue.name
                    }
                } else {
                    return ''
                }
            }
        }
    },
    async mounted() {
		this.items = this.getDetails.containers	   
		
		// get all container values
        try {          
            await this.fetchContainers()
            if (this.getShipmentContainerSizes !== 'undefined' && this.getShipmentContainerSizes.length > 0) {
                this.getShipmentContainerSizes.map((value) => {
                    this.container_sizes.push({ 
                        id: value.id,
                        name: value.name
                    })
                })
            }

        } catch(e) {
            console.log(e)
        }

        //set current page
        this.$store.dispatch("page/setPage", "shipments")
    },
    created() {},
    computed: {
        // ...mapGetters(["getShipmentTerms", "getShipmentContainerSizes"]),
        itemsWithIndex() {
            return this.items.map((items, index) => ({
                ...items,
                index: index >= 9 ? index + 1 : `0${index + 1}`
            }))
        }
    },
}
</script>

<style lang="scss">
/* @import '../assets/css/shipments_styles/shipmentInfo.css'; */
@import '../assets/scss/pages_scss/shipment/shipmentContainers.scss';
</style>
