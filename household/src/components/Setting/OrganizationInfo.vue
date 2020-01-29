<template>
	<v-card flat>
		<v-form class="form-wrapper pt-4 py-5" ref="form" v-model="valid">
		    <div class="layout row wrap">
		    	<v-spacer></v-spacer>
		        <v-flex xs12 sm6 md6 lg6 xl6 class="col-height-auto text-center">
		           <div class="layout row wrap">
		              <v-flex xs12 sm12 md12 lg12 xl12>
		                 <v-text-field class="mt-0 pt-0" v-model="regist.name" light label="会社名" required></v-text-field>
		              </v-flex>
		              <v-flex xs12 sm12 md12 lg12 xl12>
		                 <v-text-field class="mt-0 pt-0" v-model="regist.industry"  light label="業種" required></v-text-field>
		              </v-flex>
		              <v-flex xs12 sm12 md12 lg12 xl12>
		                 <v-text-field class="mt-0 pt-0" v-model="regist.scale" light label="会社規模" required>
		                 </v-text-field>
		              </v-flex>
		              <v-flex xs12 sm12 md12 lg12 xl12>
		                 <v-text-field class="mt-0 pt-0" v-model="regist.phone" light label="電話番号" required></v-text-field>
		              </v-flex>
		              <v-flex xs12 sm12 md12 lg12 xl12>
		                 <v-text-field class="mt-0 pt-0" v-model="regist.purpose" light label="目的" required>
		                 </v-text-field>
		              </v-flex>
		              <v-flex xs12 sm12 md12 lg12 xl12>
		                 <div class="btn-wrap text-xl-center">
		                    <v-btn flat class="primary" @click="update_organization">登録する</v-btn>
		                 </div>
		              </v-flex>
		           </div>
		    	 </v-flex>
		    	 <v-spacer></v-spacer>
		    </div>
		 </v-form>
	</v-card>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex'; 	
export default {
   data () {
   	return{
        regist: {},
		valid: false
      }
	},
	methods:{
		update_organization() {
         var idToken = localStorage.getItem("idToken")
         axios
            .put(process.env.VUE_APP_API + "/api/v1/organization", {info: this.regist}, {headers: {'Authorization': 'Bearer ' + idToken}})
            .then(response => {
            	console.log(response)
               this.$store.dispatch('org/fetchOrg', idToken)
               alert("更新に成功しました")
            }).catch(error => {
              console.log(error)
              alert("更新に失敗しました")
         })
      },
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
      org: function(val){
         this.regist = Object.assign({}, this.org)
      }
   }
}
</script>
