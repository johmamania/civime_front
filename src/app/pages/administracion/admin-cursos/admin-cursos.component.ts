import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { CursoApiDto } from '../../../models/curso-api.model';
import { CursosApiService } from '../../../services/cursos-api.service';
import { AdminCursosDialogComponent } from './dialog-create/admin-cursos-dialog.component';

@Component({
  selector: 'app-admin-cursos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-cursos.component.html',
  styleUrl: './admin-cursos.component.css'
})
export class AdminCursosComponent implements OnInit {
  private readonly api = inject(CursosApiService);
  private readonly dialog = inject(MatDialog);

  lista: CursoApiDto[] = [];
  buscar = '';
  loading = false;
  accionId: number | null = null;
  error: string | null = null;

  get filtradas(): CursoApiDto[] {
    const q = this.buscar.trim().toLowerCase();
    if (!q) {
      return this.lista;
    }
    return this.lista.filter((c) => {
      return (
        c.titulo.toLowerCase().includes(q) ||
        c.descripcion.toLowerCase().includes(q) ||
        (c.username || '').toLowerCase().includes(q)
      );
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.error = null;
    this.api.getTodos().subscribe({
      next: (data) => {
        this.lista = data;
        this.loading = false;
      },
      error: () => {
        this.error =
          'No se pudo cargar cursos. Verifique la tabla cursos, bucket y políticas de Supabase.';
        this.loading = false;
      }
    });
  }

  abrirCrear(): void {
    this.dialog
      .open(AdminCursosDialogComponent, {
        width: 'min(520px, 96vw)',
        autoFocus: 'first-tabbable'
      })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) {
          this.cargar();
          Swal.fire('Correcto', 'Curso creado.', 'success');
        }
      });
  }

  abrirEditar(c: CursoApiDto): void {
    this.dialog
      .open(AdminCursosDialogComponent, {
        width: 'min(520px, 96vw)',
        autoFocus: 'first-tabbable',
        data: { curso: c }
      })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) {
          this.cargar();
          Swal.fire('Correcto', 'Curso actualizado.', 'success');
        }
      });
  }

  cambiarEstado(c: CursoApiDto, valor: 0 | 1): void {
    if (c.estado === valor) {
      return;
    }
    this.accionId = c.id;
    this.api.cambiarEstado(c.id, valor).subscribe({
      next: () => {
        this.accionId = null;
        this.cargar();
      },
      error: (err) => {
        this.accionId = null;
        const m = err?.message ?? err?.error?.message;
        Swal.fire(
          'Error',
          typeof m === 'string' ? m : 'No se pudo cambiar el estado.',
          'error'
        );
      }
    });
  }

  eliminar(c: CursoApiDto): void {
    Swal.fire({
      title: 'Confirmar eliminación',
      text: '¿Eliminar este curso y su imagen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.accionId = c.id;
      this.api.eliminar(c.id).subscribe({
        next: () => {
          this.accionId = null;
          this.cargar();
          Swal.fire('Eliminado', 'El curso fue eliminado.', 'success');
        },
        error: (err) => {
          this.accionId = null;
          const m = err?.message ?? err?.error?.message;
          Swal.fire(
            'Error',
            typeof m === 'string' ? m : 'No se pudo eliminar.',
            'error'
          );
        }
      });
    });
  }

  miniaturaUrl(c: CursoApiDto): string {
    return this.api.urlImagenAbsoluta(c);
  }

  textoEstado(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

  claseEstado(estado: number): string {
    return estado === 1 ? 'estado-activo' : 'estado-inactivo';
  }
}
