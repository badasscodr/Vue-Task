<template>
    <v-dialog v-model="dialogDeleteFailed" max-width="500px" content-class="item-delete-dialog">
        <v-card class="delete-dialog">
            <v-card-title class="headline">
                <div class="delete-icon mt-3 mb-1">
                    <img src="../../assets/icons/icon-delete.svg" alt="">
                </div>
            </v-card-title>

            <v-card-text style="padding-bottom: 15px;">
                <h2>Deletion Failed</h2>
                <p>{{ message }}</p>
            </v-card-text>
            <v-card-actions class="delete-btn-wrapper">
                <v-btn class="delete-btn" text @click="close">
                    <span>Understood</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'DeleteDialog',
    props: ['editedItemData', 'dialogData', 'fromComponent', 'loadingDelete', 'message'],
    mounted() {
        
    },
    methods: {
        close() {
            this.$emit('update:dialogData', false)
        },
    },
    computed: {
        dialogDeleteFailed: {
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
        }
    },
    updated() {
        
    }
}
</script>

<style>
@import '../../assets/css/dialog_styles/deleteDialog.css';
</style>