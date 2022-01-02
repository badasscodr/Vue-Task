<template>
    <div class="users-wrapper" v-resize="onResize">
        <UsersDesktopTable 
            :isMobile="isMobile"
            :items="items"
            @addUser="addUser"
            @deleteUser="deleteUser"
            @close="close"
            @closeDelete="closeDelete"
            v-if="!isMobile" />

        <UsersMobileTable 
            :isMobile="isMobile"
            :items="items"
            @addUser="addUser"
            @deleteUser="deleteUser"
            @close="close"
            @closeDelete="closeDelete"
            v-if="isMobile" />

        <!-- <Pagination 
            v-if="typeof items !== 'undefined' && items.length > 0"
            :pageData.sync="page"
            :lengthData.sync="pageCount"
            :isMobile="isMobile"
        /> -->

        <AddUserDialog 
            :dialog.sync="dialog"
            :editedIndex.sync="editedIndex"
            :editedItemData.sync="editedItem"
            @close="close" />

        <DeleteDialog 
            :dialogData.sync="dialogDelete"
            :editedItemData.sync="currentItemToDelete"
            :editedIndexWarehouse.sync="editedIndex"
            :defaultItemWarehouse.sync="defaultItem"
            @delete="deleteUserConfirm"
            @close="closeDelete"
            fromComponent="user"
            :loadingDelete="getDeletePaymentMethod"
            componentName="User" />
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import UsersDesktopTable from '../../Tables/Settings/Users/UsersDesktopTable.vue'
import UsersMobileTable from '../../Tables/Settings/Users/UsersMobileTable.vue'
import DeleteDialog from '../../Dialog/DeleteDialog.vue'
import AddUserDialog from '../Dialog/AddUserDialog.vue'
// import Search from '../../Search.vue'
// import Pagination from '../../Pagination.vue'
import globalMethods from '../../../utils/globalMethods'

export default {
    name: "Users",
    components: {
        UsersDesktopTable,
        UsersMobileTable,
        DeleteDialog,
        AddUserDialog,
        // Search,
        // Pagination
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
        dialog: false,
        dialogDelete: false,
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
        items: [
            {
                name: 'Timothy Anker',
                email_address: 'timothy@group.com',
                date_added: 'Apr 29, 2020',
                activity_at: 'Today',
                isCurrent: false
            },
            {
                name: 'Anirban Sarkar',
                email_address: 'a.sarkar@group.com',
                date_added: 'Apr 29, 2020',
                activity_at: 'Jun 30, 2021',
                isCurrent: false
            },
            {
                name: 'Shamsuddin Delwar',
                email_address: 'shams@group.com',
                date_added: 'Mar 10, 2020',
                activity_at: 'Today',
                isCurrent: true
            },
            {
                name: 'Alexa Jackson',
                email_address: 'alexa@group.com',
                date_added: 'Jan 10, 2020',
                activity_at: 'May 31, 2021',
                isCurrent: false
            },
        ],
        editedIndex: -1,
        editedItem: {
            name: '',
            email_address: '',
            date_added: '',
            activity_at: '',
            isCurrent: ''
        },
        defaultItem: {
            name: '',
            email_address: '',
            date_added: '',
            activity_at: '',
            isCurrent: ''
        },
        isMobile: false,
        tabs: ["Users", "Notifications", "Payment Methods"],
        activeTab: 0,
        currentItemToDelete: null,
        getDeletePaymentMethod: false,
        isInputExpanded: false,
        searchData: '',
    }),
    computed: {},
    watch: {
        dialog(val) {
            val || this.close();
        },
        dialogDelete(val) {
            val || this.closeDelete();
        },
    },
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
            this.dialog = true
        },
        editUser(user) {
            this.editedIndex = this.items.indexOf(user)
			this.editedItem = Object.assign({}, user)
			this.dialog = true
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        deleteUser(item) {
			this.dialogDelete = true
			this.currentItemToDelete = item
		},
		async deleteUserConfirm() {
			if (this.currentItemToDelete !== null) {
                this.getDeletePaymentMethod = true
                // try {
                //     await this.deleteProduct(this.currentProductToDelete.id)
                //     this.fetchProducts()
                //     this.closeDeleteProduct()
                //     this.notificationMessage('Product has been deleted.')
                // } catch (e) {
                //     this.closeDeleteProduct()
                //     this.notificationError(e)
                // }

                setTimeout(() => {
                    this.notificationMessage('User has been deleted.')
                    this.getDeletePaymentMethod = false
                    this.closeDelete()
                }, 3000)
            }
		},
        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1;
            })
        },
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem);
            } else {
                this.desserts.push(this.editedItem);
            }
            this.close();
        },
        onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
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
@import '../../../assets/scss/pages_scss/settings/users.scss';
@import '../../../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../../../assets/scss/buttons.scss';
</style>