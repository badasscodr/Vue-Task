import axios from "axios";

const state = {
  currentProductSelected: null,
  products: [],
  productsLoading: false,
  createProducts: null,
  createProductsLoading: false,
  updateProduct: null,
  updateProductLoading: false,
  deleteProductLoading: false,
  error: "",
  poBaseUrlState: process.env.VUE_APP_PO_URL,
  reset: false,
  singleProduct: null,
  singleProductLoading: false,
  productsPoDropdown: [],
};

const getters = {
  poBaseUrlState: (state) => state.poBaseUrlState,
  getCurrentSelectedProduct: (state) => state.currentProductSelected,
  getProducts: (state) => state.products,
  getProductsPoDropdown: (state) => state.productsPoDropdown,
  getProductsLoading: (state) => state.productsLoading,
  getCreateProducts: (state) => state.createProducts,
  getCreateProductsLoading: (state) => state.createProductsLoading,
  getUpdatedProduct: (state) => state.updateProduct,
  getUpdatedProductLoading: (state) => state.updateProductLoading,
  getDeleteProductLoading: (state) => state.deleteProductLoading,
  getError: (state) => state.error,
  getSingleProduct: (state) => state.singleProduct,
  getSingleProductLoading: (state) => state.singleProductLoading,
};

// const poBaseUrl = "https://po.shifl.com/api"

