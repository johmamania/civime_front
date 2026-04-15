import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicidadApiService } from '../../../services/publicidad-api.service';
import { PublicidadApiDto } from '../../../models/publicidad-api.model';
import { AdminPublicidadDialogComponent } from './dialog-create/admin-publicidad-dialog.component';

@Component({
  selector: 'app-admin-publicidad',
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
  templateUrl: './admin-publicidad.component.html',
  styleUrl: './admin-publicidad.component.css'
})
export class AdminPublicidadComponent implements OnInit {
  private readonly api = inject(PublicidadApiService);
  private readonly dialog = inject(MatDialog);

  lista: PublicidadApiDto[] = [];
  buscar = '';
  loading = false;
  error: string | null = null;
  accionId: number | null = null;

  get filtradas(): PublicidadApiDto[] {
    const q = this.buscar.trim().toLowerCase();
    if (!q) {
      return this.lista;
    }
    return this.lista.filter((p) => {
      const desc = (p.descripcion || '').toLowerCase();
      const tit = (p.titulo || '').toLowerCase();
      return desc.includes(q) || tit.includes(q);
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.error = null;
    this.api.getTodas().subscribe({
      next: (data) => {
        this.lista = data;
        this.loading = false;
      },
      error: () => {
        this.error =
          'No se pudo cargar la lista. Verifique la URL y la clave de Supabase, la tabla publicidad y las políticas RLS.';
        this.loading = false;
      }
    });
  }

  abrirCrear(): void {
    this.dialog
      .open(AdminPublicidadDialogComponent, {
        width: 'min(480px, 96vw)',
        autoFocus: 'first-tabbable'
      })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) {
          this.cargar();
        }
      });
  }

  abrirEditar(p: PublicidadApiDto): void {
    this.dialog
      .open(AdminPublicidadDialogComponent, {
        width: 'min(480px, 96vw)',
        autoFocus: 'first-tabbable',
        data: { publicidad: p }
      })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) {
          this.cargar();
        }
      });
  }

  miniaturaUrl(p: PublicidadApiDto): string {
    return this.api.urlImagenAbsoluta(p);
  }

  textoEstado(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

  claseEstado(estado: number): string {
    return estado === 1 ? 'estado-activo' : 'estado-inactivo';
  }

  cambiarEstado(p: PublicidadApiDto, valor: 0 | 1): void {
    if (p.estado === valor) {
      return;
    }
    this.accionId = p.id;
    this.api.cambiarEstado(p.id, valor).subscribe({
      next: () => {
        this.accionId = null;
        this.cargar();
      },
      error: (err) => {
        this.accionId = null;
        const m = err?.error?.message;
        alert(typeof m === 'string' ? m : 'No se pudo actualizar el estado.');
      }
    });
  }

  eliminar(p: PublicidadApiDto): void {
    if (!confirm('¿Eliminar esta publicidad y su imagen en Supabase Storage?')) {
      return;
    }
    this.accionId = p.id;
    this.api.eliminar(p.id).subscribe({
      next: () => {
        this.accionId = null;
        this.cargar();
      },
      error: (err) => {
        this.accionId = null;
        const m = err?.error?.message;
        alert(typeof m === 'string' ? m : 'No se pudo eliminar.');
      }
    });
  }
}
