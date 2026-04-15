import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FooterComponent } from './footer/footer.component';
import { CIVIME_DATOS } from '../../data/civime-datos';
import {
  buildPublicMenuItems,
  type MenuItem
} from './publico-menu';
import { AuthSupabaseComponent } from './auth-supabase/auth-supabase.component';
import { AuthSupabaseService } from '../../services/auth-supabase.service';

@Component({
  selector: 'app-publico-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './publico-shell.component.html',
  styleUrl: './publico-layout.css'
})
export class PublicoShellComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authSupabase = inject(AuthSupabaseService);
  readonly datosCivime = CIVIME_DATOS;
  readonly menuItems: MenuItem[] = buildPublicMenuItems();

  /** Enlace wa.me si `whatsappNumero` tiene dígitos suficientes. */
  get whatsappHref(): string | null {
    const n = String(this.datosCivime.whatsappNumero ?? '').replace(/\D/g, '');
    if (n.length < 8) {
      return null;
    }
    return `https://wa.me/${n}`;
  }

  expandedMobileMenuIndex: number | null = null;

  private readonly mobileNavMaxPx = 720;

  toggleMobileSubmenu(index: number, item: MenuItem, event: Event): void {
    if (!item.submenus?.length) {
      return;
    }
    if (
      typeof window !== 'undefined' &&
      window.innerWidth > this.mobileNavMaxPx
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.expandedMobileMenuIndex =
      this.expandedMobileMenuIndex === index ? null : index;
  }

  onMenuClick(item: MenuItem, event: Event): void {
    if (item.route !== '/administracion') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    this.dialog
      .open(AuthSupabaseComponent, {
        width: 'min(430px, 96vw)',
        autoFocus: 'first-tabbable',
        disableClose: true
      })
      .afterClosed()
      .subscribe((token: string | null) => {
        if (!token) {
          Swal.fire({
            icon: 'warning',
            title: 'Acceso no autorizado',
            text: 'Acceso cancelado o credenciales inválidas.'
          });
          return;
        }
        const username = this.authSupabase.getUsernameFromToken(token);
        this.router.navigateByUrl('/administracion');
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: username
        }).then(() => {
          this.expandedMobileMenuIndex = null;
          this.router.navigateByUrl('/administracion');
        });
      });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (
      typeof window !== 'undefined' &&
      window.innerWidth > this.mobileNavMaxPx
    ) {
      this.expandedMobileMenuIndex = null;
    }
  }
}
