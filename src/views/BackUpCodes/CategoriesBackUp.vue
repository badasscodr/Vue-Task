<template>
    <div class="manage-category-wrapper" v-resize="onResize">
        <div class="details-breadcrumbs">
            <router-link to="/products" class="product-link">
                Products
            </router-link>

            <span class="right-chevron">
                <img src="../assets/images/right_chevron.svg" alt="" srcset="" width="7px">
            </span>

            <p class="manage-category">
                Manage Categories
            </p>
        </div>

        <div class="manage-category-table-wrapper">
            <!-- Categories Table Desktop View -->
            <CategoryDesktopTable 
                :headers="headers" 
                :items="categories"
                :pageData.sync="page"
                :itemsPerPage="itemsPerPage"
                :lengthData.sync="pageCount"
                :isMobile="isMobile"
                :editedItemFromParent.sync="editedItem"
                :defaultItemFromParent.sync="defaultItem"
                :dialogData.sync="dialog"
                :dialogDeleteFailedData.sync="deleteFailed"
                :dialogDeleteData.sync="dialogDelete"
                :editedIndexDataFromParent.sync="editedIndex"
                @closeFailedDelete="closeFailedDelete"
                @deleteItem="deleteItem"
                @editItem="editItem"
                @close="close"
                @save="save"
                @saveAndAdd="saveAndAdd"
                @deleteItemConfirm="deleteItemConfirm"
                @closeDelete="closeDelete"
                :loadingOnceData="loadingOnce"
                :loadingAndAnotherData="loadingAndAnother"
                v-if="!isMobile" />

            <!-- Categories Table Mobile View -->
            <CategoryMobileTable 
                :headers="headers" 
                :items="categories"
                :pageData.sync="page"
                :itemsPerPage="itemsPerPage"
                :lengthData.sync="pageCount"
                :isMobile="isMobile"
                :editedItemFromParent.sync="editedItem"
                :defaultItemFromParent.sync="defaultItem"
                :dialogData.sync="dialog"
                :dialogDeleteFailedData.sync="deleteFailed"
                :dialogDeleteData.sync="dialogDelete"
                :editedIndexDataFromParent.sync="editedIndex"
                @closeFailedDelete="closeFailedDelete"
                @deleteItem="deleteItem"
                @editItem="editItem"
                @close="close"
                @save="save"
                @saveAndAdd="saveAndAdd"
                @deleteItemConfirm="deleteItemConfirm"
                @closeDelete="closeDelete"
                :loadingOnceData="loadingOnce"
                :loadingAndAnotherData="loadingAndAnother"
                v-if="isMobile" />
            
            <Pagination 
                v-if="typeof categories !== 'undefined' && categories.length > 0"
                :pageData.sync="page"
                :lengthData.sync="pageCount"
                :isMobile="isMobile"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CategoryDesktopTable from '../../components/Tables/Categories/CategoryDesktopTable.vue'
import CategoryMobileTable from '../../components/Tables/Categories/CategoryMobileTable.vue'
import Pagination from '../../components/Pagination.vue'
import iziToast from "izitoast";

