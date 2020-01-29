// Sales Widget
import { Bar } from 'vue-chartjs'
import { ChartConfig } from "Constants/chart-config";

export default ({
   extends: Bar,
   props: {
     labels: [],
     charDatas: [],
     afterCharData: []
   },
   data: function () {
      return {
         options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
               yAxes: [{
                  stacked: true,
                  ticks: {
                     display: false
                  },
                  gridLines: {
                     display: false,
                     drawBorder: false
                  }
               }],
               xAxes: [{
                  stacked: true,
                  ticks: {
                     padding: 10
                  },
                  barPercentage: 0.4,
                  categoryPercentage: 1.3,
                  gridLines: {
                     display: false,
                     drawBorder: false
                  }
               }]
            },
            legend: {
               display: false
            }
         }
      }
   },
   mounted() {
      this.renderChart({
         labels: this.labels,
         datasets: [
            {
               type: 'bar',
               label: 'Earned',
               backgroundColor: ChartConfig.color.primary,
               hoverBackgroundColor: ChartConfig.color.primary,
               borderWidth: 0,
               data: this.charDatas
            },
            {
               type: 'bar',
               label: 'Earned',
               backgroundColor: ChartConfig.color.lineChartAxesColor,
               hoverBackgroundColor: ChartConfig.color.lineChartAxesColor,
               borderWidth: 0,
               data: this.afterCharData
            }
         ]
      }, this.options)
   },
   watch: {
    labels(val){
      this.renderChart({
         labels: this.labels,
         datasets: [
            {
               type: 'bar',
               label: 'Earned',
               backgroundColor: ChartConfig.color.primary,
               hoverBackgroundColor: ChartConfig.color.primary,
               borderWidth: 0,
               data: this.charDatas
            },
            {
               type: 'bar',
               label: 'Views',
               backgroundColor: ChartConfig.color.lineChartAxesColor,
               hoverBackgroundColor: ChartConfig.color.lineChartAxesColor,
               borderWidth: 0,
               data: this.afterCharData
            }
         ]
      }, this.options)
    }
   }
})
