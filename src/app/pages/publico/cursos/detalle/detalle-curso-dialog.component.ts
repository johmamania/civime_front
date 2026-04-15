import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CursoApiDto } from '../../../../models/curso-api.model';
import { CursosApiService } from '../../../../services/cursos-api.service';

interface DetalleCursoDialogData {
  idCurso: number;
}

@Component({
  selector: 'app-detalle-curso-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './detalle-curso-dialog.component.html',
  styleUrl: './detalle-curso-dialog.component.css'
})
export class DetalleCursoDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<DetalleCursoDialogComponent>);
  private readonly data = inject<DetalleCursoDialogData>(MAT_DIALOG_DATA);
  private readonly api = inject(CursosApiService);

  curso: CursoApiDto | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loading = true;
    this.error = null;
    this.api.getPorId(this.data.idCurso).subscribe({
      next: (data) => {
        this.curso = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el detalle del curso.';
        this.loading = false;
      }
    });
  }

  imagenCurso(): string {
    if (!this.curso) {
      return '';
    }
    return this.api.urlImagenAbsoluta(this.curso);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
