import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../services/login.service';
import { environment } from '../../environments/environment.development';
import Swal from 'sweetalert2';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsersService } from '../services/users.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { timer } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  error: string;
  message: string;
  _formulario: FormGroup;
  username: string;
  fullname: string;
  password: string;
  loading: boolean = false;

  recaptchaToken: string = '';
  year = new Date().getFullYear();

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private loginService: LoginService,
    private userService: UsersService,
    private router: Router,
  ) {
    this._formulario = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
  }

  login() {
    if (this._formulario.invalid) {
      return;
    }

    // Crear una instancia de Swal.mixin
    const swalWithCustomTitle = Swal.mixin({
      customClass: {
        popup: 'custom-swal-popup', // Clase para el contenedor del SweetAlert
        title: 'custom-swal-title', // Clase para el título del SweetAlert
        htmlContainer: 'custom-swal-html-container', // Clase para el contenedor del mensaje HTML
        confirmButton: 'custom-swal-confirm-button', // Clase para el botón de confirmación
        cancelButton: 'custom-swal-cancel-button' // Clase para el botón de cancelación
      },
      didOpen: () => {
        Swal.showLoading();
        Swal.getPopup().style.background = 'linear-gradient(120deg,rgba(39, 12, 192, 1),rgba(6, 5, 68, 1))';
        Swal.getPopup().style.color = '#fff';
        Swal.getPopup().style.borderRadius = '15px';
        Swal.getPopup().style.boxShadow = '0 20px 30px rgba(0,0,0,0.4)';
        document.querySelector('.custom-swal-title').textContent = 'Iniciando Sesión';
      }
    });

    // Mostrar el SweetAlert personalizado
    swalWithCustomTitle.fire({
      html: '<div style="font-family: Arial, sans-serif; font-size: 22px; color: #fff;">Verificando credenciales...</div>',
      timerProgressBar: true,
      allowOutsideClick: false
    });



    this.executeReCaptcha('login_action');
  }

  executeReCaptcha(action: string): void {
    this.recaptchaV3Service.execute(action).subscribe({
      next: (token) => {
        this.recaptchaToken = token;
        const source = timer(2000); // Emite después de 2000 milisegundos (2 segundos)
        source.subscribe(() => {
          this.performLogin();
        });

      },
      error: (err) => {
        console.error('Error en ReCAPTCHA v3:', err);
        this.error = 'ReCAPTCHA falló';
        this.handleError();
      }
    });
  }

  performLogin(): void {
    const jwtRequest = {
      username: this.username,
      password: this.password,
      token: this.recaptchaToken
    };
    this.loginService.login(jwtRequest).subscribe({
      next: (response) => {
        if (response && response.data && response.data.access_token) {
          sessionStorage.setItem(environment.TOKEN_NAME, response.data.access_token);
          this.handleSuccess();
          this.onSwal();
          this.router.navigate(['pages/inicio']);
        } else {
          this.error = 'Respuesta inválida del servidor';
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.error = 'Inicio de sesión fallido';
      }
    });
    this.handleError();
  }

  onSwal() {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.username = decodedToken.sub;
    this.userService.getByUsername(this.username).subscribe((resp) => {
      this.fullname = resp.data.fullname;
      Swal.fire('Bienvenido al Sistema de Control Interno', `${this.fullname}`, 'success');
    });
  }

  handleError() {
    this.loading = false; // Desactivar indicador de carga
    Swal.close(); // Cerrar la alerta de carga de Swal en caso de error
  }

  handleSuccess() {
    this.loading = false; // Desactivar indicador de carga
    Swal.close(); // Cerrar la alerta de carga de Swal después del éxito
  }

  resetForm() {
    this._formulario.reset(); // Reiniciar el formulario
  }

  convertirAMayusculas() {
    if (this.username) {
      this.username = this.username.toUpperCase();
    }
  }
}
