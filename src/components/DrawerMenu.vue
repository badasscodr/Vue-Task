<template>
  <div class="sidebar">
    <div class="logo">
      <router-link to="/shipments" class="shipment-logo">
        <img src="@/assets/images/logo.png" alt="" />
      </router-link>
    </div>

    <ul class="links">
      <!-- <li>
                <router-link to="/" v-bind:class="{'active-link': ($store.state.page.currentPage=='dashboard')}">
                    <img src="@/assets/images/dashboard.svg" alt="" />
                    Dashboard
                </router-link>
            </li> -->
      <li>
        <router-link
          to="/shipments"
          v-bind:class="{
            'active-link': $store.state.page.currentPage == 'shipments',
          }"
        >
          <img src="@/assets/images/shipments.svg" alt="" />
          Shipments
        </router-link>
      </li>

      <!-- <li>
                <router-link to="/pos" v-bind:class="{'active-link': ($store.state.page.currentPage=='pos')}">
                    <img src="@/assets/images/POs.svg" alt="" />
                    POs
                </router-link>
            </li> -->

      <li>
        <router-link
          to="/products"
          v-bind:class="{
            'active-link': $store.state.page.currentPage == 'products',
          }"
        >
          <img src="@/assets/images/Items.svg" alt="" />
          Products
        </router-link>
      </li>

      <!-- <li>
                <router-link to="/inventory" v-bind:class="{'active-link': ($store.state.page.currentPage=='inventory')}">
                    <img src="@/assets/images/Inventory.svg" alt="" />
                    Inventory
                </router-link>
            </li> -->

      <li>
        <router-link
          to="/suppliers"
          v-bind:class="{
            'active-link': $store.state.page.currentPage == 'suppliers',
          }"
        >
          <img src="@/assets/images/Suppliers.svg" alt="" />
          Suppliers
        </router-link>
      </li>

      <li>
        <router-link
          to="/invoices"
          v-bind:class="{
            'active-link': $store.state.page.currentPage == 'invoices',
          }"
        >
          <img src="@/assets/images/Suppliers.svg" alt="" />
          Invoices
        </router-link>
      </li>

      <!-- <li>
                <router-link to="/reports" v-bind:class="{'active-link': ($store.state.page.currentPage=='reports')}">
                    <img src="@/assets/images/Reports.svg" alt="" />
                    Reports
                </router-link>
            </li>

            <li>
                <router-link to="/billing" v-bind:class="{'active-link': ($store.state.page.currentPage=='billing')}">
                    <img src="@/assets/images/billing.svg" alt="" />
                    Billing
                </router-link>
            </li> -->

      <!-- Settings Pop Over -->
      <!-- <div class="settings-popup-menu" 
                v-bind:class="{'active-link': ($store.state.page.currentPage.includes('settings'))}">

                <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-x
                    content-class="drawer-menu-popover">

                    <template v-slot:activator="{ on, attrs }">
                        <v-btn class="settings-btn" :ripple="false" dark v-bind="attrs" v-on="on">
                            <router-link to="/settings" 
                                v-bind:class="{'active-link': ($store.state.page.currentPage=='settings')}">                            
                                <div class="settings-menu-group">
                                    <img src="@/assets/images/settings.svg" alt="" />
                                    Settings
                                </div>

                                <img src="@/assets/images/chevron-right.svg" alt="" />
                            </router-link>
                        </v-btn>
                    </template>

                    <v-card>
                        <v-list>
                            <v-list-item>                                
                                <v-list-item-title>
                                    <router-link to="/settings/?tab=users" 
                                        v-bind:class="{'active-link': ($store.state.page.currentSettingsTab==0)}" 
                                        @click.native="onClickSettings(0)">                            
                                        <img src="@/assets/images/users.svg" width="22px" height="22px" />
                                        Users
                                    </router-link>                                    
                                </v-list-item-title>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-title>
                                    <router-link to="/settings/?tab=notifications" 
                                        v-bind:class="{'active-link': ($store.state.page.currentSettingsTab==1)}"
                                        @click.native="onClickSettings(1)">                            
                                        <img src="@/assets/images/notification.svg" width="22px" height="22px" />
                                        Notifications
                                    </router-link>             
                                </v-list-item-title>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-title>
                                    <router-link to="/settings/?tab=manage-payment-methods" 
                                        v-bind:class="{'active-link': ($store.state.page.currentSettingsTab==2)}"
                                        @click.native="onClickSettings(2)">                            
                                        <img src="@/assets/images/payment.svg" width="22px" height="22px" />
                                        Payment Methods
                                    </router-link>                                    
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-menu>
            </div> -->

      <div
        v-if="isMobile"
        style="height:2px; background-color: #039DDC; margin: 12px"
      ></div>

      <!-- REDIRECT TO PROFILE PAGE -->
      <!-- <li v-if="isMobile">
                <router-link to="/profile" v-bind:class="{'active-link': ($store.state.page.currentPage=='profile')}">
                    <v-avatar size="35" style="margin-right: 10px">
                        <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
                        <v-icon small class="mr-2 account" > mdi-account </v-icon>
                    </v-avatar>
                    {{ getUser ? getUser.success.name : "" }}
                </router-link>
            </li> -->

      <!-- TEMPORARY NO REDIRECTION -->
      <li
        v-if="isMobile"
        style="padding: 0 16px; color: #E1ECF0 !important; display: flex; align-items: center; cursor: pointer;"
      >
        <v-avatar size="35" style="margin-right: 10px">
          <v-icon small class="mr-2 account"> mdi-account </v-icon>
        </v-avatar>
        {{ getUser ? JSON.parse(getUser).name : "" }}
      </li>
      <li v-if="isMobile">
        <v-btn @click="userLogout" class="btn-logout-mobile">
          <img src="@/assets/images/sign-out.png" alt="" />
          Sign Out
        </v-btn>
      </li>
    </ul>

    <p class="footer">© 2021 Shifl. All rights reserved.</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "DrawerMenu",
  props: ["isMobile"],
  data: () => ({
    menu: false,
  }),
  methods: {
    //
    ...mapActions(["logout"]),
    userLogout() {
      this.$store.dispatch("page/setTab", 1);
      this.$store.dispatch("page/setCurrentSettingsTab", 0);
      this.logout();
    },
    onClickSettings(index) {
      this.$store.dispatch("page/setCurrentSettingsTab", index);
    },
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  updated() {},
};
</script>

<style lang="scss">
@import "../assets/scss/components/drawer.scss";
</style>
