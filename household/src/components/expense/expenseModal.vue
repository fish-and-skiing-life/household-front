
<template>
  <div>
    <v-btn color="primary"  small flat @click="expenseModal = true">費目設定</v-btn>
    <v-dialog v-model="expenseModal" max-width="600px">
      <v-card>
        <v-card-text class="text-center">
          <v-data-table
            :headers="headers"
            :items="expense"
            :calculate-widths="true"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left" >{{ props.item.name }}</td>
                <td class="text-xs-left" v-if="props.item.description != ''">{{ props.item.description }}</td>
                <td class="text-xs-left" v-else>未記入</td>
                <td class="text-xs-left " >
                  <button class="text-red" @click="showDeleteModal(props.item)">
                    <v-icon left class="error--text font-sm">close</v-icon>
                  </button>
                  <button class="text-red" @click="showEditModal(props.item)">
                    <v-icon left class=" font-sm">edit</v-icon>
                  </button>
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-btn flat color="primary" @click="addExpenseModal = true">費目を追加する</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addExpenseModal" max-width="600px">
      <v-card>
        <v-card-text class="text-center">
          <app-card customClasses="mb-30">
            <h3 v-if="mode == 'new'">費目の登録</h3>
            <h3 v-else>費目の編集</h3>
            <v-form v-model="form.valid" ref="form" lazy-validation>
              <v-layout row wrap>
                <v-flex xs12 sm5>
                  <span class=" mt-4 px-5 d-block grey--text text-right">費目名</span>
                </v-flex>
                <v-flex xs12 sm7 >
                  <v-text-field class="px-4 outlined" v-model="name" :rules="form.name" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm5>
                  <span class="small pt-4 px-5 d-block grey--text text-right">説明</span>
                </v-flex>
                <v-flex xs12 sm7>
                  <v-text-field class="px-4 outlined" v-model="description"></v-text-field>
                </v-flex>
              </v-layout>
              <v-flex xs12 sm12 md12 lg12 xl12>
                <div class="mt-4 btn-wrap text-center">
                  <v-btn @click="createExpense" :disabled="!form.valid" color="success" v-if="mode=='new'"> 登録する </v-btn>
                  <v-btn @click="editExpense" :disabled="!form.valid" color="success" v-else> 編集する </v-btn>
                </div>
              </v-flex>
            </v-form>
          </app-card>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteModal" max-width="600px">
      <v-card>
        <v-card-text class="text-center">
          <h3>本当に削除しますか</h3>
          <v-btn flat color="primary" @click="deleteModalHide()">キャンセル</v-btn>
          <v-btn flat color="error" @click="deleteExpense">削除する</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    
  </div>
</template>
<script>
import AuthService from "@/auth/AuthService";
import moment from 'moment';
import axios from 'axios';
import { mapState } from "vuex";
const auth = new AuthService();
const { login, logout, authenticated, authNotifier } = auth;

export default {
  components: {
  },
  props: {
  },
  data () {
    return {
      expenseModal: false,
      headers: [
          { text: '費目', value: 'name'},
          { text: '説明', value: 'description'},
          { text: '', value: 'other'},
        ],
      idToken: localStorage.getItem("idToken"),
      addExpenseModal: false,
      userId: this.$route.params.id,
      expense: [],
      errorAlert: false,
      deleteModal: false,
      deleteItem: {},
      editId: Number,
      name: "",
      description: "",
      mode: "new",
      form: {
        valid: true,
        nameRules: [
          v => !!v || "費目は必須です",
        ]
      },
    }
  },
  methods: {
    showDeleteModal(item){
      this.deleteModal = true
      this.deleteItem = item
    },
    showEditModal(item){
      this.addExpenseModal = true
      this.mode = 'edit'
      this.name = item.name
      this.editId = item.id
      console.log(this.editId)
      this.description = item.description
    },
    deleteExpense(){
      axios
      .delete(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + this.userId + "/expense/"+ this.deleteItem.id,{headers: {'Authorization': 'Bearer ' + this.idToken}})
      .then(response => {
        let new_expense = []
        for (var index in this.expense){
          console.log(this.expense[index]['id'] != this.deleteItem.id)
          if(this.expense[index]['id'] != this.deleteItem.id){
            new_expense.push(this.expense[index])
          }
        }
        alert("削除に成功しました")
        this.expense = new_expense
        this.deleteModalHide()
      }).catch(error => {
        console.log(error)
      })
    },
    createExpense(){
      if (this.$refs.form.validate()) {
        axios
        .post(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/"+ this.userId + "/expense",{name: this.name, description: this.description, user_id: this.userId} ,{headers: {'Authorization': 'Bearer ' + this.idToken}})
        .then(response => {
          alert("登録に成功しました")
          this.expense.push(response.data.data)
          this.addExpenseModallHide()
        }).catch(error => {
          if(error.response.status == 422){
            this.errorAlert = true
          }
        })
      }
    },
    editExpense(){
      if (this.$refs.form.validate()) {
        axios
        .patch(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/"+ this.userId + "/expense/" + this.editId,{name: this.name, description: this.description, user_id: this.userId} ,{headers: {'Authorization': 'Bearer ' + this.idToken}})
        .then(response => {
          alert("編集に成功しました")
          console.log(response.data.data)
          let new_expense = []
          for(var index in this.expense){
            if(this.expense[index]['id'] == this.editId){
              new_expense.push({name: this.name, description: this.description, user_id: this.userId, id: this.editId})
            }else{
              new_expense.push(this.expense[index])
            }
          }
          this.expense = new_expense
          this.editExpenseModallHide()
        }).catch(error => {
          if(error.response.status == 422){
            this.errorAlert = true
          }
        })
      }
    },
    expenseModallHide() {
      this.expenseManageModal = false
    },
    addExpenseModallHide() {
      this.addExpenseModal = false
    },
    deleteModalHide(){
      this.deleteModal = false
    },
    editExpenseModallHide(){
      this.addExpenseModal = false
      this.mode = 'new'
    },
   signinWithAuth0() {
     login();
   },
   logoutWithAuth0() {
     logout();
   }
  },
  mounted: function() {
    console.log(this.userId)
    axios
      .get(process.env.VUE_APP_API + "/api/v1/users/"+ this.userId + "/expense", {headers: {'Authorization': 'Bearer ' + this.idToken}})
      .then(response => {
        this.expense = response.data
      }).catch(error => {
        console.log(error)
      })
  },
}
</script>

<style scoped lang="scss">
.dense{
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 4px;
  background-color: #FFB760 !important;
  border-color: #FFB760 !important;
}
</style>
