<template>
  <v-app
	:dark="darkMode"
	id="inspire"
	:class="[{ 
		'box-layout': boxLayout, 
		'collapse-sidebar': collapseSidebar, 
		'rtl-layout': rtlLayout
	}]"
  > 
      <router-view :auth="auth" :authenticated="authenticated"></router-view>
      <notifications 
        group="loggedIn" 
        position="top right"
        animation-type="velocity"
      />
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

import AuthService from "@/auth/AuthService";
const auth = new AuthService();
const { login, logout, authenticated, authNotifier  ,renewTokens} = auth;

export default {
  data () {
    return {
        auth,
        authenticated,
        logout 
    }
  },
  async created() {
        try {
            await renewTokens
        } catch (e) {
            console.log(e);
        }
    },
  methods: {

  },
  mounted() {
    if (
      this.selectedLocale.locale === "he" ||
      this.selectedLocale.locale === "ar"
    ) {
      this.$store.dispatch("rtlLayout");
    }
  },

  computed: {
    ...mapGetters([
      "darkMode",
      "collapseSidebar",
      "boxLayout",
      "rtlLayout",
      "selectedLocale"
    ])
  }
};
</script>
