<template>
    <v-dialog v-model="dialog" max-width="800px" content-class="product-dialog" :retain-focus="false" @click:outside="close">
        <template v-slot:activator="{ on, attrs }">
            <v-btn dark color="primary" class="add-product-button" v-bind="attrs" v-on="on">
                Add Product
            </v-btn>
        </template>

        <v-card class="product-dialog-card">
            <v-card-title>
                <span class="headline">{{ formTitle }}</span>

                <button icon dark class="btn-close" @click="close">
                    <v-icon>mdi-close</v-icon>
                </button>
            </v-card-title>

            <v-card-text>
                <div class="add-wrapper">
                    <div class="product-info">
                        <div class="product-number">
                            <p class="product-title">SKU</p>
                            <v-radio-group v-model="isCustom" mandatory v-if="editedIndexData === -1">
                                <v-radio label="System Generated" value="generated"></v-radio>
                                <v-radio label="Custom Number" value="custom"></v-radio>

                                <span class="custom-wrapper" v-if="isCustom == 'custom'">
                                    <img src="@/assets/icons/item-icon.svg" alt="" class="box-icon" />
                                    
                                    <v-text-field
                                        height="40px"
                                        color="#002F44"
                                        width="200px"
                                        type="number"
                                        dense
                                        class="text-fields custom"
                                        placeholder="Enter Product Number"
                                        outlined
                                        v-model="editedItem.sku">
                                    </v-text-field>
                                </span>
                            </v-radio-group>

                            <div class="custom-wrapper ml-0 mb-2" v-if="editedIndexData > -1">
                                <img src="@/assets/icons/item-icon.svg" alt="" class="box-icon" />
                                
                                <v-text-field
                                    height="40px"
                                    color="#002F44"
                                    width="200px"
                                    type="number"
                                    dense
                                    class="text-fields custom"
                                    placeholder="Enter Product Number"
                                    outlined
                                    v-model="editedItemData.sku">
                                </v-text-field>
                            </div>
                        </div>

                        <div class="product-name mb-2">
                            <p class="product-title">PRODUCT NAME</p>
                            <v-text-field
                                height="40px"
                                color="#002F44"
                                width="200px"
                                dense
                                class="text-fields select-items"
                                placeholder="Enter Product Name"
                                outlined
                                v-model="editedItem.name">
                            </v-text-field>
                        </div>

                        <div class="product-category">
                            <p class="product-title">CATEGORY</p>
                            <v-select
                                class="text-fields select-items"
                                :items="categoryLists"
                                item-text="name"
                                item-value="id"
                                placeholder="Select the category"
                                outlined
                                v-model="editedItem.category_id"></v-select>
                        </div>
                    </div>

                    <div class="product-description">                      
                        <div class="product-notes">
                            <p class="product-title">PRODUCT DESCRIPTION (Optional)</p>
                            <v-textarea
                                height="100"
                                class="text-fields description"
                                outlined
                                name="input-7-4"
                                placeholder="Type description of the product..."
                                v-model="editedItem.description"></v-textarea>
                        </div>

                        <div class="product-each mt-2 mb-2">
                            <p class="product-title">IN EACH CARTON</p>
                            <v-text-field
                                height="40px"
                                color="#002F44"
                                width="200px"
                                dense
                                class="text-fields"
                                placeholder="1 units"
                                outlined
                                type="number"
                                v-model="editedItem.units_per_carton">
                            </v-text-field>
                        </div>

                        <div class="product-img mt-2">
                            <p class="product-title">PRODUCT IMAGE (Optional)</p>
                            <div id="product-img-select-box-id" 
                                v-show="(product.create.image=='' && (editedItem.image=='' || editedItem.image==null && product.edit.image==''))" 
                                class="product-img-select-box mt-2" @click="selectProductImage()">
                                    Browse Image
                            </div>

                            <!-- <div class="product-img-selected-image-container mt-2" 
                                v-show="(product.create.image!=='' || this.editedItem.image !== null)">
                                <img class="product-img-selected-image" 
                                :src="product.create.image !== '' ? product.create.image : convertImageToBlob(this.editedItem.image)" />
                            </div> -->
                            <div v-if="product.create.image !=='' || (editedItem.image !=='' && editedItem.image!==null) || product.edit.image!==''" class="product-img-selected-image-container mt-2" 
                                v-show="(product.create.image !=='' || editedItem.image !=='')">
                                <img v-if="product.edit.image !==''" class="product-img-selected-image" :src="product.edit.image" />

                                <img v-if="editedItem.image !=='' && editedItem.image!==null && product.edit.image =='' && editedIndexData > -1" class="product-img-selected-image" :src="editedItem.image" />

                                <img v-if="product.create.image !=='' && editedIndexData === -1" class="product-img-selected-image" :src="product.create.image" />
                            </div>

                            <input 
                                ref="product_image_reference" 
                                type="file" 
                                id="product_image" 
                                @change="(e) => readFile(e)" 
                                name="product_image"
                                accept="image/png, image/jpg, image/jpeg" />

                            <div class="button-appear-success" 
                                v-show="(product.create.image!=='' || (editedItem.image!=='' && editedItem.image!==null) || product.edit.image!=='')">
                                <button class="btn-white mr-2" @click="selectProductImage()">
                                    <img src="@/assets/icons/upload.svg" alt="" width="12px" height="12px">
                                    <span class="ml-1">Re-upload</span>
                                </button>

                                <button class="btn-white" @click="removeProductImage()">
                                    <img src="@/assets/icons/deleteIcon.svg" alt="">
                                </button>
                            </div>  
                        </div>
                    </div>
                </div>
            </v-card-text>

            <v-card-actions>
                <v-btn class="btn-blue" text @click="save" :disabled="!isValid">                    
                    <span v-if="editedIndexData === -1">
                        <span v-if="!loadingOnce">Add Product</span>
                        <span v-if="loadingOnce">Adding...</span>
                    </span>

                    <span v-if="editedIndexData > -1">
                        <span v-if="!loadingOnce">Update Product</span>
                        <span v-if="loadingOnce">Updating...</span>
                    </span>
                </v-btn>
                <v-btn class="btn-white" text @click="saveAndAdd" :disabled="!isValid">
                    <span v-if="editedIndexData === -1">
                        <span v-if="!loadingAndAnother">Save & Add Another</span>
                        <span v-if="loadingAndAnother">Saving...</span>
                    </span>

                    <span v-if="editedIndexData > -1">
                        <span v-if="!loadingAndAnother">Update & Add Another</span>
                        <span v-if="loadingAndAnother">Updating...</span>
                    </span>
                </v-btn>
                <v-btn class="btn-white" text @click="close" v-if="!isMobile">
                    Cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import iziToast from "izitoast"

