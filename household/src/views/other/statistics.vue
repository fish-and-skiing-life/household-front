<template>
    <div>
      <page-title-bar></page-title-bar>
        <v-container fluid pt-0 grid-list-xl>
            <v-layout row wrap>
                <!-- Devices Share -->
                <app-card
                    colClasses="xs6"
                    :heading="now_month + 'の集計'"
                    :fullScreen="true"
                    :reloadable="true"
                    :closeable="true"
                    customClasses="device-share-widget"
                >
                  <v-layout row wrap>
                    <v-flex xs2>
                      <v-text-field  v-model="target_month" ></v-text-field>
                    </v-flex>
                    <v-flex xs1 class="px-0">
                      <v-btn flat color="primary " class="pt-3 px-0" @click="changeMonth">変更</v-btn>
                    </v-flex>
                  </v-layout>
                  <device-share :data="monthData" :total="month_total"></device-share>
                </app-card>
                <app-card
                    :heading="now_year + 'の集計'"
                    colClasses="xs6"
                    :fullScreen="true"
                    :reloadable="true"
                    :closeable="true"
                    customClasses="device-share-widget"
                >
                  <v-layout row wrap>
                    <v-flex xs2>
                      <v-text-field  v-model="target_year" ></v-text-field>
                    </v-flex>
                    <v-flex xs1 class="px-0">
                      <v-btn flat color="primary " class="pt-3 px-0" @click="changeYear">変更</v-btn>
                    </v-flex>
                  </v-layout>
                    <device-share :data="yearData" :total="year_total"></device-share>
                </app-card>
            </v-layout>

        </v-container>
    </div>
</template>

<script>
import AuthService from "@/auth/AuthService";
import DeviceShare from "Components/Widgets/DeviceShare";
import moment from 'moment';
import { ChartConfig } from "Constants/chart-config";
import axios from 'axios';

const auth = new AuthService();
const { login, logout, authenticated, authNotifier } = auth;
export default {
  components: {
    DeviceShare
  },
  data() {
    return {
      idToken: localStorage.getItem("idToken"),
      userId: this.$route.params.id,
      expense: {},
      month_households: [],
      year_households: [],
      backgroundColor: [
        ChartConfig.color.primary,
        ChartConfig.color.success,
        ChartConfig.color.warning,
        ChartConfig.color.info,
        '#AA5294',
        '#0E68BD',
        'FA778E'
      ],
      month_total: 0,
      year_total: 0,
      monthData :{},
      yearData :{},
      detailMonthData: [],
      detailMonthLabels: [],
      detailYearData:[],
      detailYearLabels:[],
      now_month: moment().format('YYYY年M月'),
      now_year: moment().format('YYYY年'),
      target_month: moment().format('YYYY/MM'),
      target_year: moment().format('YYYY')
    };
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

    var month_started_at = moment().startOf('month').format('YYYY/MM/DD')
    var month_ended_at = moment().endOf('month').format('YYYY/MM/DD')
    var year_started_at = moment().startOf('year').format('YYYY/MM/DD')
    var year_ended_at = moment().endOf('year').format('YYYY/MM/DD')

    this.getPeriodData(month_started_at, month_ended_at)
      .then(response => {
        this.month_households  =  response
        var month = this.formatPieData(response)
        this.monthData = month.piData
        this.month_total = month.total
      })

    this.getPeriodData(year_started_at, year_ended_at)
      .then(response => {
        this.year_households  =  response
        var year = this.formatPieData(response)
        this.yearData = year.piData
        this.year_total = year.total
      })
  },
  methods: {
    formatDetailInfo(households){
      this.detailLabels = []
      this.detailCharData = []

      var diff = moment(this.storeImpactReport.ended_at).diff(this.storeImpactReport.started_at, 'months')
      var created_dict = {}
      var months = 0
      var all = 0
      for(let k of Object.keys(beneficiaries)) {
        var key = moment(beneficiaries[k].created_at).format('YYYY-M')
        if(created_dict[key]){
          created_dict[key] += 1
        }else{
          created_dict[key] = 1
        }
      }
      while( months < diff){
        var now = moment(this.storeImpactReport.started_at).add(months, 'month')
        var month = moment(this.storeImpactReport.started_at).add(months, 'month').format('YYYY-M')
        this.labels.push(now.format('YYYY-MM'))
        if(created_dict[month]){
          all += created_dict[month]
          if (this.before_date(month)) {
            this.charData.push(all)
            this.afterCharData.push(0)
          }else{
            this.afterCharData.push(all)
          }     
        }else{
          if (this.before_date(month)) {
            this.charData.push(all)
            this.afterCharData.push(0)
          }else{
            this.afterCharData.push(all)
          } 
        }
        months += 1
      }
    },
    changeMonth(){
      var target = this.target_month.split('/')
      var started_at = moment({year: target[0], month: Number(target[1] -1)}).startOf('month').format('YYYY/MM/DD')
      var ended_at = moment({year: target[0], month: Number(target[1] -1 )}).endOf('month').format('YYYY/MM/DD')
      this.getPeriodData(started_at, ended_at)
      .then(response => {
        this.month_households  =  response
        var month = this.formatPieData(response)
        this.monthData = month.piData
        this.month_total = month.total
      })
    },
    changeYear(){
      var started_at = moment({year: this.target_year}).startOf('year').format('YYYY/MM/DD')
      var ended_at = moment({year: this.target_year}).endOf('year').format('YYYY/MM/DD')
      this.getPeriodData(started_at, ended_at)
      .then(response => {
        this.year_households  =  response
        var yaer = this.formatPieData(response)
        this.yearData = yaer.piData
        this.year_total = yaer.total
      })
    },
    async getPeriodData(start, end){
      var userId = this.$route.params.id
      var idToken = localStorage.getItem("idToken")
      return new Promise(function(resolve, reject) {
        axios
        .get(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + userId + "/list_period?started_at=" + start + "&ended_at=" + end, {headers: {'Authorization': 'Bearer ' + idToken}})
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    formatPieData(yearData){
      var piData = {labels: [],data:[],backgroundColor:[]}
      var total = 0
      var data = {}
      for(let k of Object.keys(yearData)) {
        if(Object.keys(data).indexOf(String(yearData[k]['expense_id'])) === -1){
          data[yearData[k]['expense_id']] = yearData[k]['price']
        }else{
          data[yearData[k]['expense_id']] += yearData[k]['price']
        }
      }

      for(let k of Object.keys(data)){
        piData.labels.push(this.getExpense(Number(k)))
        piData.data.push(data[k])
        total += data[k]
        var index = Object.keys(data).indexOf(k)
        if(index <= (this.backgroundColor.length -1)){
          piData.backgroundColor.push(this.backgroundColor[index])
        }else{
          index -= (this.backgroundColor.length -1)
          while(index > (this.backgroundColor.length -1)){
            index -= (this.backgroundColor.length -1)
          }
          piData.backgroundColor.push(this.backgroundColor[index])
        }
      }
      return {piData , total}
    },
    getExpense: function(id){
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

  },
  watch: {
    expense(val){
      var month = this.formatPieData(this.month_households)
      this.monthData = month.piData
      this.month_total = month.total
      var year = this.formatPieData(this.year_households)
      this.yearData = Object.assign({},year.piData)
      this.year_total = year.total
    }
   }
};
</script>
<style scoped lang="scss">
  .pt-3{
    padding-top: 15px !important;
  }
  .px-0{
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
</style>
