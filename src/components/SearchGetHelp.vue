<template>
    <div class="pos">
        <div class="searchHelp" id="dropdown" v-if="!isMobile">
            <img src="@/assets/images/search-icon.svg" alt="" class="search-icon" />

            <input
                :class="isOpen ? 'open' : 'close'"
                class="text-autocomplete"
                type="text"
                @input="handleSearch"
                id="input-search-data"
                v-model.trim="searchData"
                placeholder="Search anything..."
                autocomplete="off" />
                <!-- @keyup.stop="handleSearch" -->

            <br />

            <button v-if="searchData !== ''" class="close-btn" @click="clearInput">
                <img src="../assets/images/close.svg" alt="" width="18px">
            </button>

            <div class="search-results"
                :class="isOpen ? 'open-dropdown' : 'close-dropdown'" >
                <ul class="loading-search-wrapper" v-if="masterSearchLoading">
                    <div class="loading-search">
                        <v-progress-circular
                            :size="30"
                            color="#0171a1"
                            indeterminate>
                        </v-progress-circular>
                    </div>
                </ul>

                <ul class="has-data" v-if="!masterSearchLoading && searchResults.shipments !== null">
                    <!-- <div v-if="searchResults.customers !== 'undefined' && searchResults.customers !== null">
                        <p class="dropdown-title"> Customers </p>

                        <div v-for="(data, index) in searchResults.customers" 
                            :key="index">

                            <li class="dropdown-data customer">
                                {{ data.company_name }}
                            </li>
                        </div>                        
                    </div> -->

                    <div v-if="searchResults.shipments !== 'undefined' && searchResults.shipments !== null">
                        <p class="dropdown-title"> Shipments </p>

                        <div v-for="(data, index) in searchResults.shipments" 
                            :key="index">

                            <li class="dropdown-data" 
                                v-on:click="goToShipmentDetails(data)">

                                <!-- <router-link :to="`/shipment/${data.id}?status=${data.Status}`"> -->
                                <router-link :to="`/shipment/${data.id}`">
                                    <img src="../assets/images/search-shipment-icon.svg" alt="">
                        
                                    <!-- if status is pending approval, cancel or pending -->
                                    <div v-if="data.Status == 'Pending Approval' || data.Status == 'Cancelled' || data.Status == 'Pending'">
                                        <p class="data-ref">{{ data.ReferenceID }}</p>
                                        <p class="data-location">
                                            {{ data.Departure.location !== 'undefined' 
                                                || data.Departure.location !== null 
                                                || typeof typeof d.Departure.location == 'undefined'
                                                    ? data.Departure.location + ' - '
                                                    : 'Not Specified'
                                            }}

                                            {{ data.Arrival.location !== 'undefined' && data.location !== null
                                                ? data.Arrival.location
                                                : 'Not Specified'
                                            }}
                                        </p>
                                    </div>

                                    <!-- if status is completed, in transit or awaiting departure -->
                                    <div v-else>
                                        <p class="data-ref">{{ data.ReferenceID }}</p>
                                        <p class="data-location">
                                            {{ data.Departure.location !== 'undefined' 
                                                || data.Departure.location !== null 
                                                || typeof typeof d.Departure.location == 'undefined'
                                                    ? data.Departure.location
                                                    : 'Not Specified'
                                            }}

                                            {{ data.Departure.etd !== 'undefined' && data.Departure.etd !== null && data.Departure.etd !== 'Not Specified' 
                                                ?  `(${date(data.Departure.etd)})` + ' - '
                                                : '(Not Specified) - '
                                            }}

                                            {{ data.Arrival.location !== 'undefined' && data.location !== null
                                                ? data.Arrival.location
                                                : 'Not Specified'
                                            }}

                                            {{ data.Arrival.eta !== 'undefined' && data.Arrival.eta !== null && data.Arrival.eta !== 'Not Specified' 
                                                ?  `(${date(data.Arrival.eta)})`
                                                : '(Not Specified)'
                                            }}
                                        </p>
                                    </div>
                                </router-link>
                            </li>
                        </div>
                    </div> 
                </ul>

                <ul class="no-match-data" 
                    v-if="!masterSearchLoading && searchResults.customers == null && searchResults.shipments == null"> 
                    <div>
                        <img src="../assets/images/no-data-found.svg" alt="" srcset="">
                        <h4>No Match Found!</h4>
                        <p>We couldn’t find any result that matches your search. 
                        <br/>Can you please check the spelling or try different search?
                        </p>
                    </div>
                </ul>
            </div>        
        </div>

        <div class="mobile-search-wrapper" v-if="isMobile">
            <img src="@/assets/images/search-icon.svg" alt="" class="search-icon" />
        </div>
    </div>
</template>

