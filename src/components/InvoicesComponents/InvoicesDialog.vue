<template>
  <div class="text-center">
    <v-dialog v-model="dialog" max-width="1340" @click:outside="close">
      <v-card>
        <v-card-title class="v-card__title">
          Create Invocie
          <button icon dark class="btn-close" @click="close">
            <v-icon>mdi-close</v-icon>
          </button>
        </v-card-title>
        <v-divider></v-divider>

        <v-form>
          <main class="body-wrapper">
            <div class="left-side pa-6 pb-16">
              <section class="invoice-no-wrapper mb-2">
                <p class="invoice-no">INVOICE NO.</p>
                <v-text-field
                  color="#b4cfe0"
                  width="200px"
                  height="50px"
                  dense
                  value="7121-11-4"
                  class="invoice-no-textfield"
                  placeholder="Enter invoice no."
                  outlined
                >
                </v-text-field>
              </section>

              <div class="customer-wrapper">
                <p class="customer-title">CUSTOMER</p>
                <v-select
                  :items="items"
                  class="customer-select"
                  placeholder="Select customer"
                  outlined
                >
                </v-select>
              </div>

              <div class="customer-email-wrapper mb-2">
                <p class="customer-email">CUSTOMER EMAIL</p>
                <v-text-field
                  color="#b4cfe0"
                  width="200px"
                  height="50px"
                  dense
                  value=""
                  class="customer-email-textfield"
                  placeholder="Enter customer email"
                  outlined
                >
                </v-text-field>
              </div>

              <div class="invoice-date-wrapper mb-8">
                <p class="invoice-date">INVOICE DATE</p>
                <DatePicker />
              </div>
              <div class="invoice-due-date-wrapper mb-8">
                <p class="invoice-due-date">INVOICE DUE DATE</p>
                <DatePicker />
              </div>
              <div class="billing-address-wrapper mb-2">
                <p class="billing-address">BILLING ADDRESS</p>
                <InvoiceDilalogTextarea />
              </div>
              <div class="notes-wrapper mb-2">
                <p class="notes">NOTES</p>
                <InvoiceDilalogTextarea />
              </div>
            </div>
            <div class="right-side pa-6 pb-16">
              <section class="d-flex flex-column align-content-space-between ">
                <div
                  class="invoice-product-header d-flex justify-space-between py-4 px-8"
                >
                  <span>PRODUCT</span>
                  <span>HSN/SAC</span>
                  <span>DISCRIPTION</span>
                  <span>OTY</span>
                  <span>RATE</span>
                  <span>AMOUNT</span>
                </div>
                <div class="invoice-product-body d-flex px-2 py-4">
                  <div class="mr-6">
                    <v-select
                      color="black"
                      :items="items"
                      class="invoice-product-select"
                      placeholder="Select product"
                      outlined
                      height="50px"
                    ></v-select>
                  </div>
                  <div class="mr-6">
                    <v-text-field
                      color="#b4cfe0"
                      height="50px"
                      dense
                      class="invoice-product-textfield"
                      placeholder="Enter HSN."
                      outlined
                    ></v-text-field>
                  </div>
                  <div class="mr-6">
                    <v-text-field
                      color="#b4cfe0"
                      height="50px"
                      dense
                      class="invoice-product-discription"
                      placeholder="Enter invoice no."
                      outlined
                    ></v-text-field>
                  </div>
                  <div class="mr-6">
                    <v-text-field
                      color="#b4cfe0"
                      height="50px"
                      dense
                      class="invoice-product-qty"
                      placeholder="QTY."
                      outlined
                    ></v-text-field>
                  </div>
                  <div class="mr-6">
                    <v-text-field
                      color="#b4cfe0"
                      height="50px"
                      dense
                      class="invoice-product-rate"
                      placeholder="Rate."
                      outlined
                    ></v-text-field>
                  </div>
                  <div class="invoice-product-amount-wrapper">
                    <span class="d-flex align-center justify-end">$00</span>
                  </div>
                </div>
                <v-divider class="mb-4"></v-divider>
                <div class="mb-4">
                  <v-btn depressed class="invoice-product-btn">
                    <v-icon left>mdi-plus</v-icon> Add Product
                  </v-btn>
                </div>
                <v-divider class="mb-6"></v-divider>
                <div
                  class="invoice-product-footer d-flex justify-space-between"
                >
                  <div class="invoice-product-image-wrapper">
                    <div class="mb-2">
                      <span class="product-image-comp-title">ATTACHEMENTS</span>
                    </div>
                    <div
                      class="invoice-product-image pa-6 d-flex flex-column justify-center align-center"
                    >
                      <div class="upload-instruction mb-4">
                        Browse or Drope Image
                      </div>
                      <div class="upload-control">
                        <v-btn depressed class="invoice-product-btn">
                          <v-icon left>mdi-upload-outline</v-icon> Upload
                        </v-btn>
                      </div>
                    </div>
                  </div>
                  <div
                    class="invoice-product-totalcost d-flex justify-space-between"
                  >
                    <div
                      class="invoice-product-totalcost-left d-flex flex-column"
                    >
                      <span class="mb-4">Subtotal</span>
                      <span class="mb-4">Tax</span>
                      <span class="mb-4">Total</span>
                      <span><strong>Balance Due</strong></span>
                    </div>
                    <div
                      class="invoice-product-totalcost-right d-flex flex-column"
                    >
                      <span class="mb-4">$0</span>
                      <span class="mb-4">$0</span>
                      <span class="mb-4">$0</span>
                      <span><strong>$0</strong></span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </v-form>

        <v-divider></v-divider>

        <v-card-actions class="dialog_actions">
          <v-btn depressed class="btn-blue">
            Send and Save
          </v-btn>

          <v-btn depressed disabled class="btn-save">
            <span>Save</span>
          </v-btn>

          <v-btn depressed class="btn-white" @click="close">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import DatePicker from "./DatePicker.vue";
