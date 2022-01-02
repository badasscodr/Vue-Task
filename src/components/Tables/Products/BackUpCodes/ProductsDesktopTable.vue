<template>
    <v-data-table
        :headers="headers"
        :items="items"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :search="search"
        hide-default-footer
        mobile-breakpoint="769"
        @page-count="pageCount = $event"
        class="product-table elevation-1"
        :class="(typeof items !== 'undefined' && items !== null && items.length > 0) ? '' : 'no-data-table'"
        @click:row="viewItem">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Products</v-toolbar-title>
                
                <v-spacer></v-spacer>                

                <div class="search-component" v-if="(typeof items !== 'undefined' && items !== null && items.length > 0)">
                    <Search 
                        placeholder="Search Products"
                        className="search custom-search"
                        :inputData.sync="search" />
                </div>

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
                    :categoryLists="categoryLists"
                    :isMobile="isMobile"
                    :isValid="valid"
                    :loadingOnce="loadingOnceData"
                    :loadingAndAnother="loadingAndAnother" />

                <DeleteDialog 
                    :dialogData.sync="dialogDelete"
                    :editedItemData.sync="editedItem"
                    @delete="deleteItemConfirm"
                    @close="closeDelete"
                    :fromComponent="'products'"
                    :loadingDelete="getDeleteProductLoading"
                    componentName="Products" />
            </v-toolbar>

            <ProductView
                :editedItemData.sync="editedItem"
                :dialogViewData.sync="dialogView"
                :isMobile="isMobile"
                :categoryLists="categoryLists"
                @editItem="editItem"
                @deleteItem="deleteItem" />
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
                            
            <div class="no-data-wrapper" v-if="!getProductsLoading && items !== null">
                <div class="no-data-heading">
                    <img src="../../../assets/icons/empty-product-icon.svg" width="40px" height="42px" alt="">

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
                            :categoryLists="categoryLists"
                            :isMobile="isMobile"
                            :isValid="valid"
                            :loadingOnce="loadingOnceData"
                            :loadingAndAnother="loadingAndAnother" />
                    </div>
                </div>
            </div>
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
        <template v-slot:[`item.description`]="{ item }">
            <p class="mb-0">{{ (item.description !== null && item.description !== '' ? item.description : '--') }}</p>
        </template>

        <template v-slot:[`item.units_per_carton`]="{ item }">
            <span>{{ item.units_per_carton }} Units</span>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <div class="actions">								
                <button class="btn-edit" @click.stop="editItem(item)">
                    <img src="../../../assets/icons/edit-blue.svg" alt="">
                </button>

                <button class="btn-delete" @click.stop="deleteItem(item)">
                    <img src="../../../assets/icons/delete-blue.svg" alt="">
                </button>
            </div>
        </template>
    </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Search from '../../../Search.vue'
import AddProductDialog from '../../../ProductComponents/BackUpCodes/AddProductDialog.vue'
import ProductView from '../../../ProductComponents/Dialog/ProductViewDialog.vue'
import DeleteDialog from '../../../Dialog/DeleteDialog.vue'
import _ from 'lodash'

export default {
    name: "ProductsDesktopTable",
    props: ['headers', 'items', 'pageData', 
            'itemsPerPage', 'lengthData', 'isMobile', 
            'categoryLists', 'editedItemFromParent', 'defaultItemFromParent', 
            'dialogData', 'dialogViewData', 'dialogDeleteData', 
            'editedIndexDataFromParent', 'loadingOnceData', 'customSku',
            'loadingAndAnotherData'],
	components: {
		Search,
		AddProductDialog,
		ProductView,
		DeleteDialog,
	},
    data: () => ({
		search: "",
	}),
	computed: {
		...mapGetters({
            getCategories: 'category/getCategories',
			getProducts: 'products/getProducts',
			getProductsLoading: 'products/getProductsLoading',
			getUser: 'getUser',
			getDeleteProductLoading: 'products/getDeleteProductLoading'
        }),
		valid() {
			if (this.isCustom !== 'generated') {
				if (this.editedItem.sku !== null && 
                this.editedItem.name !== '' && 
                this.editedItem.category_id !== null &&
                this.editedItem.units_per_carton !== '' ) {
                    return true
				} else {
					return false
				}
			} else {
				if (this.editedItem.name !== '' && 
				this.editedItem.category_id !== null &&
				this.editedItem.units_per_carton !== '' ) {
					return true
				} else {
					return false
				}
			}
		},
        page: {
            get() {
                return this.pageData
            },
            set (value) {
                this.$emit('update:pageData', value)
            }
        },
        pageCount: {
            get() {
                return this.lengthData
            },
            set (value) {
                this.$emit('update:lengthData', value)
            }
        },
        editedItem: {
            get() {
                return this.editedItemFromParent
            }, 
            set(value) {
                this.$emit('update:editedItemFromParent', value)
            }
        },
        defaultItem: {
            get() {
                return this.defaultItemFromParent
            }, 
            set(value) {
                this.$emit('update:defaultItemFromParent', value)
            }
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
        dialogView: {
            get () {
                return this.dialogViewData
            },
            set (value) {
                if (!value) {
                    this.$emit('update:dialogViewData', false)
                } else {
                    this.$emit('update:dialogViewData', true)
                }
            }
        },
        dialogDelete: {
            get () {
                return this.dialogDeleteData
            },
            set (value) {
                if (!value) {
                    this.$emit('update:dialogDeleteData', false)
                } else {
                    this.$emit('update:dialogDeleteData', true)
                }
            }
        },
        editedIndex: {
            get() {
                return this.editedIndexDataFromParent
            },
            set(value) {
                console.log(value)
            }
        },
        isCustom: {
            get () {
                return this.customSku
            },
            set (value) {
                this.$emit('update:customSku', value)
            }
            
        },
        loadingOnce: {
            get() {
                return this.loadingOnceData
            },
            set(value) {
                console.log(value);
            }
        },
        loadingAndAnother: {
            get() {
                return this.loadingAndAnotherData
            },
            set(value) {
                console.log(value)
            }
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
		getImgUrl(pic) {
			if (pic !== 'undefined' && pic !== null) {
				return pic				
			} else {
				return require('../../../assets/icons/default-product-icon.svg')
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
        viewItem(item) {
            this.$emit('viewItem', item)
        },
        editItem(item) {
            this.$emit('editItem', item)
        },
        close() {
            this.$emit('update:dialogData', false)
        },
        deleteItem(item) {
            this.$emit('deleteItem', item)
        },
        deleteItemConfirm(item) {
            this.$emit('deleteItemConfirm', item)
        },
        closeDelete() {
            this.$emit('update:dialogDeleteData', false)
        },        
        save(data) {
            //this.$emit('save', this.editedItem)
            this.$emit('save', data)
        },
        saveAndAdd(data) {
            //this.$emit('saveAndAdd', this.editedItem)
            this.$emit('saveAndAdd', data)
        }
	},
    mounted() {
        
    },
	updated() {
        
	}
}
</script>

<style>

</style>