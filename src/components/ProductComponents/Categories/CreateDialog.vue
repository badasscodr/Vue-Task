<template>
    <v-dialog v-model="dialog"  max-width="560px" content-class="category-dialog" :retain-focus="false" @click:outside="close">
        <v-card class="dialog-wrapper">
            <v-form ref="form" v-model="valid" action="#" @submit.prevent="">
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>

                    <button icon dark class="btn-close" @click="close">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </v-card-title>

                <v-card-text>
                    <div class="category-wrapper mb-3">
                        <p class="item-title">CATEGORY NAME</p>

                        <v-text-field
                            height="40px"
                            color="#002F44"
                            width="240px"
                            dense
                            class="carton"
                            placeholder="Type item name"
                            outlined
                            v-model="editedItem.name"
                            :rules="rules"
                            hide-details="auto"
                            @keydown="inputRestrictSpecialChar($event)">
                        </v-text-field>
                    </div>

                    <div class="item-image">
                        <p class="item-title">DESCRIPTION (Optional)</p>

                        <v-textarea
                            name="input-7-1"
                            dense
                            outlined
                            class="description"
                            placeholder="Type description of the item..."
                            v-model="editedItem.description"
                            hide-details="auto">
                        </v-textarea>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <button class="btn-blue" @click="saveCategory"> 
                        <span v-if="editedIndexData === -1">
                            <span v-if="!loadingOnce">Add Category</span>
                            <span v-if="loadingOnce">Adding...</span>
                        </span>

                        <span v-if="editedIndexData > -1">
                            <span v-if="!loadingOnce">Update Category</span>
                            <span v-if="loadingOnce">Updating...</span>
                        </span>
                    </button>
                    <button class="btn-white" @click="saveAnddAddCategory">
                        <span v-if="editedIndexData === -1">
                            <span v-if="!loadingAndAddAnother">Save & Add Another</span>
                            <span v-if="loadingAndAddAnother">Saving...</span>
                        </span>

                        <span v-if="editedIndexData > -1">
                            <span v-if="!loadingAndAddAnother">Update & Add Another</span>
                            <span v-if="loadingAndAddAnother">Updating...</span>
                        </span>
                    </button>
                    <button class="btn-white" @click="close" v-if="!isMobile"> Cancel </button>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import globalMethods from '../../../utils/globalMethods'

export default {
    props: ['dialogData', 'editedItemData', 'editedIndexData', 'isMobile'],
    mounted() {},
    data: () => ({
        valid: true,
        loadingOnce: false,
        loadingAndAddAnother: false,
        rules: [
            (v) => !!v || "Input is required.",
            (v) => /^.{1,250}$/.test(v) || 'Only 250 maximum characters allowed.'
        ]
    }),
    computed: {
        ...mapGetters({
            getUser: 'getUser'
        }),
        formTitle () {
            return this.editedIndexData === -1 ? 'Add Category' : 'Edit Category'
        },
        isValid() {
            if (this.editedItem.name !== '') {
                return true
            } else {
                return false
            }
        },
        dialog: {
            get () {
                return this.dialogData
            },
            set (value) {
                this.$emit('update:dialogData', value)
            }
        },
        editedItem: {
            get () {
                return this.editedItemData
            },
            set (value) {
                this.$emit('update:editedItemData', value)
            }
        },        
    },
    methods: {  
        ...mapActions({
            fetchCategories: 'category/fetchCategories',
            createCategories: 'category/createCategories',
            updateCategories: 'category/updateCategories',
        }),
        ...globalMethods,
        async saveCategory() {
            let { name, description, id } = this.editedItem

            let passedData = {
                name,
                description
            }

            passedData.customer_id = (typeof this.getUser=='string') ? JSON.parse(this.getUser).customer.id : ''

            this.$refs.form.validate()

            if (this.$refs.form.validate()) {
                // if updating
                if (this.editedIndexData > -1) {
                    this.loadingOnce = true

                    let finalData = {
                        passedData,
                        cat_id: id
                    }

                    try {
                        await this.updateCategories(finalData)
                        this.loadingOnce = false
                        this.fetchCategories()
                        this.close()
                        this.notificationMessage('Category has been updated.')
                    } catch(e) {
                        this.loadingOnce = false
                        this.close()
                        this.notificationError(e)
                    }

                // if creating
                } else {
                    this.loadingOnce = true

                    try {
                        await this.createCategories(passedData)
                        this.loadingOnce = false
                        this.fetchCategories()
                        this.close()        
                        this.notificationMessage('Category has been created!')                       
                    } catch(e) {
                        this.loadingOnce = false
                        this.close()
                        this.notificationError(e)
                    }      
                } 
            }              
        },
        async saveAnddAddCategory() {
            let { name, description, id } = this.editedItem

            let passedData = {
                name,
                description
            }

            passedData.customer_id = (typeof this.getUser=='string') ? JSON.parse(this.getUser).customer.id : ''

            this.$refs.form.validate()

            if (this.$refs.form.validate()) { 
                // if updating
                if (this.editedIndexData > -1) {
                    this.loadingAndAddAnother = true

                    let finalData = {
                        passedData,
                        cat_id: id
                    }

                    try {
                        await this.updateCategories(finalData)
                        this.loadingAndAddAnother = false
                        this.fetchCategories()
                        this.setToDefault()
                        this.notificationMessage('Category has been updated.')
                    } catch(e) {
                        this.loadingAndAddAnother = false
                        this.notificationError(e)
                    }

                // if creating
                } else {
                    this.loadingAndAddAnother = true

                    try {
                        await this.createCategories(passedData)
                        this.loadingAndAddAnother = false
                        this.fetchCategories()
                        this.setToDefault()        
                        this.notificationMessage('Category has been created!')                       
                    } catch(e) {
                        this.loadingAndAddAnother = false
                        this.notificationError()
                    }      
                }
            }            
        },
        close() {
            this.$refs.form.resetValidation()
            this.$emit('close')
        },
        setToDefault() {
            this.close()
            this.dialog = true
        },
        inputRestrictSpecialChar(e) {
            if (/^\W$/.test(e.key)) {
                if (e.key !== '-' && e.key !== ' ') {
                    e.preventDefault();
                }
            }
        },
    },
    updated() {}
}
</script>

<style>
@import '../../../assets/css/dialog_styles/dialogHeader.css';
@import '../../../assets/css/dialog_styles/dialogFooter.css';
@import '../../../assets/css/dialog_styles/deleteDialog.css';
</style>
