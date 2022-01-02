<template>
  <v-toolbar class="header">
    <v-toolbar-title class="title">Invoices</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn outlined class="custom_btn filter_btn">
      <v-icon> mdi-filter </v-icon> Filters
    </v-btn>
    <Search
      placeholder="Search invoices"
      className="custom-search"
      class="search"
      :inputData.sync="searchValue"
    />

    <v-btn color="primary" @click="OpenDialog" class="custom_btn create_btn">
      Create Invoices
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapMutations } from "vuex";
import Search from "../Search.vue";

export default {
  name: "InvoicesHeader",
  components: {
    Search,
  },
  data() {
    return {
      searchValue: "",
    };
  },
  methods: {
    ...mapMutations({ TOGGLE_DIALOG: "invoices/TOGGLE_DIALOG" }),
    OpenDialog() {
      this.TOGGLE_DIALOG();
    },
  },
};
</script>
