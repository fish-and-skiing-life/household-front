<template>
   <div class="courses-payment">
     	<v-container fluid grid-list-xl>
	      <v-layout row wrap align-center justify-center fill-height payment-wrap>
            <v-flex xs12 sm12 md12 lg12 xl12>
                <app-card
        	        heading="組織管理情報設定"
                    customClasses="shop-by-category tab-wrap"
					contentCustomClass="pt-0 px-0"
               >
                  <v-tabs light slider-color="primary" v-model="activePayment">
                     <v-tab>NPO情報</v-tab>
                     <v-tab>ユーザー</v-tab>
                     <v-tab>支払い管理</v-tab>
                     <v-tab-item>
                        <organization-info></organization-info>
                     </v-tab-item>
                     <v-tab-item>
                        <users></users>
                     </v-tab-item>
                     <v-tab-item>
                        <plan-billing></plan-billing>
                     </v-tab-item>
                  </v-tabs>
               </app-card>
            </v-flex>
         </v-layout>
      </v-container>
   </div>
</template>

<script>
import OrganizationInfo from "Components/Setting/OrganizationInfo";
import Users from "Components/Setting/Users";
import PlanBilling from "Components/Setting/PlanBilling";
import axios from 'axios';
import { mapState } from 'vuex'; 	
export default {
   components: {
      OrganizationInfo,
      Users,
      PlanBilling
   },
   data () {
   	return{
         regist: {},
         activePayment: null,
      }
	},
	methods:{
   },
   computed: {
      ...mapState({
         org: state => state.org.orgInfo
      }),
   },
   mounted(){
      this.regist = Object.assign({}, this.org)
   },
   watch:{
      testorg: function(val){
         this.regist = Object.assign({}, this.org)
      }
   }
}
</script>