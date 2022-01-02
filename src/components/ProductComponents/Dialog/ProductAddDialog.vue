<template>
  <v-dialog
    v-model="dialogAdd"
    max-width="950px"
    content-class="product-dialog"
    :retain-focus="false"
    @click:outside="close"
  >
    <v-card class="product-dialog-card">
      <v-form ref="form" v-model="valid" action="#" @submit.prevent="">
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>

          <button icon dark class="btn-close" @click="close">
            <v-icon>mdi-close</v-icon>
          </button>
        </v-card-title>

        <v-card-text>
          <div class="add-wrapper">
            <div class="product-info">
              <div class="product-number mb-2">
                <p class="product-title">SKU</p>
                <v-radio-group
                  v-model="isCustom"
                  mandatory
                  v-if="editedIndex === -1"
                  hide-details="auto"
                >
                  <v-radio label="System Generated" value="generated"></v-radio>
                  <v-radio label="Custom Number" value="custom"></v-radio>

                  <span class="custom-wrapper" v-if="isCustom == 'custom'">
                    <img
                      src="@/assets/icons/item-icon.svg"
                      alt=""
                      class="box-icon"
                    />

                    <v-text-field
                      height="40px"
                      color="#002F44"
                      width="200px"
                      type="text"
                      dense
                      class="text-fields custom"
                      placeholder="Enter Product Number"
                      outlined
                      v-model="productItem.sku"
                      :rules="rules"
                      hide-details="auto"
                      @keydown="inputRestrictSpecialChar($event)"
                    >
                    </v-text-field>
                  </span>
                </v-radio-group>

                <div class="custom-wrapper ml-0" v-if="editedIndex > -1">
                  <img
                    src="@/assets/icons/item-icon.svg"
                    alt=""
                    class="box-icon"
                  />

                  <v-text-field
                    height="40px"
                    color="#002F44"
                    width="200px"
                    type="text"
                    dense
                    class="text-fields custom"
                    placeholder="Enter Product Number"
                    outlined
                    v-model="productItem.sku"
                    :rules="rules"
                    hide-details="auto"
                    @keydown="inputRestrictSpecialChar($event)"
                  >
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
                  v-model="productItem.name"
                  :rules="productNameRules"
                  hide-details="auto"
                  @keydown="inputRestrictSpecialChar($event)"
                >
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
                  v-model="productItem.category_id"
                  hide-details="auto"
                >
                </v-select>
              </div>

              <div class="product-each mt-2 mb-2">
                <p class="product-title">UNIT PRICE</p>
                <vuetify-money
                  background-color="white"
                  dense
                  hide-details="auto"
                  placeholder="0.00"
                  outlined
                  :options="{
                    locale: 'en-US',
                    prefix: '$',
                    length: 11,
                    precision: 2,
                  }"
                  type="number"
                  v-model="productItem.unit_price"
                  :properties="{
                    height: '40px',
                    color: '#002F44',
                    width: '200px',
                    class: 'text-fields',
                  }"
                />
              </div>

              <div class="product-each mt-2 mb-2">
                <p class="product-title">IN EACH CARTON</p>
                <v-text-field
                  background-color="white"
                  height="40px"
                  color="#002F44"
                  width="200px"
                  dense
                  class="text-fields"
                  placeholder="1 units"
                  outlined
                  type="number"
                  v-model="productItem.units_per_carton"
                  :rules="rules"
                  hide-details="auto"
                >
                </v-text-field>
              </div>

              <div class="carton-dimension  mt-2 mb-2">
                <p class="product-title">CARTON DIMENSIONS</p>
                <div class="input-container">
                  <v-text-field
                    background-color="white"
                    height="40px"
                    color="#002F44"
                    dense
                    class="text-fields carton-length mr-1"
                    outlined
                    type="number"
                    prefix="L"
                    v-model="productItem.carton_dimensions.l"
                    hide-details="auto"
                  >
                  </v-text-field>
                  <v-text-field
                    background-color="white"
                    height="40px"
                    color="#002F44"
                    dense
                    class="text-fields carton-width mr-1"
                    outlined
                    type="number"
                    prefix="W"
                    v-model="productItem.carton_dimensions.w"
                    hide-details="auto"
                  >
                  </v-text-field>
                  <v-text-field
                    background-color="white"
                    height="40px"
                    color="#002F44"
                    dense
                    class="text-fields carton-height mr-1"
                    outlined
                    type="number"
                    prefix="H"
                    v-model="productItem.carton_dimensions.h"
                    hide-details="auto"
                  >
                  </v-text-field>
                  <v-select
                    class="text-fields select-items carton-uom"
                    :items="['cm']"
                    item-text="name"
                    item-value="id"
                    height="40px"
                    outlined
                    v-model="productItem.carton_dimensions.uom"
                    hide-details="auto"
                  >
                  </v-select>
                </div>
              </div>

              <div class="carton-dimension  mt-2 mb-2">
                <p class="product-title">UNIT SHIPPING DIMS</p>
                <div class="input-container">
                  <v-text-field
                    background-color="white"
                    height="40px"
                    color="#002F44"
                    dense
                    class="text-fields carton-length mr-1"
                    outlined
                    type="number"
                    prefix="L"
                    v-model="productItem.unit_dimensions.l"
                    hide-details="auto"
                  >
                  </v-text-field>
                  <v-text-field
                    background-color="white"
                    height="40px"
                    color="#002F44"
                    dense
                    class="text-fields carton-width mr-1"
                    outlined
                    type="number"
                    prefix="W"
                    v-model="productItem.unit_dimensions.w"
                    hide-details="auto"
                  >
                  </v-text-field>
                  <v-text-field
                    background-color="white"
                    height="40px"
                    color="#002F44"
                    dense
                    class="text-fields carton-height mr-1"
                    outlined
                    type="number"
                    prefix="H"
                    v-model="productItem.unit_dimensions.h"
                    hide-details="auto"
                  >
                  </v-text-field>
                  <v-select
                    class="text-fields select-items carton-uom"
                    :items="['cm']"
                    item-text="name"
                    item-value="id"
                    outlined
                    v-model="productItem.unit_dimensions.uom"
                    hide-details="auto"
                  >
                  </v-select>
                </div>
              </div>

              <div class="carton-dimension  mt-2 mb-2">
                <p class="product-title">UNIT WEIGHT</p>
                <div class="input-container">
                  <v-text-field
                    background-color="white"
                    height="40px"
                    color="#002F44"
                    dense
                    class="text-fields carton-height mr-1"
                    outlined
                    type="number"
                    prefix="W"
                    v-model="productItem.unit_weight.value"
                    hide-details="auto"
                  >
                  </v-text-field>

                  <v-select
                    class="text-fields select-items carton-uom"
                    :items="['kg', 'lb', 'g']"
                    item-text="name"
                    item-value="id"
                    height="40px"
                    outlined
                    v-model="productItem.unit_weight.unit"
                    hide-details="auto"
                  >
                  </v-select>
                </div>
              </div>

              <div class="product-upc-number mb-2">
                <p class="product-title">UPC NUMBER (Optional)</p>
                <v-text-field
                  type="number"
                  height="40px"
                  color="#002F44"
                  width="100px"
                  dense
                  class="text-fields select-items"
                  placeholder="Enter UPC Number"
                  outlined
                  v-model="productItem.upc_number"
                  hide-details="auto"
                >
                </v-text-field>
              </div>
            </div>

            <div class="product-description">
              <div class="product-notes mb-2">
                <p class="product-title">PRODUCT DESCRIPTION (Optional)</p>
                <v-textarea
                  height="100"
                  class="text-fields description"
                  outlined
                  name="input-7-4"
                  placeholder="Type description of the product..."
                  v-model="productItem.description"
                >
                </v-textarea>
              </div>

              <div class="product-img">
                <p class="product-title">PRODUCT IMAGE (Optional)</p>

                <div
                  id="product-img-select-box-id"
                  v-show="
                    product.create.image == '' &&
                      (productItem.image == '' ||
                        (productItem.image == null && product.edit.image == ''))
                  "
                  class="product-img-select-box"
                  @click="selectProductImage()"
                >
                  Browse Image
                </div>

                <div
                  v-if="
                    product.create.image !== '' ||
                      (productItem.image !== '' &&
                        productItem.image !== null) ||
                      product.edit.image !== ''
                  "
                  class="product-img-selected-image-container"
                  v-show="
                    product.create.image !== '' || productItem.image !== ''
                  "
                >
                  <img
                    v-if="product.edit.image !== ''"
                    class="product-img-selected-image"
                    :src="product.edit.image"
                  />

                  <img
                    v-if="
                      productItem.image !== '' &&
                        productItem.image !== null &&
                        product.edit.image == '' &&
                        editedIndex > -1
                    "
                    class="product-img-selected-image"
                    :src="productItem.image"
                  />

                  <img
                    v-if="product.create.image !== '' && editedIndex === -1"
                    class="product-img-selected-image"
                    :src="product.create.image"
                  />
                </div>

                <input
                  ref="product_image_reference"
                  type="file"
                  id="product_image"
                  @change="(e) => readFile(e)"
                  name="product_image"
                  accept="image/png, image/jpg, image/jpeg"
                />

                <div
                  class="button-appear-success"
                  v-show="
                    product.create.image !== '' ||
                      (productItem.image !== '' &&
                        productItem.image !== null) ||
                      product.edit.image !== ''
                  "
                >
                  <button class="btn-white mr-2" @click="selectProductImage()">
                    <img
                      src="@/assets/icons/upload.svg"
                      alt=""
                      width="12px"
                      height="12px"
                    />
                    <span class="ml-1">Re-upload</span>
                  </button>

                  <button class="btn-white" @click="removeProductImage()">
                    <img src="@/assets/icons/deleteIcon.svg" alt="" />
                  </button>
                </div>
              </div>

              <div class="product-customs-duty">
                <p class="title-duty">Customs Duty Info</p>

                <div class="inputs-container country-info mb-2">
                  <div class="product-country-from">
                    <p class="product-title">COUNTRY FROM</p>
                    <v-combobox
                      class="text-fields select-items combobox"
                      v-model="productItem.country_from"
                      :items="countries"
                      item-text="name"
                      item-value="id"
                      :disabled="getCountriesLoading"
                      :placeholder="
                        getCountriesLoading
                          ? 'Fetching countries...'
                          : 'Select country from'
                      "
                      outlined
                      hide-details="auto"
                    >
                      <!-- <template v-slot:selection>
                                                <country-flag 
                                                    :country="getFlag(productItem.country_from)"
                                                    :v-if="getFlag(productItem.country_from) !== 'n/a'"/>

                                                <span style="color: #4a4a4a;"> {{ productItem.country_from }}</span>
                                            </template> -->

                      <!-- <template v-slot:item="{ item }">
                                                <country-flag 
                                                    :country="getFlag(item)" />
                                                <span>{{ item }}</span>
                                            </template> -->
                    </v-combobox>
                  </div>

                  <div class="product-country-to">
                    <p class="product-title">COUNTRY TO</p>
                    <v-combobox
                      class="text-fields select-items combobox"
                      v-model="productItem.country_to"
                      :items="countries"
                      item-text="name"
                      item-value="id"
                      :disabled="getCountriesLoading"
                      :placeholder="
                        getCountriesLoading
                          ? 'Fetching countries...'
                          : 'Select country to'
                      "
                      outlined
                      hide-details="auto"
                    >
                      <!-- <template v-slot:selection>
                                                <country-flag :country="getFlag(productItem.country_to)"></country-flag>
                                                <span style="color: #4a4a4a;"> {{ productItem.country_to }}</span>
                                            </template>  -->
                    </v-combobox>
                  </div>
                </div>

                <div class="product-notes mb-2">
                  <p class="product-title">
                    PRODUCT CLASSIFICATION DESCRIPTION
                  </p>
                  <v-textarea
                    height="100"
                    class="text-fields description"
                    outlined
                    name="input-7-4"
                    placeholder="Add any links to the product or additional items that can help us better classify your item..."
                    v-model="productItem.product_classification_description"
                  >
                  </v-textarea>
                </div>

                <div class="inputs-container">
                  <div class="classification-code">
                    <p class="product-title">CLASSIFICATION CODE</p>
                    <v-text-field
                      height="40px"
                      color="#002F44"
                      width="200px"
                      dense
                      class="text-fields"
                      placeholder="Classification code"
                      outlined
                      type="text"
                      v-model="productItem.classification_code"
                      hide-details="auto"
                      :disabled="
                        productItem.userClassification !== 1 &&
                          !productItem.userClassification
                      "
                    >
                      <!-- :disabled="productItem.is_for_classification_code !== 0 && productItem.is_for_classification_code" -->
                    </v-text-field>
                  </div>
                  <div class="duty-rate">
                    <p class="product-title">DUTY RATE</p>
                    <vuetify-money
                      :disabled="
                        productItem.userClassification !== 1 &&
                          !productItem.userClassification
                      "
                      background-color="white"
                      dense
                      hide-details="auto"
                      placeholder="0.00"
                      outlined
                      :options="{
                        locale: 'en-US',
                        length: 11,
                        precision: 2,
                        suffix: '%',
                      }"
                      type="number"
                      v-model="productItem.duty_rate"
                      :properties="{
                        height: '40px',
                        color: '#002F44',
                        class: 'text-fields',
                      }"
                    />
                  </div>
                </div>

                <div
                  class="classification-info-default"
                  v-if="
                    productItem.userClassification !== 1 &&
                      !productItem.userClassification
                  "
                >
                  <p class="classification-info">
                    Shifl will classify this product, If we have any questions
                    we will reach out to you, once a classification is added you
                    will receive an email.
                  </p>
                </div>

                <v-checkbox
                  class="classification-checkbox"
                  color="#819FB2"
                  :label="`Classify Myself`"
                  hide-details="auto"
                  v-model="productItem.userClassification"
                  @change="userClassify(productItem.userClassification)"
                ></v-checkbox>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="product-actions">
          <button class="btn-blue" @click.stop="saveProduct">
            <span v-if="editedIndex === -1">
              <span v-if="!loadingOnce">Add Product</span>
              <span v-if="loadingOnce">Adding...</span>
            </span>

            <span v-if="editedIndex > -1">
              <span v-if="!loadingOnce">Update Product</span>
              <span v-if="loadingOnce">Updating...</span>
            </span>
          </button>

          <button class="btn-white" @click.stop="saveAndAddProduct">
            <span v-if="editedIndex === -1">
              <span v-if="!loadingAndAddAnother">Save & Add Another</span>
              <span v-if="loadingAndAddAnother">Saving...</span>
            </span>

            <span v-if="editedIndex > -1">
              <span v-if="!loadingAndAddAnother">Update & Add Another</span>
              <span v-if="loadingAndAddAnother">Updating...</span>
            </span>
          </button>

          <button class="btn-white" @click="close" v-if="!isMobile">
            Cancel
          </button>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import globalMethods from "../../../utils/globalMethods";
