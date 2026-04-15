export const environment = {
  production:false,
  HOST: 'http://localhost:8080/backend-civime',
  /** Supabase: pegue aquí la URL del proyecto y la clave anon (Settings → API). */
  supabase: {
    url: 'https://dembesfhitqqeitfiwbz.supabase.co',
    anonKey: 'sb_publishable_Si4HXe2P_uTRjJw8nTq2ig_J2CZKsYr',
    publicidadBucket: 'publicidad',
    cursosBucket: 'cursos'
  },
  TOKEN_NAME: 'access_token',
  RETRY: 0,
  recaptcha: {
    siteKey: '6LfI0x8rAAAAAEtT4BAR-38Eit53h8o1xcIRDOAl',
  },

  allowedDomains: ['localhost:8080'],
  disallowedRoutes: ["http://localhost:8080/backend-civime/login/forget"]


  //civime
  //Peru$civime



};
