<template>
    <div id="documents" v-resize="onResize">
        <div class="download-wrapper">
            <span v-if="selected.length !== 0">
                <v-btn @click="downloadDocuments()"> 
                    <img src="../assets/icons/download.svg" alt="">
                    Download ({{ selected.length }}) 
                </v-btn>
            </span>
        </div>

        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="documents"
            :single-select="singleSelect"
            item-key="name"
            :items-per-page="itemsPerPage"
            show-select
            class="elevation-1 documents-table"
            hide-default-footer >

            <template v-slot:body='{ items }'>
                <tbody v-if="!isMobile && items.length > 0">
                    <tr v-for="item in items" :key="item.name">
                        <td>
                            <v-checkbox v-model="selected" :value="item" style="margin:0px;padding:0px"
                                hide-details class="body-checkbox" />
                        </td>
                        <td class="img-docu"> <img src="../assets/images/document.svg" alt=""> {{ item.name }}</td>
                        <td class="more-btn">
                            <button @click="download(item.name)">
                                <img src="../assets/icons/download.svg" alt="">
                            </button>
                        </td>
                    </tr>
                </tbody>

                <tbody v-if="isMobile">
                    <tr v-for="item in items" :key="item.name">
                        <td>
                            <div class="mobile-body-wrapper">
                                <div class="mobile-body-checkbox">
                                    <v-checkbox v-model="selected" :value="item" style="margin:0px;padding:0px"
                                        hide-details class="body-checkbox" />
                                </div>

                                <div class="mobile-body-content">
                                    <img src="../assets/images/document.svg" alt="">
                                    
                                    <p> {{ item.name }} </p>

                                    <button @click="download(item.name)">
                                        <img src="../assets/icons/download.svg" alt="">
                                    </button>
                                </div>
                            </div>
                        </td>
                        <!-- <td class="img-docu"> <img src="../assets/images/document.svg" alt=""> {{ item.name }}</td>
                        <td>{{ item.uploadedBy }}</td>
                        <td>{{ item.uploadedAt }}</td>
                        <td class="more-btn">
                            <button>
                                <img src="../assets/images/dot.svg" alt="">
                            </button>
                        </td> -->
                    </tr>
                </tbody>

                <tbody v-if="items.length == 0">
                    <tr class="v-data-table__empty-wrapper">
                        <td class="text-center" colspan="5">No data available</td>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
    </div>
</template>

<script>
export default {
    props: ['getDetails'],
    data: () => ({
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        isMobile: false,
        singleSelect: false,
        selected: [],
        headers: [
            {
                text: 'NAME',
                align: 'start',
                sortable: true,
                value: 'name',
            },
            { 
                text: '', 
                value: 'more',
                sortable: false,
            }
        ],
        documents: [],
    }),
    mounted() {
        if(this.getDetails !== 'undefined') {            
            let documentsData = []
            
            if (this.getDetails.shipment_suppliers !== 'undefined') {
                this.getDetails.shipment_suppliers.map(value => {
                    if (value.hbl_copy !== null) {
                        documentsData.push({
                            name: value.hbl_copy
                        })
                    }

                    if (value.packing_list !== null) {
                        documentsData.push({
                            name: value.packing_list
                        }) 
                    }

                    if (value.commercial_documents !== null) {
                        documentsData.push({
                            name: value.commercial_documents
                        })
                    }

                    if (value.commercial_invoice !== null) {
                        documentsData.push({
                            name: value.commercial_invoice
                        })
                    }
                })                
            }      
            
            this.documents = documentsData
        }
    },
    methods: {
        onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true;
            } else {
                this.isMobile = false;
            }
        },
        download(name) {
            window.location.href = `https://beta.shifl.com/download?link=${encodeURIComponent(name)}`
        },
        iterateDocument(index) {            
            if (this.selected.length > 0 && typeof this.selected[index]!=='undefined') {
                 window.location.href = `https://beta.shifl.com/download?link=${encodeURIComponent(this.selected[index].name)}`
                index++
                setTimeout(() => {
                    this.iterateDocument(index)
                }, 3000)
            }
        },
        downloadDocuments() {	
            let startIndex = 0      
            this.iterateDocument(startIndex)   
        }
    }
}
</script>

<style lang="scss">
/* @import '../assets/css/shipments_styles/shipmentDocuments.css'; */
@import '../assets/scss/pages_scss/shipment/shipmentDocuments.scss';
</style>
