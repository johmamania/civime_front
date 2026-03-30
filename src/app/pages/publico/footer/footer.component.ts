import { Component } from '@angular/core';
import { CIVIME_DATOS } from '../../../data/civime-datos';

@Component({
  selector: 'app-publico-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly datos = CIVIME_DATOS;
}
