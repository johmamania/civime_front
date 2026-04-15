import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CursoApiDto } from '../../../../models/curso-api.model';
import { CursosApiService } from '../../../../services/cursos-api.service';

interface AdminCursosDialogData {
  curso?: CursoApiDto;
}

@Component({
  selector: 'app-admin-cursos-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './admin-cursos-dialog.component.html',
  styleUrl: './admin-cursos-dialog.component.css'
})
export class AdminCursosDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AdminCursosDialogComponent>);
  private readonly api = inject(CursosApiService);
  private readonly data =
    inject<AdminCursosDialogData | null>(MAT_DIALOG_DATA, { optional: true }) ?? null;

  readonly editando = !!this.data?.curso;

  titulo = this.data?.curso?.titulo ?? '';
  descripcion = this.data?.curso?.descripcion ?? '';
  fechaApertura: Date | null = this.toDateOrNull(this.data?.curso?.fechaApertura);
  estado = this.data?.curso?.estado === 1;
  archivo: File | null = null;
  saving = false;
  errorMsg: string | null = null;

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.archivo = input.files?.[0] ?? null;
    this.errorMsg = null;
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }

  guardar(): void {
    this.errorMsg = null;
    if (!this.titulo.trim()) {
      this.errorMsg = 'Ingrese el título del curso.';
      return;
    }
    if (!this.descripcion.trim()) {
      this.errorMsg = 'Ingrese la descripción del curso.';
      return;
    }
    if (!this.editando && !this.archivo) {
      this.errorMsg = 'Seleccione una imagen para crear el curso.';
      return;
    }

    const fd = new FormData();
    fd.append('titulo', this.titulo.trim());
    fd.append('descripcion', this.descripcion.trim());
    fd.append('estado', this.estado ? '1' : '0');
    fd.append('fechaApertura', this.toIsoOrEmpty(this.fechaApertura));
    if (this.archivo) {
      fd.append('archivo', this.archivo, this.archivo.name);
    }

    this.saving = true;
    const req$ =
      this.editando && this.data?.curso
        ? this.api.actualizar(this.data.curso.id, fd)
        : this.api.create(fd);

    req$.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.saving = false;
        const m = err?.message ?? err?.error?.message;
        this.errorMsg = typeof m === 'string' ? m : 'No se pudo guardar el curso.';
      }
    });
  }

  private toIsoOrEmpty(value: Date | null): string {
    if (!value) {
      return '';
    }
    if (Number.isNaN(value.getTime())) {
      return '';
    }
    return value.toISOString();
  }

  private toDateOrNull(value?: string | null): Date | null {
    if (!value) {
      return null;
    }
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return null;
    }
    return d;
  }
}
