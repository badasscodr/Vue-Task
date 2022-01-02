<template>
    <v-row>
        <v-col>
            <!-- <v-menu
                ref="menu"
                v-model="menuModel"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto">

                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="dateModel"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        style="margin-top: 0;"
                        class="date-picker-wrapper text-fields">
                    </v-text-field>
                </template>

                <v-date-picker
                    v-model="dateModel"
                    no-title
                    scrollable>

                    <v-spacer></v-spacer>

                    <v-btn text color="primary" @click="this.setMenu(false)">
                        Cancel
                    </v-btn>

                    <v-btn text color="primary" @click="$refs.menu.save(date)">
                        OK
                    </v-btn>
                </v-date-picker>
            </v-menu> -->

            <!-- <v-menu
                v-model="menuModel"
                :close-on-content-click="false"
                :return-value.sync="dateModel"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto">

                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        height="40px"
                        class="text-fields"
                        v-model="dateModel"
                        prepend-icon="mdi-calendar"
                        placeholder="2021-05-21"
                        readonly
                        v-bind="attrs"
                        outlined
                        v-on="on"></v-text-field>
                </template>

                <v-date-picker v-model="dateModel" scrollable>
                    <v-spacer></v-spacer>

                    <v-btn text class="white-two-button" @click="menuModel = false">
                        Cancel
                    </v-btn>

                    <v-btn text class="blue-button" @click="$refs.menu.save(date)">
                        OK
                    </v-btn>
                </v-date-picker>
            </v-menu> -->
        
            <v-menu
                ref="menuModel"
                v-model="menuModel"
                :close-on-content-click="false"
                :return-value.sync="dateModel"
                transition="scale-transition"
                offset-y
                min-width="auto">

                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        height="40px"
                        class="text-fields"
                        v-model="dateModel"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        outlined
                        v-on="on">
                    </v-text-field>
                </template>

                <v-date-picker v-model="dateModel" no-title scrollable>
                    <v-spacer></v-spacer>

                    <v-btn text class="white-two-button" @click="menuModel = false">
                        Cancel
                    </v-btn>

                    <v-btn text class="blue-button" @click="$refs.menuModel.save(dateModel)">
                        OK
                    </v-btn>
                </v-date-picker>
            </v-menu>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "DatePicker",
    props: ['menu', 'date', 'setMenu'],
    data () {
        return {
            dateModel: this.date,
            menuModel: this.menu
        }
    }
};
</script>

<style>
.date-picker-wrapper {
    margin-top: 0px;
    border: 1px solid #B3CFE0 !important;
    border-radius: 4px;
    height: 48px;
    padding: 5px 10px 0 !important;
    margin-bottom: 10px;
}

.date-picker-wrapper i {
    color: #212121 !important;
    padding-top: 5px;
}
</style>