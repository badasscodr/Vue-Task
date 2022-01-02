<template>
  <div class="SignIn">
    <div class="BG#FFF">
      <img src="@/assets/images/logo.svg" alt="" class="logo"/>
      <v-form ref="form" v-model="valid">
        <h2 class="headLogIn">Forgot Password?</h2>
        <p class="bodyPrgh">
            Enter your email below and we'll send you an instruction on how to change your password.
        </p>
        <v-container>
          <v-row>
            <v-col cols="12" md="12">
              <small>EMAIL ADDRESS</small>
              <v-text-field
                placeholder="abcdefghij@email.com"
                filled
                v-model="form.email"
                :rules="emailRules"
                required
                
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12">
              <v-btn class="submitFormBtn" text @click="submit">
                {{ (getforgetPasswordLoading) ? 'Sending Instruction...' : 'Send Instruction'}}
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
      email: "",

    },
    rules: {
      required: (value) => !!value || "Required.",
      emailMatch: () => `Please provide a valid email address`,
    },

    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
  }),
  computed: {
    ...mapGetters(['getforgetPasswordLoading'])
  },
  methods: {
    ...mapActions(['forgetPassword']),
    async submit() {
      this.$refs.form.validate();

      if (this.$refs.form.validate()) {
        if (!this.getforgetPasswordLoading) {
          try {
            const data = await this.forgetPassword({ email: this.form.email})

            if (typeof data.status!=='undefined') {

              if (data.status=='not ok') {
                iziToast.warning({
                  title: 'Forget Password Error',
                  message: 'An error occured while processing your request. Please try again.',
                  displayMode: 1,
                  position: 'topRight',
                  timeout: 3000
                })
              } else {

                //redirect to the check inbox page
                this.$router.push({name: 'CheckInbox', params: { setEmail: this.form.email }})
              }
            } else {
              iziToast.warning({
                title: 'Forget Password Error',
                message: 'An error occured while processing your request. Please try again.',
                displayMode: 1,
                position: 'topRight',
                timeout: 3000
              })
            }
          } catch(e) {
            iziToast.warning({
              title: 'Forget Password Error',
              message: `${e}`,
              displayMode: 1,
              position: 'topRight',
              timeout: 3000
            })
            console.log(e)
          }          
        }
        
      }
      //console.log(this.form.email);
    },
  },
};
</script>
<style scoped>

.col-6,
.col-12:not(:last-of-type) {
  padding-bottom: 0;
}

</style>