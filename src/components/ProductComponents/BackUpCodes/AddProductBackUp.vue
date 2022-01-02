<template>
    <v-dialog v-model="dialog" max-width="800px" content-class="product-dialog" :retain-focus="false">
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
                            <v-radio-group v-model="isCustom" mandatory>
                                <v-radio label="System Generated" value="generated"></v-radio>
                                <v-radio label="Custom PO Number" value="custom"></v-radio>

                                <span class="custom-wrapper" v-if="isCustom == 'custom'">
                                    <img src="@/assets/icons/item-icon.svg" alt="" class="box-icon" />
                                    
                                    <v-text-field
                                        height="40px"
                                        color="#002F44"
                                        width="200px"
                                        dense
                                        class="text-fields custom"
                                        placeholder="Enter Product Number"
                                        outlined
                                        v-model="editedItem.sku">
                                    </v-text-field>
                                </span>
                            </v-radio-group>

                            <!-- <div class="custom-wrapper ml-0 mb-2" v-if="editedIndexData > -1">
                                <img src="@/assets/icons/item-icon.svg" alt="" class="box-icon" />
                                
                                <v-text-field
                                    height="40px"
                                    color="#002F44"
                                    width="200px"
                                    dense
                                    class="text-fields custom"
                                    placeholder="Enter Product Number"
                                    outlined
                                    v-model="editedItemData.sku">
                                </v-text-field>
                            </div> -->
                        </div>

                        <div class="product-name mb-2">
                            <p class="product-title">Product Name</p>
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
                            <p class="product-title">Category</p>
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
                            <p class="product-title">Product Description</p>
                            <v-textarea
                                height="100"
                                class="text-fields description"
                                outlined
                                name="input-7-4"
                                placeholder="Type description of the product..."
                                v-model="editedItem.description"></v-textarea>
                        </div>

                        <div class="product-each mt-2 mb-2">
                            <p class="product-title">In Each Carton</p>
                            <v-text-field
                                height="40px"
                                color="#002F44"
                                width="200px"
                                dense
                                class="text-fields"
                                placeholder="1 units"
                                outlined
                                v-model="editedItem.units_per_carton">
                            </v-text-field>
                        </div>

                        <!-- <div class="product-img mt-2">
                            <p class="product-title">Product Image (Optional)</p>

                            <UploadImages 
                                :max="1" 
                                @change="handleImages"
                                maxError="Max files exceed"
                                uploadMsg="Upload product images"
                                clearAll="remove all images"
                                v-model="editedItem.image"
                                ref="fileInput"
                            />
                        </div> -->

                        <!-- <div class="product-img mt-2">
                            <p class="product-title">Product Image (Optional)</p>

                            <img :src="newPreviewImage" v-if="newPreviewImage" alt="image" height="150px" width="150px">

                            <div class="product-container" @dragover.prevent @drop.prevent>
                                <div @dragleave="fileDragOut" @dragover="fileDragIn" @drop="handleFileDrop">
                                    Browse or Drop Image
                                <br>
                                
                                <div class="file-wrapper">
                                    <input type="file" 
                                    name="file-input" 
                                    multiple="True" 
                                    @change="handleFileInput" > 

                                    Click or drag to insert.
                                </div>
                                <ul>
                                    <li v-for="(file, index) in files" :key="index">
                                    {{ file.name }} ({{ file.size }} b)
                                    <button @click="removeFile(index)" title="Remove">X</button>
                                    </li>
                                </ul>
                                </div>
                            </div>
                        </div> -->

                        <div class="product-img mt-2">
                            <p class="product-title">Product Image</p>
                            
                           <!-- <div class="relative">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    @change="previewImage" 
                                    class="form-control-file hidden" 
                                    id="my-file">
                                <label for="my-file">Select file</label>

                                <div class="image-preview border p-2">
                                    <template>
                                        <img :src="preview" class="img-fluid" />
                                    </template>
                                </div>
                            </div> -->

                            <div>
                                <div
                                    class="imagePreviewWrapper"
                                    :style="{ 'background-image': `url(${newPreviewImage})` }"
                                    @click="selectImage">

                                   <div v-if="newPreviewImage == null">
                                        Browse or <br/> Drop Image
                                        <v-btn variant="primary" class="btn-white">Upload</v-btn>
                                   </div>
                                </div>

                                <input 
                                    ref="fileInput"
                                    type="file" 
                                    accept="image/*" 
                                    @input="pickFile"
                                    class="form-control-file hidden" 
                                    id="my-file">
                            </div>

                                <!-- <input type="file" accept="image/*" ref="myFile" @change="previewFile">
                                <div class="imagePreviewWrapper" @click="selectImage">
                                    <img 
                                        v-if="newPreviewImage" 
                                        :src="newPreviewImage" 
                                        class="imgpreview" 
                                        width="148px" 
                                        height="148px">
                                </div> -->


                             <!-- <div v-cloak @drop="addFile" @dragover.prevent>
                                <h2>Files to Upload (Drag them over)</h2>
                                <ul>
                                    <li v-for="(file, index) in files" :key="index">
                                    {{ file.name }} ({{ file.size | kb }} kb) 
                                        <button @click="removeFile(file)" title="Remove">X</button>
                                    </li>
                                </ul>
                                
                                <button @click="upload">Upload</button> 
                            </div>-->
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
// import UploadImages from "vue-upload-drop-images"
// import _ from 'lodash'

