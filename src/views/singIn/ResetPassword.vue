<template>
    <div v-if="!getResetPasswordGlobalLoading" class="SignIn">
        <div class="BG#FFF">
            <img src="@/assets/images/logo.svg" alt="" />

            <v-form ref="form" v-model="valid">
                <h2 class="headLogIn">Reset Password</h2>

                <v-container>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <small>NEW PASSWORD</small>
                            <v-text-field
                                placeholder="Type your password"
                                filled
                                v-model="form.password"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="passwordRules"
                                :type="show1 ? 'text' : 'password'"
                                name="input-10-1"
                                hint=""
                                @click:append="show1 = !show1"
                            ></v-text-field>
                            
                            <!-- <v-text-field
                            placeholder="Type your password"
                            filled
                            v-model="form.password"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            label="New Password"
                            hint=""
                            counter
                            @click:append="show1 = !show1"
                            ></v-text-field> -->
                        </v-col>

                        <v-col cols="12" sm="12">
                            <small>CONFIRM PASSWORD</small>

                            <v-text-field
                                placeholder="Retype your password"
                                filled
                                v-model="form.passwordConfirm"
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="confirmPasswordRules"
                                :type="show1 ? 'text' : 'password'"
                                name="input-10-1"
                                hint=""
                                @click:append="show1 = !show1"
                            ></v-text-field>

                            <!-- <v-text-field
                            placeholder="Retype your password"
                            filled
                            v-model="form.passwordConfirm"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[comparePassword]"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            label="confirm password"
                            hint=""
                            counter
                            @click:append="show1 = !show1"
                            ></v-text-field> -->
                        </v-col>

                        <v-col cols="12" sm="12">
                            <v-btn class="submitFormBtn" text @click="submit">
                            {{ (getResetPasswordLoading) ? 'Resetting Password...' : 'Reset Password'}}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import iziToast from 'izitoast'

export default {
  data: () => ({
    valid: true,
    show1: false,
    form: {
      password: "",
      passwordConfirm: "",
    },
    code: '',
    passwordRules: [
      (value) => !!value || "Password is required.",
      (v) => v.length >= 1 || "Password must be valid.",
    ],
  }),
  methods: {
    ...mapActions(['resetPassword','checkForgotPasswordCode']),
    async submit() {
      this.$refs.form.validate()
      if (this.$refs.form.validate()) {
        if (!this.getResetPasswordLoading) {
          try {
            const data = await this.resetPassword(
              {
                code: this.code,
                newPassword: this.form.password,
                reNewPassword: this.form.password
              }
            )

            if (typeof data.status!=='undefined') {
              if (data.status =='not ok') {
                iziToast.warning({
                  title: 'Password Reset Error',
                  message: 'An error occured while processing your request. Please try again.',
                  displayMode: 1,
                  position: 'topRight',
                  timeout: 3000
                })
              } else {
                this.$router.push({name: 'PasswordHasReset'})
              }  
            } else {
              iziToast.warning({
                  title: 'Password Reset Error',
                  message: 'An error occured while processing your request. Please try again.',
                  displayMode: 1,
                  position: 'topRight',
                  timeout: 3000
                })
            }
            
            
          } catch(e) {
            iziToast.warning({
              title: 'Password Reset Error',
              message: `${e}`,
              displayMode: 1,
              position: 'topRight',
              timeout: 3000
            })
            console.log(e)
          }          
        }
        
      }
    },
  },
  computed: {
    ...mapGetters(['getResetPasswordLoading','getResetPasswordGlobalLoading']),
    confirmPasswordRules() {
      return [
        (v) => !!v || "Confirm password is required.",
        (v) => v.length >= 1 || "Password must be valid.",
        (v) => this.form.password === v || "Password and Confirm Password do not match."
      ]
    },
  },
  async mounted() {
      const queryString = window.location.search
      let urlParams = new URLSearchParams(queryString)
      this.code = urlParams.get('code')

      try {
        const data = await this.checkForgotPasswordCode(this.code)

        console.log(data)
        if (typeof data.status!=='undefined') {
          if (data.status =='not ok') {
            //redirect to the check inbox page
            this.$router.push({name: 'Login'})
          }
        }

      } catch(e) {
        this.$router.push({name: 'Login'})
        console.log(e)
      }
      
  },
};
</script>
<style scoped>
.LinkForgetPass a {
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #0171a1;
  text-decoration: none;
}
.LinkForgetPass {
  text-align: right;
}
.checkboxStyle .v-input--selection-controls {
  margin-top: 0;
  padding-top: 0;
}
.col-6,
.col-12:not(:last-of-type) {
  padding-bottom: 0;
}
</style>
