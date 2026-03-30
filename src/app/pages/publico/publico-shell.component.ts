import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { CIVIME_DATOS } from '../../data/civime-datos';
import {
  buildPublicMenuItems,
  type MenuItem
} from './publico-menu';

@Component({
  selector: 'app-publico-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './publico-shell.component.html',
  styleUrl: './publico-layout.css'
})
export class PublicoShellComponent {
  readonly datosCivime = CIVIME_DATOS;
  readonly menuItems: MenuItem[] = buildPublicMenuItems();

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
