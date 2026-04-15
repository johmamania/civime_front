import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CIVIME_DATOS } from '../../../data/civime-datos';
import {
  CURSOS_PORTADA,
  type ProgramaItem
} from '../../../data/cursos-portada';
import { PublicidadApiService } from '../../../services/publicidad-api.service';
import { CursosComponent } from '../cursos/cursos.component';

interface PublicidadItem {
  titulo?: string;
  descripcion: string;
  img: string;
}

interface SedePrincipal {
  titulo: string;
  lineas: string[];
  img: string;
  imgAlt: string;
}

/** Intervalo entre cambios de publicidad en el hero (ms). */
const PUBLICIDAD_ROTACION_MS = 5000;

/** Imágenes y textos locales si el backend no responde o no hay activas. */
const PUBLICIDADES_PREDETERMINADAS: PublicidadItem[] = [
  {
    titulo: 'Matricula abierta para todos los niveles',
    descripcion:
      'Inscribete hoy y elige modalidad online o presencial en el centro de Lima.',
    img: 'assets/images/publicidad/image1.png'
  },
  {
    titulo: 'Nuevos horarios virtuales y presenciales',
    descripcion:
      'Consulta fechas flexibles y el programa que mejor se adapte a tu rutina.',
    img: 'assets/images/publicidad/image2.png'
  },
  {
    titulo: 'Examenes de clasificacion disponibles',
    descripcion:
      'Evalua tu nivel y ubicate en el grupo adecuado antes de iniciar clases.',
    img: 'assets/images/publicidad/image3.png'
  },
  {
    titulo: 'Sede principal de Lima',
    descripcion:
      'Visitanos en el centro de la ciudad; te atendemos con gusto.',
    img: 'assets/images/publicidad/civime_sede.jpg'
  }
];

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule, CursosComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  animations: [
    trigger('publicidadImagen', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('380ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class InicioComponent implements OnInit, OnDestroy {
  private readonly publicidadApi = inject(PublicidadApiService);
  private readonly route = inject(ActivatedRoute);
  private fragmentSub?: Subscription;

  /** Misma lista que el submenú CURSOS (puede cargarse desde backend). */
  programas: ProgramaItem[] = CURSOS_PORTADA;

  /** Única sede principal (datos alineados con `CIVIME_DATOS`). */
  sedePrincipal: SedePrincipal = {
    titulo: `${CIVIME_DATOS.ciudad} — ${CIVIME_DATOS.distrito} (sede principal)`,
    lineas: [
      `${CIVIME_DATOS.direccion} — ${CIVIME_DATOS.distrito} (centro de Lima)`,
      CIVIME_DATOS.anexos
        ? `Teléfono: ${CIVIME_DATOS.telefono} · Anexos ${CIVIME_DATOS.anexos}`
        : `Teléfono: ${CIVIME_DATOS.telefono}`
    ],
    img: 'assets/images/civime_sede.jpg',
    imgAlt: `Sede principal ${CIVIME_DATOS.nombreLargo} — ${CIVIME_DATOS.distrito}, ${CIVIME_DATOS.ciudad}`
  };

  publicidades: PublicidadItem[] = [...PUBLICIDADES_PREDETERMINADAS];

  publicidadActualIndex = 0;
  private publicidadIntervalId?: ReturnType<typeof setInterval>;

  get publicidadActual(): PublicidadItem {
    return this.publicidades[this.publicidadActualIndex];
  }

  /** Encabezado: título o, si no hay, la descripción. */
  get publicidadCabecera(): string {
    const a = this.publicidadActual;
    const t = a.titulo?.trim();
    return t || a.descripcion?.trim() || '';
  }

  /** Texto debajo de la imagen solo si aporta más que el encabezado. */
  get publicidadTextoSecundario(): string {
    const a = this.publicidadActual;
    const t = a.titulo?.trim();
    const d = a.descripcion?.trim() || '';
    if (!t) {
      return '';
    }
    return d && d !== t ? d : '';
  }

  get publicidadPuedeNavegar(): boolean {
    return this.publicidades.length > 1;
  }

  publicidadAnterior(): void {
    if (!this.publicidadPuedeNavegar) {
      return;
    }
    const n = this.publicidades.length;
    this.publicidadActualIndex =
      (this.publicidadActualIndex - 1 + n) % n;
    this.arrancarRotacionPublicidad();
  }

  publicidadSiguiente(): void {
    if (!this.publicidadPuedeNavegar) {
      return;
    }
    const n = this.publicidades.length;
    this.publicidadActualIndex = (this.publicidadActualIndex + 1) % n;
    this.arrancarRotacionPublicidad();
  }

  constructor() {
    this.fragmentSub = this.route.fragment.subscribe((f) =>
      this.scrollToId(f)
    );
  }

  private scrollToId(fragment: string | null): void {
    if (!fragment) {
      return;
    }
    const run = () =>
      document.getElementById(fragment)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    requestAnimationFrame(() => requestAnimationFrame(run));
  }

  ngOnInit(): void {
    this.publicidadApi.getActivas().subscribe({
      next: (rows) => {
        if (rows.length > 0) {
          this.publicidades = rows.map((r) => ({
            titulo: r.titulo?.trim() || undefined,
            descripcion: r.descripcion,
            img: this.publicidadApi.urlImagenAbsoluta(r)
          }));
        } else {
          this.publicidades = [...PUBLICIDADES_PREDETERMINADAS];
        }
        this.publicidadActualIndex = 0;
        this.arrancarRotacionPublicidad();
      },
      error: () => {
        this.publicidades = [...PUBLICIDADES_PREDETERMINADAS];
        this.publicidadActualIndex = 0;
        this.arrancarRotacionPublicidad();
      }
    });
  }

  private arrancarRotacionPublicidad(): void {
    if (this.publicidadIntervalId) {
      clearInterval(this.publicidadIntervalId);
      this.publicidadIntervalId = undefined;
    }
    if (this.publicidades.length <= 1) {
      return;
    }
    this.publicidadIntervalId = setInterval(() => {
      this.publicidadActualIndex =
        (this.publicidadActualIndex + 1) % this.publicidades.length;
    }, PUBLICIDAD_ROTACION_MS);
  }

  ngOnDestroy(): void {
    this.fragmentSub?.unsubscribe();
    if (this.publicidadIntervalId) {
      clearInterval(this.publicidadIntervalId);
    }
  }
}
