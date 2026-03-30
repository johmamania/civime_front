import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { certGuard } from '../guard/cert.guard';
import { Not403Component } from './not403/not403.component';
import { MantoComponent } from './manto/manto.component';
import { RegisterComponent } from './manto/register/register.component';
import { ManualComponent } from './manual/manual.component';


export const pagesRoutes: Routes = [
  { path: 'inicio', component: DashboardComponent, canActivate: [certGuard] },



  { path: 'usuarios', component: MantoComponent, canActivate: [certGuard] },
   { path: 'manual', component: ManualComponent, canActivate: [certGuard] },


  {
    path: 'manto', component: MantoComponent, children: [
      { path: 'register', component: RegisterComponent },
    ], canActivate: [certGuard]
  },
  { path: 'not-403', component: Not403Component },


];
