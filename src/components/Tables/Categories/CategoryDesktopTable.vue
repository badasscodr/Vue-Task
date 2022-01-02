<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            sort-by="name"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :search="search"
            mobile-breakpoint="1023"
            @page-count="pageCount = $event"
            class="manage-category-table elevation-1"
            :class="(typeof items !== 'undefined' && items !== null && items.length > 0) ? '' : 'no-data-table'"
            hide-default-footer
            fixed-header>

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

                    <div class="search-component" v-if="(typeof items !== 'undefined' && items !== null && items.length > 0)">
                        <Search 
                            placeholder="Search Category"
                            className="search custom-search"
                            :inputData.sync="search" />
                    </div>

                    <v-btn color="primary" dark class="btn-blue add-category" @click.stop="addCategory">
                        Add Category
                    </v-btn>
                </v-toolbar>
            </template>

            <template v-slot:[`item.name`]="{ item }">
                <p class="mb-0 item-name">{{ item.name }}</p>
            </template>

            <template v-slot:[`item.description`]="{ item }">
                <div class="item-unit">{{ (item.description !== null && item.description !== "") ? item.description : '--' }}</div>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <div class="actions">
                    <button class="btn-white mr-2" @click.stop="editCategory(item)">
                        <img src="../../../assets/icons/edit-inventory.svg" alt="">
                    </button>

                    <button class="btn-white" @click.stop="deleteCategory(item)">                    
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

export default {
    name: 'CategoryDesktopTable',
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
