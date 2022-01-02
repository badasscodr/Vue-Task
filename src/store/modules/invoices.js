const state = {
  dialog: null,
  arra: ["1"],
};

const getters = {
  getDialog: (state) => state.dialog,
};

const mutations = {
  TOGGLE_DIALOG: (state) => {
    state.dialog = !state.dialog;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