import countriesDetails from "../../../helpers/flags.json";
import _ from "lodash";

export default {
  name: "ProductAddDialog",
  props: [
    "dialog",
    "editedIndex",
    "categoryLists",
    "isMobile",
    "editedItem",
    "defaultItem",
  ],
  components: {},
  data: () => ({
    valid: true,
    isCustom: "generated",
    product: {
      create: {
        image: "",
        imageFile: null,
      },
      edit: {
        image: "",
        imageFile: null,
      },
    },
    fileReader: null,
    fileReaderUpdate: null,
    isFileUploadSuccess: false,
    showRemoveButton: false,
    loadingOnce: false,
    loadingAndAddAnother: false,
    rules: [(v) => !!v || "Input is required."],
    productNameRules: [
      (v) => !!v || "Input is required.",
      (v) => /^.{1,100}$/.test(v) || "Only 100 maximum characters allowed.",
    ],
  }),
  computed: {
    ...mapGetters({
      getUpdatedProduct: "products/getUpdatedProduct",
      getCurrentSelectedProduct: "products/getCurrentSelectedProduct",
      getUser: "getUser",
      getCountries: "warehouse/getCountries",
      getCountriesLoading: "warehouse/getCountriesLoading",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Add Product" : "Edit Product";
    },
    dialogAdd: {
      get() {
        return this.dialog;
      },
      set(value) {
        this.$emit("update:dialog", value);
      },
    },
    productItem: {
      get() {
        return this.editedItem;
      },
      set(value) {
        this.$emit("update:editedItem", value);
      },
    },
    countries() {
      return typeof this.getCountries !== "undefined" &&
        this.getCountries !== null &&
        this.getCountries.length !== 0
        ? this.getCountries
        : [];
    },
  },
  methods: {
    ...mapActions({
      fetchProducts: "products/fetchProducts",
      createProducts: "products/createProducts",
      updateProducts: "products/updateProducts",
    }),
    ...globalMethods,
    selectProductImage() {
      this.$refs.product_image_reference.click();
    },
    readFile(e) {
      console.log(e);
      let file = this.$refs.product_image_reference.files[0];
      this.fileReader.readAsDataURL(file);

      this.fileReader.onload = () => {
        if (this.editedIndex > -1) {
          this.product.edit.imageFile = file;
          this.product.edit.image = this.fileReader.result;
        } else {
          this.product.create.imageFile = file;
          this.product.create.image = this.fileReader.result;
        }
      };

      this.fileReader.onerror = () => {
        console.log("An error occured.");
        console.log(this.fileReader.error);
      };
    },
    removeProductImage() {
      this.$refs.product_image_reference.value = "";
      this.product.create.image = "";
      this.product.create.imageFile = null;
      this.productItem.imageCreate = null;
      this.productItem.image = null;
      this.product.edit.image = "";
      this.product.edit.imageFile = null;
    },
    async saveProduct() {
      let { image, ...otherItems } = this.productItem;

      otherItems.description =
        otherItems.description == null || otherItems.description == "null"
          ? ""
          : otherItems.description;

      otherItems.product_classification_description =
        otherItems.product_classification_description == null ||
        otherItems.product_classification_description == "null"
          ? ""
          : otherItems.product_classification_description;

      otherItems.country_from =
        otherItems.country_from == null || otherItems.country_from == "null"
          ? ""
          : otherItems.country_from;

      otherItems.country_to =
        otherItems.country_to == null || otherItems.country_to == "null"
          ? ""
          : otherItems.country_to;

      otherItems.carton_dimensions = JSON.stringify(
        otherItems.carton_dimensions
      );
      otherItems.unit_dimensions = JSON.stringify(otherItems.unit_dimensions);
      otherItems.unit_weight = JSON.stringify(otherItems.unit_weight);

      // otherItems.is_for_classification_code = otherItems.is_for_classification_code ? 1 : 0
      otherItems.is_for_classification_code = otherItems.userClassification
        ? 0
        : 1;

      if (!otherItems.category_id) {
        delete otherItems.category_id;
      }

      if (otherItems.is_for_classification_code == 1) {
        otherItems.classification_code = "";
      }

      if (!otherItems.duty_rate) {
        otherItems.duty_rate = 0;
      } else {
        otherItems.duty_rate = parseFloat(otherItems.duty_rate);
      }

      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        // check product edit
        if (this.editedIndex > -1) {
          if (this.product.edit.image !== "") {
            if (
              this.product.edit.imageFile.type == "image/gif" ||
              this.product.edit.imageFile.type == "image/svg+xml"
            ) {
              this.notificationError(
                "The image must be a file of type: jpg, png, jpeg."
              );
            } else {
              image = this.product.edit.imageFile;
              let passedData = {
                image,
                ...otherItems,
              };

              this.saveProductApiUpdate(passedData);
            }
          } else {
            image = null;
            let passedData = {
              image,
              ...otherItems,
            };

            this.saveProductApiUpdate(passedData);
          }
        } else {
          //check product create
          if (this.product.create.image !== "") {
            if (
              this.product.create.imageFile.type == "image/gif" ||
              this.product.create.imageFile.type == "image/svg+xml"
            ) {
              this.notificationError(
                "The image must be a file of type: jpg, png, jpeg."
              );
            } else {
              image = this.product.create.imageFile;
              let passedData = {
                image,
                ...otherItems,
              };

              this.saveProductApiCreate(passedData);
            }
          } else {
            image = null;
            let passedData = {
              image,
              ...otherItems,
            };

            this.saveProductApiCreate(passedData);
          }
        }
      }
    },
    saveAndAddProduct() {
      let { image, ...otherItems } = this.editedItem;

      otherItems.description =
        otherItems.description == null || otherItems.description == "null"
          ? ""
          : otherItems.description;

      otherItems.product_classification_description =
        otherItems.product_classification_description == null ||
        otherItems.product_classification_description == "null"
          ? ""
          : otherItems.product_classification_description;

      otherItems.country_from =
        otherItems.country_from == null || otherItems.country_from == "null"
          ? ""
          : otherItems.country_from;

      otherItems.country_to =
        otherItems.country_to == null || otherItems.country_to == "null"
          ? ""
          : otherItems.country_to;

      otherItems.carton_dimensions = JSON.stringify(
        otherItems.carton_dimensions
      );
      otherItems.unit_dimensions = JSON.stringify(otherItems.unit_dimensions);
      otherItems.unit_weight = JSON.stringify(otherItems.unit_weight);

      // otherItems.is_for_classification_code = otherItems.is_for_classification_code ? 1 : 0
      otherItems.is_for_classification_code = otherItems.userClassification
        ? 0
        : 1;

      if (!otherItems.category_id) {
        delete otherItems.category_id;
      }

      if (otherItems.is_for_classification_code == 1) {
        otherItems.classification_code = "";
      }

      if (!otherItems.duty_rate) {
        otherItems.duty_rate = 0;
      } else {
        otherItems.duty_rate = parseFloat(otherItems.duty_rate);
      }

      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        //check product edit
        if (this.editedIndex > -1) {
          if (this.product.edit.image !== "") {
            if (
              this.product.edit.imageFile.type == "image/gif" ||
              this.product.edit.imageFile.type == "image/svg+xml"
            ) {
              let message = "The image must be a file of type: jpg, png, jpeg.";
              this.notificationError(message);
            } else {
              image = this.product.edit.imageFile;
              let passedData = {
                image,
                ...otherItems,
              };

              this.saveUpdateAndAdd(passedData);
            }
          } else {
            image = null;
            let passedData = {
              image,
              ...otherItems,
            };
            // this.$emit('saveAndAdd', passedData)
            this.saveUpdateAndAdd(passedData);
          }
        } else {
          //check product create
          if (this.product.create.image !== "") {
            if (
              this.product.create.imageFile.type == "image/gif" ||
              this.product.create.imageFile.type == "image/svg+xml"
            ) {
              let message = "The image must be a file of type: jpg, png, jpeg.";
              this.notificationError(message);
            } else {
              image = this.product.create.imageFile;
              let passedData = {
                image,
                ...otherItems,
              };

              this.saveCreateAndAdd(passedData);
            }
          } else {
            image = null;
            let passedData = {
              image,
              ...otherItems,
            };

            this.saveCreateAndAdd(passedData);
          }
        }
      }
    },
    close() {
      this.userClassification = 0;
      this.$refs.form.resetValidation();
      this.$emit("close");
    },
    async saveProductApiCreate(passedData) {
      this.loadingOnce = true;

      passedData.sys_gen = this.isCustom !== "generated" ? false : true;

      if (this.isCustom === "generated") {
        let passedDataKeys = Object.keys(passedData);
        let newPassedData = {};

        if (passedDataKeys.length > 0) {
          passedDataKeys.map((pdk) => {
            if (pdk !== "sku") newPassedData[pdk] = passedData[pdk];
          });
        }

        passedData = newPassedData;
      }
      passedData.customer_id =
        typeof this.getUser == "string"
          ? JSON.parse(this.getUser).customer.id
          : "";

      try {
        await this.createProducts(passedData);
        this.loadingOnce = false;
        this.fetchProducts();
        this.$store.dispatch("products/setReset", true);
        this.close();
        this.notificationMessage("Product has been created!");
      } catch (e) {
        this.loadingOnce = false;
        this.notificationError(e);
      }
    },
    async saveProductApiUpdate(passedData) {
      this.loadingOnce = true;

      if (passedData.image == null) {
        let newPassedData = {};
        let getPassedDataKeys = Object.keys(passedData);
        if (getPassedDataKeys.length > 0) {
          getPassedDataKeys.map((gdk) => {
            if (gdk !== "image" && gdk !== "imageCreate")
              newPassedData[gdk] = passedData[gdk];
            else {
              if (gdk === "imageCreate") {
                if (passedData[gdk] == null) {
                  newPassedData["image"] = null;
                }
              }
            }
          });

          passedData = newPassedData;
        }
      }

      passedData.prod_id = passedData.id;
      passedData.customer_id =
        typeof this.getUser == "string"
          ? JSON.parse(this.getUser).customer.id
          : "";
      passedData._method = "PUT";

      try {
        await this.updateProducts(passedData);
        this.loadingOnce = false;
        this.fetchProducts();
        this.$store.dispatch("products/setReset", true);
        this.close();
        this.notificationMessage("Product has been updated!");
      } catch (e) {
        this.loadingOnce = false;
        this.notificationError(e);
      }
    },
    async saveCreateAndAdd(passedData) {
      this.loadingAndAddAnother = true;
      passedData.sys_gen = this.isCustom !== "generated" ? false : true;

      if (this.isCustom === "generated") {
        let passedDataKeys = Object.keys(passedData);
        let newPassedData = {};

        if (passedDataKeys.length > 0) {
          passedDataKeys.map((pdk) => {
            if (pdk !== "sku") newPassedData[pdk] = passedData[pdk];
          });
        }

        passedData = newPassedData;
      }

      passedData.customer_id =
        typeof this.getUser == "string"
          ? JSON.parse(this.getUser).customer.id
          : "";

      try {
        await this.createProducts(passedData);
        this.loadingAndAddAnother = false;
        this.fetchProducts();
        this.$store.dispatch("products/setReset", true);
        this.setToDefault();
        //this.close()

        this.notificationMessage("Product has been created!");
      } catch (e) {
        this.loadingAndAddAnother = false;
        this.notificationError(e);
      }
    },
    async saveUpdateAndAdd(passedData) {
      this.loadingAndAddAnother = true;

      if (passedData.image == null) {
        let newPassedData = {};
        let getPassedDataKeys = Object.keys(passedData);
        if (getPassedDataKeys.length > 0) {
          getPassedDataKeys.map((gdk) => {
            if (gdk !== "image") newPassedData[gdk] = passedData[gdk];
          });

          passedData = newPassedData;
        }
      }

      passedData.prod_id = passedData.id;
      passedData._method = "PUT";
      passedData.customer_id =
        typeof this.getUser == "string"
          ? JSON.parse(this.getUser).customer.id
          : "";

      try {
        await this.updateProducts(passedData);
        this.loadingAndAddAnother = false;
        this.fetchProducts();
        this.$store.dispatch("products/setReset", true);
        this.setToDefault();
        //this.close()

        this.notificationMessage("Product has been updated!");
      } catch (e) {
        this.loadingAndAddAnother = false;
        this.notificationError(e);
      }
    },
    setToDefault() {
      this.close();
      this.dialogAdd = true;
    },
    handlePrice(price) {
      if (price !== "") {
        let getPrice = parseInt(price);

        if (getPrice == 0) {
          this.notificationErrorCustom("Please enter price higher than 0.");
        }
      }
    },
    inputRestrictSpecialChar(e) {
      if (/^\W$/.test(e.key)) {
        if (e.key !== "-" && e.key !== " ") {
          e.preventDefault();
        }
      }
    },
    userClassify(val) {
      if (!val) {
        this.productItem.classification_code = null;
        this.productItem.duty_rate = 0;
        this.productItem.is_for_classification_code = 1;
      } else {
        this.productItem.is_for_classification_code = 0;
        this.productItem.classification_code = "";
      }
    },
    getFlag(selectedCountry) {
      let code = null;

      if (
        selectedCountry !== "undefined" &&
        selectedCountry !== null &&
        selectedCountry !== ""
      ) {
        let countryFlag = _.find(
          countriesDetails,
          (e) => e.englishShortName == selectedCountry
        );

        if (typeof countryFlag !== "undefined") {
          code = countryFlag.alpha2Code;
        } else {
          code = "n/a";
        }
      }

      return code;
    },
  },
  watch: {},
  mounted() {
    this.fileReader = new FileReader();
    this.fileReaderUpdate = new FileReader();
  },
  updated() {
    if (this.editedIndex === -1) {
      if (typeof this.$refs.form !== "undefined") {
        if (typeof this.$refs.form.resetValidation() !== "undefined") {
          this.$refs.form.resetValidation();
        }
      }
    }

    if (this.$store.state.products.reset) {
      this.$store.dispatch("products/setReset", false);
      this.product = {
        create: {
          image: "",
          imageFile: null,
        },
        edit: {
          image: "",
          imageFile: null,
        },
      };
    }
  },
};
</script>

<style lang="scss">
@import "../../../assets/scss/pages_scss/product/productAddDialog.scss";

.v-dialog.product-dialog .v-card__text .add-wrapper .product-info .input-error {
  color: #f93131;
}
</style>
