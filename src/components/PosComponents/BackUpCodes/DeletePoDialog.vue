<template>
    <v-dialog v-model="dialogInnerData" max-width="500px" content-class="item-delete-dialog" :retain-focus="false" @click:outside="closeDialog">
        <v-card class="delete-dialog">
            <v-card-title class="headline">
                <div class="delete-icon mt-3 mb-1">
                    <img src="../../assets/icons/icon-delete.svg" alt="">
                </div>
            </v-card-title>

            <v-card-text style="padding-bottom: 15px;">
                <slot name="content"></slot>
            </v-card-text>

            <v-card-actions class="delete-btn-wrapper">
                <v-btn class="delete-btn" text @click="deleteItemConfirm">
                    {{
                        (getPoDeleteLoading) ? 'Deleting...' : 'Delete'
                    }}
                </v-btn>
                <v-btn class="cancel-btn" text @click="closeDialog">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import globalMethods from '../../../utils/globalMethods'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'DeletePoDialog',
    props: ['dialogInnerData', 'item', 'dialogViewData', 'isMobile'],
    computed: {
        ...mapGetters({
            getPoDeleteLoading: 'po/getPoDeleteLoading'
        })
    },
    methods: {
        ...mapActions({
            deletePo: 'po/deletePo',
            fetchPo: 'po/fetchPo'
        }),
        ...globalMethods,
        async deleteItemConfirm() {
            try {
                await this.deletePo(this.item.id)
                this.notificationMessage('Purchase order successfully deleted.')
                this.$emit('update:dialogViewData', false)
                //await this.fetchPo()
                this.fetchPo()
                this.closeDialog()

                if (this.isMobile) {
                    this.$router.push(`/pos`)
                }
            } catch(e) {
                this.notificationError('An error occured while trying to delete the purchase order.')
                console.log(e)
            }
            
        },
        closeDialog() {
            this.$emit('update:dialogInnerData', false)
        }
    }
}
</script>

<style>
@import '../../assets/css/dialog_styles/deleteDialog.css';
</style>