<template>
    <div class="dashboard">
        <img alt="Vue logo" src="../assets/logo.png" />

        <h1>Dashboard</h1>
        <h2>Welcome {{ getUser ? JSON.parse(getUser).name : "" }}</h2>

       <div class="dashboard-wrapper">
            <v-btn @click="logout"> Logout </v-btn>
            <router-link to="/about" style="text-decoration: none">
                <v-btn> About </v-btn>
            </router-link>
       </div>

        <!-- <v-alert type="success">
        </v-alert> -->
        <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    name: "Dashboard",
    components: {
        // HelloWorld
    },
    computed: {
        ...mapGetters(["getUser"]),
    },
    methods: {
        //
        ...mapActions(["logout"]),
    },
    mounted() {
        //set current page
        this.$store.dispatch("page/setPage","dashboard")
    }
};
</script>

<style>
.dashboard {
    height: 100vh;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.dashboard-wrapper {
    display: flex;
    margin-top: 25px;
}

.dashboard-wrapper button {
    margin-right: 10px;
}
</style>