export default {
    name: 'AddProductDialog',
    props: ['editedItemData','editedIndexData', 'dialogData', 'isMobile', 'categoryLists', 'loadingOnce', 'loadingAndAnother', 'isValid', 'customSku'],
    components: {
        // UploadImages
    },
    data: () => ({
        radioGroup1: 'generated',
        vendorLists: [
            'Jiangmen Well Channel Import & Export Co., Ltd',
            'Jiangmen Well-2 Channel Import & Export Co., Ltd',
            'Jiangmen Well-3 Channel Import & Export Co., Ltd'
        ],
        categoryListsItems: [],
        headers: [
			{
				text: 'PRODUCT',
				align: 'start',
				sortable: false,
				value: 'desc',
				fixed: true,
				width: "330px"
			},
			{
				text: 'QUANTITY',
				align: 'end',
				sortable: false,
				value: 'qty',
				fixed: true,
				width: "112px"
			},
			{
				text: 'UNIT PRICE',
				align: 'end',
				sortable: false,
				value: 'price',
				fixed: true,
				width: "112px"
			},
			{
				text: 'AMOUNT',
				align: 'end',
				sortable: false,
				value: 'amount',
				fixed: true,
				width: "112px"
			},
            {
				text: '',
				align: 'end',
				sortable: false,
				value: 'actions',
				fixed: true,
				width: "30px"
			},
		],
		items: [
            {
                product: "",
                qty: "",
                price: "",
                amount: ""
            }
        ],
        counter: 1,
        selected: [],
        imageName: null,
        image: null,
        preview: null,
        rules: {
            prodSku: (value) => !!value || "Product number is required.",
            prodName: (value) => !!value || "Product name is required.",
            prodCat: (value) => !!value || "Product category is required.",
            prodDesc: (value) => !!value || "Product description is required.",
            prodUnits: (value) => !!value || "Product units is required.",
        },
        // 
        newPreviewImage: null,
        files:[]
    }),
    methods: {        
        save() {
            this.editedItem.image = this.imageName
            console.log(this.editedItem);
            this.$emit('save', this.editedItem)
        },
        saveAndAdd() {
            this.editedItem.image = this.imageName
            this.$emit('saveAndAdd', this.editedItem)
        },
        close() {
            this.$emit('update:dialogData', false)
        },
        removeRow(index) {
            this.counter--
            this.items.splice(index, 1)
        }, 
        addRow() {
            this.counter++
            this.items.push({
                product: "",
                qty: "",
                price: "",
                amount: ""
            });
        },
        handleImages(files){
            if (files !== 'undefined' && files !== null) {
                if(files.length !== 0) {
                    this.imageName = files[0]
                }
            }
        },
        previewImage(event) {
            var input = event.target
            if (input.files) {
                var reader = new FileReader()
                reader.onload = (e) => {
                    this.preview = e.target.result
                }

                this.image = input.files[0]
                reader.readAsDataURL(input.files[0])
            }
        },
        selectImage () {
            this.$refs.fileInput.click()
        },
        pickFile () {
            let input = this.$refs.fileInput
            let file = input.files
            if (file && file[0]) {
                let reader = new FileReader

                reader.onload = e => {
                    this.newPreviewImage = e.target.result
                }

                reader.readAsDataURL(file[0])
                this.$emit('input', file[0])
            }

            console.log(file);
        },
        selectImage () {
            this.$refs.fileInput.click()
        },
        pickFile () {
            let input = this.$refs.fileInput
            let file = input.files
            if (file && file[0]) {
                let reader = new FileReader

                reader.onload = e => {
                    this.newPreviewImage = e.target.result
                }

                reader.readAsDataURL(file[0])
                this.$emit('input', file[0])
            }
        },
        showImageOnLoad() {
            if(this.newPreviewImage == null) {
                if (this.editedItem.image !== null) {
                    let picBasePath = 'https://po.shifl.com/'
                    let imageRename =  this.editedItem.image.replace("public","storage")
                    
                    let imagePreview = picBasePath + imageRename
                    this.newPreviewImage = imagePreview

                    console.log(this.newPreviewImage);
                }
            }
        }
        // addFile(e) {
        //     let droppedFiles = e.dataTransfer.files;
        //     if(!droppedFiles) return;

        //     this.files.push(...droppedFiles)
        // },
        // removeFile(file){
        //     this.files = this.files.filter(f => {
        //         return f != file;
        //     });      
        // },
        // upload() {
        //     // let formData = new FormData();

        //     // this.files.forEach((f,x) => {
        //     //     formData.append('file'+(x+1), f);
        //     // });

        //     console.log(this.files);

        //     // fetch('https://httpbin.org/post', {
        //     //     method:'POST',
        //     //     body: formData
        //     // })
        //     // .then(res => res.json())
        //     // .then(res => {
        //     // console.log('done uploading', res);
        //     // })
        //     // .catch(e => {
        //     // console.error(JSON.stringify(e.message));
        //     // });

        // }
        //
        // handleFileDrop(e) {
        //     let droppedFiles = e.dataTransfer.files;
        //     if(!droppedFiles) return;

        //     this.files.push(...droppedFiles)

        //     this.color="#444444"

        //     if (droppedFiles && droppedFiles[0]) {
        //         let reader = new FileReader

        //         reader.onload = e => {
        //             this.newPreviewImage = e.target.result
        //         }

        //         reader.readAsDataURL(droppedFiles[0])
        //         this.$emit('input', droppedFiles[0])
        //     }

        //     console.log(droppedFiles);
        // },
        // handleFileInput(e) {
        //     let files = e.target.files;
        //     files = e.target.files
        //     if(!files) return;

        //     this.files.push(...files)

        //     console.log(files);

        //     if (files && files[0]) {
        //         let reader = new FileReader

        //         reader.onload = e => {
        //             this.newPreviewImage = e.target.result
        //         }

        //         reader.readAsDataURL(files[0])
        //         this.$emit('input', files[0])
        //     }

        // },
        // removeFile(fileKey){
        //     this.files.splice(fileKey, 1)
        //     this.newPreviewImage = null
        // },
        // fileDragIn(){
        //     this.color="white"
        // },
        // fileDragOut(){
        //     this.color="#444444"
        // }
    },
    computed: {
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
                console.log(value);
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
        uploadDisabled() {
            return this.files.length === 0;
        }
    },
    mounted() {
        
    },
    updated() {
        // this.showImageOnLoad()
    }
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

.imagePreviewWrapper {
    width: 150px;
    height: 150px;
    display: block;
    cursor: pointer;
    margin: 0 0 10px;
    background-size: cover;
    background-position: center center;
    border: 2px solid #B4CFE0;
    border-radius: 4px;
    padding: 30px 10px;
    text-align: center;
    color: #B4CFE0;
    border-style: dashed;
}

.file-wrapper {
  text-align: center;
  width: 100%;
  height: 5em;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  overflow: hidden;
  background: gray; /* and other things to make it pretty */
}
.file-wrapper input {
    position: absolute;
    top: 0;
    right: 0; 
    cursor: pointer;
    opacity: 0.0;
    filter: alpha(opacity=0); 
    font-size: 300px; 
    height: 200px;
}

.btn-white {
    background-color: #fff !important;
    border: 1px solid #B4CFE0;
    color: #0171A1 !important;
    padding: 10px 16px !important;
    font-size: 14px;
    height: 40px;
    text-transform: capitalize;
    letter-spacing: 0;
    box-shadow: none !important;
    margin-top: 10px;
}

.product-container {
    width: 150px;
    height: 150px;
}
</style>