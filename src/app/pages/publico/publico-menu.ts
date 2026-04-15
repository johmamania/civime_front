import { CURSOS_PORTADA } from '../../data/cursos-portada';

export interface SubMenuItem {
  label: string;
  route: string;
  fragment?: string;
}

export interface MenuItem {
  label: string;
  route?: string;
  submenus?: SubMenuItem[];
}

export function buildPublicMenuItems(): MenuItem[] {
  return [
    { label: 'INICIO', route: '/inicio' },
    {
      label: 'NOSOTROS',
      submenus: [
        { label: 'Nosotros', route: '/nosotros' },
        { label: 'Misión', route: '/nosotros', fragment: 'mision' },
        { label: 'Visión', route: '/nosotros', fragment: 'vision' }
      ]
    },
    { label: 'CURSOS', route: '/cursos' },
    /*
    {
      label: 'CURSOS',
      submenus: CURSOS_PORTADA.map((p) => ({
        label: p.titulo,
        route: p.ruta
      }))
    },*/
    /*
    {
      label: 'CURSOS VIRTUALES',
      submenus: [{ label: 'Cursos Virtuales', route: '/inicio' }]
    },
    {
      label: 'CURSOS EXTRACURRICULARES',
      submenus: [{ label: 'Cursos Extracurriculares', route: '/inicio' }]
    },*/
    {
      label: 'MATRÍCULAS',
      submenus: [
        { label: 'Tipos de matrícula', route: '/matriculas' },
        { label: 'Nueva matrícula', route: '/matricula-nuevo-registro', fragment: 'matricula' }
      ]
    },
    { label: 'CONTACTENOS', route: '/contacto' },
    { label: 'Login Admin', route: '/administracion' }
  ];
}
