<template>
	<div class="products-wrapper" v-resize="onResize">
		<!-- Products Table Desktop View -->
		<ProductDesktopTable
			:items="products"
			:categoryLists="categoryLists"
			@addProduct="addProduct"
			@editProduct="editProduct"
			@deleteProductItem="deleteProductItem"
			@viewProductItem="viewProductItem"
			:isMobile="isMobile"
			v-if="!isMobile" />

		<!-- Products Table Mobile View -->
		<ProductMobileTable
			:items="products"
			:categoryLists="categoryLists"
			@addProduct="addProduct"
			@editProduct="editProduct"
			@deleteProductItem="deleteProductItem"
			@viewProductItem="viewProductItem"
			:isMobile="isMobile"
			v-if="isMobile" />

		<ProductViewDialog
			:editedItemData.sync="editedProductItem"
			:dialogViewData.sync="dialogViewProduct"
			:isMobile="isMobile"
			:categoryLists="categoryLists"
			@editItem="editProduct"
			@deleteItem="deleteProductItem"
			@close="closeViewProduct" />
					
        <ProductAddDialog 
            :dialog.sync="dialogAddProduct"
            :editedIndex.sync="editedIndexProduct"
			:defaultItem.sync="defaultProductItem"
			:editedItem.sync="editedProductItem"
			:categoryLists="categoryLists"
			@close="closeProduct"
			:isMobile="isMobile" />

		<DeleteDialog 
            :dialogData.sync="dialogDeleteProduct"
            :editedItemData.sync="currentProductToDelete"
            :editedIndexWarehouse.sync="editedIndexProduct"
            :defaultItemWarehouse.sync="defaultProductItem"
            @delete="deleteProductConfirm"
            @close="closeDeleteProduct"
            fromComponent="products"
            :loadingDelete="getDeleteProductLoading"
            componentName="Products" />
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ProductDesktopTable from '../components/Tables/Products/ProductDesktopTable.vue'
import ProductMobileTable from '../components/Tables/Products/ProductMobileTable.vue'
import ProductAddDialog from '../components/ProductComponents/Dialog/ProductAddDialog.vue'
import ProductViewDialog from '../components/ProductComponents/Dialog/ProductViewDialog.vue'
import DeleteDialog from '../components/Dialog/DeleteDialog.vue'
import globalMethods from '../utils/globalMethods'
import _ from 'lodash'

