import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import './assets/css/main.css';
import './assets/scss/global.scss'
import router from './router'
import vuetify from './plugins/vuetify';
import vuetifyMoney from "./plugins/vuetify-money.js";
import axios from 'axios';
import 'izitoast/dist/css/iziToast.min.css';
import countryFlag from "./plugins/country-flag.js";
import './assets/tailwind.css'

Vue.config.productionTip = false;

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL
// axios.defaults.baseURL = "http://db505f5cfa37.ngrok.io/api"
axios.defaults.headers.common.Accept = "application/json"

// adding token by interceptors
axios.interceptors.request.use(function (config) {
	const token = "Bearer " + store.getters.getUserToken
	config.headers.Authorization = token;
	return config;
});

// refresh token by using interceptors

let isRefreshing = false;
// let subscribers = [];

axios.interceptors.response.use(
	response => {
		return response;
	},
	async (err) => {
		const {
			config,
			response: { status, data }
		} = err;


		const originalRequest = config;



		if (store.getters.getUserToken === '') {

			//store.dispatch("logout")
			return Promise.reject(err);
		}

		if (originalRequest.url.includes("refresh-token")) {

			store.dispatch("logout")
			return Promise.reject(err);
		}

		if ( status == 500 || status == 400) {
			return Promise.reject(data)
		}


		if (status === 401 && data.message === "Unauthenticated.") {

			if (!isRefreshing) {
				isRefreshing = true;
				store
					.dispatch("refreshToken")
					.then(({ status }) => {
						if (status === 200 || status == 204) {
							isRefreshing = false;
						}
						originalRequest.headers.Authorization = "Bearer " + store.getters.getUserToken
						return axios(originalRequest)
						// subscribers = [];
					})
					.catch(error => {
						return Promise.reject(error);
					});
			}

			// const requestSubscribers = new Promise(resolve => {
			// 	subscribeTokenRefresh(() => {
			// 		resolve(axios(originalRequest));
			// 	});
			// });

			// onRefreshed();

			// return requestSubscribers;

		}


	}
);

// function subscribeTokenRefresh(cb) {
// 	subscribers.push(cb);
// }

// function onRefreshed() {
// 	subscribers.map(cb => cb());
// }

// subscribers = [];
///

// console.log(axios.defaults.headers.common.Authorization)

new Vue({
	store,
	router,
	vuetify,
	vuetifyMoney,
	countryFlag,
	render: h => h(App)
})
	.$mount("#app");
