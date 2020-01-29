<template>
  <div>
    <div class="md-layout ">
      <v-container fluid grid-list-xl class="px-0">
        <h3 class="px-3">  ユーザー管理設定</h3>
        <div class="text-right">
          <v-btn flat color="primary" @click="userModalShow([])" >CREATE</v-btn>
        </div>

        <v-layout row wrap>
          <app-card :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
            <v-data-table :headers="headers" :items="tableData" hide-actions>
              <template slot="items" slot-scope="props">
                <td class="text-xs-center" >{{ props.item.name }}</td>
                <td class="text-xs-center">{{ props.item.email }}</td>
                <td class="text-xs-center">{{ props.item.logins_count }}</td>
                <td class="text-xs-center">{{ formated_date(props.item.created_at )}}</td>
                <td class="justify-center layout ">
                  <v-icon class="mr-2" @click="userModalShow(props.item)">edit</v-icon>
                  <v-icon @click="deleteModal = true, modalUser = props.item.user_id">delete</v-icon>
                </td>
              </template>
            </v-data-table>
          </app-card>
        </v-layout>
      </v-container>
    </div>

    <!-- ユーザの追加と編集modal -->
    <v-dialog v-model="createUserModal" max-width="500px">
      <v-card class= "px-4 ">
        <v-card-title>
          <div v-if="mode == 'create'">新規ユーザー追加</div>
          <div v-if="mode == 'edit'">ユーザー編集</div>
        </v-card-title>
        <v-card-text>
          <v-form v-model="form.valid" ref="form" lazy-validation>
            <v-layout row wrap>
              <v-flex xs12 sm3>
                <span class=" pt-4 pr-4 d-block grey--text text-right">名前</span>
              </v-flex>
              <v-flex xs12 sm9 >
                <v-text-field label="名前" v-model="user.name" :rules="form.industryRules" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm3>
                <span class=" pt-4 pr-4 d-block grey--text text-right">Email</span>
              </v-flex>
              <v-flex xs12 sm9 >
                <v-text-field label="Email" v-model="user.email" :rules="form.emailRules" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm3>
                <span class=" pt-4 pr-4 d-block grey--text text-right">パスワード</span>
              </v-flex>
              <v-flex xs12 sm9 >
                <v-text-field label="パスワード" v-model="user.password" :rules="form.passwordRules" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm3>
                <span class=" pt-4 pr-4 d-block grey--text text-right">権限</span>
              </v-flex>
              <v-flex xs12 sm9>

                <v-select 
                  item-text="label"
                  item-value="value" 
                  hide-details 
                  :items="roles"  
                  v-model="user.role"
                  label="権限"  
                  single-line  
                  menu-props="bottom"  
                ></v-select>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div v-if="mode == 'create'">
            <v-btn flat color="error" @click="createUserModalHide">Close</v-btn>
            <v-btn flat color="primary" :disabled="!form.valid" @click="createUser">登録する</v-btn>
          </div>
          <div v-if="mode == 'edit'">
            <v-btn flat color="error" @click="createUserModalHide">Close</v-btn>
            <v-btn flat color="primary" :disabled="!form.valid" @click="updateUser">編集する</v-btn>
          </div>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ユーザの削除modal -->
    <v-dialog v-model="deleteModal" max-width="500px">
      <v-card>
        <v-card-title>
          <div>確認</div>
        </v-card-title>
        <v-card-text>
          削除してしまうと、作成したデータやプロジェクトのデータも消えてしまいます。
        </v-card-text>
        <v-card-actions >
          <v-btn color="error" @click="deleteUserModalHide">キャンセル</v-btn>
          <v-btn color="success" @click="deleteUser">削除する</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex'; 
import moment from 'moment';

export default {
  name: "users",
  components: {
  },
  data() {
    return {
      createUserModal: false,
      deleteModal: false,  
      tableData: [],
      selectedPlan: {},
      headers: [
        { text: "Name", align: "left", sortable: false, value: "name", align: 'center'},
        { text: "Email", sortable: false, value: "email" , align: 'center'},
        { text: "Login count", sortable: false, value: "logins_count", align: 'center' },
        { text: "Createdat", sortable: false, value: "Createdat" , align: 'center'},
        { text: "", sortable: false, align: 'center'}
      ],
      form: {
        valid: true,
        nameRules: [
          v => !!v || "会社名は必須です",
        ],
        emailRules: [
          v => !!v || "Emailは必須です",
          v =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "正しいメールアドレスを入力してください"
        ],
        passwordRules: [
        v => !!v || "パスワードは必須です",
        v => /.{8,}/.test(v) || "短すぎます",
        v => /[a-z]/.test(v) || "小文字、大文字、記号を含めてください",
        v => /[A-Z]/.test(v) || "大文字を含めてください" ,  
        v => /[#!&-]/.test(v) || "記号を含めてください"
        ]
      },
      roles:[{label:'セールス', value: "sales"},
             {label: 'プランニング', value: "planning"}, 
             {label: '管理者' , value: "admin"}],
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
    createUser() {
      if (this.$refs.form.validate()) {
        if(this.user.role != undefined){
          var idToken = localStorage.getItem("idToken")
          axios
            .post(process.env.VUE_APP_API + "/api/v1/user", {name: this.user.name, email: this.user.email, role: this.user.role, password: this.user.password}, {headers: {'Authorization': 'Bearer ' + idToken}})
            .then(response => {
                this.tableData.push(response.data)
                alert(this.user.name + "を追加しました。")
                this.createUserModalHide() 
            }).catch(error => {
                console.log(error)
            })
        }
      }
    },
    updateUser() {
      if (this.$refs.form.validate()) {
        if(this.user.role != undefined){
            var idToken = localStorage.getItem("idToken")
            axios
              .put(process.env.VUE_APP_API + "/api/v1/user", {name: this.user.name, email: this.user.email, role: this.user.role, sub: this.user.user_id}, {headers: {'Authorization': 'Bearer ' + idToken}})
              .then(response => {
                  alert(this.user.name + "更新に成功しました")
                  this.createUserModalHide() 
              }).catch(error => {
                  if(error.response.status == 422) {
                      alert("管理者ユーザーがいなくなってしまうため処理を実行できませんでした", "danger")
                  }
              })
        }
      };
    },
    userModalShow(item) {
        (item.length == 0)? this.mode = "create" : this.mode = "edit";
        this.user = item
        this.createUserModal = true
    },
    createUserModalHide() {
        this.createUserModal = false
    },
    deleteUserModalHide() {
        this.deleteModal = false 
        this.modalUser = ""
    },
    deleteUser() {
        var idToken = localStorage.getItem("idToken")
        axios
          .delete(process.env.VUE_APP_API + "/api/v1/user", {headers: {'Authorization': 'Bearer ' + idToken}, data: {sub: this.modalUser}})
          .then(response => {
              alert("削除に成功しました")
              this.deleteUserModalHide() 
          }).catch(error => {
              alert("削除に失敗しました")
          })
    }

  },
  computed: {
    ...mapState({
        org: state => state.org.orgInfo
    })
  },
  created() {
    var idToken = localStorage.getItem("idToken")
    axios
      .get(process.env.VUE_APP_API + "/api/v1/users", {headers: {'Authorization': 'Bearer ' + idToken}})
      .then(response => {
          console.log(response.data)
          this.tableData = response.data
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

