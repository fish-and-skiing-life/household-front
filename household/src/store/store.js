import Vue from 'vue'
import Vuex from 'vuex'

// modules
import auth from './modules/auth';
import settings from './modules/settings';
import ecommerce from './modules/ecommerce';
import user from './modules/user';
import sidebar from './modules/sidebar';

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production'
export const store = new Vuex.Store({
    modules: {
        auth,
        settings,
        ecommerce,
        user: user,
        sidebar,
    },
    strict: debug,
})
