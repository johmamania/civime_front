import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthSupabaseService } from '../../../services/auth-supabase.service';

@Component({
  selector: 'app-auth-supabase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './auth-supabase.component.html',
  styleUrl: './auth-supabase.component.css'
})
export class AuthSupabaseComponent {
  private readonly dialogRef = inject(MatDialogRef<AuthSupabaseComponent>);
  private readonly authService = inject(AuthSupabaseService);

  usuario = '';
  password = '';
  loading = false;
  errorMsg: string | null = null;

  cerrar(): void {
    this.dialogRef.close(null);
  }

  login(): void {
    this.errorMsg = null;
    const email = this.usuario.trim();
    if (!email || !this.password.trim()) {
      this.errorMsg = 'Ingrese usuario y contraseña.';
      return;
    }

    this.loading = true;
    this.authService.login(email, this.password).subscribe({
      next: (token) => this.dialogRef.close(token),
      error: (err) => {
        this.loading = false;
        const msg = err?.message ?? 'Credenciales inválidas o permiso denegado.';
        this.errorMsg = String(msg);
      }
    });
  }
}
