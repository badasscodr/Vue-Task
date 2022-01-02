<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :search="search"
            hide-default-footer
            mobile-breakpoint="1023"
            @page-count="pageCount = $event"
            class="product-table elevation-1"
            :class="(typeof items !== 'undefined' && items !== null && items.length > 0) ? '' : 'no-data-table'"
            @click:row="viewProductItem"
            fixed-header>
            
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

                    <v-btn color="primary" class="btn-white manage-category-button" @click="handleManageCategory">
                        Manage Categories
                    </v-btn>

                    <v-btn color="primary" class="btn-blue add-product-button" @click.stop="addProduct">
                        Add Product
                    </v-btn>
                </v-toolbar>
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
                            <v-btn color="primary" class="btn-blue add-product-button mx-auto" @click.stop="addProduct">
                                Add Product
                            </v-btn>                            
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
                <p class="mb-0 product-description-text">
                    {{ (item.description !== null && item.description !== '' ? item.description : '--') }}
                </p>
            </template>
            
            <template v-slot:[`item.units_per_carton`]="{ item }">
                <span>{{ item.units_per_carton }} Units</span>
            </template>

            <template v-slot:[`item.duty_rate`]="{ item }">
                <span>{{ getParsedAmount(item.duty_rate) }}%</span>
            </template>

            <template v-slot:[`item.unit_price`]="{ item }">
                <span>${{ item.unit_price !== null && item.unit_price !== '' ? item.unit_price : 0 }}</span>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <div class="actions">								
                    <button class="btn-edit" @click.stop="editProduct(item)">
                        <img src="../../../assets/icons/edit-blue.svg" alt="">
                    </button>

                    <button class="btn-delete" @click.stop="deleteProductItem(item)">
                        <img src="../../../assets/icons/delete-blue.svg" alt="">
                    </button>
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
                width: "15%", 
                fixed: true
			},
			{
				text: "Description",
                align: "start",
                sortable: false,
                value: "description",
                width: "27%", 
                fixed: true
			},
			{
				text: "In Each Carton",
                align: "end",
                sortable: false,
                value: "units_per_carton",
                width: "12%", 
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
                width: "12%", 
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
