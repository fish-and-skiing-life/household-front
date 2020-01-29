
<template>
<div>
  <page-title-bar></page-title-bar>

  <div class="md-layout ">
    <v-container fluid grid-list-xl class="px-15">
      <v-layout row wrap>
        <app-card :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
          <v-form v-model="form.valid" ref="form" lazy-validation>
            <v-layout row wrap>
              <v-flex xs12 sm3>
                <span class=" pt-3 px-5 d-block grey--text text-right">商品名・場所など</span>
              </v-flex>
              <v-flex xs12 sm7 >
                <v-text-field class="pt-2" v-model="registInfo.product" :rules="form.nameRules" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12 sm3>
                <span class=" pt-3 px-5 d-block grey--text text-right">値段</span>
              </v-flex>
              <v-flex xs12 sm7 >
                <v-text-field class="pt-2" type="number" v-model="registInfo.price" :rules="form.priceRules" required></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12 sm3>
                <span class=" pt-3 px-5 d-block grey--text text-right">費目</span>
              </v-flex>
              <v-flex xs12 sm7 >
                <v-select
                  class="pt-2"
                  v-model="selectExpense"
                  :items="form.expense"
                  :rules="[v => !!v || '費目は必須です']"
                  required
                ></v-select>
                <!-- <v-text-field class="pt-2" v-model="registInfo.expense" :rules="form.expenseRules" required></v-text-field> -->
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12 sm3>
                <span class=" pt-2 px-5 d-block grey--text text-right">購入日</span>
              </v-flex>
              <v-flex xs12 sm7 >
                <v-dialog ref="buyDialog" persistent v-model="buyAtModal" lazy  full-width width="290px" :return-value.sync="registInfo.buy_at">
                  <v-text-field slot="activator" label="購入日" v-model="registInfo.buy_at" prepend-icon="event" readonly class="pt-0" :rules="form.buyAtRules"> 
                  </v-text-field>
                  <v-date-picker v-model="registInfo.buy_at" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="buyAtModal = false">Cancel</v-btn>
                    <v-btn color="primary" @click="$refs.buyDialog.save(registInfo.buy_at)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12 sm3>
                <span class=" pt-3 px-5 d-block grey--text text-right">備考</span>
              </v-flex>
              <v-flex xs12 sm7 >
                <v-text-field class="pt-2" v-model="registInfo.description"></v-text-field>
              </v-flex>
            </v-layout>

            <v-flex xs12 sm12 md12 lg12 xl12>
              <div class="text-center">
                <v-btn @click="regist" :disabled="!form.valid" color="success" v-if="hId == undefined">登録する</v-btn>
                <v-btn @click="edit_regist" :disabled="!form.valid" color="success" v-else>編集する</v-btn>
              </div>
            </v-flex>
          </v-form>
        </app-card>
      </v-layout>
    </v-container>
  </div>
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
      buyAtModal: false,
      id2name: {},
      form: {
        valid: true,
        nameRules: [ v => !!v || "商品名・場所などは必須です"],
        priceRules: [ v => !!v || "値段は必須です"],
        expenseRules: [ v => !!v || "費目は必須です"],
        buyAtRules: [ v => !!v || "購入日は必須です"],
        expense: []
      },
      selectExpense: '',
      registInfo: {
        product: "",
        price: "",
        buy_at: "",
        expense_id: Number,
        description: "",
        user_id: this.$route.params.id
      }
    }
  },
  mounted: function() {
    this.registInfo.user_id = this.user_id
    axios
    .get(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + this.userId + "/expense", {headers: {'Authorization': 'Bearer ' + this.idToken}})
    .then(response => {
      for(let index in response.data){
        this.form.expense.push({text:response.data[index]['name'], value: response.data[index]['id']})
        this.id2name[response.data[index]['id']] = response.data[index]['name']
      }
      this.id2name = Object.assign({}, this.id2name)
    }).catch(error => {
      console.log(error)
    })

    if(this.hId != undefined){
      axios
      .get(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + this.userId + "/household/" + this.hId, {headers: {'Authorization': 'Bearer ' + this.idToken}})
      .then(response => {
        this.registInfo = response.data
        console.log(this.registInfo)
      }).catch(error => {
        console.log(error)
      })
    }
  },
  methods: {
    regist(){
      if (this.$refs.form.validate()) {
        this.registInfo.expense_id = this.selectExpense
        this.registInfo.user_id = this.userId
        axios
        .post(process.env.VUE_APP_API + "/api/v1/users/" + this.userId + "/household",this.registInfo, {headers: {'Authorization': 'Bearer ' + this.idToken}})
        .then(response => {
          alert("登録が成功しました")
          this.$router.push('/' + this.userId + '/dashboard')
        }).catch(error => {
          console.log(error)
        })
      }
    },
    edit_regist(){
      if (this.$refs.form.validate()) {
        this.registInfo.expense_id = this.selectExpense
        this.registInfo.user_id = this.userId
        console.log(this.registInfo)
        axios
        .patch(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + this.userId + "/household/" + this.hId,this.registInfo, {headers: {'Authorization': 'Bearer ' + this.idToken}})
        .then(response => {
          alert("編集が成功しました")
          this.$router.push('/' + this.userId + '/household/' + this.hId)
        }).catch(error => {
          console.log(error)
        })
      }
    },
    signinWithAuth0() {
      login();
    },
    logoutWithAuth0() {
      logout();
    },
    getAge: function(day){
      return moment(day, "YYYYMMDD").fromNow().split('年前')[0].split(' ')[0] + "歳"
    },

  },
  watch: {
    id2name(val){
      this.selectExpense = {text: this.id2name[this.registInfo.expense] , value: this.registInfo.expense_id}
    }
   }
}
</script>

<style scoped lang="scss">

</style>
