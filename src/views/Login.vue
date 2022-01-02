<template>
    <div class="SignIn">
        <div class="BG#FFF login-wrapper" v-if="!loginSuccess">
            <img src="@/assets/images/logo.svg" alt="" class="logo"/>

            <v-form ref="form" v-model="valid" @submit.prevent="submit">
                <h2 class="headLogIn">Sign In to shifl</h2>

                <v-container>
                    <v-row>
                        <v-col cols="12" md="12">
                            <small>EMAIL ADDRESS</small>
                            <v-text-field
                                placeholder="e.g. abcdefghij@email.com"
                                filled
                                v-model="form.email"
                                :rules="emailRules"
                                required
                                hide-details="auto"
                            ></v-text-field>
                            <!-- <v-text-field
                                placeholder="e.g. abcdefghij@email.com"
                                filled
                                v-model="form.email"
                                :rules="emailRules"
                                label="E-mail"
                                required
                            ></v-text-field> -->
                        </v-col>

                        <v-col cols="12" sm="12">
                            <small>PASSWORD</small>
                            <v-text-field
                                placeholder="Type your password"
                                filled
                                v-model="form.password"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min]"
                                :type="show1 ? 'text' : 'password'"
                                name="input-10-1"
                                hint=""
                                @click:append="show1 = !show1"
                                hide-details="auto"
                            ></v-text-field>

                            <!-- <v-text-field
                                placeholder="Type your password"
                                filled
                                v-model="form.password"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min]"
                                :type="show1 ? 'text' : 'password'"
                                name="input-10-1"
                                label="Password"
                                hint=""
                                counter -- show how many characters of facebook
                                @click:append="show1 = !show1"
                            ></v-text-field> -->
                        </v-col>

                        <v-col cols="12" class="checkbox-wrapper">
                            <v-col class="checkboxStyle" cols="6" sm="6">
                                <v-checkbox
                                    v-model="form.checkbox"
                                    label="Remember me"
                                    hide-details="auto"
                                ></v-checkbox>
                            </v-col>

                            <v-col cols="6" sm="6" class="LinkForgetPass">
                                <router-link to="/forgetPassword">Forget Password?</router-link>
                            </v-col>
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-btn class="submitFormBtn" text type="submit"> {{ form.loginBtnValue }} </v-btn>
                        </v-col>

                        <!-- <v-col cols="12" sm="12">
                            <v-btn href="https://shifl.com/register" class="submitFormBtn" text>Sign Up</v-btn>
                        </v-col> -->

                        <v-col v-show="(getErrorMessage!=='')" cols="12" sm="12" class="flex">
                            <label class="error-message">
                                <img src="@/assets/images/error-alert.svg" alt="">
                                <span class="error-text">Sorry credential doesn’t match. Either email address or password is incorrect.</span>
                            </label>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
            <div class="snippet signup">
                <div class="stage">
                    <span class="ask-account-text">Don't have an account?  <a class="sign-text" href="https://shifl.com/register">Sign Up</a></span>
                </div>
            </div>
        </div>

        <div class="snippet" v-if="loginSuccess">
            <div class="stage">
                <div class="dot-collision"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    data: () => ({
        valid: true,
        show1: false,
        form: {
            email: (localStorage.getItem('shifl.user_rememberme_email')!==null) ? localStorage.getItem('shifl.user_rememberme_email') : '',
            password: "",
            checkbox: (localStorage.getItem('shifl.user_rememberme_email')!==null) ? true : false,
            loading: false,
            loginBtnValue: "Sign In",
            loginBtnDefaultValue: "Sign In",
            loginBtnLoadingValue: "Signing in..."
        },
        errors: [],
        rules: {
            required: (value) => !!value || "Password is required.",
            min: (v) => v.length >= 1 || "Password must be valid",
            emailMatch: () => `Please provide a valid email address`,
        },
        emailRules: [
            (v) => !!v || "E-mail is required.",
            (v) => /.+@.+/.test(v) || "E-mail must be valid",
        ],
        loginSuccess: false
    }),
    computed: {
        ...mapGetters(["getErrorMessage"]),
    },
    methods: {
        ...mapActions(["login"]),
        async submit() {

            this.$refs.form.validate();

            if (this.$refs.form.validate()) {

                //make sure to lock the login button to prevent multiple login clicks
                if ( !this.form.loading ) {
                    //set loading state
                    this.form.loading = true
                    this.form.loginBtnValue = this.form.loginBtnLoadingValue

                    //attempt to login
                    try {
                        await this.login(this.form)
                        this.form.loading = false
                        this.form.loginBtnValue = this.form.loginBtnDefaultValue

                        if (this.getErrorMessage == '') {
                            this.loginSuccess = true
                        } else {
                            this.loginSuccess = false
                        }

                    } catch(e) {
                        this.form.loading = false
                        this.form.loginBtnValue = this.form.loginBtnDefaultValue
                        this.loginSuccess = false
                    }
                }

                // console.log(this.form);

            }
        },
    },
    mounted() {
        // console.log(localStorage.getItem('shifl.user_rememberme_email'))
    },
    updated() {
    }
};
</script>

