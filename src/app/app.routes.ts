import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { LoginComponent } from './login/login.component';
import { Not404Component } from './pages/not404/not404.component';
import { InicioComponent } from './pages/publico/inicio/inicio.component';
import { PublicoShellComponent } from './pages/publico/publico-shell.component';
import { NosotrosComponent } from './pages/publico/nosotros/nosotros.component';
import { ContactoComponent } from './pages/publico/contacto/contacto.component';
import { MatriculasComponent } from './pages/publico/matriculas/matriculas.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicoShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', component: InicioComponent },
      { path: 'nosotros', component: NosotrosComponent },
      { path: 'matriculas', component: MatriculasComponent },
      { path: 'contacto', component: ContactoComponent }
    ]
  },
  {
    path: 'administracion',
    loadComponent: () =>
      import('./pages/administracion/administracion.component').then(
        (m) => m.AdministracionComponent
      )
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'pages',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/pages.routes').then((x) => x.pagesRoutes),
  },
  { path: 'not-404', component: Not404Component},
  { path: '**', redirectTo: 'not-404'}
];


