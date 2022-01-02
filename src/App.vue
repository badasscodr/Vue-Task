<template>
    <v-app class="v-app-main-wrapper" id="inspire" v-resize="onResize">
        <v-navigation-drawer v-model="drawer" app v-if="getUserToken !== '' && getUser !== null">
            <DrawerMenu v-bind:isMobile="isMobile" />
        </v-navigation-drawer>
                           
        <ul v-if="isTablet" class="tablet-header-menu" 
            :class="getUserToken !== '' && getUser !== null ? 'authenticated' : ''">
            <li>
                <v-app-bar-nav-icon
                    @click="drawer = !drawer"
                    color="white">
                </v-app-bar-nav-icon>
            </li>

            <li>
                <div class="logo">
                    <router-link to="/shipments" class="shipment-logo">
                        <img src="@/assets/images/logo.png" alt="" />
                    </router-link>
                </div>
            </li>
        </ul>

        <v-app-bar
            app
            height="64px"
            v-bind:style="{ background: activeColor }"
            v-if="getUserToken !== '' && getUser !== null && !isMobile">

            <v-toolbar-title>
                <div class="forFelx" :class="isMobile ? 'mobile' : 'desktop'">
                    <SearchGetHelp v-bind:isMobile="isMobile" />
                    <Notification v-bind:isMobile="isMobile" />
                </div>
            </v-toolbar-title>
        </v-app-bar>

		<nav class="header-menu" id="header-id" v-if="getUserToken !== '' && getUser !== null && isMobile">	
			<span class="extend-search" id="search-icon-extend" v-if="isInputExpanded">
				<img src="@/assets/images/search-icon.svg" alt="" />
			</span>		

			<ul class="search-wrapper">
				<li>
					<v-app-bar-nav-icon
						v-if="isMobile"
						@click="drawer = !drawer"
						color="white">
					</v-app-bar-nav-icon>
				</li>

				<li>
					<div class="logo">
						<router-link to="/shipments" class="shipment-logo">
                            <img src="@/assets/images/logo.png" alt="" />
                        </router-link>
					</div>
				</li>

				<li class="search-wrap">
					<img src="@/assets/images/search-icon.svg" alt="" class="mobile-search-icon" />

					<div>
						<Notification v-bind:isMobile="isMobile" />
						<input
							class="search" 
							:class="isInputExpanded ? 'expanded' : ''"
							type="text"
							id="search-input"
							v-on:click="inputClick"
							v-model.trim="searchData"
							placeholder="Search anything..."
                            @input="handleSearch"
							autocomplete="off" />
							<!-- @keyup.stop="handleSearch" -->
					</div>

					<button v-if="searchData !== ''" class="close-btn" @click="clearInput">
						<img src="./assets/images/close.svg" alt="" width="18px">
					</button>
				</li>
			</ul>

			<div class="search-results"
                 :class="isOpen ? 'open-dropdown' : ''" >

                <ul class="loading-search-wrapper" v-if="masterSearchLoading">
                    <div class="loading-search">
                        <v-progress-circular
                            :size="30"
                            color="#0171a1"
                            indeterminate>
                        </v-progress-circular>
                    </div>
                </ul>

                <ul class="has-data" v-if="!masterSearchLoading && searchResults !== 'undefined' && searchResults !== null && 
                    (searchResults.customers !== null || searchResults.shipments !== null)">
                    <div v-if="searchResults.customers !== 'undefined' && searchResults.customers !== null">
                        <p class="dropdown-title"> Customers </p>

                        <div v-for="(data, index) in searchResults.customers" 
                            :key="index">

                            <li class="dropdown-data">
                                {{ data.company_name }}
                            </li>
                        </div>                        
                    </div>

                    <div v-if="searchResults.shipments !== 'undefined' && searchResults.shipments !== null">
                        <p class="dropdown-title"> Shipments </p>

                        <div v-for="(data, index) in searchResults.shipments" 
                            :key="index">

                            <li class="dropdown-data" 
                                v-on:click="goToShipmentDetails(data)">

                                <router-link :to="`/shipment/${data.id}`">
                                    <img src="./assets/images/search-shipment-icon.svg" alt="">
                        
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
                        <img src="./assets/images/no-data-found.svg" alt="" srcset="">
                        <h4>No Match Found!</h4>
                        <p>You couldn’t find any result that matches your search. 
                        <br/>Can you please check the spelling or try different search?
                        </p>
                    </div>
                </ul>
            </div>
		</nav>

        <v-main :class="getUserToken !== '' && getUser !== null ? 'authenticated' : ''">
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import { mapGetters, mapActions } from "vuex";
import DrawerMenu from "./components/DrawerMenu.vue";
import SearchGetHelp from "./components/SearchGetHelp.vue";
import Notification from "./components/Notification.vue";
import axios from "axios"
import _ from 'lodash'
import moment from 'moment'

