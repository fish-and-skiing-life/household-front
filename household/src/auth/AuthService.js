import auth0 from 'auth0-js'
import { AUTH_CONFIG } from './auth0-variables'
import EventEmitter from 'eventemitter3'
import router from '../router'
import { store } from '../store/store';
import axios from 'axios';


class AuthService {
    


  constructor() {
    this.login = this.login.bind(this)
    this.setSession = this.setSession.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.authenticated = this.isAuthenticated()
    this.authNotifier = new EventEmitter()
    this.auth0 = new auth0.WebAuth({
      domain: AUTH_CONFIG.domain,
      clientID: AUTH_CONFIG.clientId,
      redirectUri: AUTH_CONFIG.callbackUrl,
      audience: `https://${AUTH_CONFIG.domain}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid'
    })
    this.idToken = null;
    this.profile = null;
    this.tokenExpiry = null;
  }

  login() {
    this.auth0.authorize()
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.idToken = authResult.idToken;
        this.profile = authResult.idTokenPayload;
        this.setSession(authResult)
        var idToken = localStorage.getItem("idToken")
        console.log('hoge')
        axios
          .post( process.env.VUE_APP_API_ENDPOINT +  "/api/v1/callback",{}, {headers: {'Authorization': 'Bearer ' + idToken}})
          .then(response => { 
            localStorage.setItem("name", response.data.path);
            router.replace(response.data.path + "/dashboard");
            
          }).catch(error => {
            router.replace(error.response.data.path);
          })
        // router.replace('/default/dashboard/ecommerce')
      } else if (err) {
        router.replace('/')
        console.log(err)
        alert(`Error: ${err.error}. Check the console for further details.`)
      }
    })
  }
  renewTokens() {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(localStorageKey) !== "true") {
        return reject("Not logged in");
      }

      webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          reject(err);
        } else {
          this.isAuthenticated();
          resolve(authResult);
        }
      });
    });
  }

  setSession(authResult) {

    store.dispatch('signInUserWithAuth0', authResult)
    localStorage.setItem('isUserSigninWithAuth0', true)
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('idToken', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    this.authNotifier.emit('authChange', { authenticated: true })
  }

  logout() {
    store.dispatch('signOutUserFromAuth0')
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    this.userProfile = null
    this.authNotifier.emit('authChange', false)
    // navigate to the home route
    // router.push('/session/login')
    router.push('/')
  }

  localLogin(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    
    var idToken = localStorage.getItem("idToken")
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    store.dispatch('user/fetchUser', idToken)
    return new Date().getTime() < expiresAt
  }
}

export default AuthService;