<script>
import axios from "axios"
import _ from 'lodash'
import moment from 'moment'
import { mapActions, mapGetters } from "vuex";

var cancel;
var CancelToken = axios.CancelToken;

export default {
    props: ["isMobile"],
    data() {
        return {
            loading: false,
            items: [],
            search: null,
            select: null,
            states: [
                "Alabama",
                "Alaska",
                "Marshall Islands",
                "Maryland",
                "Massachusetts",
                "Michigan",
                "Minnesota",
                "Mississippi",
                "Missouri",
                "Montana",
                "Nebraska",
                "Nevada",
                "New Hampshire",
                "New Jersey",
                "New Mexico",
                "New York",
                "North Carolina",
                "North Dakota",
                "Northern Mariana Islands",
            ],
            searchResults: {
                customers: null,
                shipments: null
            },
            noResults: false,
            searching: false,
            searchData: '',
            isOpen: false,
        };
    },
    watch: {
        search(val) {
            val && val !== this.select && this.querySelections(val);
        },
        isOpen(dropOpen) {
            if (dropOpen) {
                document.addEventListener('click', this.closeIfClickedOutside);
            }
        }
    },
    methods: {
        ...mapActions(["fetchMasterSearch", "fetchShipmentDetails"]),
        querySelections(v) {
            this.loading = true;
            // Simulated ajax query
            setTimeout(() => {
            this.items = this.states.filter((e) => {
                return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
            });
            this.loading = false
            }, 500);
        },
        clearInput() {
			setTimeout(() => {
				this.searching = false
				this.searchResults ={
                    customers: null,
                    shipments: null
                },
				this.searchData = ''
				this.isOpen = false
                document.getElementById("input-search-data").focus()
			}, 1)
		},
        clear() {
            this.searching = false
            this.searchResults = {
                customers: null,
                shipments: null
            },
            this.searchData = ''
            this.isOpen = false
        },
        pgtDebounce(func, delay) {
            let debounceTimer;

            return function() {
                console.log("debouncing call..")
                const context = this
                const args = arguments
                clearTimeout(debounceTimer)
                debounceTimer = setTimeout(() => func.apply(context, args), delay)
                console.log("..done")
            }
        },  
        // handleSearch() {
        //     this.pgtDebounce(this.preApiCall(), 300)
        // },
        // using lodash
        handleSearch: _.debounce(function() {
            this.preApiCall()
        }, 300),
        preApiCall() {
            if (cancel !== undefined) {
                cancel()
                console.log("cancelled");
            }
            this.apiCall(this.searchData)
        },
        async apiCall(searchData) {
            // this.searching = this.masterSearchLoading
            this.isOpen = true

            if (searchData !== "undefined" && searchData !== "") {
                let passedData = {
                    method: "post",
                    url: "/search",
                    cancelToken: new CancelToken(function executor(c) {
                        cancel = c
                    }),
                    params: {
                        search_text: searchData
                    }
                }

                try {
                    await this.fetchMasterSearch(passedData)

                    if (this.getAllMasterSearch !== 'undefined' && this.getAllMasterSearch !== null) {
                        if (this.getAllMasterSearch.shipments !== 'undefined' && this.getAllMasterSearch.shipments !== null) {
                            if (this.getAllMasterSearch.shipments.length !== 'undefined' && this.getAllMasterSearch.shipments.length !== 0) {                   
                                this.searchResults.shipments = this.getAllMasterSearch.shipments
                            } else {
                                this.searchResults.shipments = null
                            }
                        }
                    } else {
                        this.searchResults = {
                            customers: null,
                            shipments: null
                        }
                    }
                } catch (e) {
                    throw Error(e)
                }
            } else {
                this.clear()
            }
        },
        closeIfClickedOutside(event) {
            if (event !== 'undefined' && event !== null) {
                if (document.getElementById('dropdown').contains(event.target) !== null) {
                    if (!document.getElementById('dropdown').contains(event.target)) {
                        document.getElementById("input-search-data").focus()

                        this.isOpen = false
                        this.searchData = ''

                        document.removeEventListener('click', this.closeIfClickedOutside)
                    }
                }
            }
        },
        async goToShipmentDetails(data) {
            try {
                this.isOpen = false
                this.searchData = ''
                await this.fetchShipmentDetails(data.id)
                this.clear()
            } catch (e) {
                console.log(e);
            }
        },
        date: function (date) {
            return moment(date).format('MM/DD/YYYY');
        }
    },
    computed: {
        ...mapGetters(["getAllMasterSearch", "masterSearchLoading"]),
    },
    mounted() {},
    created() {},
    updated() {}
};
</script>

<style>
@import '../assets/css/shipments_styles/searchGetHelp.css';
</style>
