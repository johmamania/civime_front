export interface ProgramaItem {
  titulo?: string;
  codigo: string;
  descripcion: string;
  ruta: string;
}

/** Cursos de portada y submenú CURSOS (misma lista). */
export const CURSOS_PORTADA: ProgramaItem[] = [
  {
    titulo: 'Ingles',
    codigo: 'EN',
    descripcion:
      'Idioma global para investigacion, negocios y comunicacion internacional.',
    ruta: '/inicio'
  },
  {
    titulo: 'Portugues',
    codigo: 'PT',
    descripcion:
      'Tercer idioma mas hablado en las Americas y clave para comercio en Sudamerica.',
    ruta: '/inicio'
  },
  {
    titulo: 'Frances',
    codigo: 'FR',
    descripcion:
      'Lengua de diplomacia, cultura y educacion en Europa y en multiples organismos internacionales.',
    ruta: '/inicio'
  },
  {
    titulo: 'Aleman',
    codigo: 'DE',
    descripcion:
      'Clave en ciencia, industria y economia en Europa central; idioma de alto valor academico y profesional.',
    ruta: '/inicio'
  },
  {
    titulo: 'Italiano',
    codigo: 'IT',
    descripcion:
      'Idioma de gran valor cultural y academico, altamente demandado en estudios internacionales.',
    ruta: '/inicio'
  },
  {
    titulo: 'Chino Mandarin',
    codigo: 'ZH',
    descripcion:
      'El idioma con mas hablantes nativos del mundo; ventaja para comercio, tecnologia y vinculos con Asia.',
    ruta: '/inicio'
  },
  {
    titulo: 'Quechua',
    codigo: 'QU',
    descripcion:
      'Lengua originaria viva del Peru y los Andes; fortalece identidad cultural y comunicacion regional.',
    ruta: '/inicio'
  }
];
