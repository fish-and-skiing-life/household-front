import Vue from 'vue'
import Router from 'vue-router'

//routes
import defaultRoutes from './default';
import householdRoutes from './household';
import otherRoutes from './other';


const StartUp = () => import('Views/session/StartUp')
const Top = () => import('Views/Top');

const Auth0CallBack = () => import('Components/Auth0Callback/Auth0Callback');

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
	     {
			path: '/',
			component: Top,
            meta: {
              requiresAuth: false,
              breadcrumb: null
            }
        },
		{
			path: '/callback',
			component: Auth0CallBack
		},
		{
          path: '/startup',
          name: 'startup',
          component: StartUp,
          meta: { requiresAuth: true }
        },
		defaultRoutes,
		householdRoutes,
		otherRoutes
	]
})
