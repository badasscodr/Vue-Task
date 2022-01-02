<template>
	<div class='purchase-wrapper' v-resize="onResize">
        <!-- Desktop -->
        <PODesktopTable 
            :items="pos" 
            @createPo="createPo"
            @editPo="editPo"
            @viewPo="openPoView"
            :isMobile="isMobile"
            v-if="!isMobile" />

		<!-- Mobile -->	
        <POMobileTable 
            :items="pos" 
            @createPo="createPo"
            @editPo="editPo"
            @viewPo="openPoView"
            :isMobile="isMobile"
            v-if="isMobile"/>

        <POCreateDialog 
            :dialog.sync="dialogCreatePo"
            :editedIndex.sync="editedPoIndex"
            :editedItems.sync="editedPoItems"
            @close="closePoCreate"
            :isMobile="isMobile" />

        <PoViewDialog 
            :dialogViewData.sync="dialogPoView"
            :editedItemData.sync="editedPoItems"
            :createDialogData.sync="dialogCreatePo"
            @editItem="editPo"
            @closePoView="closePoView"
            :deleteInnerData.sync="dialogPoDelete"
            @deleteOpen="openDelete"
            @closeDelete="closePoDelete" />

        <DeleteDialog 
            :dialogData.sync="dialogPoDelete"
            :editedItemData.sync="currentPoToDelete"
            :editedIndexWarehouse.sync="editedPoIndex"
            :defaultItemWarehouse.sync="defaultPoItems"
            @delete="deletePoConfirm"
            @close="closePoDelete"
            fromComponent="po"
            :loadingDelete="getPoDeleteLoading"
            componentName="PO" />
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PODesktopTable from '../components/Tables/POs/PODesktopTable.vue'
import POMobileTable from '../components/Tables/POs/POMobileTable.vue'
import POCreateDialog from '../components/PosComponents/Dialog/POCreateDialog.vue'
import PoViewDialog from '../components/PosComponents/Dialog/PoViewDialog.vue'
import DeleteDialog from '../components/Dialog/DeleteDialog.vue'
import globalMethods from '../utils/globalMethods'
import axios from 'axios'
import _ from 'lodash'

