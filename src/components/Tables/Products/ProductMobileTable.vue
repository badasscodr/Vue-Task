<template>
    <div class="product-mobile-table-wrapper">
        <v-data-table
            :headers="headers"
            :items="items"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :search="search"
            hide-default-footer
            mobile-breakpoint="1023"
            @page-count="pageCount = $event"
            class="product-table-mobile elevation-1"
            :class="(typeof items !== 'undefined' && items !== null && items.length > 0) ? '' : 'no-data-table'"
            @click:row="viewProductItem">

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Products</v-toolbar-title>
                    
                    <v-spacer></v-spacer>
                </v-toolbar>

                <div class="products-button-wrapper">				
                    <v-btn color="primary" class="btn-white manage-category-button" @click="handleManageCategory">
                        Manage Categories
                    </v-btn>

                    <v-btn color="primary" class="btn-blue add-product-button" @click.stop="addProduct">
                        Add Product
                    </v-btn>
                </div>

                <div class="search-component" v-if="(typeof items !== 'undefined' && items !== null && items.length > 0)">
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
                        <button class="btn-edit" @click.stop="editProduct(item)">
                            <img src="@/assets/icons/edit-blue.svg" alt="">
                        </button>

                        <button class="btn-delete" @click.stop="deleteProductItem(item)">
                            <img src="@/assets/icons/delete-blue.svg" alt="">
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
                        <p class="dark-grey mb-1">${{ item.unit_price }}</p>

                        <div class="cat-units-wrapper">
                            <p class="light-gray category mb-1">{{ getCategoryName(item.category_id) }}</p>
                            <span class="round-divider"></span>
                            <p class="light-gray units mb-1">{{ item.units_per_carton }} Units/Carton</p>
                        </div>

                        <div class="duty-rate">                            
                            <span class="light-gray units mb-1">Duty Rate: {{ getParsedAmount(item.duty_rate) }}%</span>
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:[`item.description`]="{ item }">
                <div class="description-wrapper mb-3">
                    <div class="description-img mr-2">
                        <img src="@/assets/icons/info.svg" width="16px" height="16px">
                    </div>

                    <div class="info-wrapper">
                        <p class="light-gray desc mb-1" style="font-size: 12px;">{{ (item.description !== null && item.description !== '' ? item.description : '--') }}</p>
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
                            <img src="@/assets/icons/empty-product-icon.svg" width="40px" height="42px" alt="">

                            <h3> Add Product </h3>
                            <p>
                                Let’s add the first product on Shifl. You can use this product list for creating Purchase Orders or for managing Inventory.
                            </p>

                            <div class="mt-4" style="display: flex; justify-content: center;">
                                <v-btn color="primary" class="btn-blue add-product-button" @click.stop="addProduct">
                                    Add Product
                                </v-btn>
                            </div>
                        </div>
                    </div>
            </template>
        </v-data-table>

        <Pagination 
            v-if="typeof items !== 'undefined' && items.length > 0"
            :pageData.sync="page"
            :lengthData.sync="pageCount"
            :isMobile="isMobile" />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Search from '../../Search.vue'
import Pagination from '../../Pagination.vue'
import _ from 'lodash'

export default {
    name: "ProductDesktopTable",
    props: ['items', 'categoryLists', 'isMobile'],
	components: {
		Search,
        Pagination
	},
    data: () => ({
        page: 1,
        pageCount: 0,
        itemsPerPage: 15,        
		headers: [
			{
				text: "Sku",
                align: "start",
                sortable: false,
                value: "sku",
                width: "12%", 
                fixed: true
			},
			{
				text: "Name & Category",
                align: "start",
                sortable: false,
                value: "name",
                width: "20%", 
                fixed: true
			},
			{
				text: "Description",
                align: "start",
                sortable: false,
                value: "description",
                width: "28%", 
                fixed: true
			},
			{
				text: "In Each Carton",
                align: "end",
                sortable: false,
                value: "units_per_carton",
                width: "15%", 
                fixed: true
			},
            {
				text: "Duty Rate",
                align: "end",
                sortable: false,
                value: "duty_rate",
                width: "12%", 
                fixed: true
			},
            {
				text: "Unit Price",
                align: "end",
                sortable: false,
                value: "unit_price",
                width: "15%", 
                fixed: true
			},
			{
				text: "",
                align: "center",
                sortable: false,
                value: "actions",
                width: "10%", 
                fixed: true
			},
		],
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
        addProduct() {
            this.$emit('addProduct')
        },
        editProduct(product) {
            this.$emit('editProduct', product)
        },
        deleteProductItem(product) {
            this.$emit('deleteProductItem', product)
        },
        viewProductItem(item) {
            this.$emit('viewProductItem', item)
        },
        getParsedAmount(amount) {
            return parseFloat(amount).toFixed(2)
        }
	},
    mounted() {},
	updated() {}
}
</script>

<style></style>