var cancel;
var CancelToken = axios.CancelToken;

export default {
	name: "App",
	components: {
		// HelloWorld,
		DrawerMenu,
		SearchGetHelp,
		Notification,
	},
	created() {
		this.fetchUser();
	},
	data: () => ({
		//
		drawer: null,
		isMobile: false,
		activeColor: "white",
		searchResults: {
            customers: null,
            shipments: null
        },
		noResults: false,
		searching: false,
		searchData: '',
		isOpen: false,
		isInputExpanded: false,
        isTablet: false,
        currentWidth: window.innerWidth
	}), 
	watch: {
		isInputExpanded(dropOpen) {
            if (dropOpen) {
                document.addEventListener('click', this.closeIfClickedOutsideMobile)
            }
        }
    },
	methods: {
		...mapActions(["logout", "fetchUser", "fetchMasterSearch", "fetchShipmentDetails"]),
		onResize() {
			if (window.innerWidth < 1024) {
				this.isMobile = true;
				this.activeColor = "#0171A1";
			} else {
				this.isMobile = false;
				this.activeColor = "white";
			}

            if (window.innerWidth > 1023 && window.innerWidth < 1201) {
                this.isTablet = true
            } else {
                this.isTablet = false
            }
		},
		inputClick() {
			this.isInputExpanded = true
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
				this.isInputExpanded = true
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
                console.log("debouncing call..");
                const context = this;
                const args = arguments;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => func.apply(context, args), delay);
                console.log("..done");
            };
        },
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
                        // this.searchResults = JSON.parse(JSON.stringify(this.getAllMasterSearch))

                        if (this.getAllMasterSearch.shipments !== 'undefined' && this.getAllMasterSearch.shipments !== null) {
                            if (this.getAllMasterSearch.shipments.length !== 'undefined' && this.getAllMasterSearch.shipments.length !== 0) {                   
                                this.searchResults.shipments = this.getAllMasterSearch.shipments
                            } else {
                                this.searchResults.shipments = null
                            }
                        }
                        
                        // if (this.getAllMasterSearch.customers !== 'undefined' && this.getAllMasterSearch.customers !== null) {
                        //     if (this.getAllMasterSearch.customers.length !== 'undefined' && this.getAllMasterSearch.customers.length !== 0) {
                        //         this.searchResults.customers = this.getAllMasterSearch.customers
                        //     } else {
                        //         this.searchResults.customers = null
                        //     }
                        // }
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
        closeIfClickedOutsideMobile(event) {
            if (document.getElementById('search-input').contains(event.target) !== null) {
                if (!document.getElementById('search-input').contains(event.target)) {
                    document.getElementById("search-input").focus()

                    this.isOpen = false
                    this.searchData = ''
					this.isInputExpanded = false

                    document.removeEventListener('click', this.closeIfClickedOutsideMobile)
                }
            }
        },
        async goToShipmentDetails(data) {
            // this.$router.replace(`shipment/${data.id}?status=${data.Status}`)
            // this.clear()

            try {
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
		...mapGetters(["getUserToken", "getUser", "getAllMasterSearch", "masterSearchLoading"]),
	},
	updated() {
        if (window.innerWidth !== this.currentWidth) {
            this.currentWidth = window.innerWidth
        }
    }
};

</script>

<style lang="scss">
@import './assets/scss/app.scss';
</style>
