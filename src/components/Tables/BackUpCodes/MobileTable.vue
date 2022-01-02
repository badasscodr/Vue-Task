<template>
    <v-data-table
        :headers="headers"
        :items="items"
        sort-by="name"
        :page.sync="page"
        :items-per-page="itemsPerPage"
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
                            
            <div class="no-data-wrapper" v-if="!getCategoriesLoading && items == null">
                <div class="no-data-heading">
                    <h3> Add Category </h3>
                    <p>
                        Let’s add the first product category on Shifl. You can use category to organize your products & managing Inventory.
                    </p>

                    <div class="mt-4">                                
                        <CreateDialog
                            :dialogData.sync="dialog"
                            :editedItemData.sync="editedItem"
                            :editedIndexData.sync="editedIndex"
                            @close="close"
                            @save="save"
                            @saveAndAdd="saveAndAdd"
                            :isMobile="isMobile"
                            :isValid="valid"
                            :loadingOnce="loadingOnce"
                            :loadingAndAnother="loadingAndAnother"
                        />
                    </div>
                </div>
            </div>
        </template>

        <template v-slot:top>
            <v-toolbar flat >
                <v-toolbar-title>Categories</v-toolbar-title>
                
                <v-spacer></v-spacer>

                <CreateDialog
                    :dialogData.sync="dialog"
                    :editedItemData.sync="editedItem"
                    :editedIndexData.sync="editedIndex"
                    @close="close"
                    @save="save"
                    @saveAndAdd="saveAndAdd"
                    :isMobile="isMobile"
                    :isValid="valid"
                    :loadingOnce="loadingOnce"
                    :loadingAndAnother="loadingAndAnother"
                />

                <DeleteDialog 
                    :dialogData.sync="dialogDelete"
                    :editedItemData.sync="editedItem"
                    @delete="deleteItemConfirm"
                    @close="closeDelete"
                    :fromComponent="'category'"
                    :loadingDelete="gettDeleteCatLoading"
                    componentName="Category" />

                <DeleteFailed 
                    :dialogData.sync="deleteFailed"
                    @close="closeFailedDelete"
                    :message="'You cannot delete a category that has an associated product.'" />
            </v-toolbar>
        </template>

        <template v-slot:[`item.name`]="{ item }">
            <div class="mobile-category-name">
                <div class="item-name" style="font-family: 'Inter-SemiBold', sans-serif !important; font-size: 16px;">{{ item.name }}</div>
                <div class="actions">
                    <v-icon small class="mr-2 btn-white" @click="editItem(item)">
                        mdi-pencil
                    </v-icon>

                    <v-icon small class="btn-white" @click="deleteItem(item)">
                        mdi-delete
                    </v-icon>
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateDialog from '../../ProductComponents/Categories/CreateDialog.vue'
import DeleteDialog from '../../Dialog/DeleteDialog.vue'
import DeleteFailed from '../../Dialog/DeletionFailed.vue'

export default {
    name: 'CategoryMobileTable',
    props: ['headers', 'items', 'pageData', 'itemsPerPage', 
            'lengthData', 'isMobile', 'editedItemFromParent', 
            'defaultItemFromParent', 'dialogData', 'dialogDeleteFailedData', 
            'dialogDeleteData', 'editedIndexDataFromParent', 'loadingOnceData',
            'loadingAndAnotherData'],
    components: {
        CreateDialog,
        DeleteDialog,
        DeleteFailed
    },
    data: () => ({
        
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
        valid() {
            if (this.editedItem.name !== '') {
				return true
			} else {
                return false
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
        deleteFailed: {
            get () {
                return this.dialogDeleteFailedData
            },
            set (value) {
                if (!value) {
                    this.$emit('update:dialogDeleteFailedData', false)
                } else {
                    this.$emit('update:dialogDeleteFailedData', true)
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
        loadingOnce: {
            get() {
                return this.loadingOnceData
            },
            set(value) {
                console.log(value)
            }
        },
        loadingAndAnother: {
             get() {
                return this.loadingAndAnotherData
            },
            set(value) {
                console.log(value)
            }
        }
    },
    methods: {
        ...mapActions({
            fetchCategories: 'category/fetchCategories',
            createCategories: 'category/createCategories',
            updateCategories: 'category/updateCategories',
            deleteCategories: 'category/deleteCategories',
            fetchUser: 'fetchUser'
        }),
        editItem(item) {
            this.$emit('editItem', item)
        },
        deleteItem(item) {
            this.$emit('deleteItem', item)
        },
        deleteItemConfirm(item) {
            this.$emit('deleteItemConfirm', item)
        },
        closeFailedDelete() {
            this.$emit('closeFailedDelete', false)
        },
        close() {
            this.$emit('update:dialogData', false)
        },
        closeDelete() {
            this.$emit('update:dialogDeleteData', false)
        },
        save() {
            this.$emit('save', this.editedItem)
        },
        saveAndAdd() {
            this.$emit('saveAndAdd', this.editedItem)
        }
    },
    mounted() {

    }
}
</script>