<style>
.login-wrapper .error-message {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.login-wrapper .error-message img {
    margin-top: 3px;
}

.login-wrapper .error-message .error-text {
    font-size: 10px;
    text-align: left;
    color: red;
    padding-left: 10px;
    margin-bottom: 10px;
}

.login-wrapper .LinkForgetPass a {
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: #0171a1;
    text-decoration: none;
}

.login-wrapper .LinkForgetPass {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    /* padding-top: 0; */
    text-align: right;
}

.login-wrapper .checkboxStyle .v-input--selection-controls {
    margin-top: 0;
    padding-top: 0;
}

.login-wrapper .submitFormBtn span {
    font-family: 'Inter-Regular', sans-serif !important;
}

.login-wrapper .col-6,
.login-wrapper .col-12:not(:last-of-type) {
    /* padding-bottom: 0; */
}

.dot-collision {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: 25px;
    background-color: #9880ff;
    color: #9880ff;
}

.dot-collision::before, .dot-collision::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
}

.dot-collision::before {
    left: -20px;
    width: 20px;
    height: 20px;
    border-radius: 25px;
    background-color: #9880ff;
    color: #9880ff;
    animation: dotCollisionBefore 2s infinite ease-in;
}

.dot-collision::after {
    left: 20px;
    width: 20px;
    height: 20px;
    border-radius: 25px;
    background-color: #9880ff;
    color: #9880ff;
    animation: dotCollisionAfter 2s infinite ease-in;
    animation-delay: 1s;
}

@keyframes dotCollisionBefore {
    0%,
    50%,
    75%,
    100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-15px);
    }
}

@keyframes dotCollisionAfter {
    0%,
    50%,
    75%,
    100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(15px);
    }
}



.signup {
    /* margin-top: 23px; */
    /* Frame 99 */

    /* Auto Layout */
    /* display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;

    position: relative;
    width: 218px;
    height: 20px;
    left: 611px;
    top: 668px; */

    margin-top: 32px;
}

.sign-text {
    /* Sign Up */
    text-decoration: none;
    position: static;
    width: 53px;
    height: 20px;
    left: 165px;
    top: 0px;

    /* H5 - 14M */
    /* font-family: Inter;
    font-style: normal; */
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    /* identical to box height, or 143% */
    text-align: right;

    /* Dark Blue */
    color: #0171A1;


    /* Inside Auto Layout */
    flex: none;
    order: 1;
    flex-grow: 0;
    margin: 0px 8px;

}

.ask-account-text {
    /* Don’t have an account? */

    position: static;
    width: 157px;
    height: 20px;
    left: 0px;
    top: 0px;

    /* H5 - 14M */
    /* font-family: Inter;
    font-style: normal; */
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    /* identical to box height, or 143% */
    text-align: right;

    /* Text Black */
    color: #4A4A4A;


    /* Inside Auto Layout */
    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 0px 8px;

}
</style>
