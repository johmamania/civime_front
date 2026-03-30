import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../services/users.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent implements OnInit {
  notificaciones: any[] = [];
  idig: number;
  estado: number;

  constructor(
    public dialogRef: MatDialogRef<NotificacionesComponent>,
    private usersService: UsersService,

  ) {}

  ngOnInit(): void {
    const usuario=this.usersService.getUsuarioLogeado();
    this.idig=usuario.inspectoria.id;
    this.estado=5;

  }


  private mostrarAlerta(mensaje: string): void {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error'
    });
  }









  marcarComoLeida(notificacion: any) {
    notificacion.leida = true;
  }

  marcarTodasComoLeidas() {
    this.notificaciones.forEach(not => not.leida = true);
  }

  eliminarNotificacion(id: number) {
    this.notificaciones = this.notificaciones.filter(not => not.id !== id);
  }

  cerrar() {
    this.dialogRef.close({
      cantidadNoLeidas: this.getNotificacionesNoLeidas()
    });
  }

  getNotificacionesNoLeidas(): number {
    return this.notificaciones.filter(not => !not.leida).length;
  }
  formatearFechadiaMesAnio(fecha: Date): string {
    const fechaFormateada = new Date(fecha);
    const dia = fechaFormateada.getDate();
    const mes = fechaFormateada.getMonth() + 1;
    const anio = fechaFormateada.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  formatearFecha(fecha: Date): string {
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Hace unos momentos';
    } else if (diffMins < 60) {
      return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else {
      return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  }
}

