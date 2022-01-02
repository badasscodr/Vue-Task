<template>
	<div class='products-wrapper' v-resize="onResize">
		<!-- Desktop -->
		<v-data-table
			:headers="headers"
			:items="getProducts"
			:page.sync="page"
            :items-per-page="itemsPerPage"
            :search="search"
			hide-default-footer
			mobile-breakpoint="769"
			@page-count="pageCount = $event"
			class="product-table elevation-1"
			:class="getProducts.length !== 0 ? '' : 'no-data-table'"
			v-if="!isMobile"
			@click:row="viewItem">

			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Products</v-toolbar-title>
					
					<v-spacer></v-spacer>

					<Search 
						placeholder="Search Products"
						className="search custom-search"
						:inputData.sync="search" />

					<v-btn color="primary" class="manage-category-button" @click="handleManageCategory">
						Manage Categories
					</v-btn>

					<AddProductDialog 
						:editedIndexData.sync="editedIndex"
						:dialogData.sync="dialog"
						:editedItemData.sync="editedItem"
						:customSku.sync="isCustom"
						@close="close"
						@save="save"
						@saveAndAdd="saveAndAdd"
						:categoryLists="getCategories"
						:isMobile="isMobile"
						:isValid="valid"
						:loadingOnce="loadingOnce"
						:loadingAndAnother="loadingAndAnother" />

					<DeleteDialog 
						:dialogData.sync="dialogDelete"
						:editedItemData.sync="editedItem"
						@delete="deleteItemConfirm"
						@close="closeDelete"
						:fromComponent="'products'"
						:loadingDelete="getDeleteProductLoading" />
				</v-toolbar>

				<ProductView 
					:editedItemData.sync="editedItem"
					:dialogViewData.sync="dialogView"
					:isMobile="isMobile"
					:categoryLists="categoryLists" />
			</template>

			<template v-slot:[`item.name`]="{ item }">
				<div class="description-wrapper">
					<div class="description-img">
						<img :src="getImgUrl(item.image)" v-bind:alt="item.image" width="56px" height="56px">
					</div>

					<div class="info-wrapper">
						<p class="desc-info">{{ item.name }}</p>
						<p class="category">{{ getCategoryName(item.category_id) }}</p>
					</div>
				</div>
			</template>

			<template v-slot:[`item.units_per_carton`]="{ item }">
				<span>{{ item.units_per_carton }} Units</span>
			</template>

			<template v-slot:[`item.actions`]="{ item }">
				<div class="actions">								
					<button class="btn-edit" @click.stop="editItem(item)">
						<img src="../assets/icons/edit-blue.svg" alt="">
					</button>

					<button class="btn-delete" @click.stop="deleteItem(item)">
						<img src="../assets/icons/delete-blue.svg" alt="">
					</button>
				</div>
			</template>

			<template v-slot:no-data>
				<div class="no-data-preloader mt-4" v-if="getProductsLoading">
                        <v-progress-circular
                            :size="40"
                            color="#0171a1"
                            indeterminate
                            v-if="getProductsLoading">
                        </v-progress-circular>
                    </div>
                                    
                    <div class="no-data-wrapper" v-if="!getProductsLoading && getProducts.length == 0">
                        <div class="no-data-heading">
							<img src="../assets/icons/empty-product-icon.svg" width="40px" height="42px" alt="">

                            <h3> Add Product </h3>
                            <p>
                                Let’s add the first product on Shifl. You can use this product list for creating Purchase Orders or for managing Inventory.
                            </p>

                           <div class="mt-4">
                                <AddProductDialog 
									:editedIndexData.sync="editedIndex"
									:dialogData.sync="dialog"
									:editedItemData.sync="editedItem"
									:customSku.sync="isCustom"
									@close="close"
									@save="save"
									@saveAndAdd="saveAndAdd"
									:categoryLists="getCategories"
									:isMobile="isMobile"
									:isValid="valid"
									:loadingOnce="loadingOnce"
                                    :loadingAndAnother="loadingAndAnother" />
                           </div>
                        </div>
                    </div>
			</template>
		</v-data-table>

		<!-- Mobile -->
		<v-data-table
			:headers="headers"
			:items="getProducts"
			:page.sync="page"
            :items-per-page="itemsPerPage"
            :search="search"
			hide-default-footer
			mobile-breakpoint="769"
			@page-count="pageCount = $event"
			:class="getProducts.length !== 0 ? '' : 'no-data-table'"
			class="product-table-mobile elevation-1"
			v-if="isMobile"
			@click:row="viewItem">

			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Products</v-toolbar-title>
					
					<v-spacer></v-spacer>

					<DeleteDialog 
						:dialogData.sync="dialogDelete"
						:editedItemData.sync="editedItem"
						@delete="deleteItemConfirm"
						@close="closeDelete"
						:fromComponent="'products'"
						:loadingDelete="getDeleteProductLoading" />
				</v-toolbar>

				<ProductView 
					:editedItemData.sync="editedItem"
					:dialogViewData.sync="dialogView"
					:isMobile="isMobile"
					:categoryLists="categoryLists" />

				<div class="products-button-wrapper">				
					<v-btn color="primary" class="manage-category-button" @click="handleManageCategory">
						Manage Categories
					</v-btn>

					<AddProductDialog 
						:editedIndexData.sync="editedIndex"
						:dialogData.sync="dialog"
						:editedItemData.sync="editedItem"
						:customSku.sync="isCustom"
						@close="close"
						@save="save"
						@saveAndAdd="saveAndAdd"
						:categoryLists="getCategories"
						:isMobile="isMobile"
						:isValid="valid"
						:loadingOnce="loadingOnce"
						:loadingAndAnother="loadingAndAnother" />
				</div>

				<div class="search-component" v-if="getProducts.length !== 0">
					<Search 
						placeholder="Search Products"
						className="search custom-search"
						:inputData.sync="search" />
				</div>
			</template>

			<template v-slot:[`item.sku`]="{ item }">
				<div class="products-row">
					<p class="p-gray mb-0" style="color: #4a4a4a; font-family: 'Inter-Medium', sans-serif;">SKU <span>#{{ item.sku }}</span></p>

					<div class="actions">								
						<button class="btn-edit" @click.stop="editItem(item)">
							<img src="../assets/icons/edit-blue.svg" alt="">
						</button>

						<button class="btn-delete" @click.stop="deleteItem(item)">
							<img src="../assets/icons/delete-blue.svg" alt="">
						</button>
					</div>
				</div>
			</template>

			<template v-slot:[`item.name`]="{ item }">
				<div class="description-wrapper my-2">
					<div class="description-img">
						<img :src="getImgUrl(item.image)" class="product-img" v-bind:alt="item.image" width="56px" height="56px">
					</div>

					<div class="info-wrapper">
						<p class="desc-info mb-1" style="color: #4a4a4a;">{{ item.name }}</p>
						<p class="light-gray category mb-1">{{ getCategoryName(item.category_id) }}</p>
						<p class="light-gray units mb-1">{{ item.units_per_carton }} Units in each carton</p>
					</div>
				</div>
			</template>

			<template v-slot:[`item.description`]="{ item }">
				<div class="description-wrapper mb-3">
					<div class="description-img mr-2">
						<img src="@/assets/icons/info.svg" width="16px" height="16px">
					</div>

					<div class="info-wrapper">
						<p class="light-gray desc mb-1" style="font-size: 12px;">{{ item.description }}</p>
					</div>
				</div>
			</template>

			<template v-slot:no-data>
				<div class="no-data-preloader mt-4" v-if="getProductsLoading">
                        <v-progress-circular
                            :size="40"
                            color="#0171a1"
                            indeterminate
                            v-if="getProductsLoading">
                        </v-progress-circular>
                    </div>
                                    
                    <div class="no-data-wrapper" v-if="!getProductsLoading && getProducts.length == 0">
                        <div class="no-data-heading mt-5">
							<img src="../assets/icons/empty-product-icon.svg" width="40px" height="42px" alt="">

                            <h3> Add Product </h3>
                            <p>
                                Let’s add the first product on Shifl. You can use this product list for creating Purchase Orders or for managing Inventory.
                            </p>

                           <div class="mt-4" style="display: flex; justify-content: center;">
                                <AddProductDialog 
									:editedIndexData.sync="editedIndex"
									:dialogData.sync="dialog"
									:editedItemData.sync="editedItem"
									:customSku.sync="isCustom"
									@close="close"
									@save="save"
									@saveAndAdd="saveAndAdd"
									:categoryLists="getCategories"
									:isMobile="isMobile"
									:isValid="valid"
									:loadingOnce="loadingOnce"
									:loadingAndAnother="loadingAndAnother" />
                           </div>
                        </div>
                    </div>
			</template>
		</v-data-table>

		<Pagination 
			v-if="getProducts.length !== 0"
			:pageData.sync="page"
			:lengthData.sync="pageCount"
			:isMobile="isMobile"
		/>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Search from '../components/Search.vue'
