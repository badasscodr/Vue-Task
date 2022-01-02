<template>
    <v-dialog v-model="dialogView" max-width="880px" content-class="item-dialog-view" :retain-focus="false" @click:outside="closeView">
        
        <v-card class="dialog-wrapper">
            <v-card-title>
                <span class="headline">
                    <span class="po-num">SKU #{{ editedItem.sku }}</span>
                    <button
                        icon
                        dark
                        class="btn-close"
                        @click="closeView"
                        v-if="isMobile">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </span>

                <div class="header-actions">
                    <div>
                        <button @click.stop="editItem(editedItem)" class="btn-blue btn-edit">
                            Edit
                        </button>
                    </div>

                    <button @click.stop="deleteItem(editedItem)" class="btn-white btn-delete">
                        <span v-if="!isMobile">Delete</span>
                        <span v-if="isMobile">
                            <img src="@/assets/icons/deleteIcon.svg" alt="">
                        </span>
                    </button>

                    <button
                        icon
                        dark
                        class="btn-close"
                        @click="closeView"
                        v-if="!isMobile">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </div>
            </v-card-title>

            <v-card-text class="mb-0">
                <div class="view-wrapper">
                    <div class="view-box-img">
                        <img :src="getImgUrl(editedItem.image)" v-bind:alt="editedItem.image">
                    </div>

                    <div class="view-box-info">
                        <p class="item-name">{{ editedItem.name }}</p>
                        <p class="item-price">${{ editedItem.unit_price }}</p>

                        <div class="view-box-other-data">
                            <div class="item-info category">
                                <p class="item-title">Category</p>
                                <p class="item-data">{{ getCategoryName(editedItem.category_id) }}</p>
                            </div>

                            <div class="item-info carton">
                                <p class="item-title">In each carton</p>
                                <p class="item-data">{{ editedItem.units_per_carton }} Units</p>
                            </div>

                            <div class="item-info dimensions">
                                <p class="item-title">Carton Dimension</p>
                                <div class="item-data-dimensions">
                                    <p>
                                        <span class="item-subtitle">L </span>
                                        <span class="item-subtitle-data">
                                            {{ editedItem.carton_dimensions.l }}{{editedItem.carton_dimensions.uom}}
                                        </span>
                                    </p>

                                    <p>
                                        <span class="item-subtitle">W </span>
                                        <span class="item-subtitle-data">
                                            {{ editedItem.carton_dimensions.w }}{{editedItem.carton_dimensions.uom}}
                                        </span>
                                    </p>

                                    <p>
                                        <span class="item-subtitle">H </span>
                                        <span class="item-subtitle-data">
                                            {{ editedItem.carton_dimensions.h }}{{editedItem.carton_dimensions.uom}}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div class="item-info weight">
                                <p class="item-title">Unit Weight</p>
                                <p class="item-data">
                                    {{
                                        editedItem.unit_weight !== null ?
                                        editedItem.unit_weight.value + editedItem.unit_weight.unit
                                        : 0
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="product-description-wrapper">
                    <span>Product Description</span>
                    <p class="product-description"> {{ editedItem.description !== null ? editedItem.description : '--'}} </p>

                    <div class="view-box-other-data">
                        <div class="item-info classification">
                            <p class="item-title">Classification Code</p>
                            <p class="item-data">{{ (editedItem.classification_code !== null) ? editedItem.classification_code : '--' }}</p>
                        </div>

                        <div class="item-info rate">
                            <p class="item-title">Duty Rate</p>
                            <p class="item-data">{{ editedItem.duty_rate !== null ? parseAmount(editedItem.duty_rate) : '--'  }}</p>
                        </div>

                        <div class="item-info dimensions">
                            <p class="item-title">Unit Shipping Dims</p>
                            <div class="item-data-dimensions">
                                <p>
                                    <span class="item-subtitle">L </span>
                                    <span class="item-subtitle-data">
                                        {{
                                            editedItem.unit_dimensions !== null ?
                                            editedItem.unit_dimensions.l + editedItem.unit_dimensions.uom
                                            : 0
                                        }}
                                    </span>
                                </p>

                                <p>
                                    <span class="item-subtitle">W </span>
                                    <span class="item-subtitle-data">
                                        {{
                                            editedItem.unit_dimensions !== null ?
                                            editedItem.unit_dimensions.w + editedItem.unit_dimensions.uom
                                            : 0
                                        }}
                                    </span>
                                </p>

                                <p>
                                    <span class="item-subtitle">H </span>
                                    <span class="item-subtitle-data">
                                        {{
                                            editedItem.unit_dimensions !== null ?
                                            editedItem.unit_dimensions.h + editedItem.unit_dimensions.uom
                                            : 0
                                        }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'ProductViewDialog',
    props: ['editedItemData', 'dialogViewData', 'isMobile', 'categoryLists'],
    data: () => ({}),
    mounted() {},
    methods: {
        ...mapActions({
            setProduct: 'products/setProduct',
        }),
        closeView() {
            this.$emit('close')
        },
        getImgUrl(pic) {
			if (pic !== 'undefined' && pic !== null) {
				return pic
			} else {
				return require('../../../assets/icons/default-product-icon.svg')
			}
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
        editItem(item) {
            this.$emit('update:dialogViewData', false)
            setTimeout(() => {
                this.$emit('editItem', item)
            },100)
        },
        deleteItem(item) {
            this.$emit('update:dialogViewData', false)
            setTimeout(() => {
                this.$emit('deleteItem', item)
            },100)
        },
        parseAmount(amount) {
            if (amount !== 'undefined' && amount !== null && amount !== '') {
                return parseFloat(amount).toFixed(2) + '%'
            }
        }
    },
    computed: {
        ...mapGetters({
            getProducts: 'products/getProducts'
        }),
        dialogView: {
            get () {
                return this.dialogViewData
            },
            set (value) {
                if (!value) {
                    this.$emit('update:dialogViewData', false)
                } else {
                    this.$emit('update:dialogViewData', true)
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
        }
    },
    updated() {}
}
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/product/productViewDialog.scss';
</style>