export default {
	name: "Products",
	components: {
		ProductDesktopTable,
		ProductMobileTable,
		ProductAddDialog,
		ProductViewDialog,
		DeleteDialog
	},
	data: () => ({
		dialogAddProduct: false,
		editedIndexProduct: -1,
		editedProductItem: {
			sku: null,
			name: '',
			category_id: null,
			description: '',
			units_per_carton: '',
			image: null,
			classification_code: '',
			duty_rate: '',
			unit_price: 0,
			upc_number: '',
			is_for_classification_code: 1,			
			userClassification: 0,
			country_from: '',
			country_to: '',
			product_classification_description: '',
			carton_dimensions: {
				l: 0,
				w: 0,
				h: 0,
				uom: 'cm'
			},
			unit_dimensions: {
				l: 0,
				w: 0,
				h: 0,
				uom: 'cm'
			},
			unit_weight: {
				value: 0,
				unit: 'kg'
			}
		},
		defaultProductItem: {
			sku: null,
			name: '',
			category_id: null,
			description: '',
			units_per_carton: '',
			image: null,
			classification_code: '',
			duty_rate: 0,
			unit_price: 0,
			upc_number: '',
			is_for_classification_code: 1,
			userClassification: 0,
			country_from: '',
			country_to: '',
			product_classification_description: '',
			carton_dimensions: {
				l: 0,
				w: 0,
				h: 0,
				uom: 'cm'
			},
			unit_dimensions: {
				l: 0,
				w: 0,
				h: 0,
				uom: 'cm'
			},
			unit_weight: {
				value: 0,
				unit: 'kg'
			}
		},
		dialogViewProduct: false,
		dialogDeleteProduct: false,
		currentProductToDelete: null,		
		isMobile: false,
		categoryLists: [],
	}),
	async mounted() {
		//set current page
		this.$store.dispatch("page/setPage","products")
		this.fetchProducts()
		this.fetchCountries()

		try {
			await this.fetchCategories()
			if (typeof this.getCategories !== 'undefined' && this.getCategories!==null && this.getCategories.length > 0) {
				this.categoryLists = this.getCategories.map((value) => {
					return {
						id: value.id,
						name: value.name
					}
				})
			} else {
				this.categoryLists = []
			}
		} catch (e) {
			console.log(e)
		}
	},
	computed: {
		...mapGetters({
            getCategories: 'category/getCategories',
			getProducts: 'products/getProducts',
			getProductsLoading: 'products/getProductsLoading',
			getUser: 'getUser',
			getDeleteProductLoading: 'products/getDeleteProductLoading',
        }),
		products() {
			return (typeof this.getProducts!=='undefined' && this.getProducts.length > 0) ? this.getProducts : []
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
	created () {
	},
	methods: {
		...globalMethods,
		...mapActions({
            fetchCategories: 'category/fetchCategories',
			fetchProducts: 'products/fetchProducts',
			createProducts: 'products/createProducts',
			getCurrentCategory: 'category/getCurrentCategory',
			deleteProduct: 'products/deleteProduct',
			updateProducts: 'products/updateProducts',			
			fetchCountries: 'warehouse/fetchCountries',
        }),
		onResize() {
            if (window.innerWidth < 1023) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },    		
        addProduct() {
            this.dialogAddProduct = true
			this.editedProductItem = Object.assign({}, this.defaultProductItem)
        },
        closeProduct() {
			this.$nextTick(() => {
				this.editedProductItem =  {
					...this.defaultProductItem, 
				}
				this.editedIndexProduct = -1
			})

			this.dialogAddProduct = false
        },
		editProduct(product) {			
			this.editedIndexProduct = this.products.indexOf(product)
			if (this.editedIndexProduct==-1) {
				if (typeof product.id!=='undefined') {
					this.editedIndexProduct = _.findIndex(this.products, e => (e.id == product.id))	
				}
			}	

			let tempProduct = {...product}
			if(!tempProduct.carton_dimensions){
				tempProduct = {...tempProduct, carton_dimensions: {
					l: 0,
					w: 0,
					h: 0,
					uom: 'cm'
				}}
			}

			if(!tempProduct.unit_dimensions){
				tempProduct = {...tempProduct, unit_dimensions: {
					l: 0,
					w: 0,
					h: 0,
					uom: 'cm'
				}}
			}

			if(!tempProduct.unit_weight){
				tempProduct = {...tempProduct, unit_weight: {
					value: 0,
					unit: 'kg'
				}}
			}

			if(!tempProduct.is_for_classification_code){
				tempProduct = {...tempProduct, is_for_classification_code: 0, userClassification: 1}
			}

			if(!tempProduct.classification_code){
				tempProduct = {...tempProduct, classification_code: ''}
			}
			
			this.editedProductItem = { ...tempProduct }
			this.dialogAddProduct = true
        },
		deleteProductItem(item) {
			this.dialogDeleteProduct = true
			this.currentProductToDelete = item
		},
		async deleteProductConfirm() {
			if (this.currentProductToDelete !== null) {
                try {
                    await this.deleteProduct(this.currentProductToDelete.id)
                    this.fetchProducts()
                    this.closeDeleteProduct()
                    this.notificationMessage('Product has been deleted.')
                } catch (e) {
                    this.closeDeleteProduct()
                    this.notificationError(e)
                }
            }
		},
		closeDeleteProduct() {
			this.dialogDeleteProduct = false
		},
		viewProductItem(item) {
			this.editedProductItem = Object.assign({}, item)
			this.dialogViewProduct = true
		},
		closeViewProduct() {
			this.$nextTick(() => {
				this.editedProductItem = Object.assign({}, this.defaultProductItem)
				this.editedIndexProduct = -1
			})

			this.dialogViewProduct = false
		}
	},
	updated() {}
};
</script>

<style lang="scss">
@import '../assets/scss/pages_scss/product/product.scss';
@import '../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../assets/scss/buttons.scss';
</style>
