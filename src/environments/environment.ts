export const environment = {
  production:true,
  HOST: 'https://civime.ejercito.mil.pe/backend-civime',
  TOKEN_NAME: 'access_token',
  RETRY: 0,
  recaptcha: {
    siteKey: '6LfI0x8rAAAAAEtT4BAR-38Eit53h8o1xcIRDOAl',
  },
  allowedDomains: ['civime.ejercito.mil.pe'],  // Dominio permitido en producción
  disallowedRoutes: ['https://civime.ejercito.mil.pe/backend-civime/login/forget'],
};
