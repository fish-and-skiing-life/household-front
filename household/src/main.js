/**
 * App Entry File
 * Vuely: A Powerfull Material Design Admin Template
 * Copyright 2018. All Rights Reserved
 * Created By: The Iron Network, LLC
 * Made with Love
 */
import 'babel-polyfill';
import Vue from 'vue'
import Vuetify from 'vuetify'
import * as VueGoogleMaps from 'vue2-google-maps'
import { Vue2Dragula } from 'vue2-dragula'
import VueQuillEditor from 'vue-quill-editor'
import wysiwyg from 'vue-wysiwyg'
import VueBreadcrumbs from 'vue2-breadcrumbs'
import VueResource from 'vue-resource'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import AmCharts from 'amcharts3'
import AmSerial from 'amcharts3/amcharts/serial'
import AmAngularGauge from 'amcharts3/amcharts/gauge'
import Nprogress from 'nprogress'
import VueI18n from 'vue-i18n'
import VueTour from 'vue-tour'
import fullscreen from 'vue-fullscreen'
import InstantSearch from 'vue-instantsearch'
import VueVideoPlayer from 'vue-video-player';
import VueStripeCheckout from 'vue-stripe-checkout';
import Croppa from 'vue-croppa';

// global components
import GlobalComponents from './globalComponents'

// app.vue
import App from './App'

// router
import router from './router'

// themes
import primaryTheme from './themes/primaryTheme';

// store
import { store } from './store/store';


// include script file
import './lib/VuelyScript'

// include all css files
import './lib/VuelyCss'

// messages
import messages from './lang';

// navigation guards before each
router.beforeEach((to, from, next) => {
	Nprogress.start()
	next() // make sure to always call next()!
})

// navigation guard after each
router.afterEach((to, from) => {
	Nprogress.done()
	setTimeout(() => {
		const contentWrapper = document.querySelector(".v-content__wrap");
		if(contentWrapper !== null){
			contentWrapper.scrollTop = 0;
		}
		const boxedLayout = document.querySelector('.app-boxed-layout .app-content');
		if(boxedLayout !==  null){
			boxedLayout.scrollTop = 0;
		}
		const miniLayout = document.querySelector('.app-mini-layout .app-content');
		if(miniLayout !== null){
			miniLayout.scrollTop = 0;
		}
	}, 200);
})

import jQuery from 'jquery'
global.jquery = jQuery
global.$ = jQuery
window.$ = window.jQuery = require('jquery')



// plugins
Vue.use(Vuetify, {
	theme: store.getters.selectedTheme.theme
});
Vue.use(InstantSearch);
Vue.use(VueI18n)
Vue.use(AmCharts)
Vue.use(AmSerial)
Vue.use(VueTour)
Vue.use(AmAngularGauge)
Vue.use(Vue2Dragula)
Vue.use(VueQuillEditor)
Vue.use(VueResource)
Vue.use(wysiwyg, {
    forcePlainTextOnPaste: true,
    hideModules: {
        "table": true,
        "headings": true
    }
})
Vue.use(VueBreadcrumbs)
Vue.use(Notifications, { velocity })
Vue.use(fullscreen);
Vue.use(GlobalComponents);
Vue.use(VueVideoPlayer);
Vue.use(Croppa);
Vue.use(VueStripeCheckout, 'pk_test_IxOMJWmdNJCjhpFmnAQznHUI00Mz663aFT')
Vue.use(VueGoogleMaps, {
	load: {
		key: 'AIzaSyBtdO5k6CRntAMJCF-H5uZjTCoSGX95cdk' // Add your here your google map api key
	}
})

// Create VueI18n instance with options
const i18n = new VueI18n({
	locale: store.getters.selectedLocale.locale, // set locale
	messages, // set locale messages
})

new Vue({
  el: '#app',
  //components: {App}
  store,
  i18n,
  router,
  render: h => h(App)
})






