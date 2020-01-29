
<template>
<div>
  <page-title-bar></page-title-bar>

  <div class="md-layout ">
    <v-container fluid grid-list-xl class="px-15">
      <v-layout row wrap>
        <app-card :heading="'今月の家計簿'" :fullBlock="true" colClasses="xs12">
          <v-layout row wrap>
          <v-flex md10 class="pa-3"></v-flex>
          <v-flex md1 claee="text-center">
            <expense-modal></expense-modal>
          </v-flex>
          <v-flex md1 claee="text-center">
            <router-link :to="'./household/create'">
              <v-btn flat color="primary">新規登録</v-btn>
            </router-link>
          </v-flex>
        </v-layout>

          <v-data-table
            :headers="headers"
            :items="households"
            :search="search"
            :calculate-widths="true"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left" ><router-link :to="'household/'+ props.item.id">{{ props.item.product }}</router-link></td>
                <td class="text-xs-left" >{{ props.item.price }}</td>
                <td class="text-xs-left" >{{ getExpense(props.item.expense_id) }}</td>
                <td class="text-xs-left" >{{ formated_date(props.item.buy_at ) }}</td>
                <td class="text-xs-left" >{{ props.item.description }}</td>
              </tr>
            </template>
          </v-data-table>
        </app-card>
      </v-layout>
    </v-container>
    <!-- <expense-modal :expenseModal = "expenseModal"></expense-modal> -->
  </div>
</div>
</template>
<script>
import AuthService from "@/auth/AuthService";
import expenseModal from "@/components/expense/expenseModal";
import moment from 'moment';

import axios from 'axios';
const auth = new AuthService();
const { login, logout, authenticated, authNotifier } = auth;

export default {
  components: {
    expenseModal
  },
  data () {
    return {
        idToken: localStorage.getItem("idToken"),
        expenseModal: false,
        households: [],
        expense: {},
        userId: this.$route.params.id,
        headers: [
          { text: '商品名', value: 'product'},
          { text: '値段', value: 'price'},
          { text: '費目', value: 'expense'},
          { text: '購入日', value: 'buy_At'},
          { text: '備考', value: 'description'}
        ],
    }
  },
  mounted: function() {
    console.log(this.userId)
    axios
      .get(process.env.VUE_APP_API + "/api/v1/users/"+ this.userId + "/household", {headers: {'Authorization': 'Bearer ' + this.idToken}})
      .then(response => {
        console.log(response.data)
        this.households = response.data
      }).catch(error => {
        console.log(error)
      })
    axios
    .get(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + this.userId + "/expense", {headers: {'Authorization': 'Bearer ' + this.idToken}})
    .then(response => {
      for(let index in response.data){
        this.expense[response.data[index]['id']] = response.data[index]['name']
      }
      this.expense = Object.assign({}, this.expense)
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
   signinWithAuth0() {
     login();
   },
   logoutWithAuth0() {
     logout();
   },
    getExpense: function(id){
      console.log(id)
      return this.expense[id]
    },
    formated_date: function(date){
      return moment(date).format("YYYY/MM/DD")
    },

  }
}
</script>

<style scoped lang="scss">

</style>
