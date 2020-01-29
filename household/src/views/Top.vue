
<template>
  <div>
    <v-container fluid pt-0 grid-list-xl>
      <div v-if="!authenticated">
          <a href="#" @click.prevent="signinWithAuth0">Login</a>
      </div>
      <div v-if="authenticated">
          <a href="#" @click.prevent="logoutWithAuth0">Logout</a>
      </div>
      <h2>{{ authenticated }}</h2>
      <h1>{{ msg }}</h1>
      <h2>Before start app, you need signup or logins</h2>
    </v-container>
  </div>
</template>


<script>

import AuthService from "@/auth/AuthService";

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
      msg: 'Welcome to House Hold'
    }
  },
  methods: {
   signinWithAuth0() {
     login();
   },
   logoutWithAuth0() {
     logout();
   }
  },
  mounted: function() {
   console.log("sample")
   console.log(process.env.VUE_APP_API)
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

</style>