import InvoiceDilalogTextarea from "./InvoiceDilalogTextarea.vue";

export default {
  components: { DatePicker, InvoiceDilalogTextarea },
  data() {
    return {
      items: ["Foo", "Bar", "Fizz", "Buzz"],
      picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),

      search: "",
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "start",
          filterable: false,
          value: "name",
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" },
      ],
    };
  },
  computed: {
    ...mapGetters({ dialog: "invoices/getDialog" }),
  },
  mounted() {},
  methods: {
    ...mapMutations({ TOGGLE_DIALOG: "invoices/TOGGLE_DIALOG" }),

    close() {
      console.log("Clicked outside dialog");
      this.TOGGLE_DIALOG();
    },
  },
};
</script>
<style scoped>
.v-card__title {
  border-bottom: 2px solid #d2e3ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px !important;
  margin-bottom: 0 !important;
  top: 0;
  background-color: #ffffff;
}
.dialog_actions {
  border-top: 2px solid #d2e3ed;
  height: 70px;
  bottom: 1px;
  background-color: #ffffff;
}
.btn-blue {
  background-color: #0171a1 !important;
  color: #ffffff !important;
  padding: 10px 16px !important;
  font-size: 14px;
  height: 40px !important;
  text-transform: capitalize;
  letter-spacing: 0;
  box-shadow: none !important;
  border-radius: 4px;
  font-family: "Inter-Regular", sans-serif;
}
.btn-save {
  background-color: white;
  border: 1px solid #ebf2f5;
  color: #b4cfe0 !important;
  padding: 10px 16px !important;
  font-size: 14px;
  height: 40px;
  text-transform: capitalize;
  letter-spacing: 0;
  border-radius: 4px;
  font-family: "Inter-Regular", sans-serif;
}
.btn-white {
  background-color: white;
  border: 1px solid #b4cfe0;
  color: #0171a1 !important;
  padding: 10px 16px !important;
  font-size: 14px;
  height: 40px;
  text-transform: capitalize;
  letter-spacing: 0;
  border-radius: 4px;
  font-family: "Inter-Regular", sans-serif;
}
.invoice-product-btn {
  background-color: white !important;
  border: 1px solid #b4cfe0;
  color: #0171a1 !important;
  padding: 10px 16px !important;
  font-size: 14px;
  height: 40px;
  text-transform: capitalize;
  letter-spacing: 0;
  border-radius: 4px;
  font-family: "Inter-Regular", sans-serif;
}
.body-wrapper {
  display: flex;
}
.left-side {
  width: 30%;
  background: #f7f7f7;
}
.right-side {
  width: 70%;
}
.invoice-no,
.customer-title,
.customer-email,
.invoice-date,
.invoice-due-date,
.billing-address,
.notes {
  font-size: 10px;
  color: #819fb2;
  text-transform: capitalize;
  font-family: "Inter-SemiBold", sans-serif;
  margin-bottom: 2px !important;
}
.invoice-no-textfield >>> .v-input__slot fieldset {
  background-color: #fff !important;
}
.customer-email-textfield >>> .v-input__slot fieldset {
  background-color: #fff !important;
}
.customer-select >>> .v-input__control fieldset {
  background-color: #fff !important;
}
.invoice-product-header {
  background: #f7f7f7;
}
.invoice-product-header > span {
  color: #6d858f;
}
.invoice-product-body > div {
  /*width: 905px;
  overflow: auto;*/
}
.invoice-product-select {
  width: 130px;
}
.invoice-product-textfield,
.invoice-product-discription {
  width: 100px;
}
.invoice-product-qty {
  width: 70px;
}
.invoice-product-rate {
  width: 75px;
}
.invoice-product-select >>> .v-input__control fieldset {
  background-color: #fff !important;
  border: 1px solid #b4cfe0;
}
.invoice-product-select >>> .v-input__slot fieldset {
  background-color: #fff !important;
  border: 1px solid #b4cfe0;
}
.invoice-product-textfield >>> .v-input__slot fieldset {
  background-color: #fff !important;
  border: 1px solid #b4cfe0;
}
.invoice-product-discription >>> .v-input__slot fieldset {
  background-color: #fff !important;
  border: 1px solid #b4cfe0;
}
.invoice-product-qty >>> .v-input__slot fieldset {
  background-color: #fff !important;
  border: 1px solid #b4cfe0;
}
.invoice-product-rate >>> .v-input__slot fieldset {
  background-color: #fff !important;
  border: 1px solid #b4cfe0;
}
.invoice-product-select >>> .v-select__selection--comma {
  color: #b4cfe0;
}
.invoice-product-textfield >>> .v-text-field__slot input {
  color: #b4cfe0;
}
.invoice-product-discription >>> .v-text-field__slot input {
  color: #b4cfe0;
}
.invoice-product-qty >>> .v-text-field__slot input {
  color: #b4cfe0;
}
.invoice-product-rate >>> .v-text-field__slot input {
  color: #b4cfe0;
}
.invoice-product-amount-wrapper > span {
  height: 50px;
  width: 70px;
}
.invoice-product-image-wrapper {
  width: 50%;
}
.product-image-comp-title {
  color: #819fb2;
}
.invoice-product-image {
  border: 1px dashed #b4cfe0;
  border-radius: 8px;
  height: 180px;
}
.invoice-product-totalcost {
  width: 30%;
}
.upload-instruction {
  color: #b4cfe0;
}
</style>
