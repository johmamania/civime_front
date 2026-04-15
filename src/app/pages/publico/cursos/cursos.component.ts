import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursosApiService } from '../../../services/cursos-api.service';
import { CursoApiDto } from '../../../models/curso-api.model';
import { MaterialModule } from '../../../material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { DetalleCursoDialogComponent } from './detalle/detalle-curso-dialog.component';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule,MaterialModule],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosComponent implements OnInit {
  private readonly api = inject(CursosApiService);
  private readonly dialog = inject(MatDialog);
  @Input() embebido = false;

  cursos: CursoApiDto[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loading = true;
    this.error = null;
    this.api.getActivos().subscribe({
      next: (data) => {
        this.cursos = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los cursos.';
        this.loading = false;
      }
    });
  }

  imagenCurso(curso: CursoApiDto): string {
    return this.api.urlImagenAbsoluta(curso);
  }

  abrirDetalle(idCurso: number): void {
    this.dialog.open(DetalleCursoDialogComponent, {
      width: 'min(560px, 96vw)',
      autoFocus: false,
      data: { idCurso }
    });
  }
}
