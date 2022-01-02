<template>
    <div class="supplier-content-wrapper">
        <v-data-table
            :headers="headers"
            :items="suppliers"
            mobile-breakpoint="769"
            class="suppliers-table-mobile elevation-1"
			:search="search"
			:page.sync="page"
            :items-per-page="itemsPerPage"
			@page-count="pageCount = $event"
			hide-default-footer>

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Suppliers</v-toolbar-title>
					
                    <v-spacer></v-spacer>

					<v-btn color="primary" class="btn-blue add-supplier" @click.stop="addSupplier">
                        Add Supplier
                    </v-btn>
                </v-toolbar>					

				<div class="search-component">
					<Search 
						placeholder="Search Supplier"
						className="search custom-search"
						:inputData.sync="search" />
				</div>
            </template>	

			<template v-slot:[`item.company_name`]="{ item }">
                <div class="supplier-row">
					<p class="text-start mb-0" style="font-weight: 600;">{{ item.company_name }}</p>					

					<div class="item-button" @click="editSupplier(item)">
						<img src="../../../assets/icons/edit-blue.svg" alt="">
						<span>Edit</span>
					</div>
				</div>
            </template>

			<template v-slot:[`item.phone`]="{ item }">
                <div class="supplier-row">
					<p class="p-gray mb-0">{{ item.address }}</p>
				</div>

				<div class="supplier-row">
					<div class="d-flex align-items-center mt-1 mb-2">
						<img src="../../../assets/icons/phone.svg" class="mr-1" alt="">
						<p class="p-gray mb-0">{{ item.phone }}</p>
					</div>
				</div>
            </template>

			<template v-slot:[`item.address`]="{ item }">
				<div class="mb-4 email-mobile">
					<img src="../../../assets/icons/email.svg" class="mt-1 mr-1" alt="">
				
					<div v-if="item.emails !== ''">
						<div class="supplier-row" v-for="(email, index) in item.emails" :key="index">
							<p class="mb-0 text-start" style="color: #0171A1;">{{ email }}</p>
						</div>
					</div>

                    <div v-else>
                        <p class="mb-0" style="color: #4a4a4a;">--</p>
                    </div>
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
    name: "SupplierMobileTable",
    props: ['items'],
	components: {
		Search,
		Pagination,
	},
    data: () => ({
		page: 1,
        pageCount: 0,
        itemsPerPage: 15,
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
		isMobile: false
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
    },
    async mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "suppliers");  
    },
    updated() {}
};
</script>

<style lang="scss">
/* @import '../assets/css/suppliers_styles/suppliers.css';
@import '../assets/css/dialog_styles/dialogHeader.css';
@import '../assets/css/dialog_styles/dialogBody.css';
@import '../assets/css/dialog_styles/dialogFooter.css'; */

</style>