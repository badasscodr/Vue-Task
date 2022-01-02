<template>
    <div class="supplier-container" v-resize="onResize">
		<!-- DESKTOP -->
        <SupplierDesktopTable 
            :items="suppliers"
            @addSupplier="addSupplier"
            @editSupplier="editSupplier"
            :isMobile="isMobile"
            v-if="!isMobile"
        />

		<!-- MOBILE -->
		<SupplierMobileTable 
            :items="suppliers"
            @addSupplier="addSupplier"
            @editSupplier="editSupplier"
            :isMobile="isMobile"
            v-if="isMobile"
        />

        <SupplierDialog 
            :editedIndexData.sync="editedIndex"
            :dialogData.sync="dialog"
            :editedItemData.sync="editedItem"
            :defaultItemData.sync="defaultItem"
            @setToDefault="setToDefault"
            @close="close" 
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SupplierDialog from '../components/SupplierComponents/SupplierDialog.vue'
import SupplierDesktopTable from '../components/Tables/Supplier/SupplierDesktopTable.vue'
import SupplierMobileTable from '../components/Tables/Supplier/SupplierMobileTable.vue'

export default {
    name: "Suppliers",
	components: {
		SupplierDialog,
        SupplierDesktopTable,
        SupplierMobileTable
	},
    data: () => ({
		page: 1,
        pageCount: 0,
        itemsPerPage: 35,
        dialog: false,
        dialogDelete: false,
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
        editedIndex: -1,
        editedItem: {
            company_name: "",
            phone: "",
            address: "",
            emails: null
        },
        defaultItem: {
            company_name: "",
            phone: "",
            address: "",
            emails: null
        },
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
        suppliers() {
            let data = []

            if (typeof this.getSuppliers !== 'undefined' && this.getSuppliers !== null) {
                if (typeof this.getSuppliers.data !== 'undefined' && this.getSuppliers.data.length !== 'undefined') {
                    data = this.getSuppliers.data

                    data.map((value) => {
                        if (value.address !== null) {
                            value.address = value.address.replace(/,(?=[^\s])/g, ", ")
                        } else {
                            value.address = ''
                        }

                        if(value.phone == null) {
                            value.phone = ''
                        }

                        if(value.emails == null) {
                            value.emails = ''
                        }
                    })
                }
            }

            return data
        }
    },
    watch: {
        dialog(val) {
            val || this.close();
        },
        dialogDelete(val) {
            val || this.closeDelete();
        },
    },
    created() {},
    methods: {
        ...mapActions({
            fetchSuppliers: 'suppliers/fetchSuppliers'
        }),
        addSupplier() {
            this.dialog = true;
        },
        editSupplier(item) {
            this.editedIndex = this.suppliers.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },
        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },
        deleteSupplier(item) {
            this.editedIndex = this.suppliers.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },
        deleteSupplierConfirm() {
            this.suppliers.splice(this.editedIndex, 1);
            this.closeDelete();
        },
        closeDelete() {
            this.dialogDelete = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },
		onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
        setToDefault() {
            this.editedItem = this.defaultItem
            this.close()
            this.dialog = true
        }
    },
    async mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "suppliers");
        await this.fetchSuppliers()        
    },
    updated() {}
};
</script>

<style lang="scss">
@import '../assets/scss/pages_scss/supplier/supplier.scss';
@import '../assets/scss/buttons.scss';
@import '../assets/css/dialog_styles/dialogHeader.css';
@import '../assets/css/dialog_styles/dialogBody.css';
@import '../assets/css/dialog_styles/dialogFooter.css';
</style>
