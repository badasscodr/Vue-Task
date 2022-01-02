<template>
	<div class="SignIn">
		<div class="BG#FFF">
			<img src="@/assets/images/logo.svg" alt="" class="logo"/>

			<v-form ref="form" v-model="valid">
				<img src="@/assets/images/inbox.svg" alt="" class="inbox-img">

				<h2 class="headLogIn" style="padding-top: 20px !important;">Check Your Inbox</h2>
				<p class="bodyPrgh">
					We have sent you an email at <a href="#">{{ setEmail }} </a>
					with instruction on how to change your password. Check your email inbox.
				</p>
				
				<v-container>
					<v-row>
						<v-col cols="12" sm="12">
							<v-btn class="submitFormBtn" text @click="submit">
								{{ (getforgetPasswordLoading) ? 'Sending Instruction...' : 'Didn’t get any email?' }}
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
		setEmail() {
			return (typeof this.$route.params!=='undefined' && typeof this.$route.params.setEmail!=='undefined') ? this.$route.params.setEmail : ''
		},
		...mapGetters(['getforgetPasswordLoading'])
	},
	methods: {
		...mapActions(['forgetPassword']),
		async submit() {
			this.$refs.form.validate();
			if (this.$refs.form.validate()) {
				if (!this.getforgetPasswordLoading) {
					try {
						await this.forgetPassword({ email: this.setEmail })
						//redirect to the check inbox page
						this.$router.push({name: 'CheckInbox', params: { setEmail: this.setEmail }})
					} catch(e) {
						console.log(e)
					}
				}
			}
		},
	},
};
</script>
<style scoped>

.inbox-img {
	width: 60px;
}

.col-6,
.col-12:not(:last-of-type) {
	padding-bottom: 0;
}
</style>
