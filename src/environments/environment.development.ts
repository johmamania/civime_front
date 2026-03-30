export const environment = {
  production:false,
  HOST: 'http://localhost:8080/backend-civime',
  TOKEN_NAME: 'access_token',
  RETRY: 0,
  recaptcha: {
    siteKey: '6LfI0x8rAAAAAEtT4BAR-38Eit53h8o1xcIRDOAl',
  },

  allowedDomains: ['localhost:8080'],
  disallowedRoutes: ["http://localhost:8080/backend-civime/login/forget"]


};
