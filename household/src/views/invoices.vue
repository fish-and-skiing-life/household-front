<template>
   <div class="md-layout ">
      <v-container fluid grid-list-xl>
        <h3 > お支払い履歴</h3>

        <v-layout row wrap>
          <app-card :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
            <v-data-table :headers="headers" :items="invoiceData" hide-actions >
              <template slot="items" slot-scope="props" >
                <td >{{ info.name }} {{ format_date(props.item.period_start)}}</td>
                <td>{{ props.item.status }}</td>
                <td>{{ props.item.amount_paid.toLocaleString() }} {{props.item.currency.toUpperCase()}}</td>
              </template>
            </v-data-table>
          </app-card>
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
import moment from 'moment';
export default {
   components: {
      OrganizationInfo,
      Users,
      PlanBilling
   },
   data () {
   	return{
         invoiceData: [],
         headers: [
           { text: "支払い情報", align: "left", sortable: false, value: "info"},
           { text: "ステータス", sortable: false, value: "status" },
           { text: "金額", sortable: false, value: "amount" },
         ],
      }
	},
	methods:{
		format_date(date){
         return moment(date).format("YYYY-MM-DD")
      }
   },
   created() {
    var id_token = localStorage.getItem("idToken")
    axios
      .get(process.env.VUE_APP_API + "/api/v1/plan_billing", {headers: {'Authorization': 'Bearer ' + id_token}})
      .then(response => { 
          this.invoiceData = response.data.data
      }).catch(error => {
          console.log(error.response.data.errors)
      })
  },
  computed: {
    ...mapState({
        info: state => state.org.orgInfo,
    })
  },
}
</script>
