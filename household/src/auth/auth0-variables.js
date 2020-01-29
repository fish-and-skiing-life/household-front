export const AUTH_CONFIG = {
  clientId: '5DBgj0XDtbpKetjkxFDPN8VE49EnHN3T',
  domain: 'household.auth0.com',
  callbackUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/callback' : 'http://localhost:8080/callback',
  apiUrl: 'API_IDENTIFIER'
}