export default {
    name: 'ManageCategories',
    components: {
        CategoryDesktopTable,
        CategoryMobileTable,
        Pagination
    },
    data: () => ({
        isMobile: false,
        page: 1,
        pageCount: 0,
        itemsPerPage: 15,
        headers: [
            {
                text: 'CATEGORY NAME',
                align: 'start',
                sortable: false,
                value: 'name',
                fixed: true,
                width: '440px'
            },
            { 
                text: 'DESCRIPTION', 
                value: 'description',
                sortable: false,
                fixed: true,
                width: '465px'
            },
            { 
                text: 'NO OF PRODUCT', 
                align: 'end',
                value: 'no_of_products', 
                sortable: false,
                fixed: true,
                width: '160px'
            },
            { 
                text: '', 
                align: 'center',
                value: 'actions', 
                sortable: false,
                fixed: true,
                width: '110px'
            },
        ],
        dialog: false,
        dialogDelete: false,
        deleteFailed: false,
        editedIndex: -1,
        editedItem: {
            name: '',
            description: '',
        },
        defaultItem: {
            name: '',
            description: '',
        },
        currentItemToDelete: {},
        loadingOnce: false, // Creating and Updating only once
        loadingAndAnother: false // Creating and Updating then add again
    }),
    watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        },
        deleteFailed (val) {
            val || this.closeFailedDelete()
        }
    },
    computed: {
        ...mapGetters({
            getCategories: 'category/getCategories',
            getCategoriesLoading: 'category/getCategoriesLoading',
            getCreateCatLoading: 'category/getCreateCatLoading',
            getUpdateCatLoading: 'category/getUpdateCatLoading',
            gettDeleteCatLoading: 'category/gettDeleteCatLoading',
            getUser: 'getUser'
        }),
        categories() {
            return (typeof this.getCategories!=='undefined' && this.getCategories.length > 0) ? this.getCategories : []

           // return (typeof this.getCategories.data !=='undefined' && typeof this.getCategories.data.results!=='undefined') ? this.getCategories.data.results : null
        },
    },
    methods: {
        ...mapActions({
            fetchCategories: 'category/fetchCategories',
            createCategories: 'category/createCategories',
            updateCategories: 'category/updateCategories',
            deleteCategories: 'category/deleteCategories',
            fetchUser: 'fetchUser'
        }),
        onResize() {
			if (window.innerWidth < 767) {
				this.isMobile = true
			} else {
				this.isMobile = false;
			}
		},
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
        editItem (item) {
            this.editedIndex = this.categories.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem (item) {
            this.editedIndex = this.categories.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
            this.currentItemToDelete = {
                id: item.id,
                no_of_prod: item.no_of_products
            }
        },
        async deleteItemConfirm () {
            if (this.currentItemToDelete !== null) {
                try {
                    await this.deleteCategories(this.currentItemToDelete.id)
                    this.fetchCategories()
                    this.closeDelete()

                    let message = 'Category has been deleted.'
                    this.notificationMessage(message)
                } catch (e) {
                    this.closeDelete()

                    if (this.currentItemToDelete.no_of_prod !== 0) {
                        this.deleteFailed = true
                    } else {
                        this.notificationError()
                    }
                }
            }             
        },
        closeFailedDelete() {
            this.deleteFailed = false
        },
        close () {
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
            this.dialog = false
        },
        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        async save() {
            let passedData = {
                name: this.editedItem.name,
                description: this.editedItem.description,
            }

            passedData.customer_id = (typeof this.getUser=='string') ? JSON.parse(this.getUser).customer.id : ''

            // if updating
            if (this.editedIndex > -1) {
                this.loadingOnce = true

                let finalData = {
                    passedData,
                    cat_id: this.editedItem.id
                }

                try {
                    await this.updateCategories(finalData)
                    this.loadingOnce = false
                    this.fetchCategories()
                    this.close()

                    let message = 'Category has been updated.'      
                    this.notificationMessage(message)
                } catch(e) {
                    this.loadingOnce = false
                    this.close()
                    this.notificationError()
                }

            // if creating
            } else {
                this.loadingOnce = true

                try {
                    await this.createCategories(passedData)
                    this.loadingOnce = false
                    this.fetchCategories()
                    this.close()        

                    let message = 'Category has been created!'
                    this.notificationMessage(message)                       
                } catch(e) {
                    this.loadingOnce = false
                    this.close()
                    this.notificationError()
                }      
            }     
        },
        async saveAndAdd() {
            let passedData = {
                name: this.editedItem.name,
                description: this.editedItem.description
            }

            passedData.customer_id = (typeof this.getUser=='string') ? JSON.parse(this.getUser).customer.id : ''

            // if updating
            if (this.editedIndex > -1) {
                this.loadingAndAnother = true

                let finalData = {
                    passedData,
                    cat_id: this.editedItem.id
                }

                try {
                    await this.updateCategories(finalData)
                    this.loadingAndAnother = false
                    this.fetchCategories()
                    this.setToDefault()

                    let message = 'Category has been updated.'      
                    this.notificationMessage(message)
                } catch(e) {
                    this.loadingAndAnother = false
                    this.notificationError()
                }

            // if creating
            } else {
                this.loadingAndAnother = true

                try {
                    await this.createCategories(passedData)
                    this.loadingAndAnother = false
                    this.fetchCategories()
                    this.setToDefault()        

                    let message = 'Category has been created!'
                    this.notificationMessage(message)                       
                } catch(e) {
                    this.loadingAndAnother = false
                    this.notificationError()
                }      
            }     
        },
        setToDefault() {
            this.editedItem = this.defaultItem
            this.close()
            this.dialog = true
        }
    },
    created () {
        
    },
    mounted() {
        this.$store.dispatch("page/setPage","products")
        this.fetchCategories()

    },
    updated() {
    }
}
</script>

<style>
@import '../assets/css/products_styles/categories.css';
</style>