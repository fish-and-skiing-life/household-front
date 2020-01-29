<!-- Device Share Widget -->
<template>
   <div class="device-share-wrap">
      <div class="mb-10 pos-relative">
         <doughnut-chart-v2
            :height="240"
            :data="data"
         >
         </doughnut-chart-v2>
         <div class="overlay-content d-custom-flex justify-center align-items-center">
            <span class="grey--text font-2x fw-semi-bold">￥{{ formated_data(total)}}</span>
         </div>
      </div>
   </div>
</template>

<script>
import DoughnutChartV2 from "../Charts/DoughnutChartV2";
import numeral from "numeral";

// constants
import { ChartConfig } from "Constants/chart-config";
import { devicesShare } from "../../views/dashboard/data";

export default {
   components: {
      DoughnutChartV2
   },
   props:{
      data: Object,
      total: Number
   },
   data() {
      return {
         ChartConfig,
         devicesShare
      };
   },
   methods: {
      formated_data(val){
         return numeral(Number(val)).format('0,0')
      }
   }
};
</script>