export default {
    name: 'AddProductDialog',
    props: ['editedItemData','editedIndexData', 'dialogData', 
            'isMobile', 'categoryLists', 'loadingOnce', 
            'loadingAndAnother', 'isValid', 'customSku',],
    components: {},
    data: () => ({
        radioGroup1: 'generated',
        product: {
            create: {
                image: '',
                imageFile: null
            },
            edit: {
                image: '',
                imageFile: null
            }
        },
        fileReader: null,
        fileReaderUpdate: null,
        isFileUploadSuccess: false,
        showRemoveButton: false
    }),
    created() {
        this.$root.$refs.AddProductDialog = this;
    },
    methods: {    
        notificationError(message) {
            iziToast.warning({
                class: 'categories-toast',
                title: 'Warning',
                message: `${message}`,
                displayMode: 1,
                position: 'topRight',
                timeout: 3000,
            });
        }, 
        save() {            
            let { image, ...otherItems } = this.editedItem

            if ( this.editedIndexData > -1) {
                //check product edit
                if (this.product.edit.image!=='') {
                    if (this.product.edit.imageFile.type == 'image/gif' || this.product.edit.imageFile.type == 'image/svg+xml') {
                        let message = "The image must be a file of type: jpg, png, jpeg."
                        this.notificationError(message)
                    } else {
                        
                        image = this.product.edit.imageFile
                        let passedData = {
                            image,
                            ...otherItems
                        }
                        //this.$emit('save', this.editedItem)
                        this.$emit('save', passedData)
                    }
                } else {
                    image = null
                    let passedData = {
                        image,
                        ...otherItems
                    }
                    this.$emit('save', passedData)
                }
            } else {
                //check product create
                if (this.product.create.image!=='') {
                    if (this.product.create.imageFile.type == 'image/gif' || this.product.create.imageFile.type == 'image/svg+xml') {
                        let message = "The image must be a file of type: jpg, png, jpeg."
                        this.notificationError(message)
                    } else {
                        image = this.product.create.imageFile
                        let passedData = {
                            image,
                            ...otherItems
                        }
                        //this.$emit('save', this.editedItem)
                        this.$emit('save', passedData)
                    } 
                } else {
                    image = null
                    let passedData = {
                        image,
                        ...otherItems
                    }
                    this.$emit('save', passedData)
                }
            }
        },
        saveAndAdd() {
            let {
                image,
                ...otherItems
            } = this.editedItem

            if ( this.editedIndexData > -1) {
                //check product edit
                if (this.product.edit.image!=='') {
                    if (this.product.edit.imageFile.type == 'image/gif' || this.product.edit.imageFile.type == 'image/svg+xml') {
                        let message = "The image must be a file of type: jpg, png, jpeg."
                        this.notificationError(message)
                    } else {
                        
                        image = this.product.edit.imageFile
                        let passedData = {
                            image,
                            ...otherItems
                        }
                        //this.$emit('save', this.editedItem)
                        this.$emit('saveAndAdd', passedData)
                    }
                } else {
                    image = null
                    let passedData = {
                        image,
                        ...otherItems
                    }
                    this.$emit('saveAndAdd', passedData)
                }
            } else {
                //check product create
                if (this.product.create.image!=='') {
                    if (this.product.create.imageFile.type == 'image/gif' || this.product.create.imageFile.type == 'image/svg+xml') {
                        let message = "The image must be a file of type: jpg, png, jpeg."
                        this.notificationError(message)
                    } else {
                        image = this.product.create.imageFile
                        let passedData = {
                            image,
                            ...otherItems
                        }
                        
                        this.$emit('saveAndAdd', passedData)
                    } 
                } else {
                    image = null
                    let passedData = {
                        image,
                        ...otherItems
                    }
                    this.$emit('saveAndAdd', passedData)
                }
            }
        },
        close() {
            this.$emit('update:dialogData', false)
            this.removeProductImage()
        },
        readFile(e) {
            console.log(e);
            let file = this.$refs.product_image_reference.files[0]
            this.fileReader.readAsDataURL(file)
            
            this.fileReader.onload = () => {
                if (this.editedIndexData > -1) {
                   // this.editedItem.imageCreate = file
                   // this.editedItem.image = this.fileReader.result
                    this.product.edit.imageFile = file
                    this.product.edit.image = this.fileReader.result
                } else {
                    this.product.create.imageFile = file
                    this.product.create.image = this.fileReader.result   
                }
            }

            this.fileReader.onerror = () => {
                console.log('An error occured.')
                console.log(this.fileReader.error);
            }
        },
        removeProductImage() {
            this.$refs.product_image_reference.value = ''
            this.product.create.image = ''
            this.product.create.imageFile = null
            this.editedItem.imageCreate = null
            this.editedItem.image = null
            this.product.edit.image = ''
            this.product.edit.imageFile = null
        },
        selectProductImage() {
            this.$refs.product_image_reference.click()
        },
    },
    watch: {},
    computed: {
        ...mapGetters({
			getUpdatedProduct: 'products/getUpdatedProduct',
            getCurrentSelectedProduct: 'products/getCurrentSelectedProduct'
        }),
        formTitle () {
            return this.editedIndexData === -1 ? 'Add Product' : 'Edit Product'
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
        editedItem: {
            get () {
                return this.editedItemData
            },
            set (value) {
                console.log('What is test value',value);
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
    },
    mounted() {
        this.fileReader = new FileReader()
        this.fileReaderUpdate = new FileReader()
    },
    updated() {
        if ( this.$store.state.products.reset ) {
            this.$store.dispatch("products/setReset", false)
            this.product = {
                create: {
                    image: '',
                    imageFile: null
                },
                edit: {
                    image: '',
                    imageFile: null
                }
            }
        }
    },
}
</script>

<style>
@import '../../assets/css/products_styles/productAddDialog.css';

.custom-wrapper {
    position: relative;
    margin-left: 30px;
}

.custom-wrapper img {
    position: absolute;
    top: 15px;
    left: 12px;
    z-index: 10;
}

.custom-wrapper .v-input.text-fields.custom .v-input__control .v-input__slot input {
    padding-left: 25px;
}

.custom-wrapper .v-input.text-fields.custom .v-input__control .v-input__slot {
    background-color: #fff;
}

.product-dialog .product-img {
    min-height: 185px;
}

.product-dialog .product-img .btn-white {
    background-color: #fff !important;
    border: 1px solid #B4CFE0;
    color: #0171A1 !important;
    padding: 8px !important;
    font-size: 14px;
    height: 35px;
    text-transform: capitalize;
    letter-spacing: 0;
    box-shadow: none !important;
    margin-top: 10px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.product-dialog .product-img .btn-white.inside-box {
    width: 100%;
    background-color: #fff !important;
    border: 1px solid #B4CFE0;
    color: #0171A1 !important;
    padding: 10px !important;
    font-size: 14px;
    min-height: 30px;
    text-transform: capitalize;
    letter-spacing: 0;
    box-shadow: none !important;
    margin-top: 10px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.product-dialog .product-img .button-appear-success {
    display: flex;
}

.product-dialog .product-img .vue-dropzone {
    width: 150px;
    height: 150px;
    padding: 0;
    border: 2px solid #B4CFE0;
    border-style: dashed;
    border-radius: 4px;
    margin-top: 5px;
}

.dropzone.dz-clickable .dz-message, .dropzone.dz-clickable .dz-message {
    color: #B4CFE0;
    font-size: 14px;
    width: 100px;
    margin: 25px auto;
    line-height: 20px;
}

.product-dialog .product-img .dropzone .dz-preview {
    margin: 0 !important;
}

.dropzone .dz-details {
    display: none;
}

.product-dialog .product-img .dropzone .dz-preview .dz-remove {
    margin: 0 10px;
    font-size: 10px;
    padding: 6px;
    width: 85%;
    display: none;
}

/*  */
#product_image {
    display: none;
}

.product-img-select-box {
    cursor: pointer;
    border: 2px solid #B4CFE0;
    border-style: dashed;
    width: 150px;
    height: 150px;
    border-radius: 4px;
    padding: 35px 20px;
    text-align: center;
    font-size: 14px;
    color: #819FB2;
    background-color: #ffff;
    transition: 0.3s background-color;
}

.product-img-selected-image {
    width: 146px;
    max-width: 146px;
    height: 146px;
    border-radius: 4px;
}

.product-img-selected-image-container {
    position: relative;
    width: 150px;
    height: 150px;
    border: 2px solid #B4CFE0;
    border-style: dashed;
    border-radius: 4px;
}

.product-img-selected-image-remove {
    font-size: 12px;
    position: absolute;
    top: -9px;
    right: -8px;
    z-index: 100;
    width: 20px;
    height: 20px;
    background: black;
    color: white;
    cursor: pointer;
    border-radius: 15px;
    text-align: center;
    line-height: 17px;
}

.product-img-select-box:hover {
    background-color: #f6f6f6;
    transition: 0.3s background-color;
}
</style>