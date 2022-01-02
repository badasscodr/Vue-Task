<template>
    <v-dialog v-model="dialogDelete" max-width="500px" content-class="item-delete-dialog">
        <v-card class="delete-dialog">
            <v-card-title class="headline">
                <div class="delete-icon mt-3 mb-1">
                    <img src="../../assets/icons/icon-delete.svg" alt="">
                </div>
            </v-card-title>

            <v-card-text style="padding-bottom: 15px;">
                <h2>Delete {{ componentName }}</h2>
                <p v-if="fromComponent !== 'card'">
                    Do you want to delete the {{ fromComponent }} ‘‘{{ editedItem !== null && editedItem.name !== null ? editedItem.name : '' }}’’?
                </p>

                <p v-else>
                    Do you want to delete the {{ fromComponent }} ‘‘{{ editedItem !== null && editedItem.name !== null ? editedItem.card_number : '' }}’’ from the payment methods?
                </p>
            </v-card-text>
            
            <v-card-actions class="delete-btn-wrapper">
                <v-btn class="delete-btn" text @click="deleteItemConfirm">
                    <span v-if="loadingDelete">Deleting...</span>
                    <span v-if="!loadingDelete">Delete</span>
                </v-btn>
                <v-btn class="cancel-btn" text @click="closeDelete">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'DeleteDialog',
    props: ['editedItemData', 'dialogData', 'fromComponent', 'loadingDelete', 'componentName', 'editedIndexWarehouse', 'defaultItemWarehouse'],
    mounted() {
    },
    updated() {
    },
    methods: {
        deleteItemConfirm() {
            this.$emit('delete')
        },
        closeDelete() {
           // this.$emit('update:editedIndexWarehouse', -1)
            //this.$emit('update:dialogData', false)
            this.dialogDelete = false
        },
    },
     computed: {
        dialogDelete: {
            get () {
                return this.dialogData
            },
            set (value) {
                if (!value) {
                   // this.$emit('update:editedIndexWarehouse', -1)
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
        }
    },
}
</script>

<style>
@import '../../assets/css/dialog_styles/deleteDialog.css';
</style>