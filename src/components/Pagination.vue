<template>
    <div class="pagination-wrapper pt-3">
        <v-pagination
            v-model="page"
            :length="pageCount"
            prev-icon="Previous"
            next-icon="Next"
            :total-visible="!isMobile ? '11' : '5' ">
        </v-pagination>
    </div>    
</template>

<script>
export default {
    props: ['pageData', 'lengthData', 'isMobile'],
	name: 'Pagination',
	components: {
		// vueDropzone: vueDropzone
	},
	data: () => ({
        
	}),
	computed: {
        page: {
            get() {
                return this.pageData
            },
            set (value) {
                this.$emit('update:pageData', value)
                if (this.$store.state.page.currentPage == 'shipments') {
                    this.$store.dispatch("page/setCurrentShipmentPage", value)
                }
            }
        },
        pageCount: {
            get() {
                return this.lengthData
            },
            set (value) {
                this.$emit('update:lengthData', value)
            }
        }
    },        
	watch: {

    },        
	created () {
        
	},
	methods: {

	},
	mounted() {
        
	},
	updated() {
        
	}
}
</script>

<style>
.pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    align-content: center;
    padding: 15px 24px;
    align-content: center; 
    border: 1px solid #d2e3ed;
    /* border-top: none; */
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

.pagination-wrapper .v-pagination li button {
    width: 100%;
    /* font-size: 14px; */
    font-size: 16px;
    box-shadow: none;
}

.pagination-wrapper .v-pagination li button:focus {
    outline: 0 !important;
}

.pagination-wrapper .v-pagination li button i {
    /* font-size: 14px; */
    font-size: 16px;
    font-style: normal;
    font-family: "Inter-Medium", sans-serif;
    font-weight: 600;
}

.pagination-wrapper .v-pagination__navigation i {
    color: #0171a1 !important;
}

.pagination-wrapper .v-pagination__navigation--disabled i {
    color: #b4cfe0 !important;
}

.v-pagination__item {
    color: #4a4a4a !important;
    outline: none !important;
}

.theme--light.v-pagination .v-pagination__item--active {
    color: #002f44 !important;
    background-color: transparent !important;
    border: none;
    font-family: "Inter-Bold", sans-serif;
    outline: none !important;
}

.theme--light.v-pagination .v-pagination__item--active:focus {
    border: none !important;
    outline: none !important;
}
</style>
