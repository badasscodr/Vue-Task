<template>
    <div class="notifications-wrapper" v-resize="onResize">
        <div>
            <div class="notification-content">
                <div class="notification-wrapper">
                    <v-row>
                        <v-col cols="12" sm="6">
                            <div class="notifications critical">
                                <div class="notification-header">
                                    <h3>Critical Notifications</h3>
                                    <p>
                                        These notifications can’t be disabled. At least one recipient is required for each notification.
                                    </p>
                                </div>

                                <div class="notification-body">
                                    <div class="notification-box">
                                        <h4>Booking Emails</h4>

                                        <div class="recepients">
                                            <div class="card-title">Recipients</div>
                                            <vueSelect 
                                                height="76"
                                                class="v-text-fields v-multiple select supplier-dialog mb-1"
                                                taggable
                                                multiple
                                                inputId="warehouse-emails-lists"
                                                placeholder="e.g. name@email.com"
                                                v-model="emails.bookingEmails"
                                                :options="options"
                                                no-drop
                                                :select-on-key-codes="[188, 13]">
                                            </vueSelect>

                                            <small>
                                                Separate multiple email addresses with comma
                                            </small>
                                        </div>
                                    </div>

                                    <div class="notification-box">
                                        <h4>Arrival Notice</h4>

                                        <div class="recepients">
                                            <div class="card-title">Recipients</div>
                                            <vueSelect 
                                                height="76"
                                                class="v-text-fields v-multiple select supplier-dialog mb-1"
                                                taggable
                                                multiple
                                                inputId="warehouse-emails-lists"
                                                placeholder="e.g. name@email.com"
                                                v-model="emails.arrivalEmails"
                                                :options="options"
                                                no-drop
                                                :select-on-key-codes="[188, 13]">
                                            </vueSelect>

                                            <small>
                                                Separate multiple email addresses with comma
                                            </small>
                                        </div>
                                    </div>

                                    <div class="notification-box">
                                        <h4>Payment Reminder</h4>

                                        <div class="recepients">
                                            <div class="card-title">Recipients</div>
                                            <vueSelect 
                                                height="76"
                                                class="v-text-fields v-multiple select supplier-dialog mb-1"
                                                taggable
                                                multiple
                                                inputId="warehouse-emails-lists"
                                                placeholder="e.g. name@email.com"
                                                v-model="emails.paymentReminderEmails"
                                                :options="options"
                                                no-drop
                                                :select-on-key-codes="[188, 13]">
                                            </vueSelect>

                                            <small>
                                                Separate multiple email addresses with comma
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </v-col>

                        <div class="divider" v-if="isMobile"></div>

                        <v-col cols="12" sm="6">
                            <div class="notifications others">
                                <div class="notification-header">
                                    <h3>Other Notifications</h3>
                                    <p>These notifications can be disabled.</p>
                                </div>

                                <div class="notification-body">
                                    <div class="notification-box">
                                        <h4>
                                            Departure Notice

                                            <v-switch
                                                v-model="switches.departureSwitch"
                                                inset
                                                hide-details="auto"
                                                :ripple="false"
                                                color="success">
                                            </v-switch>
                                        </h4>

                                        <div class="recepients" v-if="switches.departureSwitch">
                                            <div class="card-title">Recipients</div>
                                            <vueSelect 
                                                height="76"
                                                class="v-text-fields v-multiple select supplier-dialog mb-1"
                                                taggable
                                                multiple
                                                inputId="warehouse-emails-lists"
                                                placeholder="e.g. name@email.com"
                                                v-model="emails.departureEmails"
                                                :options="options"
                                                no-drop
                                                :select-on-key-codes="[188, 13]">
                                            </vueSelect>

                                            <small>
                                                Separate multiple email addresses with comma
                                            </small>
                                        </div>
                                    </div>

                                    <div class="notification-box">
                                        <h4>
                                            ETA Change Alert

                                            <v-switch
                                                v-model="switches.etaAlertSwitch"
                                                inset
                                                hide-details="auto"
                                                :ripple="false"
                                                color="success">
                                            </v-switch>
                                        </h4>

                                        <div class="recepients" v-if="switches.etaAlertSwitch">
                                            <div class="card-title">Recipients</div>
                                            <vueSelect 
                                                height="76"
                                                class="v-text-fields v-multiple select supplier-dialog mb-1"
                                                taggable
                                                multiple
                                                inputId="warehouse-emails-lists"
                                                placeholder="e.g. name@email.com"
                                                v-model="emails.releasedAtTerminalEmails"
                                                :options="options"
                                                no-drop
                                                :select-on-key-codes="[188, 13]">
                                            </vueSelect>

                                            <small>
                                                Separate multiple email addresses with comma
                                            </small>
                                        </div>
                                    </div>

                                    <div class="notification-box">
                                        <h4>
                                            Telex Reminder

                                            <v-switch
                                                v-model="switches.telexSwitch"
                                                inset
                                                hide-details="auto"
                                                :ripple="false"
                                                color="success">
                                            </v-switch>
                                        </h4>

                                        <div class="recepients" v-if="switches.telexSwitch">
                                            <div class="card-title">Recipients</div>
                                            <vueSelect 
                                                height="76"
                                                class="v-text-fields v-multiple select supplier-dialog mb-1"
                                                taggable
                                                multiple
                                                inputId="warehouse-emails-lists"
                                                placeholder="e.g. name@email.com"
                                                v-model="emails.telexEmails"
                                                :options="options"
                                                no-drop
                                                :select-on-key-codes="[188, 13]">
                                            </vueSelect>

                                            <small>
                                                Separate multiple email addresses with comma
                                            </small>
                                        </div>
                                    </div>

                                    <div class="notification-box">
                                        <h4>
                                            Gated Out

                                            <v-switch
                                                v-model="switches.gatedOutSwitch"
                                                inset
                                                hide-details="auto"
                                                :ripple="false"
                                                color="success">
                                            </v-switch>
                                        </h4>

                                        <div class="recepients" v-if="switches.gatedOutSwitch">
                                            <div class="card-title">Recipients</div>
                                            <vueSelect 
                                                height="76"
                                                class="v-text-fields v-multiple select supplier-dialog mb-1"
                                                taggable
                                                multiple
                                                inputId="warehouse-emails-lists"
                                                placeholder="e.g. name@email.com"
                                                v-model="emails.releasedAtTerminalEmails"
                                                :options="options"
                                                no-drop
                                                :select-on-key-codes="[188, 13]">
                                            </vueSelect>

                                            <small>
                                                Separate multiple email addresses with comma
                                            </small>
                                        </div>
                                    </div>

                                    <div class="notification-box">
                                        <h4>
                                            Last Free Day

                                            <v-switch
                                                v-model="switches.lastFreeDaySwitch"
                                                inset
                                                hide-details="auto"
                                                :ripple="false"
                                                color="success">
                                            </v-switch>
                                        </h4>

                                        <div class="recepients" v-if="switches.lastFreeDaySwitch">
                                            <div class="card-title">Recipients</div>
                                            <vueSelect 
                                                height="76"
                                                class="v-text-fields v-multiple select supplier-dialog mb-1"
                                                taggable
                                                multiple
                                                inputId="warehouse-emails-lists"
                                                placeholder="e.g. name@email.com"
                                                v-model="emails.lastFreeDayEmails"
                                                :options="options"
                                                no-drop
                                                :select-on-key-codes="[188, 13]">
                                            </vueSelect>

                                            <small>
                                                Separate multiple email addresses with comma
                                            </small>
                                        </div>
                                    </div>

                                    <div class="notification-box">
                                        <h4>
                                            Released At Terminal

                                            <v-switch
                                                v-model="switches.releasedAtTerminalSwitch"
                                                inset
                                                hide-details="auto"
                                                :ripple="false"
                                                color="success">
                                            </v-switch>
                                        </h4>

                                        <div class="recepients" v-if="switches.releasedAtTerminalSwitch">
                                            <div class="card-title">Recipients</div>
                                            <vueSelect 
                                                height="76"
                                                class="v-text-fields v-multiple select supplier-dialog mb-1"
                                                taggable
                                                multiple
                                                inputId="warehouse-emails-lists"
                                                placeholder="e.g. name@email.com"
                                                v-model="emails.releasedAtTerminalEmails"
                                                :options="options"
                                                no-drop
                                                :select-on-key-codes="[188, 13]">
                                            </vueSelect>

                                            <small>
                                                Separate multiple email addresses with comma
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import globalMethods from '../../../utils/globalMethods'
import vSelect from 'vue-select'
import "vue-select/src/scss/vue-select.scss";