export default {
	name: "POs",
	components: {
        PODesktopTable,
        POMobileTable,
        POCreateDialog,
        PoViewDialog,
        DeleteDialog
	},
	data: () => ({
        hasMounted: false,
        dialogCreatePo: false,
        editedPoIndex: -1,
        editedPoItems: {
            products: [{
                id: null,
                quantity: 0,
                unit_price: 0,
                amount: 0
            }],
            po_number: '',
			is_system_generated: 1,
			supplier_id: '',
			customer_id: '',
			notes: '',
			created_by: '',
			tax: 0,
			warehouse_id: '',
			sub_total: '',
			shipping: 0,
			total: '',
			discount: 0
        },
        defaultPoItems: {
            products: [{
                id: null,
                quantity: 0,
                unit_price: 0,
                amount: 0
            }],
            po_number: '',
			is_system_generated: 1,
			supplier_id: '',
			customer_id: '',
			notes: '',
			created_by: '',
			tax: 0,
			warehouse_id: '',
			sub_total: '',
			shipping: 0,
			total: '',
			discount: 0
        },
        dialogPoView: false,
        dialogPoDelete: false,
        currentPoToDelete: null,
		isMobile: false,
	}),
	computed: {
		...mapGetters({
            getAllPo: 'po/getAllPo',
			getPoLoading: 'po/getPoLoading',
            getPoDeleteLoading: 'po/getPoDeleteLoading',
            poBaseUrlState: 'products/poBaseUrlState',
        }),
		pos() {
			let posData = []

			if (typeof this.getAllPo !== 'undefined' && this.getAllPo !== null) {
				if (typeof this.getAllPo.results !== 'undefined' && this.getAllPo.results !== null) {
					if (this.getAllPo.results.data !== 'undefined' && this.getAllPo.results.data !== null) {
						if (this.getAllPo.results.data.length !== 'undefined' && this.getAllPo.results.data.length !== null) {
							posData = this.getAllPo.results.data

							if (posData !== 'undefined' && posData.length !== 'undefined') {
								posData.map(value => {
									if (typeof value.po_items == 'string') {
										value.po_items = JSON.parse(value.po_items)
									}
								})
							}
						}
					}
				}
			}

			return posData
        },
	},
	watch: {
		dialog (val) {
			val || this.close()
		},
		dialogView (val) {
			val || this.closeView()
		},
	},
	methods: {
		...mapActions({
            fetchPo: 'po/fetchPo',
			fetchWarehouse: 'warehouse/fetchWarehouse',
			fetchProducts: 'products/fetchProducts',
            deletePo: 'po/deletePo',
            setPoDefault: 'po/setPoDefault'
        }),
        ...globalMethods,
		onResize() {
            if (window.innerWidth < 1023) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
        async fetchSingleProduct(id) {
            try {
                const res = await axios.get(`${this.poBaseUrlState}/products/${id}`)
                if (res.status === 200) {
                    if (typeof res.data!=='undefined') {
                        if (typeof res.data.unit_price!=='undefined' && res.data.unit_price!=='' && res.data.unit_price!==null) {
                            return Promise.resolve(res.data.unit_price)    
                        } else {
                            return Promise.resolve(0)
                        }
                    } else {
                        return Promise.resolve(0)
                    }
                } else {
                    return Promise.resolve(0)
                }
            } catch(e) {

                if (typeof e.message!=='undefined' && e.message =='UnAuthenticated') {
                    this.$router.push('/login')
                } else {
                    return Promise.reject(0)
                }
                
            }
            
        },
        createPo() {
            this.dialogCreatePo = true     
            this.editedPoItems.products = [
                {
                    id: null,
                    quantity: 0,
                    unit_price: 0,
                    amount: 0
                }
            ]
            this.editedPoIndex = -1
        },
        processSingleProduct(getIndex, context, po) {
            
            if (po.purchase_order_products[getIndex]) {
                let ipp = po.purchase_order_products[getIndex]
                po.purchase_order_products[getIndex] = {
                    id: ipp.product_id,
                    quantity: ipp.quantity,
                    amount: ipp.amount,
                    product_id: ipp.product_id
                }

                let unit_price = ipp.unit_price

                if (unit_price===null || unit_price==='' || ipp.unit_price==0) {

                    context.fetchSingleProduct(ipp.product_id).then( data => {
                        unit_price = (typeof data.unit_price!=='undefined') ? data.unit_price : unit_price
                        unit_price = (unit_price==null || unit_price=='') ? 0 : unit_price
                        po.purchase_order_products[getIndex].unit_price = unit_price

                        this.processSingleProduct(++getIndex, context, po)
                    }).catch(e => {
                        console.log(e)
                        po.purchase_order_products[getIndex].unit_price = 0
                        this.processSingleProduct(++getIndex, context, po)
                    })
                } else {
                    po.purchase_order_products[getIndex].unit_price = (unit_price==null || unit_price=='') ? 0 : unit_price
                    this.processSingleProduct(++getIndex, context, po)
                }
            } else {
                po.loadingState = false
                po.products = po.purchase_order_products
                this.editedPoItems = Object.assign({}, po)
            }
        },
        async editPo(po) {
            this.dialogCreatePo = true
            this.editedPoIndex = 100000000
            //this.setPoDefault()
            if (this.hasMounted) {
                this.fetchPo().catch(e => {
                    if (e=='UnAuthenticated') {
                        //this.$router.push('/login')   
                        window.location.href = '/login'
                    }
                })
            }

            this.editedPoIndex = _.findIndex(this.pos, e => (e.id === po.id))
            po.products = []
            po.loadingState = true
            if (typeof po.purchase_order_products!=='undefined' && Array.isArray(po.purchase_order_products) && po.purchase_order_products.length > 0) {

                let index = 0
                
                //let po_products = po.products
                po.products = []
                this.editedPoItems = Object.assign({}, po)
                this.processSingleProduct(index, this, po)               

            } else {
                po.loadingState = false
                this.editedPoItems = Object.assign({}, po)
            }            
        },
        closePoCreate() {
            this.dialogCreatePo = false            
			this.$nextTick(() => {
				this.editedPoItems = Object.assign({}, this.defaultPoItems)
				this.editedPoIndex = -1
			})
        },
        openPoView(po) {
            this.editedPoIndex = _.findIndex(this.pos, e => (e.id === po.id))
			po.products = []
			if (typeof po.purchase_order_products!=='undefined' && Array.isArray(po.purchase_order_products) && po.purchase_order_products.length > 0) {
				po.products = po.purchase_order_products.map(ipp => ({
					id: ipp.product_id,
					quantity: ipp.quantity,
					unit_price: ipp.unit_price,
					amount: ipp.amount,
					sku: (typeof ipp.product!=='undefined' && ipp.product!==null) ? ipp.product.sku : '',
					description: (typeof ipp.product!=='undefined' && ipp.product!==null) ? ipp.product.description : ''
				}))
			}
			this.editedPoItems = Object.assign({}, po)			
            this.dialogPoView = true
        },
        closePoView() {
            this.dialogPoView = false            
			this.$nextTick(() => {
				this.editedPoItems = Object.assign({}, this.defaultPoItems)
				this.editedPoIndex = -1
			})
        },
        openDelete(item) {
            this.dialogPoDelete = true
            this.currentPoToDelete = item
            this.currentPoToDelete.name = item.po_number
        },
        async deletePoConfirm() {
            try {
                await this.deletePo(this.currentPoToDelete.id)
                this.notificationMessage('Purchase order successfully deleted.')
                this.fetchPo()
                this.closePoDelete()
                this.closePoView()

                if (this.isMobile) {
                    this.$router.push(`/pos`)
                }
            } catch(e) {
                this.closePoDelete()
                this.notificationError(e)
            }
        },
        closePoDelete() {
            this.dialogPoDelete = false
            this.$nextTick(() => {
				this.editedPoItems = Object.assign({}, this.defaultPoItems)
				this.editedPoIndex = -1
			})
        }
	},
	async mounted() {
		//set current page
		this.$store.dispatch("page/setPage","pos")
		this.fetchPo()
		this.fetchWarehouse()
		this.fetchProducts()
        this.hasMounted = true
	},	
	updated() {}
};
</script>

<style lang="scss">
@import "../assets/scss/pages_scss/po/po.scss";
@import '../assets/scss/pages_scss/dialog/globalDialog.scss';
@import "../assets/scss/buttons.scss";
</style>
