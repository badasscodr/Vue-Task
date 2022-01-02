<template>
    <v-container>
        <!-- <v-row justify="end align-center"> -->
        <v-row :class="!isMobile ? 'row-desktop' : 'row-mobile'">
            <!-- <v-badge :content="messages" :value="messages" color="green" overlap>
                <img src="@/assets/images/notification-icon.svg" alt="" width="18" height="18" v-if="!isMobile">   
                <img src="@/assets/images/mobile-notif.png" alt="" v-if="isMobile" class="mobile-notif" />
            </v-badge> -->

            <v-menu offset-y v-if="!isMobile">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        v-on="on"
                        class="avatar-button" >
                        <v-avatar v-if="!isMobile" size="35">
                            <!-- <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img> -->
                            <v-icon small class="mr-2"> mdi-account </v-icon>
                        </v-avatar>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item>
                        <!-- <button v-for="(item, index) in items" :key="index">{{ item.title }}</button> -->
                        <v-btn @click="userLogout" class="btn-logout"> 
                            <v-icon aria-hidden="false" style="color: #000 !important; margin-right: 5px !important; font-size: 20px !important;"> mdi-logout </v-icon>
                            Logout 
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "Notification",
    props:['isMobile'],
    data() {
        return {
            messages: 0,
            show: false,
            items: [
                { title: 'Logout' },
            ],
        };
    },
    methods: {
        //
        ...mapActions(["logout"]),
        userLogout() {
            this.$store.dispatch("page/setTab", 1)
            this.logout()
        }
    },
};
</script>

<style scoped>
.row-desktop {
    justify-content: flex-end;
    align-items: center;
}

.mobile-notif {
    margin-top: 4px;
    width: 18px;
}

.avatar-button {
    padding: 0 !important;
    min-width: 35px !important;
    width: 35px !important;
    border-radius: 50% !important;
    margin: 0 5px 0 25px !important;
    background-color: #fff !important;
}

.btn-logout {
    background-color: transparent !important;
    box-shadow: none !important;
    text-transform: capitalize !important;
    letter-spacing: 0;
    font-weight: 600;
}

.avatar-button .v-btn__content .v-avatar i {
    font-size: 20px !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin: 0 !important;
}
</style>
