import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminPublicidadComponent } from './admin-publicidad/admin-publicidad.component';
import { AdminCursosComponent } from './admin-cursos/admin-cursos.component';
import { AdminEstadisticaComponent } from './admin-estadistica/admin-estadistica.component';
import { AuthSupabaseService } from '../../services/auth-supabase.service';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTabsModule,
    AdminPublicidadComponent,
    AdminCursosComponent,
    AdminEstadisticaComponent
  ],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})
export class AdministracionComponent {
  private readonly auth = inject(AuthSupabaseService);
  private readonly router = inject(Router);

  get usernameLogueado(): string {
    const token = this.auth.getToken();
    if (!token) {
      return 'usuario';
    }
    return this.auth.getUsernameFromToken(token);
  }

  volverSitioPublico(event: Event): void {
    event.preventDefault();
    this.auth.logout().subscribe({
      next: () => this.router.navigateByUrl('/inicio'),
      error: () => this.router.navigateByUrl('/inicio')
    });
  }
}
