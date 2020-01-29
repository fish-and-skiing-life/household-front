
<template>
  <div class="checkout-wrap">
    <v-container fluid>
      <v-layout row wrap align-center justify-center >
        <app-card :fullBlock="true" colClasses="xl8 lg8 md9 sm9 xs12">
            <h2 class="px-3 py-4 mb-0">ようこそ! 新規登録をしましょう</h2>
            <v-form v-model="form.valid" ref="form" lazy-validation>
              <v-layout row wrap>
                <v-flex xs12 sm12 md12 >
                  <v-text-field label="名前" v-model="form.name" :rules="form.nameRules" required></v-text-field>
                </v-flex>                     
              </v-layout> 
              <!-- <v-layout row wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="グループ" v-model="form.group" :rules="form.domainRules" required></v-text-field>
                </v-flex>
              </v-layout> -->
              <v-layout>
                <v-flex xs12 sm12 md12 lg12 xl12>
                  <div class="btn-wrap text-center">
                    <v-btn color="success" :disabled="!form.valid" @click="create" >登録</v-btn>
                  </div>
                </v-flex>
              </v-layout>
            </v-form>
        </app-card>
      </v-layout>
    </v-container>   
   </div>
</template>


<script>
import axios from 'axios';

export default {
  components: {
  },
  data () {
    return {
      idToken: localStorage.getItem("idToken"),
      plan: "",
      userId: "",
      form: {
        valid: true,
        name: "",
        nameRules: [
          v => !!v || "名前は必須です",
        ],
        // domain: "",
        // domainRules: [
        //   v => !!v || "テナントIDは必須です",
        // ]
      },
    }
  },
  methods: {
    create(){
      if (this.$refs.form.validate()) {
          axios
            .patch(process.env.VUE_APP_API_ENDPOINT + "/api/v1/name_update" ,{name: this.form.name, id: this.userId}, {headers: {'Authorization': 'Bearer ' + this.idToken}})
            .then(response => { 
                console.log(this.response)
                // this.$store.commit('org/setProfile', response.data.org.profile)
                // this.$store.dispatch("org/fetchOrg", this.idToken)
                // localStorage.setItem("domain", this.form.domain);
                // this.$router.push(this.domain + "/dashboard");

            }).catch(error => {
                console.log(error)
            })
      }
    },
  },
  created() {
  },
  beforeCreate() {
    var d = localStorage.getItem("domain")
    var idToken = localStorage.getItem("idToken")
    if(d) {
        this.$router.push(d + "/dashboard");
    } else {
        axios
          .get(process.env.VUE_APP_API_ENDPOINT + "/api/v1/check", {headers: {'Authorization': 'Bearer ' + idToken}})
          .then(response => { 
            console.log('成功')
            this.userId = response.data.user.id
              console.log(response)
          }).catch(error => {
            console.log('no',error.response.data.user)
            this.userId = error.response.data.user.id
          })
    }
  }
}
</script>

<style scoped>

</style>
