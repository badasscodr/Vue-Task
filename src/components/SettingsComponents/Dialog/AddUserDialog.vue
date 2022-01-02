<template>
    <v-dialog v-model="dialogAdd" max-width="560px" content-class="add-user-dialog" :retain-focus="false" @click:outside="close">
        <v-card>
            <v-form ref="form" v-model="valid" action="#" @submit.prevent="">
                <v-card-title>
                    <span class="headline">Add User</span>

                    <button icon dark class="btn-close" @click="close">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </v-card-title>

                <v-card-text>
                    <div class="add-user-wrapper">
                        <div class="add-user-info">
                            <v-row>
                                <v-col cols="12">
                                    <div class="card-name mb-3">
                                        <p class="card-title">Email Address</p>
                                        <v-text-field
                                            height="40px"
                                            color="#002F44"
                                            width="200px"
                                            dense
                                            class="text-fields select-items"
                                            placeholder="Enter email address"
                                            outlined
                                            type="number"
                                            :rules="rules"
                                            hide-details="auto">
                                        </v-text-field>
                                    </div>
                                </v-col>

                                <v-col cols="12">
                                    <div class="card-name mb-3">
                                        <p class="card-title">Name <span>(Optional)</span></p>
                                        <v-text-field
                                            height="40px"
                                            color="#002F44"
                                            width="200px"
                                            dense
                                            class="text-fields select-items"
                                            placeholder="Enter full name"
                                            outlined
                                            type="number"
                                            hide-details="auto">
                                        </v-text-field>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-card-text>

                <v-card-actions>
                    <button class="btn-blue" @click="save"> 
                        <span>Add User</span>
                    </button>

                    <button class="btn-white" @click="close">
                        Cancel
                    </button>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import globalMethods from '../../../utils/globalMethods'

export default {
    name: "AddUserDialog",
    props: ['dialog', 'editedIndex', 'editedItemData'],
    components: {},
    mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "settings/users");
    },
    data: () => ({
        isMobile: false,
        valid: true,
        rules: [
            (v) => !!v || 'Input is required.'
        ],
        paymentMethods: [
            '**** **** **** 3840'
        ]
    }),
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Add User' : 'Edit User'
        },
        dialogAdd: {
            get() {
                return this.dialog
            },
            set(value) {
                this.$emit('update:dialog', value)
            }
        },
        userData: {
            get() {
                return this.editedItemData
            },
            set(value) {
                this.$emit('update:editedItemData', value)
            }
        }
    },
    watch: {},
    methods: {
        ...mapActions({
            
        }),
        ...globalMethods,
        onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
        close() {
            this.$refs.form.resetValidation()
            this.$emit('close')
        },
        save() {
            this.$refs.form.validate()
        }
    },
};
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/settings/userDialog.scss';
</style>