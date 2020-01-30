<template>
  <div>
    <div class="md-layout ">

      <v-container fluid grid-list-xl class="px-0">
        <h3 class="px-3">  グループ設定</h3>
        <div class="text-right">
          <v-btn flat color="primary" @click="createGroupModalShow">グループの作成</v-btn>
          <v-btn flat color="primary" @click="showDeleteModal">グループを削除</v-btn>
          <v-btn flat color="primary" @click="showAttendModal">グループに参加</v-btn>
        </div>
        <v-layout row wrap>
          <app-card :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
            <v-data-table :headers="headers" :items="tableData" hide-actions>
              <template slot="items" slot-scope="props">
                <td class="text-xs-center" v-if="props.item.group_token != null">{{ props.item.group_name }}</td>
                <td class="text-xs-center" v-else>未登録</td>
                <td class="text-xs-center" v-if="props.item.group_token != null">{{ props.item.group_token }}</td>
                <td class="text-xs-center" v-else>未登録</td>
                <td class="text-xs-center" v-if="props.item.group_token != null">{{ formated_date(props.item.group_created_at )}}</td>
                <td class="text-xs-center" v-else>未登録</td>
                <td class="justify-center layout " v-if="props.item.group_token != null">
                  <v-icon  class="mr-2" @click="editGroupModalShow(props.item)">edit</v-icon>
                </td>
              </template>
            </v-data-table>
          </app-card>
        </v-layout>
      </v-container>
    </div>

    <v-dialog v-model="createGroupModal" max-width="600px">
      <v-card class= "px-4">
        <v-card-title>
          <h3 class="text-center" v-if="mode == 'new'">グループの作成</h3>
          <h3 class="text-center" v-else>グループの編集</h3>
        </v-card-title>
        <v-card-text>
          <v-form v-model="form.valid" ref="form" lazy-validation>
            <v-layout row wrap>
              <v-flex xs12 sm4>
                <span class=" pt-4 pr-4 d-block grey--text text-right">グループ名</span>
              </v-flex>
              <v-flex xs12 sm8 >
                <v-text-field label="名前" v-model="groupName" :rules="form.nameRules" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div>
            <v-btn flat color="error" @click="groupModalHide">Close</v-btn>
            <v-btn flat color="primary" :disabled="!form.valid" @click="registGroup" v-if="mode == 'new'">作成する</v-btn>
            <v-btn flat color="primary" :disabled="!form.valid" @click="registGroup('')" v-if="mode == 'edit'">編集する</v-btn>
            <v-btn flat color="primary" :disabled="!form.valid" @click="registGroup('out')" v-if="mode == 'edit'">グループを抜ける</v-btn>
          </div>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteModal" max-width="600px">
    <v-card>
      <v-card-text class="text-center">
         <v-layout row wrap>
            <v-flex xs12 sm4>
              <span class=" pt-4 pr-4 d-block grey--text text-right">グループトークン</span>
            </v-flex>
            <v-flex xs12 sm8 >
              <v-text-field label="トークン" v-model="deleteToken"></v-text-field>
            </v-flex>
          </v-layout>
        <v-btn flat color="primary" @click="deleteModalHide()">キャンセル</v-btn>
        <v-btn flat color="error" @click="deleteGroup">削除する</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog v-model="attendModal" max-width="600px">
    <v-card>
      <v-card-text class="text-center">
         <v-layout row wrap>
            <v-flex xs12 sm4>
              <span class=" pt-4 pr-4 d-block grey--text text-right">グループトークン</span>
            </v-flex>
            <v-flex xs12 sm8 >
              <v-text-field label="トークン" v-model="attendToken"></v-text-field>
            </v-flex>
          </v-layout>
        <v-btn flat color="primary" @click="attendModalHide()">キャンセル</v-btn>
        <v-btn flat color="error" @click="attendGroup">参加する</v-btn>
      </v-card-text>
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
      deleteModal: false,
      createGroupModal: false,
      attendModal: false,
      tableData: [],
      selectedPlan: {},
      headers: [
        { text: "所属グループ名", sortable: false, value: "group_name" , align: 'center'},
        { text: "グループトークン", sortable: false, value: "group_token" , align: 'center'},
        { text: "作成日", sortable: false, value: "Createdat" , align: 'center'},
        { text: "", sortable: false, align: 'center'}
      ],
      form: {
        valid: true,
        groupRules: [
          v => !!v || "グループ名は必須です",
        ],
      },
      userId: this.$route.params.id,
      mode: "",
      groupToken: "",
      groupName: "",
      deleteToken: "",
      attendToken: ""
    };
  },
  methods: {
    groupModalHide(){
      this.createGroupModal = false
    },
    deleteModalHide(){
      this.deleteModal = false
    },
    attendModalHide(){
      this.attendModal = false
    },
    formated_date(date){
      return moment(date).format("YYYY年MM月DD日")
    },
    registGroup(type) {
      if (this.$refs.form.validate()) {
        var idToken = localStorage.getItem("idToken")
        var regist = {name: this.groupName}
        if ( this.mode == 'new'){
          axios
            .post(process.env.VUE_APP_API + "/api/v1/group", regist, {headers: {'Authorization': 'Bearer ' + idToken}})
            .then(response => {
                alert("作成に成功しました")
                this.groupModalHide() 
                location.reload();
            }).catch(error => {
            })
        }else{
          if(type == ''){
            axios
            .patch(process.env.VUE_APP_API + "/api/v1/group/" + this.groupToken, regist, {headers: {'Authorization': 'Bearer ' + idToken}})
            .then(response => {
                alert("編集に成功しました")
                this.groupModalHide() 
                location.reload();
            }).catch(error => {
            })
          }
          else{
            axios
              .patch(process.env.VUE_APP_API + "/api/v1/users/" + this.userId, {group_token: null}, {headers: {'Authorization': 'Bearer ' + idToken}})
              .then(response => {
                  alert("脱退に成功しました")
                  this.groupModalHide() 
                  location.reload();
              }).catch(error => {
            })
          }
          
        }
      };
    },
    deleteGroup(){
      var idToken = localStorage.getItem("idToken")
      axios
      .delete(process.env.VUE_APP_API_ENDPOINT + "/api/v1/group/" + this.deleteToken,{headers: {'Authorization': 'Bearer ' + idToken}})
      .then(response => {
        alert("削除に成功しました")
        this.deleteModalHide()
        location.reload();
      }).catch(error => {
        if (error.response.status == 404) {
          alert("無効なトークンです。")
        }
      })
    },
    attendGroup(){
      var idToken = localStorage.getItem("idToken")
      axios
      .patch(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + this.userId + "/attend_group", {group_token: this.attendToken},{headers: {'Authorization': 'Bearer ' + idToken}})
      .then(response => {
        alert("参加に成功しました")
        this.attendModalHide()
        location.reload();
      }).catch(error => {
        if (error.response.status == 404) {
          alert("無効なトークンです。")
        }
      })
    },
    createGroupModalShow() {
      this.mode = "new"
      this.createGroupModal = true
    },
    editGroupModalShow(item) {
      this.mode = "edit"
      this.groupName = item.group_name
      this.groupToken = item.group_token
      this.createGroupModal = true
    },
    showDeleteModal(item){
      this.deleteModal = true
      this.deleteItem = item
    },
    showAttendModal(){
      this.attendModal = true
    }
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

