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
import { PublicidadApiService } from '../../../../services/publicidad-api.service';
import { PublicidadApiDto } from '../../../../models/publicidad-api.model';


interface AdminPublicidadDialogData {
  publicidad?: PublicidadApiDto;
}

@Component({
  selector: 'app-admin-publicidad-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './admin-publicidad-dialog.component.html',
  styleUrl: './admin-publicidad-dialog.component.css'
})
export class AdminPublicidadDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AdminPublicidadDialogComponent>);
  private readonly api = inject(PublicidadApiService);
  private readonly data =
    inject<AdminPublicidadDialogData | null>(MAT_DIALOG_DATA, { optional: true }) ??
    null;

  readonly editando = !!this.data?.publicidad;

  titulo = this.data?.publicidad?.titulo ?? '';
  descripcion = this.data?.publicidad?.descripcion ?? '';
  estado = this.data?.publicidad?.estado === 1;
  archivo: File | null = null;
  saving = false;
  errorMsg: string | null = null;

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const f = input.files?.[0];
    this.archivo = f ?? null;
    this.errorMsg = null;
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }

  guardar(): void {
    this.errorMsg = null;
    if (!this.descripcion.trim()) {
      this.errorMsg = 'Ingrese una descripción.';
      return;
    }
    if (!this.editando && !this.archivo) {
      this.errorMsg = 'Seleccione una imagen (jpg, png, gif o webp).';
      return;
    }
    if (this.editando && this.data?.publicidad) {
      this.saving = true;
      this.api
        .actualizarTexto(this.data.publicidad.id, {
          titulo: this.titulo.trim() || null,
          descripcion: this.descripcion.trim()
        })
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => {
            this.saving = false;
            const m = err?.message ?? err?.error?.message;
            this.errorMsg =
              typeof m === 'string'
                ? m
                : 'No se pudo actualizar el texto de la publicidad.';
          }
        });
      return;
    }

    const fd = new FormData();
    fd.append('titulo', this.titulo.trim());
    fd.append('descripcion', this.descripcion.trim());
    fd.append('estado', this.estado ? '1' : '0');
    fd.append('archivo', this.archivo, this.archivo.name);
    this.saving = true;
    this.api.create(fd).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.saving = false;
        const m = err?.message ?? err?.error?.message;
        this.errorMsg =
          typeof m === 'string'
            ? m
            : 'No se pudo guardar. Revise Supabase, el bucket y las políticas de Storage.';
      }
    });
  }
}
