<template>
  <div class="session-wrapper">
    <div class="pt-80 text-xs-center">
      <div class="session-table-cell">
        <div class="session-content">
          <img 
            :src="appLogo"
            class="img-responsive mb-3" 
            width="78" 
            height="78" 
          />
          <h2 class="mb-3">家計簿アプリ　House Hold へようこそ</h2>
          <v-container fluid pt-0 grid-list-xl>
            <div v-if="!authenticated">
                <a href="#" @click.prevent="signinWithAuth0">Login</a>
            </div>
            <div v-if="authenticated">
                <a href="#" @click.prevent="logoutWithAuth0">Logout</a>
            </div>
          </v-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import AuthService from "@/auth/AuthService";
import AppConfig from "Constants/AppConfig";

const auth = new AuthService();
const { login, logout, authenticated, authNotifier } = auth;

export default {
  name: 'HelloWorld',
  data () {
    authNotifier.on("authChange", authState => {
      this.authenticated = authState.authenticated
    })
    return {
      authenticated,
      appLogo: AppConfig.appLogo2,
    }
  },
  methods: {
   signinWithAuth0() {
     login();
   },
   logoutWithAuth0() {
     logout();
   }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hello {
    text-align: center
}
.pt-80{
  padding-top:  80px;
}

</style>
