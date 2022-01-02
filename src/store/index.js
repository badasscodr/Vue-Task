import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import shipment from "./modules/shipment";
import page from "./modules/page";
import shipmentDetails from "./modules/shipmentDetails";
import masterSearch from "./modules/masterSearch";
import scheduleOptions from "./modules/scheduleOptions";
import milestones from "./modules/milestones";
import po from "./modules/po";
import products from "./modules/products";
import category from "./modules/category";
import warehouse from "./modules/warehouse";
import inventory from "./modules/inventory";
import suppliers from "./modules/suppliers";
import invoices from "./modules/invoices";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    shipment,
    page,
    shipmentDetails,
    masterSearch,
    scheduleOptions,
    milestones,
    po,
    products,
    category,
    warehouse,
    inventory,
    suppliers,
    invoices,
  },
});
