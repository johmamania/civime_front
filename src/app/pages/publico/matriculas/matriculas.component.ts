import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CIVIME_DATOS } from '../../../data/civime-datos';

export interface TipoMatricula {
  id: string;
  etiqueta: string;
  titulo: string;
  resumen: string;
  puntos: string[];
  variante: 'nueva' | 'continua' | 'clasificacion' | 'especial';
}

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './matriculas.component.html',
  styleUrl: './matriculas.component.css'
})
export class MatriculasComponent {
  readonly datos = CIVIME_DATOS;

  readonly tipos: TipoMatricula[] = [
    {
      id: 'nueva',
      etiqueta: 'Nueva',
      titulo: 'Matrícula nueva',
      resumen:
        'Primera inscripción en el centro o en un idioma que no cursaste antes con nosotros.',
      puntos: [
        'Documento de identidad vigente (copia simple).',
        'Pago de derecho de matrícula según tarifario vigente.',
        'Asignación de nivel inicial o prueba de ubicación según el programa.'
      ],
      variante: 'nueva'
    },
    {
      id: 'continua',
      etiqueta: 'Continua',
      titulo: 'Matrícula continua',
      resumen:
        'Siguiente ciclo del mismo idioma tras aprobar el nivel anterior en el CIVIME.',
      puntos: [
        'Constancia de estudios o registro de calificaciones del último ciclo.',
        'Matrícula dentro de las fechas publicadas en secretaría.',
        'Mantiene prioridad en el mismo turno cuando hay cupos limitados.'
      ],
      variante: 'continua'
    },
    {
      id: 'clasificacion',
      etiqueta: 'Clasificación',
      titulo: 'Matrícula con examen de clasificación',
      resumen:
        'Para quienes ya tienen conocimientos previos y desean ubicarse en un nivel intermedio o avanzado.',
      puntos: [
        'Inscripción al examen en las fechas indicadas.',
        'Resultado válido para el periodo académico en curso.',
        'Matrícula al nivel asignado según puntaje y criterios del centro.'
      ],
      variante: 'clasificacion'
    },
    {
      id: 'especial',
      etiqueta: 'Institucional',
      titulo: 'Matrícula institucional o grupal',
      resumen:
        'Programas bajo convenio (empresas, entidades públicas o grupos cerrados).',
      puntos: [
        'Comunicación formal por la oficina de convenios o coordinación académica.',
        'Plazos y documentación según el contrato o anexo vigente.',
        'Modalidad presencial, virtual o mixta según lo acordado.'
      ],
      variante: 'especial'
    }
  ];
}
