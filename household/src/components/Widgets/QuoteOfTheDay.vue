<!-- Quote Of The Day Widget -->
<template>
	<div class="pa-4 quote-wrapper">
		<app-section-loader :status="loaderStatus"></app-section-loader>
		<slick :options="slickOptions" v-if="!loaderStatus">
			<div v-for="quotes in quotesOfTheDay" :key="quotes.id">
				<div class="text-center px-4 py-3">
					<div class="avatar-wrap mb-5 pos-relative d-inline-block">
						<img :src="quotes.avatar" class="img-responsive rounded-circle mx-auto" alt="reviwers" width="80" height="80">
						<span class="quote-icon primary--text">
	              		<i class="zmdi font-3x zmdi-quote zmdi-hc-rotate-180"></i>
	            	</span>
					</div>
					<div class="quote-content">
						<h6 class="mb-4">{{quotes.author}}</h6>
						<p>{{quotes.body}}</p>
					</div>
				</div>
			</div>
		</slick>
	</div>
</template>

<script>
	import Slick from "vue-slick";
	import api from "Api";
	
	export default {
		data() {
			return {
				loaderStatus: false,
				quotesOfTheDay: null
			};
		},
		mounted() {
			this.getQuotesOfTheDay();
		},
		computed: {
			slickOptions() {
				return {
					dots: true,
					infinite: true,
					speed: 500,
					slidesToShow: 1,
					slidesToScroll: 1,
					autoplay: true,
					arrows: false,
					rtl: this.$store.getters.rtlLayout
				};
			}
		},
		methods: {
			getQuotesOfTheDay() {
				this.loaderStatus = false;
                var json_str = '[{"id":1,"author":"John Doe","avatar":"/static/avatars/user-6.jpg","date":"Yesterday","body":"Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. I thought back to my own angry youth, when I could easily use words to justify violent thoughts which might have become violent actions.Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. "},{"id":2,"author":"Shelby Caldwell","avatar":"/static/avatars/user-7.jpg","date":"10 min ago","body":"Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. I thought back to my own angry youth, when I could easily use words to justify violent thoughts which might have become violent actions.Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. "},{"id":3,"author":"Beau Salinas","avatar":"/static/avatars/user-8.jpg","date":"Yesterday","body":"Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. I thought back to my own angry youth, when I could easily use words to justify violent thoughts which might have become violent actions. Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others."},{"id":4,"author":"Kelsey Beck","avatar":"/static/avatars/user-9.jpg","date":"Yesterday","body":"Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. I thought back to my own angry youth, when I could easily use words to justify violent thoughts which might have become violent actions.Watching the news the other day, it occurred to me that people who have “words to live by” often begin to attack and even kill others. "}]'
                this.quotesOfTheDay = JSON.parse(json_str);
			}
		},
		components: {
			Slick
		}
	};
</script>
