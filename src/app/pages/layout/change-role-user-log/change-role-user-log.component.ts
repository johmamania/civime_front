import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../services/users.service';
import Swal from 'sweetalert2';
import { Rol } from '../../../model/rol';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-change-role-user-log',
  standalone: true,
  imports: [MaterialModule,FormsModule],
  templateUrl: './change-role-user-log.component.html',
  styleUrl: './change-role-user-log.component.css'
})
export class ChangeRoleUserLogComponent implements OnInit{

  roleActiveName:string;
  roles:any[];
  constructor(
    public MatDialogRef: MatDialogRef<ChangeRoleUserLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialog:MatDialog,
    private loginService:LoginService,
    private usersService:UsersService

  ){
   this.roleActiveName=this.data.roleActiveName;

  }
  ngOnInit(): void {
    this.listMisRoles();

  }

listMisRoles(){
  this.usersService.getListMisRoles(this.data.username).subscribe(resp=>{
    this.roles=resp.data;
  })
}


seleccionarRol(role: Rol) {
  if(this.roleActiveName==role.name){
     this.MatDialogRef.close();
      Swal.fire({
        title: '<div style="display: flex; align-items: center; gap: 8px; color: #4CAF50; font-size: 24px; font-weight: 600;"><span class="material-icons" style="font-size: 28px;">check_circle</span> Rol</div>',
        html: '<div style="font-size: 16px; color: #424242; padding: 10px 0;">Rol Seleccionado Activo</div>',
        icon: 'success',
        iconColor: '#4CAF50',
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'swal-success-popup'
        }
      });
    return
  }
  Swal.fire({
    title: '<div style="display: flex; align-items: center; gap: 8px; color: #2196F3; font-size: 24px; font-weight: 600;"><span class="material-icons" style="font-size: 28px;">sync</span> Cambiando rol</div>',
    html: `<div style="font-size: 16px; color: #424242; padding: 10px 0;">Cambiando rol a <strong style="color: #1976D2;">${role.name}</strong><br>Por favor espere...</div>`,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'swal-loading-popup',
      timerProgressBar: 'my-progress-bar'
    }
  });

  setTimeout(() => {
    this.usersService.changeRoleActive(this.data.username, role.idRole).subscribe(
      (resp) => {
        if (resp.message == 'success') {
          Swal.close();
          this.salir(role.name);
        }
      },
      (error) => {
        Swal.close();
        Swal.fire({
          title: '<div style="display: flex; align-items: center; gap: 8px; color: #f44336; font-size: 24px; font-weight: 600;"><span class="material-icons" style="font-size: 28px;">error</span> Error</div>',
          html: '<div style="font-size: 16px; color: #424242; padding: 10px 0;">No se pudo cambiar el rol</div>',
          icon: 'error',
          iconColor: '#f44336',
          confirmButtonColor: '#f44336',
          confirmButtonText: '<span style="display: flex; align-items: center; gap: 6px;"><span class="material-icons" style="font-size: 18px;">check</span> Entendido</span>',
          customClass: {
            popup: 'swal-error-popup'
          }
        });
      }
    );
  }, 1000);
}



  salir(acc:any){
  this.MatDialogRef.close({acc:1,name:acc});
}

cerrardialog(){
  this.MatDialogRef.close({acc:0});
}

logout(){
    this.MatDialogRef.close({acc:0});
    this.loginService.logout();
  }
}
