import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../model/users';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../model/menu';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-manto',
  standalone: true,
  imports: [ MaterialModule, NgIf],
  templateUrl: './manto.component.html',
  styleUrl: './manto.component.css'
})
export class MantoComponent {

  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['idUser', 'cip', 'username', 'grado', 'fullname','unidad', 'estado','acciones'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

   allData: any[];
  username: string;
  totalElements: number = 0;
  buscador: string= '';
  searchParam: string = '';
  page: number = 0;
  pageSize: number = 10;
  tamano:number=1000000000;
  menus: Menu[];


  constructor(
    public dialog: MatDialog,
    private menuService: MenuService,
    private _snackBar: MatSnackBar,
    private userService: UsersService) { }

  ngOnInit(): void {
    this.filterPage();

  }

  filterPage(){
    this.userService.filterusers(this.buscador,this.page,this.pageSize).subscribe(resp=>{
       this.allData = resp.data;
        this.totalElements = resp.data.totalElements;
        this.createTable(resp.data.content);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    })
  }

  openRegistrarModal(idUser:any): void {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '60%',
      data:idUser,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.filterPage();
    });
  }

  createTable(data: User[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  showMore(e: any) {
    this.userService.listPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });
  }
/*
  openWelcomeMessage(id: string, username: string): void {

    const dialogRef = this.dialog.open(RolesMenuComponent, {
      data: {
        idUser: id,
        username: username
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });

    dialogRef.componentInstance.cerrarDialogo.subscribe(() => {
      dialogRef.close();
      Swal.fire({
        title: "Permisos Actualizados!",
        icon: "success"
      });
    });
  }
*/
  changeEstado(username: string, estado: number) {
    Swal.fire({
      title: '<div style="display: flex; align-items: center; gap: 8px; color: #FF9800; font-size: 24px; font-weight: 600;"><span class="material-icons" style="font-size: 28px;">warning</span> Cambiar Estado</div>',
      html: '<div style="font-size: 16px; color: #424242; padding: 10px 0;">¿Está seguro de cambiar el estado del usuario?</div>',
      icon: 'warning',
      iconColor: '#FF9800',
      showCancelButton: true,
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#f44336',
      confirmButtonText: '<span style="display: flex; align-items: center; gap: 6px;"><span class="material-icons" style="font-size: 18px;">check</span> Sí, cambiar</span>',
      cancelButtonText: '<span style="display: flex; align-items: center; gap: 6px;"><span class="material-icons" style="font-size: 18px;">close</span> Cancelar</span>',
      customClass: {
        popup: 'swal-warning-popup',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (estado == 1) {
          estado = 2;
        } else {
          estado = 1;
        }
        console.log(estado);
        this.userService.changeEstado(username, estado).subscribe();
        Swal.fire({
          title: '<div style="display: flex; align-items: center; gap: 8px; color: #4CAF50; font-size: 24px; font-weight: 600;"><span class="material-icons" style="font-size: 28px;">check_circle</span> Estado Cambiado</div>',
          html: '<div style="font-size: 16px; color: #424242; padding: 10px 0;">El estado del usuario ha sido cambiado correctamente</div>',
          icon: 'success',
          iconColor: '#4CAF50',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'swal-success-popup'
          }
        });
        this.showMore({ pageIndex: this.paginator.pageIndex, pageSize: this.paginator.pageSize });
      }
    });
  }


  deleteuser(id: number) {
    Swal.fire({
      title: 'Eliminar Usuario',
      text: '¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe((response) => {
          Swal.fire({
            title: 'Usuario Eliminado',
            text: 'El usuario ha sido eliminado correctamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          this.ngOnInit();
        });
      }
    });
  }


}