const actions = {
  setProduct({ commit }, payload) {
    commit("setProduct", payload);
  },
  setReset({ commit }, payload) {
    commit("setReset", payload);
  },
  fetchProducts: async ({ commit }) => {
    commit("SET_PRODUCTS_LOADING", true);

    await axios
      .get(`${process.env.VUE_APP_PO_URL}/products`)
      .then((res) => {
        commit("SET_PRODUCTS_LOADING", false);
        if (res.status === 200) {
          if (typeof res.data !== "undefined") {
            let productsData = [];
            if (
              typeof res.data.results !== "undefined" &&
              typeof res.data.results.data !== "undefined"
            )
              productsData = res.data.results.data;

            if (productsData.length > 0) {
              const tempProductsData = productsData.map((product) => {
                let tempCartonDimensions = {
                  l: 0,
                  w: 0,
                  h: 0,
                  uom: "cm",
                };

                if (product.carton_dimensions) {
                  tempCartonDimensions = {
                    ...JSON.parse(product.carton_dimensions),
                  };
                  tempCartonDimensions.l = tempCartonDimensions.l
                    ? tempCartonDimensions.l
                    : tempCartonDimensions.length;
                  tempCartonDimensions.h = tempCartonDimensions.h
                    ? tempCartonDimensions.h
                    : tempCartonDimensions.height;
                  tempCartonDimensions.w = tempCartonDimensions.w
                    ? tempCartonDimensions.w
                    : tempCartonDimensions.width;
                }

                let tempUnitDimensions = {
                  l: 0,
                  w: 0,
                  h: 0,
                  uom: "cm",
                };

                if (product.unit_dimensions) {
                  tempUnitDimensions = {
                    ...JSON.parse(product.unit_dimensions),
                  };
                }

                let tempUnitWeight = {
                  value: 0,
                  unit: "kg",
                };

                if (product.unit_weight) {
                  tempUnitWeight = { ...JSON.parse(product.unit_weight) };
                }

                return {
                  ...product,
                  carton_dimensions: {
                    l: tempCartonDimensions.l,
                    w: tempCartonDimensions.w,
                    h: tempCartonDimensions.h,
                    uom: tempCartonDimensions.uom,
                  },
                  unit_dimensions: {
                    l: tempUnitDimensions.l,
                    w: tempUnitDimensions.w,
                    h: tempUnitDimensions.h,
                    uom: tempUnitDimensions.uom,
                  },
                  unit_weight: {
                    value: tempUnitWeight.value,
                    unit: tempUnitWeight.unit,
                  },
                };
              });

              productsData = tempProductsData;
            }

            commit("SET_PRODUCTS", productsData);
          } else {
            commit("SET_PRODUCTS", []);
          }
        }
      })
      .catch((err) => {
        commit("SET_PRODUCTS_LOADING", false);
        if (typeof err.error !== "undefined") {
          return Promise.reject(err.error);
        } else {
          if (typeof err.message !== "undefined") {
            return Promise.reject(
              "Token has been expired. Please reload the page."
            );
          }
        }
      });
  },
  createProducts: async ({ commit }, payload) => {
    commit("SET_CREATE_PRODUCTS_LOADING", true);

    let fd = new FormData();
    let getPayloadKeys = Object.keys(payload);

    if (getPayloadKeys.length > 0) {
      getPayloadKeys.map((gpk) => {
        fd.append(gpk, payload[gpk]);
      });
    }

    if (payload !== null) {
      // if image is not null, use form data
      if (payload.image !== null) {
        await axios
          .post(`${process.env.VUE_APP_PO_URL}/products/create`, fd, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              if (res.data) {
                // console.log(res.data);
                commit("SET_CREATE_PRODUCTS_LOADING", false);
                // commit("SET_CREATE_PRODUCTS", res.data)
              }
            }
          })
          .catch((err) => {
            commit("SET_CREATE_PRODUCTS_LOADING", false);
            if (typeof err.error !== "undefined") {
              return Promise.reject(err.error);
            } else {
              if (typeof err.message !== "undefined") {
                return Promise.reject(
                  "Token has been expired. Please reload the page."
                );
              }
            }
          });

        // if image is null, do not use form data
      } else {
        await axios
          .post(`${process.env.VUE_APP_PO_URL}/products/create`, payload)
          .then((res) => {
            if (res.status === 200) {
              if (res.data) {
                // console.log(res.data);
                commit("SET_CREATE_PRODUCTS_LOADING", false);
                // commit("SET_CREATE_PRODUCTS", res.data)
              }
            }
          })
          .catch((err) => {
            commit("SET_CREATE_PRODUCTS_LOADING", false);
            if (typeof err.error !== "undefined") {
              return Promise.reject(err.error);
            } else {
              if (typeof err.message !== "undefined") {
                return Promise.reject(
                  "Token has been expired. Please reload the page."
                );
              }
            }
          });
      }
    }
  },
  updateProducts: async ({ commit }, payload) => {
    commit("SET_UPDATE_PRODUCTS_LOADING", true);

    let fd = new FormData();
    let getPayloadKeys = Object.keys(payload);

    if (getPayloadKeys.length > 0) {
      getPayloadKeys.map((gpk) => {
        fd.append(gpk, payload[gpk]);
      });
    }

    if (payload !== null) {
      // if image is not null, use form data
      if (payload.image !== null) {
        await axios
          .post(
            `${process.env.VUE_APP_PO_URL}/products/update/${payload.prod_id}`,
            fd,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            if (res.status === 200) {
              if (res.data) {
                // console.log(res.data);
                commit("SET_UPDATE_PRODUCTS_LOADING", false);
                // commit("SET_UPDATE_PRODUCTS", res.data)
              }
            }
          })
          .catch((err) => {
            commit("SET_UPDATE_PRODUCTS_LOADING", false);
            if (typeof err.error !== "undefined") {
              return Promise.reject(err.error);
            } else {
              if (typeof err.message !== "undefined") {
                return Promise.reject(
                  "Token has been expired. Please reload the page."
                );
              }
            }
          });

        // if image is null, do not use form data
      } else {
        await axios
          .post(
            `${process.env.VUE_APP_PO_URL}/products/update/${payload.prod_id}`,
            payload
          )
          .then((res) => {
            if (res.status === 200) {
              if (res.data) {
                // console.log(res.data);
                commit("SET_UPDATE_PRODUCTS_LOADING", false);
                // commit("SET_UPDATE_PRODUCTS", res.data)
              }
            }
          })
          .catch((err) => {
            commit("SET_UPDATE_PRODUCTS_LOADING", false);
            if (typeof err.error !== "undefined") {
              return Promise.reject(err.error);
            } else {
              if (typeof err.message !== "undefined") {
                return Promise.reject(
                  "Token has been expired. Please reload the page."
                );
              }
            }
          });
      }
    }
  },
  deleteProduct: async ({ commit }, id) => {
    commit("SET_DELETE_PRODUCT_LOADING", true);

    await axios
      .delete(`${process.env.VUE_APP_PO_URL}/products/delete/${id}`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data) {
            // console.log(res.data);
            commit("SET_DELETE_PRODUCT_LOADING", false);
            // commit("SET_DELETE_CATEGORIES", res.data)
          }
        }
      })
      .catch((err) => {
        commit("SET_DELETE_PRODUCT_LOADING", false);
        if (typeof err.error !== "undefined") {
          return Promise.reject(err.error);
        } else {
          if (typeof err.message !== "undefined") {
            return Promise.reject(
              "Token has been expired. Please reload the page."
            );
          }
        }
      });
  },
  fetchSingleProduct: async ({ commit }, id) => {
    commit("SET_SINGLE_PRODUCT_LOADING", true);

    await axios
      .get(`${process.env.VUE_APP_PO_URL}/products/${id}`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data) {
            // console.log(res.data.results);
            commit("SET_SINGLE_PRODUCT_LOADING", false);
            commit("SET_SINGLE_PRODUCT", res.data);
          }
        }
      })
      .catch((err) => {
        commit("SET_SINGLE_PRODUCT_LOADING", false);
        if (typeof err.error !== "undefined") {
          return Promise.reject(err.error);
        } else {
          if (typeof err.message !== "undefined") {
            return Promise.reject(
              "Token has been expired. Please reload the page."
            );
          }
        }
      });
  },
};

const methods = {
  testing: () => {
    alert("testing");
  },
};

const mutations = {
  setReset: (state, payload) => {
    state.reset = payload;
  },
  setProduct: (state, payload) => {
    state.currentProductSelected = payload;
  },
  SET_PRODUCTS: (state, payload) => {
    state.products = payload;
  },
  SET_PRODUCTS_LOADING: (state, payload) => {
    state.productsLoading = payload;
  },
  SET_CREATE_PRODUCTS: (state, payload) => {
    state.createProducts = payload;
  },
  SET_CREATE_PRODUCTS_LOADING: (state, payload) => {
    state.createProductsLoading = payload;
  },
  SET_UPDATE_PRODUCTS: (state, payload) => {
    state.updateProduct = payload;
  },
  SET_UPDATE_PRODUCTS_LOADING: (state, payload) => {
    state.updateProductLoading = payload;
  },
  SET_DELETE_PRODUCT_LOADING: (state, payload) => {
    state.deleteProductLoading = payload;
  },
  SET_SINGLE_PRODUCT: (state, payload) => {
    state.singleProduct = payload;
  },
  SET_SINGLE_PRODUCT_LOADING: (state, payload) => {
    state.singleProductLoading = payload;
  },
  SET_ERROR: (state, payload) => {
    state.error = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  methods,
};
