<template>
  <div class="blog-list">
    <div class="md-layout ">
      <v-container fluid grid-list-xl>
        <h3 >プランと支払い情報</h3>

        <v-layout row wrap>
          <v-flex xl12 lg12 md12 sm12 xs12>
            <v-card >
              <v-list>
                <v-list-tile  @click="changePlan = true;">
                  <v-list-tile-content>
                    <v-list-tile-title v-text="'プランの変更'"></v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-avatar>
                    <div v-if="plan==false" class="fs-12 grey--text d-inline-block">
                        <div>フリー</div>
                        <div>¥0 / month</div>
                    </div>
                    <div v-if="plan!=false" class="fs-12 grey--text d-inline-block">
                        <div>{{plan.nickname}}</div>
                        <div>¥{{plan.amount}} / month</div>
                    </div>
                  </v-list-tile-avatar>
                </v-list-tile>
                <v-list-tile   @click="checkout">
                  <v-list-tile-content>
                    <v-list-tile-title v-text="'支払い方法の変更'"></v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-avatar>
                    <p v-if="card==false" class="fs-12 grey--text d-inline-block ">
                        カード情報を登録してください 
                    </p>
                    <div v-if="card!=false" class=" fs-12 grey--text d-inline-block ">
                        <div> Card: **** **** **** {{card.last4}}</div>
                        <div>Expiration: {{card.exp_month}}/{{card.exp_year}}</div>
                        <div>Amount: ¥{{plan.amount}}</div>
                    </div>
                  </v-list-tile-avatar>
                </v-list-tile>
                <v-list-tile   @click="$router.replace('invoices')">
                  <v-list-tile-content>
                    <v-list-tile-title v-text="'お支払い履歴'"></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile   @click="">
                  <v-list-tile-content>
                    <v-list-tile-title v-text="'お申し込みの解約'"></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>

    <vue-stripe-checkout
        ref="checkoutRef"
        :image="image"
        :name = "name"
        :description="description"
        :currency="currency"
        :allow-remember-me="false"
        @done="done"
      ></vue-stripe-checkout>

    <v-dialog v-model="changePlan" max-width="900px">
      <v-card>
        <v-card-text class="text-center">
          <h3 >プランの変更</h3>
          <plans-table ref = "pTable"></plans-table>
          <v-btn flat color="error" @click="changePlanModalHide">Close</v-btn>
          <v-btn flat color="primary"  @click="registPlan">登録する</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="paymentModal" max-width="900px">
      <v-card>
        <v-card-text class="text-center">
          <h3 >プランの変更</h3>
<!--           <v-form class="form-wrapper pt-4 py-5" ref="form" v-model="valid">
          <div class="layout row wrap">
              <v-flex xs12 sm12 md12 lg8 xl8>
                 <div class="layout row wrap">
                    <v-flex xs12 sm12 md6 lg10 xl10>
                       <v-text-field class="mt-0 pt-0" v-model="cardInfo['num']" :rules="inputRules.basictextRules" light label="Card Number" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6 lg10 xl10>
                       <v-text-field class="mt-0 pt-0" v-model="cardInfo['name']" :rules="inputRules.basictextRules" light label="Name" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6 lg3 xl3>
                       <v-text-field class="mt-0 pt-0" v-model="cardInfo['cvv']" :rules="inputRules.basictextRules" light label="CVV" required>
                       </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6 lg3 xl3>
                       <v-text-field class="mt-0 pt-0 pl-4" v-model="cardInfo['date']" :rules="inputRules.basictextRules" light label="Expiry Date(01/10)" required></v-text-field>
                    </v-flex>
                 </div>
               </v-flex>
               <v-flex xs12 sm12 md12 lg3 xl2 hidden-md-and-down d-flex justify-center align-center card-visibility>
                  <img class="atm-img"  src="/static/img/credit-card.png" alt="Credit card" width="128" height="200">
               </v-flex>
              </div>
            </v-form> -->
          <v-btn color="error" @click="paymentModalHide">Close</v-btn>
          <v-btn color="success"  @click="changePayment">登録する</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex'; 
import PlansTable from './PlansTable.vue'

export default {
  components: {
    PlansTable
  },
  data() {
    return {
      changePlan: false,
      deleteUserModal: false,
      paymentModal: false,  
      tableData: [],
      roles:['セールス', 'プランニング', '管理者'],
      user: [],
      card: "",
      valid: false,
      plan: "",
      cardInfo: {
        name: "",
        num: "",
        cvv:"",
        date: ""
      },
      idToken: localStorage.getItem("idToken"),
      inputRules: {
          basictextRules: [v => !!v || 'This field should not be empty.'],
        },

        name: 'Shut up and take my money!',
        image: 'https://i.imgur.com/HhqxVCW.jpg',
        description: 'SPRAY有料プランお申し込み',
        currency: 'JPY',
        amount: 0
    };
  },
  methods: {
    registPlan() {
      if(this.plan != ""){
        axios
          .post(process.env.VUE_APP_API + "/api/v1/subscription", { plan: this.$refs.iTable.selectedPlan.id}, {headers: {'Authorization': 'Bearer ' + this.idToken}})
          .then(response => {
              console.log(response)
              alert("申し込みが完了しました。ありがとうございます")
              this.changePlanModalHide() 
          }).catch(error => {
              console.log(error)
          })
      }
    },
    
    changePayment(){
      if (this.$refs.form.validate()) {
      }
    },
    changePlanModalHide() {
        this.changePlan = false
    },
    paymentModalHide() {
        this.paymentModal = false
    },
    done({token, args}){
      var id_token = localStorage.getItem("idToken")
      axios
        .patch(process.env.VUE_APP_API + "/api/v1/subscription",{stripeToken: token}, {headers: {'Authorization': 'Bearer ' + id_token}})
        .then(response => { 
            alert("変更が登録されました")
            this.$router.push(this.domain + "/dashboard");
        }).catch(error => {
            console.log(error.response.data.errors)
        })
    },
    async checkout () {
      this.amount = this.plan.amount
      const { token, args } = await this.$refs.checkoutRef.open();
    }
  },
  computed: {
    ...mapState({
        org: state => state.org.orgInfo
    })
  },
  created() {
    axios
      .get(process.env.VUE_APP_API + "/api/v1/subscription", {headers: {'Authorization': 'Bearer ' + this.idToken}})
      .then(response => { 
        console.log(response)
          if(response.status == 204) {
              this.plan = false
          } else {
            console.log(response.data)
              this.plan = response.data.plan
              this.card = response.data.card.data[0]
              this.selectedPlan = this.plan.id
              
          }
      }).catch(error => {
          console.log(error)
      })

  },
}

</script>
<style lang="scss" scoped>
  .v-card{
    -webkit-box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 0px 0px rgba(0,0,0,0.12);
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 0px 0px rgba(0,0,0,0.12);
    text-decoration: none;
  }
  .v-avatar{
    width: 300px !important;
  }

</style>
