import { ChangeRoleUserLogComponent } from './change-role-user-log/change-role-user-log.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { Menu } from '../../model/menu';
import { MenuService } from '../../services/menu.service';
import { LoginService } from '../../services/login.service';
import { UsersService } from '../../services/users.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy{
  roleActiveName:string;
  roleActiveId:number;
  menus: Menu[];
  selectedMenuUrl:string;
  brigada:string;
  cargo:string;
  menuurl1:string;
  menuurl2:string;
  username:string;
  inspectoria:string;
  idig: number;
  estado: number=5;
  cantidadNotificaciones: any = 0; // Ejemplo: 9 notificaciones
  private conteoInterval: any;

  constructor(
    private dialogRef: MatDialog,
     private router: Router,
    private menuService: MenuService,
    private loginService: LoginService,
    private userService: UsersService,
     private _snackBar: MatSnackBar,

  ){}

  ngOnInit(): void {
   this.cargarDatos();
  }

  cargarDatos(){
     const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);

    if (token && !helper.isTokenExpired(token)) {
      const decodedToken = helper.decodeToken(token);
      this.username = decodedToken.sub;

      // ✅ Escuchar siempre el cambio del menú
      this.menuService.getMenuChange().subscribe(resp => {
        this.menus = resp;
        this.menuurl1=this.menus[0].url;
        this.menuurl2=this.menus[1].url;
      });

      // ✅ Solo hacer llamada si no hay caché
      if (!this.menuService.hasCachedMenu()) {
        this.menuService.getMenusByUser(this.username).subscribe(); // ya hace setMenuChange internamente
      } else {
        // ✅ Si ya hay caché, propagarlo igual al layout
        const cached = this.menuService.getCachedMenu();
        if (cached) {
          this.menuService.setMenuChange(cached);
        }
      }
      // Obtener datos del usuario
      this.userService.getByUsername(this.username).subscribe(resp => {
        this.username = resp.data.username;
        this.roleActiveName = resp.data.roleActive.name;
        this.roleActiveId= resp.data.roleActive.idRole;
        this.brigada=resp.data.brigada.nombreCorto;//nombreCorto;
        this.userService.setUsuarioLogeado(resp.data);
        this.inspectoria=resp.data.inspectoria.acronimo;
        this.cargo=resp.data.cargo.nombre;
        this.idig=resp.data.inspectoria.id;

        // actualizar conteo automáticamente cada 5 minutos
        this.conteoInterval = setInterval(() => {

        }, 10 * 1000);
      });

      // Notificaciones generales
      this.userService.getMessageChange().subscribe(data => {
        this._snackBar.open(data, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      });

    } else {
      this.router.navigate(['/not-403']);
    }
  }
/*
  conteoObservaciones(){
    this.entregableService.conteoObservaciones(this.idig, this.estado).subscribe((resp) => {
      if(resp.message==='success'){
        this.cantidadNotificaciones = resp.data;
      }else{
        this.cantidadNotificaciones = 0;
      }
    });
  }
*/
  ngOnDestroy(): void {
    if (this.conteoInterval) {
      clearInterval(this.conteoInterval);
    }
  }

    selectMenu(menuUrl: string) {
    this.selectedMenuUrl = menuUrl;
    sessionStorage.setItem('selectedMenu', menuUrl);
  }

  changeRoleUserLog(){
    const dialog= this.dialogRef.open(ChangeRoleUserLogComponent,{
      width:'20%',
      height:'80%',
      position: {
      right: '0'
    },
      disableClose:true,
      data: {username:this.username,roleActiveName:this.roleActiveName}
    })
     dialog.afterClosed().subscribe(result => {
          if(result.acc==1){
          Swal.fire({
                title: 'ROL',
                text: `Rol cambiado a ${result.name}`,
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true
              });
        this.menus=[];
        this. cargarDatos();
        // sessionStorage.getItem( 'selectedMenu');

        if (sessionStorage.getItem('selectedMenu') === this.menuurl1) {
           this.router.navigate([this.menuurl2]);
           sessionStorage.setItem('selectedMenu', this.menuurl2);
           } else {
             this.router.navigate([this.menuurl1]);
             sessionStorage.setItem('selectedMenu', this.menuurl1);
           }

      }
     })
  }








  logout(){
    this.loginService.logout();
  }

  vernotificaciones(){
    const dialogRef = this.dialogRef.open(NotificacionesComponent, {
      width: '400px',
      maxWidth: '90vw',
      height: '100vh',
      position: {
        right: '0',
        top: '0'
      },
      panelClass: 'notificaciones-panel',
      disableClose: false,
      hasBackdrop: true,
      backdropClass: 'notificaciones-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Actualizar contador de notificaciones si es necesario
      if (result && result.cantidadNoLeidas !== undefined) {
        this.cantidadNotificaciones = result.cantidadNoLeidas;
      }
    });
  }
}
