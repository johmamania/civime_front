import { Component, Inject, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { MenuService } from '../../services/menu.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  username: string;
  idESave:number=1;
 imagenes:any[];
 urls: { [id: number]: string } = {}; // mapa id -> url blob
  constructor(
    private menuService: MenuService,

  ){}


  ngOnInit(): void {

   //   const helper = new JwtHelperService();
    //  const token = sessionStorage.getItem(environment.TOKEN_NAME);
    //  const decodedToken = helper.decodeToken(token);
    //  this.username = decodedToken.sub;
     // this.menuService.getMenusByUser(this.username).subscribe(resp => this.menuService.setMenuChange(resp.data));
    // this.listarImagenes()
  }




}
