import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminPublicidadComponent } from './admin-publicidad/admin-publicidad.component';
import { AdminCursosComponent } from './admin-cursos/admin-cursos.component';
import { AdminEstadisticaComponent } from './admin-estadistica/admin-estadistica.component';

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
export class AdministracionComponent {}
