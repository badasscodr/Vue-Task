<template>
    <v-data-table
      :headers="header"
      :items="getInvoices"
      item-key="name"
      show-select
      :hide-default-footer="true"
      class="elevation-1 invoice_table"
    >
      <template v-slot:[`item.reference`]="{ item }">
        <span class="reference">{{ item.reference }}</span>
      </template>
      <template v-slot:[`item.action`]>
        <v-btn class="action_btn" outlined small>
          <v-icon small color=""> mdi-phone-hangup-outline </v-icon>
        </v-btn>
        <v-menu bottom offset-y>
          <template v-slot:activator="{ on, attrs }">
             <v-btn v-on="on" v-bind="attrs" class="action_btn ml-2" outlined small>
          <v-icon small color=""> mdi-dots-horizontal </v-icon>
        </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, i) in items" :key="i" @click="() => {}">
              <v-list-item-title class="menu_title" :class="item.title">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
</template>

<script>
export default {
    name: 'InvoicesTable',
    props: ['header', 'getInvoices', 'items']
}
</script>