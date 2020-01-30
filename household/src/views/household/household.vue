
<template>
<div>
  <page-title-bar></page-title-bar>
  <v-container fluid grid-list-xl class="px-15">
    <div class="md-layout ">
      <v-card>
          <v-card-text class="text-center">
            <v-data-table
              :headers="headers"
              :items="household"
              :calculate-widths="true"
              hide-actions
            >
              <template slot="items" slot-scope="props">
                <tr>
                  <td class="text-xs-left" >{{ props.item.product }}</td>
                  <td class="text-xs-left" >{{ props.item.price }}</td>
                  <td class="text-xs-left" >{{ getExpense(props.item.expense_id) }}</td>
                  <td class="text-xs-left" >{{ formated_date(props.item.buy_at) }}</td>
                  <td class="text-xs-left" v-if="props.item.description != ''">{{ props.item.description }}</td>
                  <td class="text-xs-left" v-else>未記入</td>
                  <td class="text-xs-left " >
                    <button class="text-red" @click="showDeleteModal(props.item)">
                      <v-icon left class="error--text font-sm">close</v-icon>
                    </button>
                  </td>
                </tr>
              </template>
            </v-data-table>

            <router-link :to="'./' + hId + '/edit'">
              <v-btn flat color="primary">編集する</v-btn>
            </router-link>
          </v-card-text>
        </v-card>
    </div>
  </v-container>

  <v-dialog v-model="deleteModal" max-width="600px">
    <v-card>
      <v-card-text class="text-center">
        <h3>本当に削除しますか</h3>
        <v-btn flat color="primary" @click="deleteModalHide()">キャンセル</v-btn>
        <v-btn flat color="error" @click="deleteHousehold">削除する</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</div>
</template>
<script>
import AuthService from "@/auth/AuthService";
import moment from 'moment';

import axios from 'axios';
const auth = new AuthService();
const { login, logout, authenticated, authNotifier } = auth;

export default {
  components: {
  },
  data () {
    return {
      idToken: localStorage.getItem("idToken"),
      userId: this.$route.params.id,
      hId: this.$route.params.h_id,
      editHouseholdModal: false,
      expense: {},
      deleteModal: false,
      deleteItem: {},
      household: [],
      headers: [
          { text: '商品名', value: 'product'},
          { text: '値段', value: 'price'},
          { text: '費目', value: 'expense'},
          { text: '購入日', value: 'buy_At'},
          { text: '備考', value: 'description'},
          { text: 'その他', value: 'other'}
        ]
    }
  },
  mounted: function() {
    axios
    .get(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + this.userId + "/expense", {headers: {'Authorization': 'Bearer ' + this.idToken}})
    .then(response => {
      for(let index in response.data){
        this.expense[response.data[index]['id']] = response.data[index]['name']
      }
      this.expense= Object.assign({},this.expense)
    }).catch(error => {
      console.log(error)
    })

    axios
    .get(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + this.userId + "/household/" + this.hId, {headers: {'Authorization': 'Bearer ' + this.idToken}})
    .then(response => {
      this.household.push(response.data)
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    showDeleteModal(item){
      this.deleteModal = true
      this.deleteItem = item
    },
    deleteModalHide(){
      this.deleteModal = false
    },
    deleteHousehold(){
      axios
      .delete(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + this.userId + "/household/"+ this.deleteItem.id,{headers: {'Authorization': 'Bearer ' + this.idToken}})
      .then(response => {
        alert("削除に成功しました")
        this.deleteModalHide()
        this.$router.push('/' + this.userId + '/dashboard')
      }).catch(error => {
        console.log(error)
      })
    },
    getExpense: function(id){
      console.log(this.expense)
      console.log(this.expense[id])
      return this.expense[id]
    },
    signinWithAuth0() {
      login();
    },
    logoutWithAuth0() {
      logout();
    },
    formated_date: function(date){
      return moment(date).format("YYYY/MM/DD")
    },

  }
}
</script>

<style scoped lang="scss">

</style>
