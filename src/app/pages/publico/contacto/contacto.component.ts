import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CIVIME_DATOS } from '../../../data/civime-datos';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  readonly datos = CIVIME_DATOS;
}
