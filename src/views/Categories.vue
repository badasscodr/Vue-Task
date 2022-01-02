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
                :items="categories"
                @addCategory="addCategory"
                @editCategory="editCategory"
                @deleteCategory="deleteCategory"
                :isMobile="isMobile"
                v-if="!isMobile" />

            <!-- Categories Table Mobile View -->
            <CategoryMobileTable 
                :items="categories"
                @addCategory="addCategory"
                @editCategory="editCategory"
                @deleteCategory="deleteCategory"
                :isMobile="isMobile"
                v-if="isMobile" />

            <CreateDialog
                :dialogData.sync="dialogCategoryCreate"
                :editedItemData.sync="editedCategoryItem"
                :editedIndexData.sync="editedCategoryIndex"
                @close="closeCategory"
                :isMobile="isMobile" />

            <DeleteDialog 
                :dialogData.sync="dialogDeleteCategory"
                :editedItemData.sync="currentItemToDelete"
                @delete="deleteCategoryConfirm"
                @close="closeDelete"
                :fromComponent="'category'"
                :loadingDelete="gettDeleteCatLoading"
                componentName="Category" />

            <DeletionFailed 
                :dialogData.sync="dialogDeleteFailed"
                @close="closeFailedDelete"
                :message="'You cannot delete a category that has an associated product.'" />
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CategoryDesktopTable from '../components/Tables/Categories/CategoryDesktopTable.vue'
import CategoryMobileTable from '../components/Tables/Categories/CategoryMobileTable.vue'
import DeleteDialog from '../components/Dialog/DeleteDialog.vue'
import DeletionFailed from '../components/Dialog/DeletionFailed.vue'
import globalMethods from '../utils/globalMethods'
import CreateDialog from '../components/ProductComponents/Categories/CreateDialog.vue'

export default {
    name: 'ManageCategories',
    components: {
        CategoryDesktopTable,
        CategoryMobileTable,
        CreateDialog,
        DeleteDialog,
        DeletionFailed
    },
    data: () => ({
        dialogCategoryCreate: false,
        editedCategoryIndex: -1,
        editedCategoryItem: {
            name: '',
            description: '',
        },
        defaultCategoryItem: {
            name: '',
            description: '',
        },
        dialogDeleteCategory: false,
        dialogDeleteFailed: false,
        currentItemToDelete: null,
        isMobile: false
    }),
    watch: { },
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
        ...globalMethods,
        onResize() {
			if (window.innerWidth < 1023) {
				this.isMobile = true
			} else {
				this.isMobile = false;
			}
		},
        addCategory() {
            this.dialogCategoryCreate = true
        },
        editCategory(category) {
            this.editedCategoryIndex = this.categories.indexOf(category)
            this.editedCategoryItem = Object.assign({}, category)
            this.dialogCategoryCreate = true
        },
        deleteCategory(category) {
            this.editedCategoryIndex = this.categories.indexOf(category)
            this.editedItem = Object.assign({}, category)
            this.dialogDeleteCategory = true

            this.currentItemToDelete = {
                name: category.name,
                id: category.id,
                no_of_prod: category.no_of_products
            }
        },
        async deleteCategoryConfirm() {
            if (this.currentItemToDelete !== null) {
                try {
                    await this.deleteCategories(this.currentItemToDelete.id)
                    this.fetchCategories()
                    this.closeDelete()
                    this.notificationMessage('Category has been deleted.')
                } catch (e) {
                    this.closeDelete()

                    if (this.currentItemToDelete.no_of_prod !== 0) {
                        this.dialogDeleteFailed = true
                    } else {
                        this.notificationError(e)
                    }
                }
            }
        },
        closeDelete() {
            this.dialogDeleteCategory = false

            this.$nextTick(() => {
                this.editedCategoryItem = Object.assign({}, this.defaultCategoryItem)
                this.editedCategoryIndex = -1
            })
        },
        closeFailedDelete() {
            this.dialogDeleteFailed = false
        },
        closeCategory() {
            this.$nextTick(() => {
                this.editedCategoryItem = Object.assign({}, this.defaultCategoryItem)
                this.editedCategoryIndex = -1
            })

            this.dialogCategoryCreate = false
        },
    },
    created () {
        
    },
    mounted() {
        this.$store.dispatch("page/setPage","products")
        this.fetchCategories()
    },
    updated() {}
}
</script>

<style lang="scss">
/* @import '../assets/css/products_styles/categories.css'; */

@import '../assets/scss/pages_scss/category/categories.scss';
@import '../assets/scss/pages_scss/category/categoriesDialog.scss';
@import '../assets/scss/buttons.scss';
@import '../assets/scss/pages_scss/dialog/globalDialog.scss';
</style>
