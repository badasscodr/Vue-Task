<template>
    <div class="supplier-content-wrapper">
        <v-data-table
            :headers="headers"
            mobile-breakpoint="769"
            :items="suppliers"
            class="suppliers-table elevation-1"
            :class="suppliers !== null && suppliers.length !== 'undefined' && suppliers.length !== 0 ? '' : 'no-data-table'"
			:search="search"
			:page.sync="page"
            :items-per-page="itemsPerPage"
			@page-count="pageCount = $event"
			hide-default-footer
            fixed-header>

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Suppliers</v-toolbar-title>
					
                    <v-spacer></v-spacer>

					<Search 
						placeholder="Search Supplier"
						className="search custom-search"
						:inputData.sync="search" />

                    <v-btn color="primary" class="btn-blue add-supplier" @click.stop="addSupplier">
                        Add Supplier
                    </v-btn>
                </v-toolbar>
            </template>

			<template v-slot:[`item.emails`]="{ item }">
                <div class="email-wrapper" v-if="item.emails !== ''">
                    <div class="email-container" v-for="(email, index) in item.emails" :key="index">
                        <p class="mb-0" style="color: #0171A1;">{{ email }}</p>
                    </div>
                </div>

                <div v-if="item.emails == ''">
                    <p class="mb-0" style="color: #4a4a4a;">--</p>
                </div>
            </template>

            <template v-slot:[`item.phone`]="{ item }">
                <p class="mb-0">{{ item.phone !== '' ? item.phone : '--' }}</p>
            </template> 

            <template v-slot:[`item.address`]="{ item }">
                <p class="mb-0">{{ item.address !== '' ? item.address : '--' }}</p>
            </template> 

            <template v-slot:[`item.actions`]="{ item }">				
				<div class="item-button" @click="editSupplier(item)">
					<img src="../../../assets/icons/edit-blue.svg" alt="">
					<span>Edit</span>
				</div>
            </template>

            <template v-slot:no-data>
                <div class="no-data-preloader mt-4" v-if="getSuppliersLoading">
                    <v-progress-circular
                        :size="40"
                        color="#0171a1"
                        indeterminate
                        v-if="getSuppliersLoading">
                    </v-progress-circular>
                </div>

                <div class="no-data-wrapper" v-if="!getSuppliersLoading && suppliers !== null && suppliers.length !== 'undefined' && suppliers.length == 0">
                    <div class="no-data-heading">
                        <img src="../../../assets/icons/empty-supplier-icon.svg" width="40px" height="42px" alt="">

                        <h3> Add Supplier </h3>
                        <p>
                            Let’s add the first supplier on Shifl. <br>
                            You can use this supplier list for creating Purchase Orders.
                        </p>

                        <div class="mt-4">
                            <v-btn color="primary" class="btn-blue add-supplier" @click.stop="addSupplier">
                                Add Supplier
                            </v-btn>
                        </div>
                    </div>
                </div>
            </template>
        </v-data-table>

		<Pagination 
            v-if="suppliers.length !== 0"
			:pageData.sync="page"
			:lengthData.sync="pageCount"
			:isMobile="isMobile"
		/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Search from '../../../components/Search.vue'
import Pagination from '../../../components/Pagination.vue'

export default {
    name: "SupplierDesktopTable",
    props: ['items', 'isMobile'],
	components: {
		Search,
		Pagination,
	},
    data: () => ({
		page: 1,
        pageCount: 0,
        itemsPerPage: 35,
        headers: [
            {
                text: "Name",
                align: "start",
                sortable: false,
                value: "company_name",
                width: "25%", 
                fixed: true
            },
            {
                text: "Phone",
				align: "start",
                value: "phone",
                sortable: false,
                width: "20%", 
                fixed: true
            },
            {
                text: "Address",
				align: "start",
                value: "address",
                sortable: false,
                width: "25%", 
                fixed: true
            },
			{
                text: "Email",
				align: "start",
                value: "emails",
                sortable: false,
                width: "20%", 
                fixed: true
            },
			{
                text: "",
				align: "center",
                value: "actions",
                sortable: false,
                width: "10%", 
                fixed: true
            },
        ],
		search: '',
    }),
    computed: {
        ...mapGetters({
            getSuppliers: 'suppliers/getSuppliers',
            getUser: 'getUser',
            getSuppliersLoading: 'suppliers/getSuppliersLoading'
        }),
        formTitle() {
            return this.editedIndex === -1 ? "Add Supplier" : "Edit Supplier";
        },
        suppliers: {
            get() {
                return this.items
            }, 
            set(value) {
                this.$emit('items', value)
            }
        }
    },
    watch: {},
    created() {},
    methods: {
        ...mapActions({
            fetchSuppliers: 'suppliers/fetchSuppliers'
        }),
        addSupplier() {
            this.$emit('addSupplier')
        },
        editSupplier(item) {
            this.$emit('editSupplier', item)
        },
        deleteSupplier() {
            console.log('delete');
        }
        // editItem(item) {
        //     this.editedIndex = this.suppliers.indexOf(item);
        //     this.editedItem = Object.assign({}, item);
        //     this.dialog = true;
        // },
        // deleteItem(item) {
        //     this.editedIndex = this.suppliers.indexOf(item);
        //     this.editedItem = Object.assign({}, item);
        //     this.dialogDelete = true;
        // },
        // deleteItemConfirm() {
        //     this.suppliers.splice(this.editedIndex, 1);
        //     this.closeDelete();
        // },
        // close() {
        //     this.dialog = false;
        //     this.$nextTick(() => {
        //         this.editedItem = Object.assign({}, this.defaultItem);
        //         this.editedIndex = -1;
        //     });
        // },
        // closeDelete() {
        //     this.dialogDelete = false;
        //     this.$nextTick(() => {
        //         this.editedItem = Object.assign({}, this.defaultItem);
        //         this.editedIndex = -1;
        //     });
        // },
		// onResize() {
        //     if (window.innerWidth < 769) {
        //         this.isMobile = true
        //     } else {
        //         this.isMobile = false
        //     }
        // },
        // setToDefault() {
        //     this.editedItem = this.defaultItem
        //     this.close()
        //     this.dialog = true
        // }
    },
    async mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "suppliers");  
    },
    updated() {}
};
</script>

<style>
/* @import '../../../assets/css/suppliers_styles/suppliers.css';
@import '../../../assets/css/dialog_styles/dialogHeader.css';
@import '../../../assets/css/dialog_styles/dialogBody.css';
@import '../../../assets/css/dialog_styles/dialogFooter.css'; */

</style>