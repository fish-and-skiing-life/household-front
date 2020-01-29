<template>
    <div>
        <v-container fluid pt-0 grid-list-xl>
            <v-layout row wrap>
                <!-- Devices Share -->
                <app-card
                    colClasses="xs7"
                    :fullScreen="true"
                    :reloadable="true"
                    :closeable="true"
                    customClasses="device-share-widget"
                >
                    <device-share :data="monthData" :total="month_total"></device-share>
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
      monthData :{
        labels: [],
        data: [],
        backgroundColor: []
      },
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

    axios
    .get(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + this.userId + "/list_period?started_at=" + month_started_at + "&ended_at=" + month_ended_at, {headers: {'Authorization': 'Bearer ' + this.idToken}})
    .then(response => {
      console.log(response)
      this.month_households = response.data
      this.formatMonthData(response.data)
    }).catch(error => {
      console.log(error)
    })

    axios
    .get(process.env.VUE_APP_API_ENDPOINT + "/api/v1/users/" + this.userId + "/list_period?started_at=" + year_started_at + "&ended_at=" + year_ended_at, {headers: {'Authorization': 'Bearer ' + this.idToken}})
    .then(response => {
      console.log(response)
      this.year_households = response.data
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    formatMonthData(monthData){
      this.monthData = {labels: [],data:[],backgroundColor:[]}
      var data = {}
      for(let k of Object.keys(monthData)) {
        if(Object.keys(data).indexOf(String(monthData[k]['expense_id'])) === -1){
          data[monthData[k]['expense_id']] = monthData[k]['price']
        }else{
          data[monthData[k]['expense_id']] += monthData[k]['price']
        }
      }

      for(let k of Object.keys(data)){
        this.monthData.labels.push(this.getExpense(Number(k)))
        this.monthData.data.push(data[k])
        this.month_total += data[k]
        var index = Object.keys(data).indexOf(k)
        if(index <= (this.backgroundColor.length -1)){
          this.monthData.backgroundColor.push(this.backgroundColor[index])
        }else{
          index -= (this.backgroundColor.length -1)
          while(index > (this.backgroundColor.length -1)){
            index -= (this.backgroundColor.length -1)
          }
          this.monthData.backgroundColor.push(this.backgroundColor[index])
        }
      }
      this.monthData = Object.assign({}, this.monthData)
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
      this.formatMonthData(this.month_households)
    }
   }
};
</script>
