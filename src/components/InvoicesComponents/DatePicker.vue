<template>
  <v-menu
    v-model="dateMenu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
    max-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        append-icon="mdi-calendar-month-outline"
        class="invoice-date-textfield"
        :label="label"
        readonly
        color="#b4cfe0"
        width="200px"
        height="50px"
        placeholder="Invoice Date"
        outlined
        hide-details
        :value="dateValue"
        v-on="on"
        @focus="focusDate"
        @blur="blurDate"
      >
      </v-text-field>
    </template>
    <v-date-picker
      locale="en-in"
      v-model="dateValue"
      no-title
      @input="dateMenu = false"
    ></v-date-picker>
  </v-menu>
</template>
<script>
export default {
  data() {
    return {
      dateMenu: false,
      dateValue: null,
    };
  },
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  methods: {
    focusDate() {
      setTimeout(() => {
        if (!this.dateMenu) {
          this.dateMenu = true;
        }
      }, 200);
    },
    blurDate() {
      setTimeout(() => {
        if (this.dateMenu) {
          this.dateMenu = false;
        }
      }, 200);
    },
  },
};
</script>
<style scoped>
.invoice-date-textfield >>> .v-input__control fieldset {
  background-color: #fff !important;
}
</style>