import AddProductDialog from '../components/ProductComponents/AddProductDialog.vue'
import ProductView from '../components/ProductComponents/ProductView.vue'
import DeleteDialog from '../components/Dialog/DeleteDialog.vue'
import Pagination from '../components/Pagination.vue'
import iziToast from "izitoast";
import _ from 'lodash'

export default {
	name: "Products",
	components: {
		// HelloWorld
		Search,
		AddProductDialog,
		ProductView,
		DeleteDialog,
		Pagination
	},
	data: () => ({
		// valid: true,
		page: 1,
        pageCount: 0,
        itemsPerPage: 7,
		search: "",
		dialog: false,
		dialogView: false,
		dialogDelete: false,
		headers: [
			{
				text: "Sku",
                align: "start",
                sortable: false,
                value: "sku",
                width: "164px", 
                fixed: true
			},
			{
				text: "Name & Category",
                align: "start",
                sortable: false,
                value: "name",
                width: "332px", 
                fixed: true
			},
			{
				text: "Description",
                align: "start",
                sortable: false,
                value: "description",
                width: "332px", 
                fixed: true
			},
			{
				text: "In Each Carton",
                align: "end",
                sortable: false,
                value: "units_per_carton",
                width: "200px", 
                fixed: true
			},
			{
				text: "",
                align: "center",
                sortable: false,
                value: "actions",
                width: "112px", 
                fixed: true
			},
		],
		pos: [],
		editedIndex: -1,
		editedItem: {			
			sku: null,
			name: '',
			category_id: null,
			description: '',
			units_per_carton: '',
			image: null
		},
		defaultItem: {
			sku: null,
			name: '',
			category_id: null,
			description: '',
			units_per_carton: '',
			image: null
		},
		isMobile: false,
		isCustom: '',
		categoryLists: [],
		currentItemToDelete: null,
		loadingOnce: false,
		loadingAndAnother: false
	}),
	async mounted() {
		//set current page
		this.$store.dispatch("page/setPage","products")
		this.fetchProducts()
		
		try {
			await this.fetchCategories()
			if (this.getCategories !== 'undefined' && this.getCategories !== null) {
				if (this.getCategories.data.length !== 0) {
					this.getCategories.data.map((value) => {
						this.categoryLists.push({
							id: value.id,
							name: value.name
						})
					})
				}
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
			getDeleteProductLoading: 'products/getDeleteProductLoading'
        }),
		formTitle () {
			return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
		},
		valid() {			
			if (this.isCustom !== 'generated') {
				if (this.editedItem.sku !== null && 
				this.editedItem.name !== '' && 
				this.editedItem.category_id !== null && 
				this.editedItem.description !== '' &&
				this.editedItem.units_per_carton !== '' ) {
					return true
				} else {
					return false
				}
			} else {
				if (this.editedItem.name !== '' && 
				this.editedItem.category_id !== null && 
				this.editedItem.description !== '' &&
				this.editedItem.units_per_carton !== '' ) {
					return true
				} else {
					return false
				}
			}
		}
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
		...mapActions({
            fetchCategories: 'category/fetchCategories',
			fetchProducts: 'products/fetchProducts',
			createProducts: 'products/createProducts',
			getCurrentCategory: 'category/getCurrentCategory',
			deleteProduct: 'products/deleteProduct',
			updateProducts: 'products/updateProducts'
        }),
		notificationMessage(message) {
            iziToast.success({
                class: 'categories-toast',
                title: 'OK',
                message: `${message}`,
                displayMode: 1,
                position: 'topRight',
                timeout: 3000,
            });
        },
        notificationError() {
            iziToast.error({
                class: 'categories-toast',
                title: 'Error',
                message: `Something's wrong. Please reload the page and try again.`,
                displayMode: 1,
                position: 'topRight',
                timeout: 3000,
            });
        },
		viewItem(item) {
			this.editedIndex = this.getProducts.indexOf(item)
			this.editedItem = Object.assign({}, item)
			this.dialogView = true
		},
		editItem(item) {
			this.editedIndex = this.getProducts.indexOf(item)
			this.editedItem = Object.assign({}, item)
			this.dialog = true
		},
		deleteItem(item) {
			this.editedIndex = this.getProducts.indexOf(item)
			this.editedItem = Object.assign({}, item)
			this.dialogDelete = true
			this.currentItemToDelete = item.id
		},
		async deleteItemConfirm() {
			if (this.currentItemToDelete !== null) {
                try {
                    await this.deleteProduct(this.currentItemToDelete)
                    this.fetchProducts()
                    this.closeDelete()

                    let message = 'Product has been deleted.'
                    this.notificationMessage(message)
                } catch (e) {
                    this.closeDelete()
                    this.notificationError()
                }
            }
		},
		closeView() {
			this.dialogView = false
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			})
		},
		close() {
			this.dialog = false
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			})
		},
		closeDelete() {
			this.dialogDelete = false
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			})
		},
		async save() {
			if (this.getUser !== 'undefined' && this.getUser !== null) {
				let user_id = this.getUser.success.id

				// required fields to be passed
				let passedData = {
					name: this.editedItem.name,
					description: this.editedItem.description,
					units_per_carton: this.editedItem.units_per_carton,
					category_id: this.editedItem.category_id,						
					customer_id: user_id,
					created_by: user_id,
					image: this.editedItem.image
				}

				if (this.editedIndex > -1) {
					// this.loadingOnce = true

					// passedData = {
					// 	...passedData,

					// }

				} else { 
					this.loadingOnce = true

					if (this.isCustom !== 'generated') {
						passedData = {
							...passedData,
							sku: this.editedItem.sku,
							sys_gen: false,
						}
					} else {
						passedData = {
							...passedData,
							sys_gen: true,
						}
					}

					// if image is not null, pass image field, if null, dont
					// if (this.editedItem.image !== null) {
					// 	passedData = {
					// 		...passedData,
					// 		image: this.editedItem.image
					// 	}
					// }

					// console.log(passedData);
					
					try {
						await this.createProducts(passedData)
						this.loadingOnce = false
						this.fetchProducts()
						this.close()        

						let message = 'Product has been created!'
						this.notificationMessage(message)
					} catch(e) {
						this.loadingOnce = false
						this.close()
						this.notificationError()
					}						
				}
			}
		},
		async saveAndAdd() {
			if (this.getUser !== 'undefined' && this.getUser !== null) {
				let user_id = this.getUser.success.id

				if (this.editedIndex > -1) {
					console.log('update');

				} else { 
					this.loadingAndAnother = true
					// required fields to be passed
					let passedData = {
						name: this.editedItem.name,
						description: this.editedItem.description,
						units_per_carton: this.editedItem.units_per_carton,
						category_id: this.editedItem.category,						
						customer_id: user_id,
						created_by: user_id
					}

					if (this.isCustom !== 'generated') {
						passedData = {
							...passedData,
							sku: this.editedItem.sku,
							sys_gen: false,
						}
					} else {
						passedData = {
							...passedData,
							sys_gen: true,
						}
					}

					// if image is not null, pass image field, if null, dont
					if (this.editedItem.image !== null) {
						passedData = {
							...passedData,
							image: this.editedItem.image
						}
					}

					console.log(passedData);
					
					try {
						await this.createProducts(passedData)
						this.loadingAndAnother = false
						this.fetchProducts()
						this.setToDefault()  

						let message = 'Product has been created!'
						this.notificationMessage(message)
					} catch(e) {
						this.loadingAndAnother = false
						this.notificationError()
					}						
				}
			}
		},
		onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
		getImgUrl(pic) {
			if (pic !== 'undefined' && pic !== null) {
				let picBasePath = 'https://po.shifl.com/'
				let imageRename = pic !== null ? pic.replace("public","storage") : ''
				
				let imagePreview = picBasePath + imageRename
				return imagePreview
			} else {
				return require('../assets/icons/default-product-icon.svg')
			}
		},
		handleManageCategory() {
			this.$router.push(`products/manage-categories`)
		},
		getCategoryName(id) {
			if(this.categoryLists.length !== 0 && id) {
                let findSizeValue = _.find(this.categoryLists, (e) => (e.id == id))

                if (typeof findSizeValue !== 'undefined') {
                    if (findSizeValue.name !== 'undefined') {
                        return findSizeValue.name
                    }
                } else {
                    return ''
                }
            }
		},
		setToDefault() {
            this.editedItem = this.defaultItem
            this.close()
            this.dialog = true
        }
	},
	updated() {
		
	}
};
</script>

<style>
@import '../assets/css/products_styles/products.css';
@import '../assets/css/dialog_styles/dialogHeader.css';
@import '../assets/css/dialog_styles/dialogBody.css';
@import '../assets/css/dialog_styles/dialogFooter.css';

</style>