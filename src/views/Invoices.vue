<template>
  <div class="invoices-wrapper">
    <InvoicesHeader />
    <v-tabs>
      <v-tab
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab_name"
        @click="handleCurrentTab(tab)"
      >
        {{ tab }}
      </v-tab>
    </v-tabs>
    <InvoicesTable :header="header" :getInvoices="getInvoices" :items="items" />
    <InvoicesDialog />
  </div>
</template>

<script>
import InvoicesHeader from "../components/InvoicesComponents/InvoicesHeader.vue";
import InvoicesTable from "../components/InvoicesComponents/InvoicesTable.vue";
import InvoicesDialog from "../components/InvoicesComponents/InvoicesDialog.vue";

export default {
  name: "Invoices",
  components: {
    InvoicesHeader,
    InvoicesTable,
    InvoicesDialog,
  },
  data() {
    return {
      items: [
        { title: "recieved payment" },
        { title: "duplicate" },
        { title: "view" },
        { title: "send" },
        { title: "send remainder" },
        { title: "print" },
        { title: "delete" },
      ],
      currentTab: "all",
      tabs: ["all", "paid", "unpaid"],
      header: [
        {
          text: "invoice date",
          align: "start",
          sortable: true,
          value: "invoice_date",
          fixed: true,
        },
        {
          text: "invoice no",
          align: "start",
          sortable: true,
          value: "invoice_no",
          fixed: true,
        },
        {
          text: "customer",
          align: "start",
          sortable: true,
          value: "customer",
          fixed: true,
        },
        {
          text: "reference",
          align: "start",
          sortable: true,
          value: "reference",
        },
        {
          text: "due date",
          align: "start",
          sortable: true,
          value: "due_date",
        },
        {
          text: "amount",
          align: "start",
          sortable: true,
          value: "amount",
        },
        {
          text: "status",
          align: "start",
          sortable: true,
          value: "status",
        },
        {
          text: "",
          align: "start",
          sortable: false,
          value: "action",
        },
      ],
      invoices: [
        {
          invoice_date: "11-11-11",
          invoice_no: 12345,
          customer: "new serves int",
          reference: "#HL0090",
          due_date: "jun 25, 2022",
          amount: "1000",
          status: "paid",
          action: "",
        },
        {
          invoice_date: "11-11-11",
          invoice_no: 12345,
          customer: "new serves int",
          reference: "#HL0090",
          due_date: "jun 25, 2022",
          amount: "1000",
          status: "unpaid",
          actions: "",
        },
        {
          invoice_date: "11-11-11",
          invoice_no: 12345,
          customer: "new serves int",
          reference: "#HL0090",
          due_date: "jun 25, 2022",
          amount: "1000",
          status: "paid",
          action: "",
        },
        {
          invoice_date: "11-11-11",
          invoice_no: 12345,
          customer: "new serves int",
          reference: "#HL0090",
          due_date: "jun 25, 2022",
          amount: "1000",
          status: "unpaid",
          action: "",
        },
        {
          invoice_date: "11-11-11",
          invoice_no: 12345,
          customer: "new serves int",
          reference: "#HL0090",
          due_date: "jun 25, 2022",
          amount: "1000",
          status: "unpaid",
          action: "",
        },
      ],
    };
  },
  computed: {
    getInvoices() {
      if (this.currentTab === "all") {
        return this.invoices;
      } else {
        return this.invoices.filter((item) => item.status === this.currentTab);
      }
    },
  },
  methods: {
    handleCurrentTab(tab) {
      this.currentTab = tab;
    },
  },
  mounted() {
    this.$store.dispatch("page/setPage", "invoices");
  },
};
</script>

<style lang="scss">
@import "../assets/scss/pages_scss/invoices/invoices.scss";
</style>
