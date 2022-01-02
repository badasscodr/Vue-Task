<template>
	<div class="SignIn">
		<div class="BG#FFF">
			<img src="@/assets/images/logo.svg" alt="" />

			<form>
				<img src="@/assets/images/Key.png" alt="" />
				<h2 class="headLogIn" style="padding-top: 20px !important;">Password has been Reset</h2>
				<p class="bodyPrgh">
					Your password has been reset. Please log in now with your new password.
				</p>

				<v-container>
					<v-row>
						<v-col cols="12" sm="12">
						<v-btn class="submitFormBtn" text @click="navigateLogin">
							Go to Sign In
						</v-btn>
						</v-col>
					</v-row>
				</v-container>
			</form>
		</div>
	</div>
</template>

<script>
export default {
	data: () => ({
		valid: true,
		show1: false,
		form: {
		email: "",

		},
	}),
	methods: {
		navigateLogin() {
			//redirect to the check inbox page
            this.$router.push({name: 'Login'})
		}
	},
};
</script>

<style scoped>
.col-6,
.col-12:not(:last-of-type) {
  padding-bottom: 0;
}
</style>