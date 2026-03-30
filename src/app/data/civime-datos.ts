/**
 * Datos institucionales del CIVIME (Centro de Idiomas).
 * Un solo origen para portada, cabecera y pie.
 */
export const CIVIME_DATOS = {
  nombreCorto: 'CIVIME',
  nombreLargo: 'CIVIME — Centro de Idioma Virgen de las Mercedes',
  /** Texto corto para marca / meta. */
  descripcion:
    'Centro de Idiomas Virgen   de las Mercedes. Cursos de idiomas con modalidad presencial y virtual.',
  correo: '',
  correoInformes: 'informes@civime.edu.pe',
  /** Dominio público (sin protocolo) para mostrar en cabecera. */
  dominioWeb: 'civime.edu.pe',
  telefono: '(01) 219-0600',
  /** Vacío si no aplica; ej. "3188 — 3189". */
  anexos: '',
  /** Av. Arequipa, corazón del centro de Lima (Cercado). */
  direccion: 'Av. Arequipa 1080',
  distrito: 'Cercado de Lima',
  ciudad: 'Lima',
  pais: 'Perú',
  horarioAtencion: 'Lunes a viernes: 08:00 — 16:00'
} as const;