export default {
    name: "Notifications",
    components: {
        vueSelect: vSelect
    },
    mounted() {
        //set current page
        this.$store.dispatch("page/setPage", "settings/notifications");
        this.fetchCountries()
    },
    data: () => ({
        isMobile: false,
        tabs: ["Users", "Notifications", "Payment Methods"],
        activeTab: 1,
        options: [],
        emails: {
            bookingEmails: [
                'mona15@hotmail.com',
                'harvey.heidenreich@spencer.com'
            ],
            arrivalEmails: [
                'mona15@hotmail.com'
            ],
            paymentReminderEmails: [
                'mona15@hotmail.com',
                'testing@gmail.com'
            ],
            departureEmails: [
                'mona15@hotmail.com',
                'harvey.heidenreich@spencer.com'
            ],
            telexEmails: [
                'mona15@hotmail.com',
                'harvey.heidenreich@spencer.com'
            ],
            lastFreeDayEmails: [
                'mona15@hotmail.com',
                'harvey.heidenreich@spencer.com',
                'mona151@hotmail.com',
                'testing@gmail.com'
            ],
            releasedAtTerminalEmails: [
                'mona15@hotmail.com',
            ]
        },
        switches: {
            departureSwitch: true,
            etaAlertSwitch: false,
            telexSwitch: true,
            gatedOutSwitch: false,
            lastFreeDaySwitch: true,
            releasedAtTerminalSwitch: true
        }
    }),
    computed: {},
    watch: {},
    methods: {
        ...mapActions({
            fetchCountries: 'warehouse/fetchCountries',
        }),
        ...globalMethods,
        getCurrentTab(id) {
            console.log(id);
        },
        onTabChange() {
            this.page = 1;

            if (this.activeTab == 0) {
                this.$router.push(`users`)
            }

            if (this.activeTab == 2) {
                this.$router.push(`manage-payment-methods`)
            }
        },
        onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
    },
};
</script>

<style lang="scss">
@import '../../../assets/scss/pages_scss/settings/notifications.scss';
@import '../../../assets/scss/pages_scss/dialog/globalDialog.scss';
@import '../../../assets/scss/buttons.scss';
</style>