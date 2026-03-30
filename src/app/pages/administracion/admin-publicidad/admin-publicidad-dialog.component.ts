import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PublicidadApiService } from '../../../services/publicidad-api.service';

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

  descripcion = '';
  estado = true;
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
    if (!this.archivo) {
      this.errorMsg = 'Seleccione una imagen (jpg, png, gif o webp).';
      return;
    }
    const fd = new FormData();
    fd.append('descripcion', this.descripcion.trim());
    fd.append('estado', this.estado ? '1' : '0');
    fd.append('archivo', this.archivo, this.archivo.name);
    this.saving = true;
    this.api.create(fd).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.saving = false;
        const m = err?.error?.message;
        this.errorMsg =
          typeof m === 'string' ? m : 'No se pudo guardar. Revise el backend.';
      }
    });
  }
}
