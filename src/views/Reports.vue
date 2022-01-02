<template>
	<div class="reports-wrapper">
		<div class="reports-header">
			<h2>Reports</h2>

			<v-dialog v-model="dialog" max-width="560px" content-class="save-changes-dialog" v-resize="onResize">
				<template v-slot:activator="{ on, attrs }">
					<v-btn color="primary" dark class="save-changes" v-bind="attrs" v-on="on">
						Save Changes
					</v-btn>							
				</template>

				<v-card class="save-changes-card">
					<v-card-title>
						<span class="headline">Save Changes</span>

						<button icon dark class="btn-close" @click="close">
							<v-icon>mdi-close</v-icon>
						</button>
					</v-card-title>

					<v-card-text class="mt-5">
						
					</v-card-text>

					<v-card-actions>
						<v-btn class="btn-blue" text @click="close">
							Save Changes
						</v-btn>
						<v-btn class="btn-white" text @click="close">
							Discard Changes
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</div>

		<div class="reports-body">
			<div class="report-box">
				<div class="box-header">
					<div class="header-title">
						<p class="report-title">Shipment Report</p>

						<v-radio-group v-model="shipment_report" row>
							<v-radio label="Enable" color="primary" value="enable"></v-radio>
							<v-radio label="Disable" color="primary" value="disable"></v-radio>
						</v-radio-group>
					</div>

					<div class="header-button">
						<v-btn color="primary" class="download-button">Download Report Now</v-btn>
					</div>
				</div>

				<div class="box-body">
					<v-row>
						<v-col cols="12" sm="12" md="6" class="pb-0">
							<v-row>
								<v-col cols="12" sm="12" md="4">
									<label class="text-item-label">Frequency</label>
									<v-select
										class="text-fields normal-vselect"
										placeholder="Select Frequency"
										:items="frequencyItems"
										outlined>
									</v-select>
								</v-col>                    

								<v-col cols="12" sm="12" md="4">
									<label class="text-item-label">Day</label>
									<v-select
										class="text-fields normal-vselect"
										placeholder="Select Day"
										:items="dayItems"
										outlined>
									</v-select>
								</v-col>

								<v-col cols="12" sm="12" md="4">
									<label class="text-item-label">Time</label>
									<TimePicker :time.sync="time" :menu.sync="menuTime" :icon="null" />
								</v-col>
							</v-row>
						</v-col>
					</v-row>

					<v-row>
						<v-col cols="12" sm="12" md="12">
							<label class="text-item-label">Recepients</label>
							<vueSelect 
                                class="v-text-fields v-multiple select"
                                taggable
                                multiple
                                placeholder="Enter emails"
                                :options="options" />
							<span style="color: #819FB2; font-size: 12px;">Separate multiple email addresses with comma</span>
						</v-col>
					</v-row>
				</div>
			</div>

			<div class="report-box">
				<div class="box-header">
					<div class="header-title">
						<p class="report-title">Utilization Report</p>

						<v-radio-group v-model="utilization_report" row>
							<v-radio label="Enable" color="primary" value="enable"></v-radio>
							<v-radio label="Disable" color="primary" value="disable"></v-radio>
						</v-radio-group>
					</div>

					<div class="header-button">
						<v-btn color="primary" class="download-button">Download Report Now</v-btn>
					</div>
				</div>

				<div class="box-body">
					<v-row>
						<v-col cols="12" sm="12" md="6" class="pb-0">
							<v-row>
								<v-col cols="12" sm="12" md="4">
									<label class="text-item-label">Frequency</label>
									<v-select
										class="text-fields normal-vselect"
										placeholder="Select Frequency"
										:items="frequencyItems"
										outlined>
									</v-select>
								</v-col>

								<v-col cols="12" sm="12" md="4">
									<label class="text-item-label">Time</label>
									<TimePicker :time.sync="time" :menu.sync="menuTime" :icon="null" />
								</v-col>
							</v-row>
						</v-col>
					</v-row>

					<v-row>
						<v-col cols="12" sm="12" md="12">
							<label class="text-item-label">Recepients</label>
							<vueSelect 
                                class="v-text-fields v-multiple select"
                                taggable
                                multiple
                                placeholder="Enter emails"
                                :options="options" />
							<span style="color: #819FB2; font-size: 12px;">Separate multiple email addresses with comma</span>
						</v-col>
					</v-row>
				</div>
			</div>

			<div class="report-box">
				<div class="box-header">
					<div class="header-title">
						<p class="report-title">Efficiency Report</p>

						<v-radio-group v-model="utilization_report" row>
							<v-radio label="Enable" color="primary" value="enable"></v-radio>
							<v-radio label="Disable" color="primary" value="disable"></v-radio>
						</v-radio-group>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import TimePicker from '../components/DateTimeComponents/TimePicker.vue'
import vSelect from 'vue-select'
import "vue-select/src/scss/vue-select.scss";

export default {
	name: 'Reports',
	components: {
		TimePicker,
		vueSelect: vSelect
	},
	mounted() {
		//set current page
		this.$store.dispatch("page/setPage","reports")
	},
	data: () => ({
		dialog: false,
		shipment_report: 'enable',
		utilization_report: 'enable',
        isMobile: false,
		frequencyItems: [
			'Daily',
			'Weekly',
			'Monthly',
			'Yearly'
		],
		dayItems: [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		],
        time: null,
        menuTime: false,
		options: []
    }),
	methods: {
		onResize() {
            if (window.innerWidth < 769) {
                this.isMobile = true
            } else {
                this.isMobile = false
            }
        },
		close() {
			this.dialog = false
		}
	}
}
</script>

<style>
@import '../assets/css/reports_styles/reports.css';
@import '../assets/css/dialog_styles/dialogHeader.css';
@import '../assets/css/dialog_styles/dialogBody.css';
@import '../assets/css/dialog_styles/dialogFooter.css';

</style>
