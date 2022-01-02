<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="items"
            sort-by="calories"
            class="methods-table elevation-1"
            hide-default-footer
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :search="search"
            @page-count="pageCount = $event"
            mobile-breakpoint="769">

            <template v-slot:top>                
                <div class="tab-name">
                    <div class="tab-method" v-if="activeTab == 0">
                        <h3>All Users</h3>

                        <v-spacer></v-spacer>

                        <button class="btn btn-primary search-users" @click="inputClick">
                            <img src="@/assets/images/search-icon.svg" alt="" width="15px" height="15px" class="mobile-search-icon" />
                        </button>

                        <div class="search" :class="isInputExpanded ? 'expanded' : ''">
                            <img src="@/assets/images/search-icon.svg" alt="" width="15px" height="15px" class="input-search-icon" :class="isInputExpanded ? 'expanded' : ''" />
                            
                            <input
                                class="search-asd" 
                                type="text"
                                id="search-input"
                                v-model.trim="search"
                                placeholder="Search Users..."
                                @input="handleSearch"
                                autocomplete="off" />
                        </div>

                        <button v-if="isInputExpanded" class="close-btn" @click="clearInput">
                            Cancel
                        </button>

                        <v-btn color="primary" dark class="ml-2 btn-blue" @click="addUser">
                            Add User
                        </v-btn>
                    </div>                    
                </div>       
            </template>

            <template v-slot:[`item.name`]="{ item }">
                <div class="user-name">
                    <p class="mb-0" v-if="item.isCurrent">
                        {{ item.name }}

                        <span>(Current User)</span>
                    </p>

                    <p class="mb-0" v-else>{{ item.name }}</p>
                </div>

                <div>
                    <span>
                        {{ item.email_address }}
                    </span>
                </div>
            </template>

            <template v-slot:[`item.email_address`]="{ item }">
                <div class="email-wrapper-mobile">
                    <div class="content-wrapper">
                        <span>Date Added</span>
                        <p>{{ item.date_added }}</p>
                    </div>

                    <div class="content-wrapper">
                        <span>Last Activity At</span>
                        <p>{{ item.activity_at }}</p>
                    </div>
                </div>
            </template>

            <template v-slot:[`item.date_added`]="{ item }">
                <div class="user-action-buttons">
                    <!-- <v-btn class="btn-white icons" @click="editPaymentMethod(item)">
                        <img src="../../../assets/icons/edit-blue.svg" alt="">
                    </v-btn> -->

                    <v-btn class="btn-white icons" @click="deleteUser(item)">
                        <img src="../../../../assets/icons/delete-blue.svg" alt="">
                    </v-btn>
                </div>
            </template>

            <template v-slot:no-data>
                <v-btn color="primary"> Reset </v-btn>
            </template>
        </v-data-table>

        <Pagination 
            v-if="typeof items !== 'undefined' && items.length > 0"
            :pageData.sync="page"
            :lengthData.sync="pageCount"
            :isMobile="isMobile"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import Pagination from '../../../Pagination.vue'
import globalMethods from '../../../../utils/globalMethods'

export default {
    name: "UsersMobileTable",
    props: ['items', 'isMobile'],
    components: {
        Pagination
    },
    mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "settings/users");
        this.fetchCountries()
    },
    data: () => ({
        page: 1,
        pageCount: 0,
        itemsPerPage: 35,
		search: "",
        headers: [
            {
                text: "User",
                align: "start",
                sortable: false,
                value: "name",
                width: "30%", 
                fixed: true
            },
            {
                text: "Email Address",
                align: "start",
                sortable: false,
                value: "email_address",
                width: "20%", 
                fixed: true
            },
            {
                text: "Date Added",
                align: "start",
                sortable: false,
                value: "date_added",
                width: "20%", 
                fixed: true
            },
            {
                text: "Last Activity At",
                align: "start",
                sortable: false,
                value: "activity_at",
                width: "15%", 
                fixed: true
            },
            {
                text: "",
                align: "end",
                sortable: false,
                value: "actions",
                width: "15%", 
                fixed: true
            },
        ],
        activeTab: 0,
        isInputExpanded: false,
        searchData: '',
    }),
    computed: {},
    watch: {},
    methods: {
        ...mapActions({
            fetchCountries: 'warehouse/fetchCountries',
        }),
        ...globalMethods,
        getCurrentTab(id) {
            console.log(id);
        },
        onTabChange() {
            this.page = 1;

            if (this.activeTab == 1) {
                this.$router.push(`notifications`)
            }

            if (this.activeTab == 2) {
                this.$router.push(`manage-payment-methods`)
            }
        },
        addUser() {
            this.$emit('addUser')
        },
        editUser(user) {
            this.editedIndex = this.items.indexOf(user)
			this.editedItem = Object.assign({}, user)
			this.dialog = true
        },
        close() {
            this.$emit('close')
        },
        deleteUser(item) {
            this.$emit('deleteUser', item)
		},
        closeDelete() {
            this.$emit('closeDelete')
        },
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem);
            } else {
                this.desserts.push(this.editedItem);
            }
            this.close();
        },
        clearInput() {
            this.isInputExpanded = false
            this.searchData = ''
            this.search = ''
        },
        inputClick() {
            this.isInputExpanded = true
            document.getElementById("search-input").focus()
        },
        handleSearch() {},
    },
};
</script>

<style lang="scss">
@import '../../../../assets/scss/pages_scss/settings/users.scss';
@import '../../../../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../../../../assets/scss/buttons.scss';
</style>