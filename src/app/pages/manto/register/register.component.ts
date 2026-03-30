import { Brigada } from './../../../model/brigada';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { NgFor, NgIf } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment.development';
import { UsersService } from '../../../services/users.service';
import { PersonaService } from '../../../services/persona.service';
import { Dependencia } from '../../../model/dependencia';
import { UserSave } from '../../../model/usesave';
import { Nucleo } from '../../../model/nucleo';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { User } from '../../../model/users';
import Swal from 'sweetalert2';
import { Rol } from '../../../model/rol';
import { Inspectoria } from '../../../model/inspectoria';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  title: string = 'REGISTRAR NUEVO';
  saved: boolean = false;
  nucleos: Nucleo[] = [];
  brigadas: Brigada[] = [];
  unidades: Dependencia[] = [];
  roles: Rol[] = [];
  inspectorias: Inspectoria[] = [];
  inspectoriasByIdPadre: Inspectoria[] = [];
  selectedNivel: number = 0;
  selectedCargo: number = 0;
  //
  idsRoles: number[];
  message: string;
  error: string;

  dni: string;
  username: string;
  grado: string;
  arma: string;
  fullname: string;
  selectedNucleo: string;
  selectedBrigada: string;
  selectedUnidad: string;
  telefono: string;
  selectedInspectoria: string;
  rolesSelected: Rol[] = [];
  userForm: FormGroup;

  @Output() cerrarDialogo = new EventEmitter<void>();

  constructor(
    public matDialogRef: MatDialogRef<RegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personaService: PersonaService,
    private userService: UsersService,

  ) {}

  ngOnInit(): void {
    if (this.data != 0) {
      this.title = 'EDITAR';
      this.saved = true;
      this.obtenerDatosUser();
    } else {
    }

    this.cargarRoles();
    this.cargarInspectorias();
  }

  obtenerDatosUser() {
    this.userService.getByIdUser(this.data).subscribe(
      (user: User) => {
        //  const roles = user.roles;
        //  const seleccionados = this.rolesSelected.filter(p => roles.some(pr => pr.idRole === p.idRole)    );
        (this.dni = user.dni),
          (this.username = user.username),
          (this.grado = user.grado),
          (this.arma = user.arma),
          (this.fullname = user.fullname),
          (this.selectedNucleo = user.nucleo.id),
          (this.selectedBrigada = user.brigada.id),

        // this.nivel = user.roles[0].idRole,
        (this.rolesSelected = user.roles),
          (this.selectedUnidad = user.unidad.id),
          (this.selectedInspectoria =
            user.inspectoria?.id || user.inspectoria || '');
      },
      (error) => {
        console.log('Error al obtener los datos de la experiencia:', error);
      }
    );
  }
  compareRoles(o1: Rol, o2: Rol): boolean {
    return o1 && o2 ? o1.idRole === o2.idRole : o1 === o2;
  }

  crearUsuario() {
    if (this.camposLlenos()) {
      const newUser: any = {
        username: this.username,
        dni: this.dni,
        grado: this.grado,
        arma: this.arma,
        fullname: this.fullname,
        estado: 1,
        nucleo: { id: this.selectedNucleo },
        brigada: { id: this.selectedBrigada },
        unidad: { id: this.selectedUnidad },
        telefono: this.telefono,
        roles: this.rolesSelected,
        inspectoria: this.selectedInspectoria
          ? { id: this.selectedInspectoria }
          : null,
        cargo: this.selectedCargo
          ? { id: this.selectedCargo }
          : null,
      };

      if (this.data != 0) {
        this.userService.updateUser(this.data, newUser).subscribe((resp) => {
          this.matDialogRef.close();
          Swal.fire({
            title: 'USUARIO',
            text: 'Actualizado Correctamente',
            icon: 'success',
          });
        });
      } else {
        this.userService.saveUser(newUser).subscribe((data) => {
          this.matDialogRef.close();
          Swal.fire({
            title: ' USUARIO',
            text: 'Registrado Correctamente',
            icon: 'success',
          });
        });
      }
    }
  }

  camposLlenos(): boolean {
    return !!this.dni;
    // !!this.nivel;
  }


  seleccionarUnidad(idUnidad: string) {
    this.selectedUnidad = idUnidad;
  }

  getByDni(dni: string) {
    this.userService .getByDni(this.dni).subscribe((data) => {
      //  console.log(data)
    //  const resultado = data.chasqui.replace('@ejercito.mil.pe', '');
      this.username = data.dni;
      this.grado = data.grado;
      this.fullname =data.fullname;
      this.arma = data.arma;
    });
  }

  //roles
  cargarRoles() {
    this.userService.getRolesAll().subscribe((resp) => {
      this.roles = resp.data;
    });
  }

  // Inspectorias
  nivelSeleccionarnivel(nivel: any) {
    if (nivel == 100) {
      this.selectedNivel = 1;
    } else if (nivel == 200) {
      this.selectedNivel = 2;
    } else if (nivel == 300) {
      this.selectedNivel = 3;
    } else if (nivel == 400) {
      this.selectedNivel = 4;
    }

    this.cargarInspectorias();
  }

  cargarInspectorias() {
    this.userService.listInspectoriasByNivel(3).subscribe(
      (resp) => {
        this.inspectorias = resp.data || [];
      },
      (error) => {
        console.error('Error al cargar inspectorías:', error);
        this.inspectorias = [];
      }
    );
  }


  cargarInspectoriasByigidpadre(idpadre: number) {
    this.userService.listInspectoriasByIdPadre(idpadre).subscribe(
      (resp) => {
        this.inspectoriasByIdPadre = resp.data || [];
      },
      (error) => {
        console.error('Error al cargar inspectorías:', error);
        this.inspectoriasByIdPadre = [];
      }
    );
  }















  validarNumero(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  validarLongitud() {
    if (this.dni && this.dni.length > 9) {
      this.dni = this.dni.slice(0, 9);
    }
  }

  salir() {
    this.matDialogRef.close();
  }
}
