<template>
    <v-dialog v-model="dialog" max-width="500px" content-class="confirm-dialog-wrapper item-delete-dialog" :retain-focus="false">
        <v-card class="delete-dialog">
            <v-card-title class="headline">
                <div class="delete-icon mt-3 mb-1">
                    <img src="../../../assets/icons/icon-delete.svg" alt="">
                </div>
            </v-card-title>

            <v-card-text style="padding-bottom: 15px;">
                <h2>Confirm Booking?</h2>
                <p>Your booking will be confirm with ‘{{ carrier }}’. Do you want to proceed with this option?</p>
            </v-card-text>

            <v-card-actions class="delete-btn-wrapper">
                <v-btn class="delete-btn" text @click="confirmSchedule">
                    <span v-if="!loading">
                        Confirm Booking
                    </span>

                    <span v-if="loading">
                        Confirming Booking...
                    </span>
                </v-btn>
                <v-btn class="cancel-btn" text @click="close">Back to Options</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['carrier','editedIndexData', 'dialogData', 'loading'],
    data: () => ({
        
    }),
    methods: {
        confirmSchedule() {
            this.$emit('confirm')
        },
        close() {
            this.$emit('update:dialogData', false)
        },
        onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
    },
    computed: {
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
        }
    }
};
</script>

<style>
@import '../../../assets/css/dialog_styles/deleteDialog.css';
</style>
