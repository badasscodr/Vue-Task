import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Dashboard',
		component: () => import( /* webpackChunkName: "/" */ '../views/Dashboard.vue'),
		meta: { requiresAuth: true },
		redirect: '/shipments'
	},
	{
		path: '/login',
		name: 'Login',
		// component: Login
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
		meta: { requiresAuth: false }
	},
	{
		path: "/forgetPassword",
		name: "ForgetPassword",
		component: () => import( /* webpackChunkName: "forgetPassword" */ "../views/singIn/ForgetPassword.vue"),
		meta: { otherRequiresAuth: true }
	},
	{
		path: "/checkInbox",
		name: "CheckInbox",
		component: () => import( /* webpackChunkName: "ckeckInbox" */ "../views/singIn/CkeckInbox.vue"),
		meta: { otherRequiresAuth: true }
	},
	{
		path: "/change-password",
		name: "ResetPassword",
		component: () => import( /* webpackChunkName: "resetPassword" */ "../views/singIn/ResetPassword.vue"),
		meta: { otherRequiresAuth: true }
	},
	{
		path: "/passHasReset",
		name: "PasswordHasReset",
		component: () => import( /* webpackChunkName: "passHasReset" */ "../views/singIn/PasswordHasReset.vue"),
		meta: { otherRequiresAuth: true }
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/About.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/shipments',
		name: 'Shipments',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		// component: () => import( /* webpackChunkName: "about" */ '../views/Shipments.vue'),
		component: () => import( /* webpackChunkName: "about" */ '../views/Shipment.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/shipment/:id',
		name: 'Shipment Details',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/ShipmentDetails.vue'),
		meta: { requiresAuth: true }
	},
	{
		path: '/pos',
		name: 'POs',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/PO.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/pos/item',
		name: 'PoMobile',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../components/PosComponents/Mobile/PoMobile.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/products',
		name: 'Products',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/Products.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/products/manage-categories',
		name: 'ManageCategories',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/Categories.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/inventory',
		name: 'Inventory',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/Inventory.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/warehouses/inventory',
		name: 'InventoryMobile',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../components/InventoryComponents/Mobile/InventoryMobile.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/suppliers',
		name: 'Suppliers',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/Suppliers.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/reports',
		name: 'Reports',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/Reports.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/billing',
		name: 'Billing',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/Billing.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/settings',
		name: 'Settings',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/Settings.vue'),
		meta: { requiresAuth: true },
	},
	{
		path: '/invoices',
		name: 'Invoices',
		component: () => import( /* webpackChunkName: "about" */ '../views/Invoices.vue'),
		meta: { requiresAuth: true },
	},
]

const router = new VueRouter({
	mode: 'history',
	routes
})


router.beforeEach((to, from, next) => {


	if (to.matched.some(record => record.meta.requiresAuth)) {

		//check token
		if (store.getters.getUserToken && store.getters.getExpiresAt) {

			//if token expired
			if (new Date(store.getters.getExpiresAt) <= new Date()) {
				// if token time is expired then try to refresh the token
				store
				.dispatch("refreshToken")
				.then(({ status }) => {
					if (status === 200 || status == 204) {
					console.log('refresh 200')
					next();
					} else {
					next({
						name: "Login"
					})
					}
				})
				.catch(() => {
					next({
						name: "Login"
					})
				})
			} else {
				if (from.name=="Login") {
					window.location.href = to.path
				} else {
					next()	
				}
				
			}
		} else {
			next({
				name: "Login"
			})
		}

	} else {
		if (to.matched.some(record => !record.meta.requiresAuth)) {
			if (store.getters.getUserToken && store.getters.getExpiresAt) {
				next({
					name: "Dashboard"
				})
			} else {
				if (from.name=="Login") {
					window.location.href = to.path
				} else {
					next()	
				}
			}
		} else {
			//other routes
			if (store.getters.getUserToken && store.getters.getExpiresAt) {
				next({
					name: "Dashboard"
				})
			} else {
				if (from.name=="Login") {
					window.location.href = to.path
				} else {
					next()	
				}
			}

		}
	}

})


export default router
