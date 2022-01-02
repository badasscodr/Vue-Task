<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            sort-by="name"
            :page.sync="page"
            :search="search"
            :items-per-page="itemsPerPage"
            mobile-breakpoint="1023"
            @page-count="pageCount = $event"
            class="manage-category-table-mobile elevation-1"
            :class="(typeof items !== 'undefined' && items !== null && items.length > 0) ? '' : 'no-data-table'"
            hide-default-footer>

            <template v-slot:no-data>
                <div class="no-data-preloader mt-4" v-if="getCategoriesLoading">
                    <v-progress-circular
                        :size="40"
                        color="#0171a1"
                        indeterminate
                        v-if="getCategoriesLoading">
                    </v-progress-circular>
                </div>
                                
                <div class="no-data-wrapper" v-if="!getCategoriesLoading && items.length == 0">
                    <div class="no-data-heading">
                        <h3> Add Category </h3>
                        <p>
                            Let’s add the first product category on Shifl. You can use categories to organize your products and manage your inventory.
                        </p>

                        <div class="mt-4">                                
                            <v-btn color="primary" dark class="btn-blue add-category" @click.stop="addCategory">
                                Add Category
                            </v-btn>
                        </div>
                    </div>
                </div>
            </template>

            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Categories</v-toolbar-title>
                    
                    <v-spacer></v-spacer>

                    <v-btn color="primary" dark class="btn-blue add-category" @click.stop="addCategory">
                        Add Category
                    </v-btn>
                </v-toolbar>                

                <div class="search-component" v-if="(typeof items !== 'undefined' && items !== null && items.length > 0)">
                    <Search 
                        placeholder="Search Category"
                        className="search custom-search"
                        :inputData.sync="search" />
                </div>
            </template>

            <template v-slot:[`item.name`]="{ item }">
                <div class="mobile-category-name">
                    <div class="item-name">{{ item.name }}</div>

                    <div class="actions">
                        <button class="btn-white mr-2" @click.stop="editCategory(item)">
                            <img src="../../../assets/icons/edit-inventory.svg" alt="">
                        </button>

                        <button class="btn-white" @click.stop="deleteCategory(item)">                    
                            <img src="../../../assets/icons/delete-blue.svg" alt="">
                        </button>
                    </div>
                </div>
            </template>

            <template v-slot:[`item.description`]="{ item }">
                <div class="mobile-category-unit">
                    <div class="item-unit">{{ typeof item.no_of_products !== 'undefined' ? item.no_of_products : '0' }} <span>Products</span></div>
                </div>
            </template>

            <template v-slot:[`item.no_of_products`]="{ item }">
                <div class="mobile-category-desc">
                    <div class="item-desc">{{ (item.description !== null && item.description !== "") ? item.description : '--' }}</div>
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

export default {
    name: 'CategoryMobileTable',
    props: ['items', 'isMobile'],
    components: {
        Search,
        Pagination
    },
    data: () => ({
        page: 1,
        pageCount: 0,
        itemsPerPage: 15,
        search: '',
        headers: [
            {
                text: 'CATEGORY NAME',
                align: 'start',
                sortable: false,
                value: 'name',
                fixed: true,
                width: '30%'
            },
            { 
                text: 'DESCRIPTION', 
                value: 'description',
                sortable: false,
                fixed: true,
                width: '30%'
            },
            { 
                text: 'NO OF PRODUCT', 
                align: 'end',
                value: 'no_of_products', 
                sortable: false,
                fixed: true,
                width: '20%'
            },
            { 
                text: '', 
                align: 'end',
                value: 'actions', 
                sortable: false,
                fixed: true,
                width: '20%'
            },
        ],
    }),
    computed: {
        ...mapGetters({
            getCategories: 'category/getCategories',
            getCategoriesLoading: 'category/getCategoriesLoading',
            getCreateCatLoading: 'category/getCreateCatLoading',
            getUpdateCatLoading: 'category/getUpdateCatLoading',
            gettDeleteCatLoading: 'category/gettDeleteCatLoading',
            getDeleteCat: 'category/getDeleteCat',
            getUser: 'getUser'
        }),
    },
    methods: {
        ...mapActions({
            fetchCategories: 'category/fetchCategories',
            createCategories: 'category/createCategories',
            updateCategories: 'category/updateCategories',
            deleteCategories: 'category/deleteCategories',
            fetchUser: 'fetchUser'
        }),
        addCategory() {
            this.$emit('addCategory')
        },
        editCategory(category) {
            this.$emit('editCategory', category)
        },
        deleteCategory(category) {
            this.$emit('deleteCategory', category)
        }
    },
    mounted() {}
}
</script>

<style>
.manage-category-table-mobile .search-component .search-component-wrapper {
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
}

.manage-category-table-mobile .search-component .search-component-wrapper .v-input,
.manage-category-table-mobile .search-component .search-component-wrapper .v-input .v-input__control .v-input__slot {
    width: 100% !important;
    margin-bottom: 0;
}

.manage-category-table-mobile .search-component .search-component-wrapper .v-input .v-input__control .v-text-field__details {
    display: none;
}

.mobile-category-name .item-name {
    font-family: 'Inter-SemiBold', sans-serif !important;
    font-size: 16px;
    white-space: nowrap;
    width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: start;
}
</style>
