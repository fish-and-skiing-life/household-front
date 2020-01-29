<template>
	<div>
		<v-container grid-list-xl fluid>
			<v-layout row wrap>
				<v-flex xl12 md12 lg12 sm12 xs12>
					<div>
						<div class="pricing-wrapper">
							<div class="pricing-list">
								<v-layout row wrap row-eq-height>

									<app-card 
										v-for="p in plans" 
										colClasses="xs12 sm4 md4 lg4 " 
										customClasses="text-xs-center"
										:fullBlock="true"
									>
										<div class="pricing-icon mb-30">
											<img src="/static/img/pricing-icon.png" alt="pricing icon" class="img-responsive" width="" height="" />
										</div>
										<h4 class="primary--text pricing-title">{{ p.nickname }}プラン</h4>
										<p>{{p.metadata.lp_description }}</p>
										<v-btn v-if="selectedPlan == p" color="success" flat large block @click="switchPlan(p)">選択中</v-btn>
										<v-btn v-else color="primary" flat large block @click="switchPlan(p)"> 選択</v-btn>
									</app-card>

								</v-layout>
							</div>
						</div>
					</div>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
    	plans: [],
    	selectedPlan:[]
    };
  },
   methods: {
	switchPlan(plan){
	    this.selectedPlan = plan
	}
  },
  created() {
    var idToken = localStorage.getItem("idToken")
    axios
      .get(process.env.VUE_APP_API + "/api/v1/organization/plans_list", {headers: {'Authorization': 'Bearer ' + idToken}}) 
      .then(response => { 
          this.plans = response.data.data.reverse()
      }).catch(error => {
      })
  },
};
</script>
