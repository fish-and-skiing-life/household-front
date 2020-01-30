<template>
  <div>
    <div class="md-layout ">
      <v-container fluid grid-list-xl class="px-0">
        <h3 class="px-3">  ユーザー管理設定</h3>
        <v-layout row wrap>
          <app-card :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
            <v-data-table :headers="headers" :items="tableData" hide-actions>
              <template slot="items" slot-scope="props">
                <td class="text-xs-center" v-if="props.item.name != null">{{ props.item.name }}</td>
                <td class="text-xs-center" v-else>未登録</td>
                <td class="text-xs-center" v-if="props.item.group_name != null">{{ props.item.group_name }}</td>
                <td class="text-xs-center" v-else>未登録</td>
                <td class="text-xs-center">{{ formated_date(props.item.created_at )}}</td>
                <td class="justify-center layout ">
                  <v-icon class="mr-2" @click="userModalShow(props.item)">edit</v-icon>
                </td>
              </template>
            </v-data-table>
          </app-card>
        </v-layout>
      </v-container>
    </div>

    <!-- ユーザの追加と編集modal -->
    <v-dialog v-model="createUserModal" max-width="600px">
      <v-card class= "px-4">
        <v-card-title>
          <h3 class="text-center">ユーザー情報の編集</h3>
        </v-card-title>
        <v-card-text>
          <v-form v-model="form.valid" ref="form" lazy-validation>
            <v-layout row wrap>
              <v-flex xs12 sm4>
                <span class=" pt-4 pr-4 d-block grey--text text-right">名前</span>
              </v-flex>
              <v-flex xs12 sm8 >
                <v-text-field label="名前" v-model="user.name" :rules="form.industryRules" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <span class=" pt-4 pr-4 d-block grey--text text-right">グループトークン</span>
              </v-flex>
              <v-flex xs12 sm8 >
                <v-text-field label="トークン" v-model="user.password"></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div>
            <v-btn flat color="error" @click="createUserModalHide">Close</v-btn>
            <v-btn flat color="primary" :disabled="!form.valid" @click="updateUser">編集する</v-btn>
          </div>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AuthService from "@/auth/AuthService";
import axios from 'axios';
import moment from 'moment';

const auth = new AuthService();
const { login, logout, authenticated, authNotifier } = auth;

export default {
  components: {
  },
  data() {
    return {
      createUserModal: false,
      tableData: [],
      selectedPlan: {},
      headers: [
        { text: "名前", align: "left", sortable: false, value: "name", align: 'center'},
        { text: "グループ名", sortable: false, value: "Createdat" , align: 'center'},
        { text: "作成日", sortable: false, value: "Createdat" , align: 'center'},
        { text: "", sortable: false, align: 'center'}
      ],
      form: {
        valid: true,
        nameRules: [
          v => !!v || "名前は必須です",
        ],
      },
      userId: this.$route.params.id,
      user: [],
      mode: "",
      modalUser: "",
      required: "",
    };
  },
  methods: {
    formated_date(date){
      return moment(date).format("YYYY年MM月DD日")
    },
    updateUser() {
      if (this.$refs.form.validate()) {
        var idToken = localStorage.getItem("idToken")
        var regist = {name: this.user.name, group_id: this.user.group_id, sub: this.user.sub}
        axios
          .patch(process.env.VUE_APP_API + "/api/v1/users/" + this.userId , regist, {headers: {'Authorization': 'Bearer ' + idToken}})
          .then(response => {
              alert(this.user.name + "さんの更新に成功しました")
              this.createUserModalHide() 
          }).catch(error => {
          })
      };
    },
    userModalShow(item) {
        this.mode = "edit"
        console.log(item)
        this.user = Object.assign({},item)
        this.createUserModal = true
    },
    createUserModalHide() {
        this.createUserModal = false
    },
  },
  created() {
    var idToken = localStorage.getItem("idToken")
    axios
      .get(process.env.VUE_APP_API + "/api/v1/users/" + this.userId, {headers: {'Authorization': 'Bearer ' + idToken}})
      .then(response => {
          console.log(response)
          this.tableData.push(response.data)
      }).catch(error => {
          console.log(error)
      })
  }
}

</script>
<style lang="scss" scoped>
.test .wrap_round{
  border: 1px solid #82b1ff;
  border-radius: 4px;
  padding: .25rem .5rem;
}
</style>

