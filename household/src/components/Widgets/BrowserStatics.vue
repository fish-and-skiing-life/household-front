<template>
   <div class="browser-statics-wrapper">
		<div class="grayish-blue d-custom-flex justify-space-between pa-4">
			<div class="white--text">
				<h1 class="mb-0">{{formated_num(sumImpact)}}万円</h1>
				<p class="mb-0 fs-14">Current Impact</p>
			</div>
			<div class="pr-4">
				<i class="zmdi font-3x success--text zmdi-accounts"></i>
			</div>
		</div>
		<v-list>
			<v-list-tile v-for="item in browserData">
				<div>
					<h6>{{item.title}}</h6>
				</div>
				<div class="justify-space-between">
					<span class="fw-light">{{formated_num(item.impact)}}万</span>
					<h6 class="primary--text">{{formated_rate(item.impact)}}%</h6>
				</div>
			</v-list-tile>
		</v-list>
	</div>
</template>
<script>
import numeral from "numeral";
export default {
  components: {},
  props: {
     sumImpact: 0,
     browserData: []
   },
  data: function() {
    return {
      blog: {
        id: 3,
        thumbnail: "/static/img/blog-3.jpg",
        title: "lorem ipsum is simply dummy text",
        body:
          "Consectetur adipisicing elit. Ullam expedita, necessitatibus sit exercitationem aut quo quos inventore similique nulla minima distinctio illo iste dignissimos vero nostrum, magni pariatur delectus natus.",
        date: "1-jun-2018"
      },
    };
  },
  methods: {
  	formated_num(num){
  		return numeral(num/1000).format('0,0')
  	},
  	formated_rate(num){
  		return numeral(num/ this.sumImpact * 100).format('0.0')
  	}
  },
  mounted() {
  	console.log(this.browserData)
  	for(let row in this.browserData){
  		console.log(row)
  	}
  },
  watch: {
  	browserData(val){
  	  for(let row in this.browserData){
  		console.log(row)
  	  }
  	}
  }
};
</script>
