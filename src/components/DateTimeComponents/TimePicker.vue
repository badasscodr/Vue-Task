<template>
    <v-menu
        ref="menuTime"
        v-model="menuModel"
        :close-on-content-click="false"
        :return-value.sync="timeModel"
        transition="scale-transition"
        offset-y
        max-width="260px"
        min-width="260px">

        <!-- CALL THEM LIKE THIS -->
        <!-- <div class="date-picker">                                    
            <DatePicker :date.sync="date" :menu.sync="menuDate" />
        </div>

        <div class="time-picker">
            <TimePicker :time.sync="time" :menu.sync="menuTime" />
        </div> -->

        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                height="48px"
                class="text-fields"
                outlined
                v-model="timeModel"
                :append-icon="icon == null ? '' : 'mdi-clock-time-four-outline'"
                readonly
                v-bind="attrs"
                v-on="on"
                placeholder="--:--:--">
            </v-text-field>
        </template>

        <v-time-picker
            v-if="menuModel"
            v-model="timeModel"
            scrollable
            full-width
            ampm-in-title>
            <v-spacer></v-spacer>

            <v-btn text class="white-two-button" @click="menuModel = false">
                Cancel
            </v-btn>

            <v-btn text class="blue-button" @click="$refs.menuTime.save(timeModel)">
                OK
            </v-btn>
        </v-time-picker>
      </v-menu>
    
</template>

<script>
export default {
    name: "TimePicker",
    props: ['menu', 'time', 'setMenu', 'modal', 'icon'],
    data () {
        return {
            timeModel: this.time,
            menuModel: this.menu,
            modalModel: this.modal
        }
    }
};
</script>

<style>
.v-picker.v-card .v-picker__title {
    padding: 10px !important;
}

.v-picker.v-card .v-picker__title .v-time-picker-title__time .v-picker__title__btn, .v-time-picker-title__time span {
    font-size: 60px !important;
}

.v-picker--full-width .v-time-picker-clock__container {
    max-width: 245px !important;
}

.v-time-picker-clock__container {
    flex-basis: 245px !important;
}
</style>